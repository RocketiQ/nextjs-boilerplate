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
      <div className="apply-shell">
        <div style={{ marginBottom: 16 }}>
          <small style={{ background:'#fee2e2', color:'#991b1b', padding:'4px 8px', borderRadius:999, fontWeight:600 }}>RocketiQ — Careers</small>
          <h1 style={{ fontSize: 28, margin: '12px 0 8px' }}>Business Operations Associate</h1>
          <p style={{ color:'#374151', margin:0 }}>Apply below. PDF résumé (≤ 2 MB) required. By submitting, you consent to recruiting data processing.</p>
        </div>

        <div className="careers-grid">
          {/* Job post (content) */}
          <section style={card}>
            <h2 style={{ marginTop:0 }}>About RocketiQ</h2>
            <p>
              RocketiQ is a research-native aerospace edtech startup founded by a U.S.-based rocket propulsion scientist.
              We build simulation-driven workshops, open-source research projects, and educational outreach programs in aerospace and space sciences.
              Our mission is to bridge the gap between ambitious learners in India and global research standards in space, propulsion, and astrophysics.
            </p>

            <h3>About the Role</h3>
            <p>
              Support day-to-day operations across Creative, Web, Hiring/HR Ops, Events, and Internal Systems. This is a core-team, non-executive role reporting into the Founder and Business Operations Manager.
              You’ll help run the weekly rhythm, keep trackers clean, prep documents, and drive follow-ups to done.
            </p>

            <h3>Key Responsibilities</h3>
            <ul>
              <li><strong>Founder support:</strong> Turn Founder’s notes into tasks; keep a daily brief and decision/action log; end-of-day update.</li>
              <li><strong>Calendar & comms:</strong> Manage IST/US scheduling; prep agendas/pre-reads; draft follow-ups for approval; coordinate stakeholders.</li>
              <li><strong>Meeting ops:</strong> Run standups when delegated; capture minutes; assign owners/dates; chase blockers; keep the task board current.</li>
              <li><strong>Hiring & HR (support):</strong> Draft posts, screen to must-haves, schedule interviews/take-homes, prep offers/onboarding; update the master sheet.</li>
              <li><strong>Creative/social (coordination):</strong> Maintain content calendar; collect briefs/assets; basic QA on copy/links; weekly status.</li>
              <li><strong>Website/product (assist):</strong> Convert notes to tickets/specs; maintain backlog; coordinate sprints; run UAT checklists; compile release notes.</li>
              <li><strong>Events (assist):</strong> Build run-of-show; set up Zoom/YouTube/StreamYard; moderate chat/Q&amp;A; post-event summary with metrics.</li>
              <li><strong>Docs & systems:</strong> Keep SOPs/templates current; enforce naming/versioning; manage access lists; log NDAs/vendor docs; maintain confidentiality.</li>
              <li><strong>Reporting & improvements:</strong> Weekly dashboard (hiring, content, web, events), flag risks, benchmark tools, and suggest small process fixes.</li>
            </ul>

            <h3>Requirements (strict)</h3>
            <ul>
              <li><strong>Education:</strong> bachelor’s graduate or master’s (pursuing/graduate) or PhD (pursuing/graduate).</li>
              <li><strong>Experience:</strong> 1+ years proven leadership/management in operations, program management, or product/people operations.</li>
              <li><strong>Execution:</strong> evidence of shipping on schedules across multiple stakeholders; comfort running meeting rhythms and driving follow-ups.</li>
              <li><strong>Tools:</strong> strong Google Workspace; task trackers (Notion/Asana/Trello/Jira); Zoom/Meet; solid spreadsheet skills.</li>
              <li><strong>Communication:</strong> excellent written and verbal English; clear updates and professional stakeholder handling.</li>
              <li><strong>Process/Quality:</strong> SOP/checklist mindset, versioning/naming hygiene, attention to detail.</li>
              <li><strong>Availability:</strong> ~2–3 hours/day on weekdays with overlap to India and U.S. time zones; responsive on priority items.</li>
            </ul>

            <h3>What You’ll Gain</h3>
            <ul>
              <li>Core-team exposure with direct mentorship from the Founder and Ops Manager.</li>
              <li>Certificate of Appointment (unique ID) and performance-based Letter of Recommendation.</li>
              <li>Public credit on shipped pages/events and internal systems you help build.</li>
              <li>Priority consideration for future paid roles/contract work.</li>
            </ul>

            <h3>Duration/Time/Location/Compensation</h3>
            <ul>
              <li><strong>Duration:</strong> minimum 1 year; extensions possible based on performance</li>
              <li><strong>Notice period:</strong> 3 months if you choose to leave</li>
              <li><strong>Time:</strong> ~2–3 hours/day (weekday cadence), flexible scheduling with overlap</li>
              <li><strong>Location:</strong> Remote (India-first; global participation welcome)</li>
              <li><strong>Compensation:</strong> Unpaid role (voluntary appointment); no salary or benefits</li>
            </ul>

            <p>For questions reach out to us at <a href="mailto:contact@therocketiq.com">contact@therocketiq.com</a></p>

            <h3>Documents needed for Application</h3>
            <ul>
              <li>CV</li>
              <li>1-page project summary: Describe a cross-team project you led—your plan, meeting schedule, key metrics you tracked, main risks and how you handled them, and the final results.</li>
            </ul>

            <h3>Selection Process</h3>
            <p>Screening → interview → Selection → 30-day trial/pilot month → confirmation.</p>
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
