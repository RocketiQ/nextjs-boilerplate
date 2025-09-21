import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

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
  const max = 2 * 1024 * 1024;
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
    const job_slug = String(form.get('job_slug') || '');
    const name = String(form.get('name') || '');
    const email = String(form.get('email') || '');
    const age = Number(form.get('age') || 0) || null;

    const country = String(form.get('country') || '');
    const state = String(form.get('state') || '');
    const whatsapp = String(form.get('whatsapp') || '');

    const qualification = String(form.get('qualification') || '');
    const qualification_other = String(form.get('qualification_other') || '') || null;
    const degree_name = String(form.get('degree_name') || '');

    const heard_from = String(form.get('heard_from') || '');
    const heard_from_other = String(form.get('heard_from_other') || '') || null;

    const motivation = String(form.get('q1') || '').trim(); // we store q1 as "motivation"

    // 3) Required files
    const resume = form.get('resume') as File | null;
    const cover = form.get('cover_letter') as File | null;
    const project = form.get('project_summary') as File | null;

    const v1 = requirePdf(resume, 'Résumé / CV');
    if (v1) return NextResponse.json({ ok: false, error: v1 }, { status: 400 });
    const v2 = requirePdf(cover, 'Cover Letter');
    if (v2) return NextResponse.json({ ok: false, error: v2 }, { status: 400 });
    const v3 = requirePdf(project, '1-Page Project Summary');
    if (v3) return NextResponse.json({ ok: false, error: v3 }, { status: 400 });

    if (!job_slug || !name || !email || !country || !state || !whatsapp || !qualification || !degree_name || !heard_from || !motivation) {
      return NextResponse.json({ ok: false, error: 'Missing required fields' }, { status: 400 });
    }

    // 4) Optional: experiences bundle (same shape as before)
    const experiences = [
      { role: String(form.get('exp1_role') || ''), org: String(form.get('exp1_org') || ''), dates: String(form.get('exp1_dates') || ''), summary: String(form.get('exp1_summary') || '') },
      { role: String(form.get('exp2_role') || ''), org: String(form.get('exp2_org') || ''), dates: String(form.get('exp2_dates') || ''), summary: String(form.get('exp2_summary') || '') },
      { role: String(form.get('exp3_role') || ''), org: String(form.get('exp3_org') || ''), dates: String(form.get('exp3_dates') || ''), summary: String(form.get('exp3_summary') || '') },
    ].filter(x => x.role || x.org || x.summary);

    const custom_answers: Record<string, any> = {}; // keep if you want to add UTM later

    // 5) Upload files
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    const safeName = sanitizeName(name || 'applicant');

    const up = async (folder: string, f: File) => {
      const bytes = Buffer.from(await f.arrayBuffer());
      const path = `${folder}/${Date.now()}_${safeName}.pdf`;
      const { error } = await supabase.storage.from('applications').upload(path, bytes, {
        contentType: 'application/pdf',
        upsert: false,
      });
      if (error) throw error;
      return path;
    };

    const resume_path = await up('resumes', resume!);
    const cover_letter_path = await up('covers', cover!);
    const project_summary_path = await up('projects', project!);

    // 6) Insert row (MATCHES Option B columns)
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
      motivation,
      resume_path,
      cover_letter_path,
      project_summary_path,
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
