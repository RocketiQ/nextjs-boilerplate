'use client';
import { useState } from 'react';
import Turnstile from '../components/Turnstile';

export default function BusinessOpsAssociateApply() {
  const [pending, setPending] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [fileErr, setFileErr] = useState<string | null>(null);

  function validateFile(f: File) {
    const isPdf = f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) return 'Please upload a PDF file.';
    const maxBytes = 2 * 1024 * 1024;
    if (f.size > maxBytes) return 'PDF must be ≤ 2 MB.';
    return null;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true); setMsg(null); setFileErr(null);

    const fd = new FormData(e.currentTarget);
    const file = fd.get('resume') as File | null;
    if (!file) { setFileErr('Attach your resume (PDF).'); setPending(false); return; }
    const v = validateFile(file); if (v) { setFileErr(v); setPending(false); return; }

    const res = await fetch('/api/apply', { method: 'POST', body: fd });
    if (res.ok) {
      setMsg('Application submitted. Thank you!');
      // GA4 event (no PII)
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'application_submitted', {
          job_slug: 'business-operations-associate',
        });
      }
      (e.currentTarget as HTMLFormElement).reset();
    } else {
      const j = await res.json().catch(() => null);
      setMsg(j?.error ? `Failed: ${j.error}` : 'Submission failed. Please try again.');
    }
    setPending(false);
  }

  const card: React.CSSProperties = { border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, background: '#fff' };
  const label: React.CSSProperties = { fontSize: 14, fontWeight: 600, marginBottom: 6 };
  const input: React.CSSProperties = { padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 10, fontSize: 14, width: '100%' };

  return (
    <main style={{ background: '#f7f7f8', minHeight: '100vh' }}>
      {/* rely on .apply-shell from globals.css (no inline maxWidth/font here) */}
      <div className="apply-shell">
        <div style={{ marginBottom: 16 }}>
          <small style={{ background:'#fee2e2', color:'#991b1b', padding:'4px 8px', borderRadius:999, fontWeight:600 }}>RocketiQ — Careers</small>
          <h1 style={{ fontSize: 28, margin: '12px 0 8px' }}>Business Operations Associate — Part-Time, Unpaid</h1>
          <p style={{ color:'#374151', margin:0 }}>Apply below. PDF résumé (≤ 2 MB) required. By submitting, you consent to recruiting data processing.</p>
        </div>

        <div className="careers-grid">
          {/* Job post (summary) */}
          <section style={card}>
            <h2 style={{ marginTop:0 }}>About RocketiQ</h2>
            <p>RocketiQ is a research-native aerospace edtech startup founded by a U.S.-based rocket propulsion scientist. We build simulation-driven workshops, open-source research projects, and educational outreach.</p>
            <h3>About the Role</h3>
            <p>Founder-facing support across Creative, Web, Hiring/HR Ops, Events, and Internal Systems. Turn notes into tasks, keep trackers clean, prep docs, and drive follow-ups to done.</p>
            <h3>Key Responsibilities</h3>
            <ul>
              <li>Calendar & comms; agendas, minutes, follow-ups</li>
              <li>Hiring support: posts, screening, scheduling, onboarding logs</li>
              <li>Creative/social coordination; weekly status</li>
              <li>Website/product assist: tickets, sprint coordination, UAT checklists</li>
              <li>Events assist: run-of-show, platform setup, post-event metrics</li>
              <li>Docs & systems hygiene; access lists; NDAs/vendor docs</li>
              <li>Weekly dashboard (hiring, content, web, events); flag risks</li>
            </ul>
          </section>

          {/* Apply form */}
          <section style={card}>
            <h2 style={{ marginTop:0 }}>Apply Now</h2>
            <form onSubmit={onSubmit}>
              <input type="hidden" name="job_slug" value="business-operations-associate" />

              <div style={{ display:'grid', gap: 12 }}>
                <div><div style={label}>Full name</div><input name="name" required placeholder="Jane Doe" style={input} /></div>
                <div><div style={label}>Age</div><input name="age" type="number" min={0} placeholder="22" style={input} /></div>
                <div><div style={label}>Email</div><input name="email" type="email" required placeholder="jane@domain.com" style={input} /></div>

                <div className="stack-2">
                  <div><div style={label}>Country</div><input name="country" placeholder="India" style={input} /></div>
                  <div><div style={label}>State</div><input name="state" placeholder="Karnataka" style={input} /></div>
                </div>

                <div><div style={label}>WhatsApp (with country code)</div><input name="whatsapp" placeholder="+919876543210" style={input} /></div>

                <div>
                  <div style={label}>Qualification</div>
                  <select name="qualification" style={input} defaultValue="">
                    <option value="" disabled>Choose one</option>
                    <option>Bachelors pursuing</option>
                    <option>Bachelors graduate</option>
                    <option>Masters pursuing</option>
                    <option>Masters graduate</option>
                    <option>PhD pursuing</option>
                    <option>PhD graduate</option>
                  </select>
                </div>

                <div><div style={label}>Degree name</div><input name="degree_name" placeholder="B.Tech Mechanical" style={input} /></div>

                <div><div style={label}>Portfolio / GitHub (optional)</div><input name="portfolio" type="url" placeholder="https://github.com/username" style={input} /></div>

                <fieldset style={{ border:'1px dashed #e5e7eb', borderRadius:12, padding:12 }}>
                  <legend style={{ fontSize:13 }}>Relevant experience (up to 3)</legend>
                  {[1,2,3].map(i => (
                    <div key={i} className="stack-2" style={{ marginBottom: 10 }}>
                      <input name={`exp${i}_role`} placeholder={`Experience ${i}: Role`} style={input} />
                      <input name={`exp${i}_org`} placeholder="Organization" style={input} />
                      <input name={`exp${i}_dates`} placeholder="Dates (e.g., 2023–2024)" style={input} />
                      <input name={`exp${i}_summary`} placeholder="1–2 line summary" style={input} />
                    </div>
                  ))}
                </fieldset>

                <div><div style={label}>Why RocketiQ for this role? (optional)</div><textarea name="q1" rows={4} style={{ ...input, resize:'vertical' }} /></div>
                <div><div style={label}>Anything else we should know? (optional)</div><textarea name="q2" rows={3} style={{ ...input, resize:'vertical' }} /></div>

                <div>
                  <div style={label}>Resume (PDF, ≤ 2 MB)</div>
                  <input type="file" name="resume" accept="application/pdf" required />
                  {fileErr && <div style={{ color:'#b91c1c', fontSize:12, marginTop:6 }}>{fileErr}</div>}
                </div>

                <label style={{ fontSize:13, color:'#374151' }}>
                  <input type="checkbox" name="consent" required /> I consent to RocketiQ processing my data for recruiting.
                </label>

                {/* Turnstile inside the form */}
                <Turnstile theme="light" />

                <button
                  type="submit"
                  disabled={pending}
                  style={{
                    background: pending ? '#ef4444aa' : '#ef4444',
                    color:'#fff', border:0, borderRadius:10, padding:'10px 14px',
                    fontWeight:600, cursor: pending ? 'not-allowed' : 'pointer'
                  }}
                >
                  {pending ? 'Submitting…' : 'Submit Application'}
                </button>

                {msg && <div style={{ fontSize:14, color: msg.startsWith('Failed') ? '#b91c1c' : '#065f46' }}>{msg}</div>}
              </div>
            </form>
          </section>
        </div>

        <p style={{ textAlign:'center', color:'#6b7280', fontSize:12, marginTop:20 }}>© {new Date().getFullYear()} RocketiQ</p>
      </div>
    </main>
  );
}
