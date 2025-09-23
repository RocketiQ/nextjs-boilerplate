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
    blurb:
      'Help run cadence, trackers, hiring support, docs & follow-ups across Ops.',
    meta: 'Remote • ~2–3 hrs/day • Unpaid (certified)',
  },
];

export default function CareersPage() {
  function trackClick(job_slug: string) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'careers_open_role_clicked', { job_slug });
    }
  }

  const grid = useMemo<React.CSSProperties>(
    () => ({
      display: 'grid',
      gap: 20,
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      alignItems: 'stretch',
    }),
    []
  );

  const cardInner: React.CSSProperties = {
    display: 'grid',
    gap: 12,
    height: '100%',
  };

  const metaStyle: React.CSSProperties = {
    color: 'var(--muted)',
    fontSize: 15,
  };

  const heroWrap: React.CSSProperties = {
    marginTop: 8,
    marginBottom: 28,
  };

  const heroTitle: React.CSSProperties = {
    margin: 0,
    fontWeight: 900,
    fontSize: 'clamp(30px, 5vw, 60px)',
    lineHeight: 1.16,
    letterSpacing: '-0.02em',
  };

  const heroSub: React.CSSProperties = {
    color: 'var(--muted)',
    marginTop: 14,
    fontSize: 18,
  };

  const heroBtns: React.CSSProperties = {
    display: 'flex',
    gap: 12,
    marginTop: 20, // mobile/default
    flexWrap: 'wrap',
  };

  const hotLine: React.CSSProperties = {
    marginTop: 18, // mobile/default
    fontSize: 16,
    color: 'var(--muted)',
  };

  const sectionH2: React.CSSProperties = {
    fontWeight: 900,
    fontSize: 'clamp(22px, 2.2vw, 32px)',
    marginTop: 44,
    marginBottom: 16,
    letterSpacing: '-0.01em',
  };

  return (
    <main className="careers-page">
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
          <h1 id="careers-hero-title" style={heroTitle}>
            Start your career in{' '}
            <span style={{ color: 'var(--accent)' }}>
              Space Science &amp; Technology
            </span>
          </h1>

          <p className="hero-sub" style={heroSub}>
            India’s first research-native Space edtech startup
          </p>

          <div className="hero-btns" style={heroBtns}>
            <a
              href="#internships"
              className="btn-primary btn-size btn-glow"
              style={{ textDecoration: 'none' }}
            >
              Internships
            </a>
            <a
              href="#jobs"
              className="btn-ghost btn-size btn-glow"
              style={{ textDecoration: 'none' }}
            >
              Jobs
            </a>
          </div>

          <div className="hot-line" style={hotLine}>
            <strong style={{ color: 'var(--text)' }}>Hot vacancies:</strong>{' '}
            <Link href="/graphic-designer-intern">Graphic Designer Intern</Link>,{' '}
            <Link href="/business-operations-associate">
              Business Operations Associate
            </Link>
            , <Link href="/research-engineer-intern">Research Engineer Intern</Link>
          </div>
        </section>

        {/* INTERNSHIPS */}
        <section id="internships" aria-labelledby="internships-title">
          <h2 id="internships-title" style={sectionH2}>
            Internships
          </h2>
          <div className="grid-3" style={grid}>
            {internships.map((r) => (
              <article
                key={r.slug}
                className="card-dk lift-card"
                style={cardInner}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: 20,
                    fontWeight: 800,
                    color: 'var(--accent)',
                  }}
                >
                  {r.title}
                </h3>
                {r.meta && <div style={metaStyle}>{r.meta}</div>}
                <p style={{ margin: '6px 0 12px', fontSize: 16 }}>
                  {r.blurb}
                </p>
                <div style={{ marginTop: 'auto' }}>
                  <Link
                    href={r.href}
                    onClick={() => trackClick(r.slug)}
                    className="btn-primary btn-glow"
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
          <h2 id="jobs-title" style={sectionH2}>
            Jobs
          </h2>
          <div className="grid-3" style={grid}>
            {jobs.map((r) => (
              <article
                key={r.slug}
                className="card-dk lift-card"
                style={cardInner}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: 20,
                    fontWeight: 800,
                    color: 'var(--accent)',
                  }}
                >
                  {r.title}
                </h3>
                {r.meta && <div style={metaStyle}>{r.meta}</div>}
                <p style={{ margin: '6px 0 12px', fontSize: 16 }}>
                  {r.blurb}
                </p>
                <div style={{ marginTop: 'auto' }}>
                  <Link
                    href={r.href}
                    onClick={() => trackClick(r.slug)}
                    className="btn-primary btn-glow"
                    style={{ textDecoration: 'none', display: 'inline-block' }}
                  >
                    View role &amp; apply
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <p
          style={{
            textAlign: 'center',
            color: '#9aa4b2',
            fontSize: 12,
            marginTop: 30,
          }}
        >
          © {new Date().getFullYear()} RocketiQ Next-Gen Learning. All rights
          reserved.
        </p>
      </div>

      {/* Page-scoped enhancements */}
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }

        /* --- Desktop-only spacing tweaks --- */
        @media (min-width: 1024px) {
          /* logo sits a bit lower from the top, and large gap below it */
          .careers-page .logo-bar {
            margin-top: 18px;
            margin-bottom: 120px; /* massive space to hero */
          }
          /* ~4 lines of space (≈ 96px) between subheading and buttons */
          .careers-page .hero-btns {
            margin-top: 96px !important;
          }
          /* same 4-line space from buttons to Hot vacancies */
          .careers-page .hot-line {
            margin-top: 96px !important;
          }
        }

        .careers-page .btn-size {
          width: 160px;
          text-align: center;
          padding: 12px 16px;
          border-radius: 12px;
          font-weight: 700;
        }
        .careers-page .btn-ghost {
          border: 1px solid var(--accent);
          color: var(--accent);
          background: transparent;
        }
        .careers-page .btn-glow {
          transition: transform 0.2s ease, box-shadow 0.25s ease, filter 0.2s ease;
          will-change: transform, box-shadow, filter;
        }
        .careers-page .btn-glow:hover {
          transform: translateY(-1px);
          box-shadow:
            0 0 0 2px rgba(255, 200, 60, 0.35) inset,
            0 0 24px rgba(255, 200, 60, 0.35);
          filter: saturate(1.05);
        }
        .careers-page .lift-card {
          position: relative;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          will-change: transform, box-shadow;
        }
        .careers-page .lift-card:hover {
          transform: translateY(-6px) scale(1.015);
          box-shadow:
            0 0 0 1px rgba(255, 200, 60, 0.35) inset,
            0 16px 36px rgba(0, 0, 0, 0.35),
            0 0 40px rgba(255, 200, 60, 0.12);
        }
        @media (min-width: 1024px) {
          .careers-page .grid-3 {
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
          }
        }
      `}</style>
    </main>
  );
}
