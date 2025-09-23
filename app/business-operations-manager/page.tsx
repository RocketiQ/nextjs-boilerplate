'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Turnstile from '../components/Turnstile';

export default function BusinessOpsManagerApply() {
  const [pending, setPending] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [fileErr, setFileErr] = useState<string | null>(null);

  const [qualification, setQualification] = useState<string>('');
  const [heardFrom, setHeardFrom] = useState<string>('');

  function validatePdf(f: File | null, label: string) {
    if (!f) return `${label} is required.`;
    const isPdf = f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) return `${label}: please upload a PDF file.`;
    const maxBytes = 2 * 1024 * 1024; // 2 MB
    if (f.size > maxBytes) return `${label}: file must be under 2 MB.`;
    return null;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setMsg(null);
    setFileErr(null);

    const formEl = e.currentTarget;
    const fd = new FormData(formEl);

    // Conditional "Other" text boxes must be filled
    if (fd.get('qualification') === 'Other' && !String(fd.get('qualification_other') || '').trim()) {
      setPending(false);
      return setMsg('Please specify your qualification in the “If Other, specify” field.');
    }
    if (fd.get('heard_from') === 'Other' && !String(fd.get('heard_from_other') || '').trim()) {
      setPending(false);
      return setMsg('Please specify how you heard about this role in the “If Other, specify” field.');
    }

    // Validate required PDFs (this role requires all three)
    const resume = fd.get('resume') as File | null;
    const cover = fd.get('cover_letter') as File | null;
    const project = fd.get('project_summary') as File | null;

    const v1 = validatePdf(resume, 'Résumé / CV');
    if (v1) { setFileErr(v1); setPending(false); return; }
    const v2 = validatePdf(cover, 'Cover Letter');
    if (v2) { setFileErr(v2); setPending(false); return; }
    const v3 = validatePdf(project, '1-Page Project Summary');
    if (v3) { setFileErr(v3); setPending(false); return; }

    // Submit to API
    const res = await fetch('/api/apply', { method: 'POST', body: fd });

    if (res.ok) {
      setMsg('Application submitted. Thank you!');
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'application_submitted', { job_slug: 'business-operations-manager' });
      }
      formEl.reset();
      setQualification('');
      setHeardFrom('');
    } else {
      const j = await res.json().catch(() => null);
      setMsg(j?.error ? `Failed: ${j.error}` : 'Submission failed. Please try again.');
    }
    setPending(false);
  }

  // Typography helpers (consistent with other pages)
  const h2First: React.CSSProperties = { marginTop: 0, marginBottom: 8, fontWeight: 800, fontSize: 20 };
  const h2Next:  React.CSSProperties = { marginTop: 20, marginBottom: 8, fontWeight: 800, fontSize: 20 };
  const label:   React.CSSProperties = { fontSize: 14, fontWeight: 700, marginBottom: 6, color: 'var(--muted)' };

  return (
    <main>
      {/* Centered logo */}
      <header className="logo-bar">
        <Image
          src="/rocketiq-white.png"
          alt="RocketiQ"
          width={320}
          height={44}
          priority
          style={{ height: 'auto' }}
        />
      </header>

      <div className="apply-shell">
        {/* Badge + Title */}
        <div style={{ marginBottom: 16 }}>
          <small className="pill">RocketiQ — Careers</small>
          <h1 style={{ fontSize: 28, margin: '12px 0 0' }}>Business Operations Manager</h1>
        </div>

        <div className="careers-grid">
          {/* Left: Job description */}
          <section className="card-dk">
            <h2 style={h2First}><strong>About RocketiQ</strong></h2>
            <p>
              RocketiQ is a research-native aerospace edtech startup founded by a U.S.-based rocket propulsion scientist.
              We build simulation-driven workshops, open-source research projects, and educational outreach programs in aerospace and space sciences.
              Our mission is to bridge the gap between ambitious learners in India and global research standards in space, propulsion, and astrophysics.
            </p>

            <h2 style={h2Next}><strong>About the Role</strong></h2>
            <p>
              Own day-to-day business operations across Creative, Web, Hiring/HR Ops, Events, and Internal Systems.
              Translate goals into plans, run execution cadences, enforce quality bars, and keep the organization synchronized.
              Core-team scope (non-executive) with a pathway to future executive responsibility based on performance.
            </p>

            <h2 style={h2Next}><strong>Key Responsibilities</strong></h2>
            <ul style={{ listStyleType: 'disc', paddingLeft: '1.25rem', marginTop: 0 }}>
              <li><strong>Creative &amp; outreach:</strong> Manage designers/social/outreach; maintain content calendar, posting cadence, brand voice, and asset QA.</li>
              <li><strong>Website/product:</strong> Coordinate web designer/developer and creative lead; own sprint planning, specs, issue triage, UAT/QA, and release notes.</li>
              <li><strong>Hiring &amp; HR ops:</strong> Create job posts; manage applications; schedule interviews; run structured evaluations; issue offers; onboard/offboard; maintain master sheets, certificates/LORs, and performance tracking.</li>
              <li><strong>Operations cadence:</strong> Run weekly standups and reviews; set OKRs/KPIs; track progress; publish notes/decisions; keep the task tracker current.</li>
              <li><strong>Events &amp; partnerships:</strong> Plan/host virtual events; manage platforms (Zoom/YouTube/StreamYard); run-of-show, moderator briefs, and post-event reports.</li>
              <li><strong>Documentation &amp; compliance:</strong> Maintain SOPs, templates, and checklists; ensure data hygiene, access control, confidentiality/NDAs, and vendor paperwork.</li>
              <li><strong>Special projects:</strong> Support program launches (workshops/fellowships), light vendor coordination, and cross-team problem-solving.</li>
            </ul>

            <h2 style={h2Next}><strong>Qualifications</strong></h2>
            <ul style={{ listStyleType: 'disc', paddingLeft: '1.25rem', marginTop: 0 }}>
              <li><strong>Education:</strong> bachelor’s graduate or master’s (pursuing/graduate) or PhD (pursuing/graduate).</li>
              <li><strong>Experience:</strong> 2+ years proven leadership/management in operations, program management, or product/people operations.</li>
              <li><strong>Execution:</strong> track record of shipping on schedules across multiple teams; comfort running cadences, setting OKRs/KPIs, and holding owners accountable.</li>
              <li><strong>Communication:</strong> excellent written and verbal English; crisp specs, clear updates, professional stakeholder management.</li>
              <li><strong>Process/Quality:</strong> documentation habit, SOP/checklist mindset, versioning/naming hygiene, attention to detail.</li>
              <li><strong>Availability:</strong> ~3 hours/day on weekdays with overlap to India and U.S. time zones; responsive on priority items.</li>
            </ul>

            <h2 style={h2Next}><strong>What You’ll Gain</strong></h2>
            <ul style={{ listStyleType: 'disc', paddingLeft: '1.25rem', marginTop: 0 }}>
              <li>Certificate of Appointment (unique ID) and performance-based Letter of Recommendation.</li>
              <li>Core-team ownership with executive-track mentorship.</li>
              <li>Public credit on shipped pages/events and internal systems you help build.</li>
              <li>Priority consideration for future paid roles/contract work.</li>
            </ul>

            <h2 style={h2Next}><strong>Role Logistics</strong></h2>
            <ul style={{ listStyleType: 'disc', paddingLeft: '1.25rem', marginTop: 0 }}>
              <li><strong>Duration:</strong> minimum 1 year; extensions possible based on performance</li>
              <li><strong>Time:</strong> ~3 hours/day (weekday cadence), flexible scheduling with overlap</li>
              <li><strong>Location:</strong> Remote (India-first; global participation welcome)</li>
              <li><strong>Compensation:</strong> Unpaid, but certified</li>
            </ul>

            <h2 style={h2Next}><strong>Application Requirements</strong></h2>
            <ul style={{ listStyleType: 'disc', paddingLeft: '1.25rem', marginTop: 0 }}>
              <li><strong>Curriculum Vitae:</strong> most recently updated C.V.</li>
              <li><strong>Cover Letter:</strong> briefly explain fit and motivation for this role.</li>
              <li><strong>1-page project summary:</strong> describe a cross-team project you led—your plan, meeting schedule, key metrics you tracked, main risks and how you handled them, and the final results.</li>
            </ul>

            <h2 style={h2Next}><strong>Application Deadline</strong></h2>
            <p>Applications will be reviewed immediately upon receipt. The position is open until filled with an anticipated start date of October 1, 2025.</p>

            <h2 style={h2Next}><strong>Selection Process</strong></h2>
            <p>Screening → interview → selection → 30-day trial/pilot month → confirmation.</p>

            <p style={{ marginTop: 16 }}>
              For questions, reach out to <a href="mailto:contact@therocketiq.com">contact@therocketiq.com</a>
            </p>
          </section>

          {/* Right: Apply form */}
          <section className="card-dk">
            <h2 style={h2First}><strong>Apply Now</strong></h2>

            <form onSubmit={onSubmit}>
              <input type="hidden" name="job_slug" value="business-operations-manager" />

              <div style={{ display: 'grid', gap: 12 }}>
                {/* Basics */}
                <div>
                  <div style={label}>Full name</div>
                  <input name="name" required placeholder="e.g., Jane Doe" />
                </div>

                <div>
                  <div style={label}>Age</div>
                  <input name="age" type="number" min={0} required placeholder="e.g., 24" />
                </div>

                <div>
                  <div style={label}>Email</div>
                  <input name="email" type="email" required placeholder="e.g., jane@domain.com" />
                </div>

                <div className="stack-2">
                  <div>
                    <div style={label}>Country</div>
                    <input name="country" required placeholder="e.g., India" />
                  </div>
                  <div>
                    <div style={label}>State</div>
                    <input name="state" required placeholder="e.g., Karnataka" />
                  </div>
                </div>

                <div>
                  <div style={label}>WhatsApp (with country code)</div>
                  <input name="whatsapp" required placeholder="e.g., +919876543210" />
                </div>

                {/* Qualification + Other */}
                <div>
                  <div style={label}>Qualification</div>
                  <select
                    name="qualification"
                    required
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                  >
                    <option value="" disabled>Choose one</option>
                    <option>Bachelors pursuing</option>
                    <option>Bachelors graduate</option>
                    <option>Masters pursuing</option>
                    <option>Masters graduate</option>
                    <option>PhD pursuing</option>
                    <option>PhD graduate</option>
                    <option value="Other">Other (specify below)</option>
                  </select>
                </div>

                {qualification === 'Other' && (
                  <div>
                    <div style={label}>If Other, specify</div>
                    <input name="qualification_other" placeholder="e.g., Diploma in … / Alternative credential" />
                  </div>
                )}

                <div>
                  <div style={label}>Degree name</div>
                  <input name="degree_name" required placeholder="e.g., B.Tech Mechanical" />
                </div>

                {/* How did you hear */}
                <div>
                  <div style={label}>How did you hear about this role?</div>
                  <select
                    name="heard_from"
                    required
                    value={heardFrom}
                    onChange={(e) => setHeardFrom(e.target.value)}
                  >
                    <option value="" disabled>Choose one</option>
                    <option>LinkedIn</option>
                    <option>Twitter</option>
                    <option>Facebook</option>
                    <option>Instagram</option>
                    <option>WhatsApp</option>
                    <option>RocketiQ website</option>
                    <option>Friend</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {heardFrom === 'Other' && (
                  <div>
                    <div style={label}>If Other, specify</div>
                    <input name="heard_from_other" placeholder="e.g., University newsletter" />
                  </div>
                )}

                {/* Relevant experience (optional, up to 3) */}
                <fieldset style={{ border: '1px dashed var(--panel-border)', borderRadius: 12, padding: 12 }}>
                  <legend style={{ fontSize: 13, fontWeight: 700 }}>Relevant experience (up to 3)</legend>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="stack-2" style={{ marginBottom: 10 }}>
                      <input name={`exp${i}_role`} placeholder={`Experience ${i}: Role`} />
                      <input name={`exp${i}_org`} placeholder="Organization Name" />
                      <input name={`exp${i}_dates`} placeholder="Dates (e.g., Jan 2023 – Feb 2024)" />
                      <input name={`exp${i}_summary`} placeholder="1–2 line summary" />
                    </div>
                  ))}
                </fieldset>

                {/* Motivation (required) */}
                <div>
                  <div
