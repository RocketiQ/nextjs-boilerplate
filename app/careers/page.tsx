'use client';

import Link from 'next/link';
import Image from 'next/image';

type Role = {
  title: string;
  slug: string;          // used for GA tracking and URL
  href: string;          // link to the form page you already have
  blurb: string;         // one-liner summary
  meta?: string;         // small meta line (e.g., "Remote • Unpaid")
};

const roles: Role[] = [
  {
    title: 'Business Operations Associate',
    slug: 'business-operations-associate',
    href: '/business-operations-associate',
    blurb: 'Help run cadence, trackers, hiring support, docs & follow-ups across Ops.',
    meta: 'Remote • ~2–3 hrs/day • Unpaid (certified)',
  },
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
];

export default function CareersIndex() {
  // simple, safe GA click tracking
  function trackClick(job_slug: string) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'careers_open_role_clicked', { job_slug });
    }
  }

  const grid: React.CSSProperties = {
    display: 'grid',
    gap: 16,
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    alignItems: 'stretch',
  };

  const cardInner: React.CSSProperties = {
    display: 'grid',
    gap: 8,
    height: '100%',
    position: 'relative',
    zIndex: 1, // keep content above the glow layer
  };

  const metaStyle: React.CSSProperties = {
    color: 'var(--muted)',
    fontSize: 13,
  };

  return (
    <main>
      {/* Centered logo row */}
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
        {/* Header */}
        <div style={{ marginBottom: 16 }}>
          <small className="pill">RocketiQ — Careers</small>
          <h1 style={{ fontSize: 28, margin: '12px 0 0' }}>Open Roles</h1>
          <p style={{ color: 'var(--muted)', marginTop: 8 }}>
            Explore current opportunities at RocketiQ. Click a role to view details and apply.
          </p>
        </div>

        {/* Cards grid */}
        <section style={grid}>
          {roles.map((r) => (
            <article key={r.slug} className="card-dk careers-card" style={cardInner as any}>
              <h2 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 800, color: 'var(--accent)' }}>
                {r.title}
              </h2>
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
        </section>

        <p style={{ textAlign: 'center', color: '#9aa4b2', fontSize: 12, marginTop: 20 }}>
          © {new Date().getFullYear()} RocketiQ Next-Gen Learning. All rights reserved.
        </p>
      </div>

      {/* Local styling: subtle card glow, CTA glow, and lift-on-hover */}
      <style jsx global>{`
        /* Card lift + glow */
        .careers-card {
          position: relative;
          overflow: visible; /* allow glow to bleed */
          transition: transform 200ms ease, box-shadow 200ms ease, filter 200ms ease;
          will-change: transform;
        }
        .careers-card::before {
          content: '';
          position: absolute;
          inset: -8px; /* extend glow beyond edges */
          border-radius: 16px;
          background: radial-gradient(
            60% 50% at 50% 10%,
            rgba(245, 181, 36, 0.18),
            rgba(245, 181, 36, 0.06) 40%,
            transparent 70%
          );
          filter: blur(14px);
          opacity: 0;
          transition: opacity 200ms ease, filter 200ms ease, transform 200ms ease;
          z-index: 0;
          pointer-events: none;
        }
        .careers-card:hover,
        .careers-card:focus-within {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 12px 28px rgba(245, 181, 36, 0.10);
          filter: saturate(1.05);
        }
        .careers-card:hover::before,
        .careers-card:focus-within::before {
          opacity: 1;
          filter: blur(18px);
          transform: scale(1.01);
        }

        /* CTA glow */
        .btn-primary.btn-glow {
          position: relative;
          box-shadow:
            0 0 0 1px rgba(245, 181, 36, 0.55) inset,
            0 6px 16px rgba(245, 181, 36, 0.14),
            0 0 14px rgba(245, 181, 36, 0.10);
          transition: transform 160ms ease, box-shadow 160ms ease, filter 160ms ease;
          will-change: transform, box-shadow;
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

        /* Respect reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .careers-card,
          .careers-card::before,
          .btn-primary.btn-glow {
            transition: none !important;
          }
        }
      `}</style>
    </main>
  );
}
