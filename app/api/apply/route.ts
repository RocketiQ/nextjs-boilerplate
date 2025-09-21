import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs'; // needed for Buffer/file handling

function sanitizeName(s: string) {
  return s.trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '_').slice(0, 60);
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    // --- Turnstile ---
    const token = (form.get('cf-turnstile-response') as string) || '';
    if (!token) {
      return NextResponse.json({ ok: false, error: 'Turnstile token missing' }, { status: 400 });
    }

    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('cf-connecting-ip') ||
      '';

    const secret = process.env.TURNSTILE_SECRET_KEY;
    if (!secret) {
      console.error('TURNSTILE_SECRET_KEY missing');
      return NextResponse.json({ ok: false, error: 'Server misconfiguration' }, { status: 500 });
    }

    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token, remoteip: ip as string }),
    });

    const outcome = await verifyRes.json();
    if (!outcome.success) {
      // console.log('Turnstile errors:', outcome['error-codes']);
      return NextResponse.json({ ok: false, error: 'Turnstile verification failed' }, { status: 400 });
    }

    // --- Required basics ---
    const job_slug = String(form.get('job_slug') || '');
    const name = String(form.get('name') || '');
    const email = String(form.get('email') || '');
    const consent = form.get('consent');
    const file = form.get('resume') as File | null;

    // NOTE column `note` is NOT NULL in your DB; use q1 fallback or '-'
    const note = (String(form.get('note') ?? form.get('q1') ?? '').trim() || '-');

    if (!job_slug || !name || !email || !consent || !file) {
      return NextResponse.json({ ok: false, error: 'Missing required fields' }, { status: 400 });
    }

    // 2 MB + PDF validation
    const maxBytes = 2 * 1024 * 1024;
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) return NextResponse.json({ ok: false, error: 'PDF only' }, { status: 400 });
    if (file.size > maxBytes) return NextResponse.json({ ok: false, error: 'File too large (≤ 2 MB)' }, { status: 400 });

    // --- Optional/common fields ---
    const age = Number(form.get('age') || 0) || null;
    const country = String(form.get('country') || '');
    const state = String(form.get('state') || '');
    const whatsapp = String(form.get('whatsapp') || '');
    const qualification = String(form.get('qualification') || '');
    const degree_name = String(form.get('degree_name') || '');
    const portfolio = String(form.get('portfolio') || '');

    const experiences = [
      { role: String(form.get('exp1_role') || ''), org: String(form.get('exp1_org') || ''), dates: String(form.get('exp1_dates') || ''), summary: String(form.get('exp1_summary') || '') },
      { role: String(form.get('exp2_role') || ''), org: String(form.get('exp2_org') || ''), dates: String(form.get('exp2_dates') || ''), summary: String(form.get('exp2_summary') || '') },
      { role: String(form.get('exp3_role') || ''), org: String(form.get('exp3_org') || ''), dates: String(form.get('exp3_dates') || ''), summary: String(form.get('exp3_summary') || '') },
    ].filter(x => x.role || x.org || x.summary);

    const custom_answers: Record<string, any> = {
      q1: form.get('q1') || null,
      q2: form.get('q2') || null,
    };

    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

    // Upload resume to private Storage bucket
    const bytes = await file.arrayBuffer();
    const safeName = sanitizeName(name || 'applicant');
    const path = `resumes/${Date.now()}_${safeName}.pdf`;

    const { error: upErr } = await supabase
      .storage
      .from('applications')
      .upload(path, Buffer.from(bytes), { contentType: 'application/pdf', upsert: false });

    if (upErr) throw upErr;

    // Insert DB row
    const { error: dbErr } = await supabase.from('applications').insert({
      job_slug, name, age, email, country, state, whatsapp,
      qualification, degree_name, portfolio, note,
      resume_path: path, experiences, custom_answers
    });

    if (dbErr) throw dbErr;

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 });
  }
}
