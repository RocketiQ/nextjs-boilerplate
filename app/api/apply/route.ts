import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs'; // ensure Node runtime for file handling

function sanitizeName(s: string) {
  return s.trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '_').slice(0, 60);
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    // required basics
    const job_slug    = String(form.get('job_slug') || '');
    const name        = String(form.get('name') || '');
    const email       = String(form.get('email') || '');
    const note        = String(form.get('note') || '');
    const consent     = form.get('consent');
    const file        = form.get('resume') as File | null;

    if (!job_slug || !name || !email || !note || !consent || !file) {
      return NextResponse.json({ ok:false, error:'Missing required fields' }, { status: 400 });
    }

    // 2 MB + PDF validation
    const maxBytes = 2 * 1024 * 1024;
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) return NextResponse.json({ ok:false, error:'PDF only' }, { status: 400 });
    if (file.size > maxBytes) return NextResponse.json({ ok:false, error:'File too large (≤ 2 MB)' }, { status: 400 });

    // optional/common fields
    const age          = Number(form.get('age') || 0) || null;
    const country      = String(form.get('country') || '');
    const state        = String(form.get('state') || '');
    const whatsapp     = String(form.get('whatsapp') || '');
    const qualification= String(form.get('qualification') || '');
    const degree_name  = String(form.get('degree_name') || '');
    const portfolio    = String(form.get('portfolio') || '');

    // experiences (up to 3 rows)
    const experiences = [
      { role: String(form.get('exp1_role') || ''), org: String(form.get('exp1_org') || ''), dates: String(form.get('exp1_dates') || ''), summary: String(form.get('exp1_summary') || '') },
      { role: String(form.get('exp2_role') || ''), org: String(form.get('exp2_org') || ''), dates: String(form.get('exp2_dates') || ''), summary: String(form.get('exp2_summary') || '') },
      { role: String(form.get('exp3_role') || ''), org: String(form.get('exp3_org') || ''), dates: String(form.get('exp3_dates') || ''), summary: String(form.get('exp3_summary') || '') },
    ].filter(x => x.role || x.org || x.summary);

    // any custom job-specific questions
    const custom_answers: Record<string, any> = {
      q1: form.get('q1') || null,
      q2: form.get('q2') || null
    };

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Upload file to private Storage bucket
    const bytes = await file.arrayBuffer();
    const safeName = sanitizeName(name || 'applicant');
    const path = `resumes/${Date.now()}_${safeName}.pdf`;
    const { error: upErr } = await supabase.storage.from('applications')
      .upload(path, Buffer.from(bytes), { contentType: 'application/pdf', upsert: false });
    if (upErr) throw upErr;

    // Insert DB row
    const { error: dbErr } = await supabase.from('applications').insert({
      job_slug, name, age, email, country, state, whatsapp,
      qualification, degree_name, portfolio, note,
      resume_path: path, experiences, custom_answers
    });
    if (dbErr) throw dbErr;

    return NextResponse.json({ ok:true });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ ok:false, error: 'Server error' }, { status: 500 });
  }
}
