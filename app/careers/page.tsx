'use client';

import Link from 'next/link';
import Image from 'next/image';

type Role = {
  slug: string;
  title: string;
  blurb: string;
  meta: string;
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

export default function CareersBlueprint() {
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
            <article key={r.slug} className="card-blueprint">
              {/* corner crop marks */}
              <span className="crop crop-tl" aria-hidden="true" />
              <span className="crop crop-br" aria-hidden="true" />

              <div className="bp-body">
                <div className="bp-topbar" />
                <div className="bp-meta">{r.meta}</div>
                <h2 className="bp-title">{r.title}</h2>
                <p className="bp-blurb">{r.blurb}</p>

                <Link href={r.slug} className="bp-cta" aria-label={`Open ${r.title}`}>
                  View role <span className="arrow">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>

        <p style={{ textAlign: 'center', color: '#9aa4b2', fontSize: 12, marginTop: 24 }}>
          © 2025–2027 RocketiQ Next-Gen Learning. All rights reserved.
        </p>
      </div>

      {/* Blueprint Grid styling (scoped) */}
      <style jsx global>{`
        .roles-grid {
          display: grid;
          gap: 20px;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          align-items: stretch;
        }

        .card-blueprint {
          position: relative;
          border-radius: 16px;
          padding: 1px; /* thin accent border */
          background: linear-gradient(
            135deg,
            rgba(245, 181, 36, 0.85),
            rgba(245, 181, 36, 0.25)
          );
          transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
          overflow: hidden;
        }

        .card-blueprint:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(245, 181, 36, 0.08);
          background: linear-gradient(
            135deg,
            rgba(245, 181, 36, 0.95),
            rgba(245, 181, 36, 0.32)
          );
        }

        .card-blueprint .bp-body {
          position: relative;
          border-radius: 15px;
          padding: 16px;
          min-height: 230px;
          background:
            /* grid vertical lines */
            repeating-linear-gradient(
              to right,
              rgba(245, 181, 36, 0.08) 0,
              rgba(245, 181, 36, 0.08) 1px,
              transparent 1px,
              transparent 14px
            ),
            /* grid horizontal lines */
            repeating-linear-gradient(
              to bottom,
              rgba(245, 181, 36, 0.08) 0,
              rgba(245, 181, 36, 0.08) 1px,
              transparent 1px,
              transparent 14px
            ),
            var(--panel);
          border: 1px solid var(--panel-border);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        /* thin golden rule at top (title bar) */
        .card-blueprint .bp-topbar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(
            to right,
            rgba(245, 181, 36, 0.0),
            rgba(245, 181, 36, 0.7),
            rgba(245, 181, 36, 0.0)
          );
        }

        .card-blueprint .bp-title {
          margin: 0;
          font-size: 18px;
          font-weight: 800;
          color: var(--text);
          letter-spacing: 0.2px;
        }

        .card-blueprint .bp-meta {
          font-size: 12px;
          letter-spacing: 0.3px;
          color: var(--muted);
        }

        .card-blueprint .bp-blurb {
          color: #cbd4e6;
          margin: 2px 0 12px;
          line-height: 1.55;
        }

        .card-blueprint .bp-cta {
          align-self: flex-start;
          background: rgba(245, 181, 36, 0.06);
          border: 1px dashed rgba(245, 181, 36, 0.6);
          color: var(--text);
          border-radius: 10px;
          padding: 10px 14px;
          font-weight: 800;
          letter-spacing: 0.3px;
          text-decoration: none;
          transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease,
            background-color 0.2s ease;
        }
        .card-blueprint .bp-cta:hover {
          border-color: rgba(245, 181, 36, 0.95);
          background: rgba(245, 181, 36, 0.12);
          box-shadow: 0 0 18px rgba(245, 181, 36, 0.12);
          transform: translateY(-1px);
        }
        .card-blueprint .bp-cta .arrow {
          margin-left: 6px;
        }

        /* corner crop marks */
        .card-blueprint .crop {
          position: absolute;
          width: 18px;
          height: 18px;
          border: 1px solid rgba(245, 181, 36, 0.45);
          pointer-events: none;
        }
        .card-blueprint .crop-tl {
          top: 8px;
          left: 8px;
          border-right: none;
          border-bottom: none;
        }
        .card-blueprint .crop-br {
          bottom: 8px;
          right: 8px;
          border-left: none;
          border-top: none;
        }
      `}</style>
    </main>
  );
}
