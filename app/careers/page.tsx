'use client';

import Link from 'next/link';
import Image from 'next/image';

type Role = {
  slug: string;
  title: string;
  blurb: string;
  meta: string; // quick status line
};

const ROLES: Role[] = [
  {
    slug: '/business-operations-associate',
    title: 'Business Operations Associate',
    blurb:
      'Founder-facing support across Creative, Web, Hiring/HR Ops, Events, and Internal Systems. Keep the weekly rhythm, move follow-ups to done.',
    meta: 'Remote • ~2–3 hrs/day',
  },
  {
    slug: '/graphic-designer-intern',
    title: 'Graphic Designer Intern',
    blurb:
      'Design infographics, carousels, and visuals for space topics. Turn complex ideas into clear, engaging content for outreach.',
    meta: 'Remote • ~10 hrs/week • Internship',
  },
  {
    slug: '/research-projects-developer-intern',
    title: 'Research Projects Developer Intern',
    blurb:
      'Design 4-week, code-backed workshop projects (Python preferred). Clear milestones, scaffolds, and measurable outcomes.',
    meta: 'Remote • ~10 hrs/week • 6 months',
  },
];

export default function CareersHome() {
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
        <div style={{ marginBottom: 16, textAlign: 'center' }}>
          <small className="pill">RocketiQ — Careers</small>
          <h1 style={{ fontSize: 28, margin: '12px 0 0' }}>Open Roles</h1>
          <p style={{ color: 'var(--muted)', marginTop: 8 }}>
            Explore current opportunities. Click a card to view details and apply.
          </p>
        </div>

        <div className="roles-grid">
          {ROLES.map((r) => (
            <article key={r.slug} className="card-thruster">
              <div className="card-body">
                <div className="card-meta">{r.meta}</div>
                <h2 className="card-title">{r.title}</h2>
                <p className="card-blurb">{r.blurb}</p>

                <Link href={r.slug} className="thrust-cta" aria-label={`Open ${r.title}`}>
                  IGNITE
                </Link>
              </div>
            </article>
          ))}
        </div>

        <p style={{ textAlign: 'center', color: '#9aa4b2', fontSize: 12, marginTop: 24 }}>
          © 2025–2027 RocketiQ Next-Gen Learning. All rights reserved.
        </p>
      </div>

      {/* Thruster styling (scoped) */}
      <style jsx global>{`
        /* grid for role cards */
        .roles-grid {
          display: grid;
          gap: 20px;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          align-items: stretch;
        }

        /* THRUSTER CARD: gradient border + plume glow */
        .card-thruster {
          position: relative;
          border-radius: 16px;
          padding: 1px; /* gradient border thickness */
          background: linear-gradient(
            135deg,
            rgba(245, 181, 36, 0.9),
            rgba(245, 181, 36, 0.25)
          );
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .card-thruster .card-body {
          background: var(--panel);
          border: 1px solid var(--panel-border);
          border-radius: 15px;
          padding: 16px;
          min-height: 220px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        /* Thruster plume (bottom glow) */
        .card-thruster::after {
          content: '';
          position: absolute;
          left: 50%;
          bottom: -14px;
          transform: translateX(-50%);
          width: 140px;
          height: 28px;
          background: radial-gradient(
            50% 70% at 50% 0%,
            rgba(245, 181, 36, 0.55) 0%,
            rgba(245, 181, 36, 0.0) 70%
          );
          filter: blur(8px);
          opacity: 0.45;
          pointer-events: none;
          transition: opacity 0.25s ease, transform 0.25s ease;
        }

        .card-thruster:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(245, 181, 36, 0.08);
        }
        .card-thruster:hover::after {
          opacity: 0.75;
          transform: translateX(-50%) scale(1.05);
        }

        .card-title {
          margin: 0;
          font-size: 18px;
          font-weight: 800;
          color: var(--text);
        }
        .card-meta {
          font-size: 12px;
          letter-spacing: 0.3px;
          color: var(--muted);
          opacity: 0.95;
        }
        .card-blurb {
          color: #cbd4e6;
          margin: 2px 0 8px;
          line-height: 1.55;
        }

        /* CTA */
        .thrust-cta {
          align-self: flex-start;
          background: var(--accent);
          color: var(--bg);
          border: 0;
          border-radius: 10px;
          padding: 10px 14px;
          font-weight: 800;
          letter-spacing: 0.3px;
          text-decoration: none;
          transition: transform 0.2s ease, filter 0.2s ease, box-shadow 0.2s ease;
        }
        .thrust-cta:hover {
          filter: brightness(1.06);
          box-shadow: 0 0 20px rgba(245, 181, 36, 0.12);
          transform: translateY(-1px);
        }
        .thrust-cta:active {
          transform: translateY(0);
        }
      `}</style>
    </main>
  );
}
