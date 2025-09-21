import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs'; // needed for Buffer/file handling

function sanitizeName(s: string) {
  return s.trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '_').slice(0, 60);
}

async function verifyTurnstile(req: Request, form: FormData) {
  const token = (form.get('cf-turnstile-response') as string) || '';
  if (!token) {
    return { ok: false, res: NextResponse.json({ ok: false, error: 'Turnstile token missing' }, { status: 400 }) };
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('cf-connecting-ip') ||
    '';

  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.error('TURNSTILE_SECRET_KEY missing');
    return { ok: false, res: NextResponse.json({ ok: false, error: 'Server misconfiguration' }, { status: 500 }) };
  }

  const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret, response: token, remoteip: ip as string }),
  });

  const outcome = await verifyRes.json();
  if (!outcome.success) {
    return { ok: false, res: NextResponse.json({ ok: false, error: 'Turnstile verification failed' }, { status: 400 }) };
  }

  return { ok: true as const };
}

function validatePdf(file: File | null, label: string) {
  if (!file) return `${label} is required`;
  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  if (!isPdf) return `${label}: PDF only`;
  const maxBytes = 2 * 1024 * 1024; // 2 MB
  if (file.size > maxBytes) return `${label}: file too large (≤ 2 MB)`;
  return null;
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    // --- Turnstile ---
    const gate = await verifyTurnstile(req, form);
    if (!gate.ok) return gate.res!;

    // --- Required basics (now stricter, matching your UI) ---
    const job_slug = String(form.get('job_slug') || '').trim();
    const name = String(form.get('name') || '').trim();
    const email = String(form.get('email') || '').trim();
    const consent = form.get('consent');

    // Newly required fields
    const age = Number(form.get('age') || 0) || null;
    const country = String(form.get('country') || '').trim();
    const state = String(form.get('state') || '').trim();
    const whatsapp = String(form.get('whatsapp') || '').trim();
    const qualification = String(form.get('qualification') || '').trim();
    const qualification_other = String(form.get('qualification_other') || '').trim();
    const degree_name = String(form.get('degree_name') || '').trim();
    const heard_from = String(form.get('heard_from') || '').trim();
    const heard_from_other = String(form.get('heard_from_other') || '').trim();

    // Motivation (used to satisfy NOT NULL "note")
    const q1 = String(form.get('q1') || '').trim();
    const note = q1 || '-';

    // Files (all required now)
    const resume = form.get('resume') as File | null;
    const coverLetter = form.get('cover_letter') as File | null;
    const projectSummary = form.get('project_summary') as File | null;

    // Hard-required checks
    if (!job_slug || !name || !email || !consent) {
      return NextResponse.json({ ok: false, error: 'Missing required fields' }, { status: 400 });
    }
    if (!age || !country || !state || !whatsapp || !qualification || !degree_name || !heard_from || !q1) {
      return NextResponse.json({ ok: false, error: 'Please complete all required fields' }, { status: 400 });
    }
    if (qualification === 'Other' && !qualification_other) {
      return NextResponse.json({ ok: false, error: 'Please specify your qualification (Other)' }, { status: 400 });
    }
    if (heard_from === 'Other' && !heard_from_other) {
      return NextResponse.json({ ok: false, error: 'Please specify how you heard about this role (Other)' }, { status: 400 });
    }

    // PDF validations
    const v1 = validatePdf(resume, 'Résumé / CV');
    if (v1) return NextResponse.json({ ok: false, error: v1 }, { status: 400 });
    const v2 = validatePdf(coverLetter, 'Cover Letter');
    if (v2) return NextResponse.json({ ok: false, error: v2 }, { status: 400 });
    const v3 = validatePdf(projectSummary, '1-Page Project Summary');
    if (v3) return NextResponse.json({ ok: false, error: v3 }, { status: 400 });

    // --- Optional/common (kept for compatibility) ---
    // Portfolio was removed in UI; keep empty string to satisfy older schema if present.
    const portfolio = String(form.get('portfolio') || '');

    // Experiences (up to 3), still optional
    const experiences = [
      { role: String(form.get('exp1_role') || ''), org: String(form.get('exp1_org') || ''), dates: String(form.get('exp1_dates') || ''), summary: String(form.get('exp1_summary') || '') },
      { role: String(form.get('exp2_role') || ''), org: String(form.get('exp2_org') || ''), dates: String(form.get('exp2_dates') || ''), summary: String(form.get('exp2_summary') || '') },
      { role: String(form.get('exp3_role') || ''), org: String(form.get('exp3_org') || ''), dates: String(form.get('exp3_dates') || ''), summary: String(form.get('exp3_summary') || '') },
    ].filter(x => x.role || x.org || x.summary);

    // Bundle misc answers (and new fields) into JSONB
    const custom_answers: Record<string, any> = {
      q1, // motivation (also duplicated to "note")
      qualification_other: qualification === 'Other' ? qualification_other : null,
      heard_from,
      heard_from_other: heard_from === 'Other' ? heard_from_other : null,
      attachments: {
        // will be filled after uploads
        cover_letter_path: null,
        project_summary_path: null,
      },
    };

    // --- Supabase ---
    const supabaseUrl = process.env.SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    if (!supabaseUrl || !serviceKey) {
      console.error('Supabase env missing');
      return NextResponse.json({ ok: false, error: 'Server misconfiguration' }, { status: 500 });
    }
    const supabase = createClient(supabaseUrl, serviceKey);

    // Upload helper
    async function uploadPdfToBucket(file: File, prefix: string) {
      const bytes = await file.arrayBuffer();
      const safeName = sanitizeName(name || 'applicant');
      const path = `${prefix}/${Date.now()}_${safeName}.pdf`;
      const { error } = await supabase
        .storage
        .from('applications')
        .upload(path, Buffer.from(bytes), { contentType: 'application/pdf', upsert: false });
      if (error) throw error;
      return path;
    }

    // Upload all 3 PDFs
    const resume_path = await uploadPdfToBucket(resume!, 'resumes');
    const cover_letter_path = await uploadPdfToBucket(coverLetter!, 'cover_letters');
    const project_summary_path = await uploadPdfToBucket(projectSummary!, 'project_summaries');

    // Fill attachment paths into custom_answers
    custom_answers.attachments.cover_letter_path = cover_letter_path;
    custom_answers.attachments.project_summary_path = project_summary_path;

    // --- Insert DB row (keep existing schema fields) ---
    const { error: dbErr } = await supabase.from('applications').insert({
      job_slug,
      name,
      age,
      email,
      country,
      state,
      whatsapp,
      qualification,
      degree_name,
      portfolio,          // stays for backward-compat (empty string if not used)
      note,               // NOT NULL in your DB (using q1)
      resume_path,        // main resume path (top-level column kept)
      experiences,
      custom_answers,     // includes heard_from, other-fields, and the 2 extra file paths
    });

    if (dbErr) throw dbErr;

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 });
  }
}
