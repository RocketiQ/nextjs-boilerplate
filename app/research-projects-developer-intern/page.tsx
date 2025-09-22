'use client';

import { useState } from 'react';
import Image from 'next/image';
import Turnstile from '../components/Turnstile';

export default function ResearchProjectsDeveloperInternApply() {
  const [pending, setPending] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [fileErr, setFileErr] = useState<string | null>(null);

  // track selects to conditionally require the "Other" text boxes
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

    // Conditional requirements: "Other" fields must be non-empty when chosen
    if (fd.get('qualification') === 'Other' && !String(fd.get('qualification_other') || '').trim()) {
      setPending(false);
      return setMsg('Please specify your qualification in the “If Other, specify” field.');
    }
    if (fd.get('heard_from') === 'Other' && !String(fd.get('heard_from_other') || '').trim()) {
      setPending(false);
      return setMsg('Please specify how you heard about this role in the “If Other, specify” field.');
    }

    // Validate only the Résumé/CV
    const resume = fd.get('resume') as File | null;
    const v1 = validatePdf(resume, 'Résumé / CV');
    if (v1) { setFileErr(v1); setPending(false); return; }

    // Submit to API
    const res = await fetch('/api/apply', { method: 'POST', body: fd });

    if (res.ok) {
      setMsg('Application submitted. Thank you!');
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'application_submitted', {
          job_slug: 'research-projects-developer-intern',
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

  // Typography helpers
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
          <h1 style={{ fontSize: 28, margin: '12px 0 0' }}>Research Projects Developer Intern</h1>
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
              Design high-quality, project-based research projects for RocketiQ workshops/courses. You’ll convert advanced topics into clear,
              4-week workshop projects with weekly milestones, code scaffolds, simple inputs/datasets (if any), and measurable learning outcomes.
              This is not a heavy Git role; basic version control is enough.
            </p>

            <h2 style={h2Next}><strong>Genres (choose one or more)</strong></h2>
            <ul style={{ listStyleType: 'disc', paddingLeft: '1.25rem', marginTop: 0 }}>
              <li>Propulsion &amp; Combustion</li>
              <li>High-Speed Flows &amp; CFD</li>
              <li>UAV/Drone Systems</li>
              <li>Guidance, Navigation &amp; Control</li>
              <li>AI/ML for Aerospace</li>
              <li>Space Systems &amp; CubeSats</li>
              <li>Space Imaging &amp; Computer Vision</li>
              <li>Structures &amp; Materials</li>
              <li>Thermal &amp; Cryogenic Systems</li>
              <li>Space Environments &amp; MMOD</li>
              <li>Human Factors &amp; Mission Ops</li>
            </ul>

            <h2 style={h2Next}><strong>Key Responsibilities</strong></h2>
            <ul style={{ listStyleType: 'disc', paddingLeft: '1.25rem', marginTop: 0 }}>
              <li>Draft project specs with objectives, prerequisites, weekly milestones, and success criteria.</li>
              <li>Build code scaffolds (Python preferred) and simple inputs/datasets.</li>
              <li>Write step-by-step instructions, rubrics, and a short instructor guide.</li>
              <li>Produce reference outputs (plots/tables) and a concise PDF handout (LaTeX or Google Docs).</li>
              <li>Add light Git usage: repo structure, README quickstart, and basic commit history.</li>
              <li>Align projects with RocketiQ tone: reproducible, practical, and portfolio-ready.</li>
            </ul>

            <h2 style={h2Next}><strong>Requirements</strong></h2>
            <ul style={{ listStyleType: 'disc', paddingLeft: '1.25rem', marginTop: 0 }}>
              <li>3rd-year (or higher) bachelor’s student, OR master’s student (pursuing/graduate).</li>
              <li>Strong fundamentals in one chosen genre; ability to explain clearly.</li>
              <li>Proficiency in Python (NumPy/SciPy/Matplotlib); MATLAB is a plus.</li>
              <li>Comfort with LaTeX or clean documentation writing; basic Git (clone/branch/commit/push).</li>
              <li>Nice to have: Cantera/OpenFOAM/ROS2, PyTorch/TF basics, control theory, remote sensing tools.</li>
            </ul>

            <h2 style={h2Next}><strong>What You’ll Gain</strong></h2>
            <ul style={{ listStyleType: 'disc', paddingLeft: '1.25rem', marginTop: 0 }}>
              <li>A certificate of internship from RocketiQ upon successful completion.</li>
              <li>A Letter of Recommendation (LOR) based on performance.</li>
              <li>Opportunity to fast-track into the RocketiQ Research Fellowship for free (subject to performance and qualifications).</li>
              <li>Credit on shipped workshop projects and public portfolio artifacts.</li>
              <li>Mentorship + structured feedback; priority for future paid roles/contract work.</li>
            </ul>

            <h2 style={h2Next}><strong>Role Logistics</strong></h2>
            <ul style={{ listStyleType: 'disc', paddingLeft: '1.25rem', marginTop: 0 }}>
              <li><strong>Duration:</strong> 6 months, extensions possible</li>
              <li><strong>Time:</strong> ~2 hours/day (~10 hrs/week), flexible</li>
              <li><strong>Location:</strong> Remote (India-first, global participation welcome)</li>
              <li><strong>Compensation:</strong> This is an unpaid internship, but certified.</li>
            </ul>

            <h2 style={h2Next}><strong>Application Deadline</strong></h2>
            <p>Applications will be reviewed immediately upon receipt. The position is open until filled with an anticipated start date of October 1, 2025.</p>

            <p style={{ marginTop: 16 }}>
              For any questions or clarifications, feel free to reach out to us at{' '}
              <a href="mailto:contact@therocketiq.com">contact@therocketiq.com</a>
            </p>
          </section>

          {/* Right: Apply form (same structure as designer page: one experience row + résumé only) */}
          <section className="card-dk">
            <h2 style={h2First}><strong>Apply Now</strong></h2>

            <form onSubmit={onSubmit}>
              <input type="hidden" name="job_slug" value="research-projects-developer-intern" />

              <div style={{ display: 'grid', gap: 12 }}>
                {/* Basics */}
                <div>
                  <div style={label}>Full name</div>
                  <input name="name" required placeholder="e.g., Jane Doe" />
                </div>

                <div>
                  <div style={label}>Age</div>
                  <input name="age" type="number" min={0} required placeholder="e.g., 22" />
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

                {/* Relevant experience — ONLY one row */}
                <fieldset style={{ border: '1px dashed var(--panel-border)', borderRadius: 12, padding: 12 }}>
                  <legend style={{ fontSize: 13, fontWeight: 700 }}>Relevant experience</legend>
                  <div className="stack-2" style={{ marginBottom: 10 }}>
                    <input name="exp1_role" placeholder="Experience 1: Role" />
                    <input name="exp1_org" placeholder="Organization Name" />
                    <input name="exp1_dates" placeholder="Dates (e.g., Jan 2022 – Feb 2023)" />
                    <input name="exp1_summary" placeholder="1–2 line summary" />
                  </div>
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

                {/* Files — ONLY Résumé/CV */}
                <div>
                  <div style={label}>Résumé / CV (PDF, under 2 MB)</div>
                  <input type="file" name="resume" accept="application/pdf" required />
                </div>

                {fileErr && (
                  <div style={{ color: '#ff9898', fontSize: 12, marginTop: 6 }}>{fileErr}</div>
                )}

                {/* Consent */}
                <label className="consent">
                  <input type="checkbox" name="consent" required />{' '}
                  I consent to RocketiQ processing my data for recruiting.
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
          © 2025–2027 RocketiQ Next-Gen Learning. All rights reserved.
        </p>
      </div>
    </main>
  );
}
