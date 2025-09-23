'use client';

import Link from 'next/link';
import Image from 'next/image';

type Role = {
  title: string;
  slug: string;
  href: string;
  blurb: string;
  meta?: string;
};

const internships: Role[] = [
  {
    title: 'Graphic Designer Intern',
    slug: 'graphic-designer-intern',
    href: '/graphic-designer-intern',
    blurb: 'Design educational visuals for rockets, space, and astrophysics.',
    meta: 'Remote • ~10 hrs/week • Unpaid (certified)',
  },
  {
    title: 'Research Projects Developer Intern',
    slug: 'research-projects-developer-intern',
    href: '/research-projects-developer-intern',
    blurb: 'Build 4-week, code-backed workshop projects with milestones & rubrics.',
    meta: 'Remote • ~10 hrs/week • Unpaid (certified)',
  },
  {
    title: 'Research Engineer Intern',
    slug: 'research-engineer-intern',
    href: '/research-engineer-intern',
    blurb: 'Own and ship a research-grade repo with CI, docs, and tests.',
    meta: 'Remote • ~10 hrs/week • Unpaid (certified)',
  },
];

const jobs: Role[] = [
  {
    title: 'Business Operations Associate',
    slug: 'business-operations-associate',
    href: '/business-operations-associate',
    blurb: 'Help run cadence, trackers, hiring support, docs & follow-ups across Ops.',
    meta: 'Remote • ~2–3 hrs/day • Unpaid (certified)',
  },
];

export default function CareersIndex() {
  function trackClick(job_slug: string) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'careers_open_role_clicked', { job_slug });
    }
  }

  return (
    <main>
      {/* Logo */}
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
        {/* HERO */}
        <section className="hero">
          <p className="eyebrow">Hello and welcome —</p>
          <h1 className="hero-title">
            Start your career in <span className="hero-accent">Space Science &amp; Technology</span>
          </h1>
          <p className="hero-sub">India’s first research-native Space edtech startup</p>

          <div className="hero-cta">
            <a href="#internships" className="btn-primary hero-btn">Internships</a>
            <a href="#jobs" className="btn-outline">Jobs</a>
          </div>

          <p className="hot">
            <span className="hot-label">Hot vacancies:</span>{' '}
            <Link href="/graphic-designer-intern" className="hot-link">Graphic Designer Intern</Link>,{' '}
            <Link href="/business-operations-associate" className="hot-link">Business Operations Associate</Link>,{' '}
            <Link href="/research-engineer-intern" className="hot-link">Research Engineer Intern</Link>
          </p>
        </section>

        {/* INTERNSHIPS */}
        <section id="internships" className="section-block">
          <h2 className="section-title">Internships</h2>
          <div className="roles-grid">
            {internships.map((r) => (
              <article key={r.slug} className="card-dk role-card">
                <h3 className="role-title">{r.title}</h3>
                {r.meta && <div className="meta">{r.meta}</div>}
                <p className="blurb">{r.blurb}</p>
                <div className="actions">
                  <Link
                    href={r.href}
                    onClick={() => trackClick(r.slug)}
                    className="btn-primary"
                  >
                    View role &amp; apply
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* JOBS */}
        <section id="jobs" className="section-block">
          <h2 className="section-title">Jobs</h2>
          <div className="roles-grid">
            {jobs.map((r) => (
              <article key={r.slug} className="card-dk role-card">
                <h3 className="role-title">{r.title}</h3>
                {r.meta && <div className="meta">{r.meta}</div>}
                <p className="blurb">{r.blurb}</p>
                <div className="actions">
                  <Link
                    href={r.href}
                    onClick={() => trackClick(r.slug)}
                    className="btn-primary"
                  >
                    View role &amp; apply
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <p className="footer-note">
          © {new Date().getFullYear()} RocketiQ Next-Gen Learning. All rights reserved.
        </p>
      </div>

      {/* Page styles (scoped) */}
      <style jsx>{`
        :global(html) {
          scroll-behavior: smooth;
        }

        .hero {
          text-align: left;
          margin-bottom: 36px;
        }
        .eyebrow {
          color: var(--muted);
          margin: 0 0 6px;
          letter-spacing: 0.02em;
        }
        .hero-title {
          margin: 0;
          font-weight: 900;
          line-height: 1.1;
          font-size: clamp(28px, 4vw, 44px);
        }
        .hero-accent {
          color: var(--accent);
        }
        .hero-sub {
          margin: 8px 0 14px;
          color: var(--muted);
          font-size: 15px;
        }
        .hero-cta {
          display: flex;
          gap: 10px;
          margin: 14px 0 10px;
          flex-wrap: wrap;
        }
        .hero-btn {
          text-decoration: none;
        }
        .btn-outline {
          display: inline-block;
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid var(--accent);
          color: var(--accent);
          text-decoration: none;
          font-weight: 700;
          transition: transform .15s ease, background-color .15s ease, color .15s ease;
        }
        .btn-outline:hover {
          transform: translateY(-1px);
          background: rgba(255, 204, 0, 0.08);
          color: var(--accent);
        }

        .hot {
          margin-top: 8px;
          color: var(--muted);
          font-size: 14px;
        }
        .hot-label {
          font-weight: 700;
          color: var(--muted);
        }
        .hot-link {
          color: var(--accent);
          text-decoration: none;
          border-bottom: 1px dotted transparent;
        }
        .hot-link:hover {
          border-bottom-color: var(--accent);
        }

        .section-block {
          margin: 28px 0 12px;
        }
        .section-title {
          margin: 0 0 12px;
          font-size: 22px;
          font-weight: 800;
          text-align: left;
        }

        .roles-grid {
          display: grid;
          gap: 16px;
          grid-template-columns: 1fr;
        }
        @media (min-width: 1024px) {
          .roles-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        .role-card {
          display: grid;
          gap: 8px;
          height: 100%;
          padding: 16px;
        }
        .role-title {
          margin: 0 0 4px;
          font-size: 18px;
          font-weight: 800;
          color: var(--accent);
        }
        .meta {
          color: var(--muted);
          font-size: 13px;
        }
        .blurb {
          margin: 8px 0 12px;
        }
        .actions {
          margin-top: auto;
          display: flex;
          gap: 8px;
        }

        .footer-note {
          text-align: center;
          color: #9aa4b2;
          font-size: 12px;
          margin-top: 24px;
        }
      `}</style>
    </main>
  );
}
