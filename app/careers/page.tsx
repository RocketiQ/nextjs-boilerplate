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

/* --- Group 1: Internships --- */
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
  meta: 'Remote • ~10 hrs/week • Unpaid (certified)',
}
];

/* --- Group 2: Part-Time Roles --- */
const partTimeRoles: Role[] = [
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

  const grid: React.CSSProperties = {
    display: 'grid',
    gap: 16,
    // Columns won’t stretch beyond 460px; grid centers them on wide screens
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 460px))',
    justifyContent: 'center',
    alignItems: 'stretch',
  };

  const cardInner: React.CSSProperties = {
    display: 'grid',
    gap: 8,
    height: '100%',
  };

  const metaStyle: React.CSSProperties = {
    color: 'var(--muted)',
    fontSize: 13,
  };

  const Section = ({ title, roles }: { title: string; roles: Role[] }) => (
    <section style={{ marginTop: 24 }}>
      <h2 style={{ fontSize: 22, margin: '0 0 10px', color: 'var(--accent)' }}>{title}</h2>
      <div style={grid}>
        {roles.map((r) => (
          <article key={r.slug} className="card-dk careers-card" style={cardInner}>
            <h3 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 800, color: 'var(--accent)' }}>
              {r.title}
            </h3>
            {r.meta && <div style={metaStyle}>{r.meta}</div>}
            <p style={{ margin: '8px 0 12px' }}>{r.blurb}</p>
            <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
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
  );

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
        {/* Page header */}
        <div style={{ marginBottom: 16 }}>
          <small className="pill">RocketiQ — Careers</small>
          <h1 style={{ fontSize: 28, margin: '12px 0 0' }}>Open Roles</h1>
          <p style={{ color: 'var(--muted)', marginTop: 8 }}>
            Explore current opportunities at RocketiQ. Click a role to view details and apply.
          </p>
        </div>

        {/* Sections */}
        <Section title="Internships" roles={internships} />
        <Section title="Part-Time Roles" roles={partTimeRoles} />

        <p style={{ textAlign: 'center', color: '#9aa4b2', fontSize: 12, marginTop: 20 }}>
          © {new Date().getFullYear()} RocketiQ Next-Gen Learning. All rights reserved.
        </p>
      </div>

      {/* Hover lift (no center glow) + button glow */}
      <style jsx global>{`
        .careers-card {
          position: relative;
          transition: transform 180ms ease, box-shadow 180ms ease, filter 180ms ease;
          will-change: transform;
        }
        .careers-card:hover,
        .careers-card:focus-within {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(245, 181, 36, 0.16);
          filter: saturate(1.03);
        }

        .btn-primary.btn-glow {
          position: relative;
          box-shadow:
            0 0 0 1px rgba(245, 181, 36, 0.55) inset,
            0 6px 16px rgba(245, 181, 36, 0.14),
            0 0 14px rgba(245, 181, 36, 0.10);
          transition: transform 160ms ease, box-shadow 160ms ease, filter 160ms ease;
        }
        .btn-primary.btn-glow:hover,
        .btn-primary.btn-glow:focus-visible {
          transform: translateY(-1px);
          box-shadow:
            0 0 0 1px rgba(245, 181, 36, 0.85) inset,
            0 10px 24px rgba(245, 181, 36, 0.20),
            0 0 22px rgba(245, 181, 36, 0.18);
          text-decoration: none;
        }

        @media (prefers-reduced-motion: reduce) {
          .careers-card,
          .btn-primary.btn-glow {
            transition: none !important;
          }
        }
      `}</style>
    </main>
  );
}
