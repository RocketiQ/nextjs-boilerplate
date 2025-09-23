'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useMemo } from 'react';

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

export default function CareersPage() {
  function trackClick(job_slug: string) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'careers_open_role_clicked', { job_slug });
    }
  }

  // Reusable styles
  const grid = useMemo<React.CSSProperties>(
    () => ({
      display: 'grid',
      gap: 20,
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', // 3 across on desktop, wrap on small
      alignItems: 'stretch',
    }),
    []
  );

  const cardInner: React.CSSProperties = {
    display: 'grid',
    gap: 10,
    height: '100%',
  };

  const metaStyle: React.CSSProperties = {
    color: 'var(--muted)',
    fontSize: 13,
  };

  const heroWrap: React.CSSProperties = {
    marginTop: 12,
    marginBottom: 28,
  };

  const heroEyebrow: React.CSSProperties = {
    color: 'var(--muted)',
    fontSize: 14,
    marginBottom: 10,
  };

  const heroTitle: React.CSSProperties = {
    margin: 0,
    fontWeight: 900,
    // Big but responsive (roughly like the green design)
    fontSize: 'clamp(28px, 4.6vw, 56px)',
    lineHeight: 1.18,
    letterSpacing: '-0.02em',
  };

  const heroSub: React.CSSProperties = {
    color: 'var(--muted)',
    marginTop: 12,
    fontSize: 16,
  };

  const heroBtns: React.CSSProperties = {
    display: 'flex',
    gap: 12,
    marginTop: 18,
    flexWrap: 'wrap',
  };

  const outlineBtn: React.CSSProperties = {
    display: 'inline-block',
    padding: '10px 16px',
    borderRadius: 12,
    border: '1px solid var(--accent)',
    color: 'var(--accent)',
    textDecoration: 'none',
  };

  const hotLine: React.CSSProperties = {
    marginTop: 16,
    fontSize: 14,
    color: 'var(--muted)',
  };

  const sectionH2: React.CSSProperties = {
    fontWeight: 800,
    fontSize: 18,
    marginTop: 38,
    marginBottom: 14,
  };

  return (
    <main>
      {/* Logo row */}
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
        <section style={heroWrap} aria-labelledby="careers-hero-title">
          <div style={heroEyebrow}>Hello and welcome —</div>
          <h1 id="careers-hero-title" style={heroTitle}>
            Start your career in{' '}
            <span style={{ color: 'var(--accent)' }}>Space Science &amp; Technology</span>
          </h1>

          <p style={heroSub}>India’s first research-native Space edtech startup</p>

          <div style={heroBtns}>
            {/* Keep native anchors so it scrolls to sections */}
            <a href="#internships" className="btn-primary" style={{ textDecoration: 'none' }}>
              Internships
            </a>
            <a href="#jobs" style={outlineBtn}>Jobs</a>
          </div>

          <div style={hotLine}>
            <strong style={{ color: 'var(--text)' }}>Hot vacancies:</strong>{' '}
            <Link href="/graphic-designer-intern">Graphic Designer Intern</Link>,{' '}
            <Link href="/business-operations-associate">Business Operations Associate</Link>,{' '}
            <Link href="/research-engineer-intern">Research Engineer Intern</Link>
          </div>
        </section>

        {/* INTERNSHIPS */}
        <section id="internships" aria-labelledby="internships-title">
          <h2 id="internships-title" style={sectionH2}>Internships</h2>
          <div style={grid}>
            {internships.map((r) => (
              <article key={r.slug} className="card-dk" style={cardInner}>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: 'var(--accent)' }}>
                  {r.title}
                </h3>
                {r.meta && <div style={metaStyle}>{r.meta}</div>}
                <p style={{ margin: '6px 0 12px' }}>{r.blurb}</p>
                <div style={{ marginTop: 'auto' }}>
                  <Link
                    href={r.href}
                    onClick={() => trackClick(r.slug)}
                    className="btn-primary"
                    style={{ textDecoration: 'none', display: 'inline-block' }}
                  >
                    View role &amp; apply
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* JOBS */}
        <section id="jobs" aria-labelledby="jobs-title">
          <h2 id="jobs-title" style={sectionH2}>Jobs</h2>
          <div style={grid}>
            {jobs.map((r) => (
              <article key={r.slug} className="card-dk" style={cardInner}>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: 'var(--accent)' }}>
                  {r.title}
                </h3>
                {r.meta && <div style={metaStyle}>{r.meta}</div>}
                <p style={{ margin: '6px 0 12px' }}>{r.blurb}</p>
                <div style={{ marginTop: 'auto' }}>
                  <Link
                    href={r.href}
                    onClick={() => trackClick(r.slug)}
                    className="btn-primary"
                    style={{ textDecoration: 'none', display: 'inline-block' }}
                  >
                    View role &amp; apply
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <p style={{ textAlign: 'center', color: '#9aa4b2', fontSize: 12, marginTop: 28 }}>
          © {new Date().getFullYear()} RocketiQ Next-Gen Learning. All rights reserved.
        </p>
      </div>
    </main>
  );
}
