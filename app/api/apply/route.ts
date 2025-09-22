// app/api/apply/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs'; // needed for Buffer/file handling

function sanitizeName(s: string) {
  return s.trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '_').slice(0, 60);
}

async function verifyTurnstile(req: Request, form: FormData) {
  const token = (form.get('cf-turnstile-response') as string) || '';
  if (!token) return { ok: false as const, error: 'Turnstile token missing' };

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('cf-connecting-ip') ||
    '';

  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return { ok: false as const, error: 'Server misconfiguration' };

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret, response: token, remoteip: ip }),
  });
  const out = await res.json();
  if (!out.success) return { ok: false as const, error: 'Turnstile verification failed' };
  return { ok: true as const };
}

function requirePdf(f: File | null, label: string) {
  if (!f) return `${label} is required.`;
  const isPdf = f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf');
  if (!isPdf) return `${label}: please upload a PDF file.`;
  const max = 2 * 1024 * 1024; // 2 MB
  if (f.size > max) return `${label}: file must be under 2 MB.`;
  return null;
}

function optionalPdf(f: File | null, label: string) {
  if (!f) return null; // truly optional
  const isPdf = f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf');
  if (!isPdf) return `${label}: please upload a PDF file.`;
  const max = 2 * 1024 * 1024; // 2 MB
  if (f.size > max) return `${label}: file must be under 2 MB.`;
  return null;
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    // 1) Human check
    const t = await verifyTurnstile(req, form);
    if (!t.ok) return NextResponse.json({ ok: false, error: t.error }, { status: 400 });

    // 2) Required basics (match Option B schema)
    const job_slug = String(form.get('job_slug') || '').trim();
    const name = String(form.get('name') || '').trim();
    const email = String(form.get('email') || '').trim();

    const age = Number(form.get('age') || 0) || null;
    const country = String(form.get('country') || '').trim();
    const state = String(form.get('state') || '').trim();
    const whatsapp = String(form.get('whatsapp') || '').trim();

    const qualification = String(form.get('qualification') || '').trim();
    const qualification_other =
      (String(form.get('qualification_other') || '').trim() || null);

    const degree_name = String(form.get('degree_name') || '').trim();

    const heard_from = String(form.get('heard_from') || '').trim();
    const heard_from_other =
      (String(form.get('heard_from_other') || '').trim() || null);

    // store q1 as "motivation" (NOT NULL in the DB)
    const motivation = String(form.get('q1') || '').trim();

    // 3) Files
    const resume = form.get('resume') as File | null;
    const cover = form.get('cover_letter') as File | null;        // optional
    const project = form.get('project_summary') as File | null;   // optional

    // Validate files (Résumé required; others optional)
    const v1 = requirePdf(resume, 'Résumé / CV');
    if (v1) return NextResponse.json({ ok: false, error: v1 }, { status: 400 });

    const v2 = optionalPdf(cover, 'Cover Letter');
    if (v2) return NextResponse.json({ ok: false, error: v2 }, { status: 400 });

    const v3 = optionalPdf(project, '1-Page Project Summary');
    if (v3) return NextResponse.json({ ok: false, error: v3 }, { status: 400 });

    // Ensure required text fields present
    if (
      !job_slug || !name || !email || !country || !state ||
      !whatsapp || !qualification || !degree_name || !heard_from || !motivation
    ) {
      return NextResponse.json({ ok: false, error: 'Missing required fields' }, { status: 400 });
    }

    // 4) Experiences (up to 3; tolerate missing)
    const experiences = [
      { role: String(form.get('exp1_role') || '').trim(), org: String(form.get('exp1_org') || '').trim(), dates: String(form.get('exp1_dates') || '').trim(), summary: String(form.get('exp1_summary') || '').trim() },
      { role: String(form.get('exp2_role') || '').trim(), org: String(form.get('exp2_org') || '').trim(), dates: String(form.get('exp2_dates') || '').trim(), summary: String(form.get('exp2_summary') || '').trim() },
      { role: String(form.get('exp3_role') || '').trim(), org: String(form.get('exp3_org') || '').trim(), dates: String(form.get('exp3_dates') || '').trim(), summary: String(form.get('exp3_summary') || '').trim() },
    ].filter(x => x.role || x.org || x.summary);

    const custom_answers: Record<string, any> = {}; // keep for UTM/etc. later

    // 5) Uploads
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const safeName = sanitizeName(name || 'applicant');

    const uploadPdf = async (folder: string, f: File | null) => {
      if (!f) return null;
      const bytes = Buffer.from(await f.arrayBuffer());
      const path = `${folder}/${Date.now()}_${safeName}.pdf`;
      const { error } = await supabase
        .storage
        .from('applications')
        .upload(path, bytes, { contentType: 'application/pdf', upsert: false });
      if (error) throw error;
      return path;
    };

    const resume_path = await uploadPdf('resumes', resume);
    const cover_letter_path = await uploadPdf('covers', cover);
    const project_summary_path = await uploadPdf('projects', project);

    // 6) Insert row
    const { error: dbErr } = await supabase.from('applications').insert({
      job_slug,
      name,
      email,
      age,
      country,
      state,
      whatsapp,
      qualification,
      qualification_other,
      degree_name,
      heard_from,
      heard_from_other,
      motivation,                // NOT NULL in schema
      resume_path,               // required file
      cover_letter_path,         // nullable
      project_summary_path,      // nullable
      experiences,
      custom_answers
    });
    if (dbErr) throw dbErr;

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 });
  }
}
