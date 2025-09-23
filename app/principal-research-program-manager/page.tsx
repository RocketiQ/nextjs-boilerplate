'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Turnstile from '../components/Turnstile';

export default function PrincipalResearchProgramManagerApply() {
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

    // Required PDFs for this role: Résumé/CV + 1-page project summary
    const resume = fd.get('resume') as File | null;
    const project = fd.get('project_summary') as File | null;

    const v1 = validatePdf(resume, 'Résumé / CV');
    if (v1) { setFileErr(v1); setPending(false); return; }
    const v3 = validatePdf(project, '1-Page Project Summary');
    if (v3) { setFileErr(v3); setPending(false); return; }

    // Submit to API
    const res = await fetch('/api/apply', { method: 'POST', body: fd });

    if (res.ok) {
      setMsg('Application submitted. Thank you!');
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'application_submitted', {
          job_slug: 'principal-research-program-manager',
        });
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
          <h1 style={{ fontSize: 28, margin: '12px 0 0' }}>Principal Research Program Manager</h1>
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
              Own the end-to-end technical content engine. Lead and manage the Research &amp; Content team (project developers,
              research engineers, fellowship mentors), set the technical roadmap, hire and onboard contributors, author/oversee
              high-end research projects and solvers, enforce reproducibility/CI standards, and ensure smooth delivery of
              workshops and research fellowships.
            </p>

            <h2 style={h2Next}><strong>Genres</strong></h2>
            <ul style={{ listStyleType: 'disc', paddingLeft: '1.25rem', marginTop: 0 }}>
              <li>Propulsion &amp; Combustion</li>
              <li>High-Speed Flows &amp; CFD</li>
              <li>UAV/Drone Systems</li>
              <li>Structures &amp; Materials</li>
              <li>Thermal &amp; Cryogenic Systems</li>
              <li>Space Environments &amp; MMOD</li>
              <li>Human Factors &amp; Mission Ops</li>
            </ul>

            <h2 style={h2Next}><strong>Key Responsibilities</strong></h2>
            <ul style={{ listStyleType: 'disc', paddingLeft: '1.25rem', marginTop: 0 }}>
              <li><strong>Team leadership:</strong> Run the content roadmap; scope projects; assign owners; review designs/PRs; mentor contributors and fellows.</li>
              <li><strong>Hiring &amp; onboarding:</strong> Draft role briefs, create job posts, interview candidates, run technical screens, design 30-day onboarding plans.</li>
              <li><strong>Project creation:</strong> Write/approve specs, METHODS/RESULTS docs, and rubrics; create reference solvers/prototypes where needed (Python; C++ welcome).</li>
              <li><strong>Git &amp; quality:</strong> Enforce repo hygiene (src/, scripts/, cases/, tests/, docs/, env/), licensing and CITATION, CI (GitHub Actions), smoke/metric tests, and reference outputs.</li>
              <li><strong>Delivery:</strong> Prepare workshop/fellowship materials (LaTeX/PDF packs, code skeletons, datasets), coordinate live sessions, and serve as a mentor for one or more fellowship teams.</li>
              <li><strong>Reviews &amp; releases:</strong> Run design and code reviews; validate against equations and benchmarks; publish tagged releases and brief release notes.</li>
              <li><strong>Reporting:</strong> Weekly content dashboard (pipeline, risks, CI health, velocity); monthly summary with corrective actions.</li>
              <li><strong>Standards &amp; templates:</strong> Maintain project templates (README, METHODS, RESULTS, contribution guide), grading rubrics, and evaluation metrics.</li>
            </ul>

            <h2 style={h2Next}><strong>Qualifications</strong></h2>
            <ul style={{ listStyleType: 'disc', paddingLeft: '1.25rem', marginTop: 0 }}>
              <li><strong>Education:</strong> Master’s (pursuing/graduate) OR PhD (pursuing/graduate).</li>
              <li><strong>Expertise:</strong> Deep applied knowledge in High-Speed Propulsion, Thermal/Fluids for Space, Shock Physics, AI/ML for Simulation and Test, Aerostructures, UAV/Drone Systems (strong in at least two; working fluency in the rest).</li>
              <li><strong>Experience:</strong> Proven leadership and people management in research/engineering programs (team oversight, hiring, code reviews, delivery to deadlines).</li>
              <li><strong>Communication:</strong> Excellent written and verbal English; clear updates and professional stakeholder handling.</li>
              <li><strong>Availability:</strong> ~3 hours/day with overlap to India and U.S. time zones; responsive on priority items.</li>
            </ul>

            <h2 style={h2Next}><strong>What You’ll Gain</strong></h2>
            <ul style={{ listStyleType: 'disc', paddingLeft: '1.25rem', marginTop: 0 }}>
              <li>Core-team scope with a clear path to Head of Research / CTO-track based on performance.</li>
              <li>Maintainer credit on flagship projects (open-source or proprietary).</li>
              <li>Certificate of Appointment (unique ID) and performance-based Letter of Recommendation.</li>
              <li>Priority consideration for future paid roles/contract work.</li>
            </ul>

            <h2 style={h2Next}><strong>Role Logistics</strong></h2>
            <ul style={{ listStyleType: 'disc', paddingLeft: '1.25rem', marginTop: 0 }}>
              <li><strong>Duration:</strong> minimum 1 year; extensions possible based on performance</li>
              <li><strong>Time:</strong> ~3 hours/day, flexible scheduling</li>
              <li><strong>Location:</strong> Remote (India-first; global participation welcome)</li>
              <li><strong>Compensation:</strong> Unpaid, but certified</li>
            </ul>

            <h2 style={h2Next}><strong>Application Requirements</strong></h2>
            <ul style={{ listStyleType: 'disc', paddingLeft: '1.25rem', marginTop: 0 }}>
              <li><strong>Curriculum Vitae:</strong> most recently updated C.V.</li>
              <li><strong>1-page project summary:</strong> pick one domain (from the listed six) and outline a research project you would lead at RocketiQ—problem statement, governing equations/methods, solver plan (modules/tests/CI), validation dataset/benchmarks, milestones &amp; metrics, and expected artifacts (docs/plots/releases).</li>
            </ul>

            <h2 style={h2Next}><strong>Application Deadline</strong></h2>
            <p>Applications will be reviewed immediately upon receipt. The position is open until filled with an anticipated start date of October 1, 2025.</p>

            <h2 style={h2Next}><strong>Selection Process</strong></h2>
            <p>Screening → interview (technical + management) → mock fellowship mentorship session (30–40 min) → 30-day pilot month → confirmation.</p>

            <p style={{ marginTop: 16 }}>
              For questions, reach out to <a href="mailto:contact@therocketiq.com">contact@therocketiq.com</a>
            </p>
          </section>

          {/* Right: Apply form */}
          <section className="card-dk">
            <h2 style={h2First}><strong>Apply Now</strong></h2>

            <form onSubmit={onSubmit}>
              <input type="hidden" name="job_slug" value="principal-research-program-manager" />

              <div style={{ display: 'grid', gap: 12 }}>
                {/* Basics */}
                <div>
                  <div style={label}>Full name</div>
                  <input name="name" required placeholder="e.g., Jane Doe" />
                </div>

                <div>
                  <div style={label}>Age</div>
                  <input name="age" type="number" min={0} required placeholder="e.g., 26" />
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
                  <input name="degree_name" required placeholder="e.g., M.Tech Aerospace" />
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
                  <div style={label}>Why do you want to join RocketiQ for this role?</div>
                  <textarea
                    name="q1"
                    rows={5}
                    required
                    placeholder="In 4–6 sentences, share your motivation, the strengths you’ll bring, and what you’d aim to deliver in your first 60 days."
                    style={{ resize: 'vertical' }}
                  />
                </div>

                {/* Files (required: CV + 1-page project summary) */}
                <div>
                  <div style={label}>Résumé / CV (PDF, under 2 MB)</div>
                  <input type="file" name="resume" accept="application/pdf" required />
                </div>

                <div>
                  <div style={label}>1-Page Project Summary (PDF, under 2 MB)</div>
                  <input type="file" name="project_summary" accept="application/pdf" required />
                </div>

                {fileErr && (
                  <div style={{ color: '#ff9898', fontSize: 12, marginTop: 6 }}>{fileErr}</div>
                )}

                {/* Consent */}
                <label className="consent">
                  <input type="checkbox" name="consent" required /> I consent to RocketiQ processing my data for recruiting.
                </label>

                {/* Turnstile inside the form */}
                <Turnstile theme="light" />

                <button
                  type="submit"
                  className={`btn-primary ${pending ? 'btn-disabled' : ''}`}
                  disabled={pending}
                >
                  {pending ? 'Submitting…' : 'Submit Application'}
                </button>

                {msg && (
                  <div style={{ fontSize: 14, color: msg.startsWith('Failed') ? '#ff9898' : '#7de5b3' }}>
                    {msg}
                  </div>
                )}
              </div>
            </form>
          </section>
        </div>

        <p style={{ textAlign: 'center', color: '#9aa4b2', fontSize: 12, marginTop: 20 }}>
          © {new Date().getFullYear()} RocketiQ Next-Gen Learning. All rights reserved.
        </p>
      </div>
    </main>
  );
}
