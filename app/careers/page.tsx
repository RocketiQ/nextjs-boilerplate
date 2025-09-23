'use client';

import Link from 'next/link';
import Image from 'next/image';

type Role = {
  slug: string;
  title: string;
  blurb: string;
  meta: string; // short status line
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
            <article key={r.slug} className="card-orbit">
              {/* orbital rings */}
              <span className="orbit orbit-a" aria-hidden="true" />
              <span className="orbit orbit-b" aria-hidden="true" />
              <span className="satellite" aria-hidden="true" />

              <div className="card-body">
                <div className="card-meta">{r.meta}</div>
                <h2 className="card-title">{r.title}</h2>
                <p className="card-blurb">{r.blurb}</p>

                <Link href={r.slug} className="orbit-cta" aria-label={`Open ${r.title}`}>
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

      {/* ORBIT styling (scoped to this page) */}
      <style jsx global>{`
        .roles-grid {
          display: grid;
          gap: 20px;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          align-items: stretch;
        }

        .card-orbit {
          position: relative;
          border-radius: 16px;
          padding: 1px; /* thin gradient border */
          background: linear-gradient(
            135deg,
            rgba(245, 181, 36, 0.85),
            rgba(245, 181, 36, 0.22)
          );
          transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
          overflow: hidden;
        }
        .card-orbit .card-body {
          position: relative;
          background: var(--panel);
          border: 1px solid var(--panel-border);
          border-radius: 15px;
          padding: 16px;
          min-height: 220px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        /* ORBITAL RINGS (big faint circles peeking in) */
        .card-orbit .orbit {
          position: absolute;
          pointer-events: none;
          border-radius: 999px;
          border: 1px solid rgba(245, 181, 36, 0.25);
          filter: drop-shadow(0 0 8px rgba(245, 181, 36, 0.05));
          transform: rotate(8deg);
        }
        /* top-right large ring */
        .card-orbit .orbit-a {
          width: 360px;
          height: 360px;
          top: -170px;
          right: -120px;
        }
        /* bottom-left smaller ring */
        .card-orbit .orbit-b {
          width: 240px;
          height: 240px;
          bottom: -120px;
          left: -100px;
          transform: rotate(-6deg);
          border-color: rgba(245, 181, 36, 0.18);
        }

        /* tiny satellite dot riding an orbit */
        .card-orbit .satellite {
          position: absolute;
          width: 8px;
          height: 8px;
          right: 38px;
          top: 34px;
          background: var(--accent);
          border-radius: 50%;
          box-shadow:
            0 0 0 2px rgba(245, 181, 36, 0.25),
            0 0 14px rgba(245, 181, 36, 0.35);
        }

        .card-orbit:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(245, 181, 36, 0.08);
          background: linear-gradient(
            135deg,
            rgba(245, 181, 36, 0.95),
            rgba(245, 181, 36, 0.28)
          );
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
          margin: 2px 0 10px;
          line-height: 1.55;
        }

        .orbit-cta {
          align-self: flex-start;
          background: transparent;
          border: 1px solid rgba(245, 181, 36, 0.45);
          color: var(--text);
          border-radius: 10px;
          padding: 10px 14px;
          font-weight: 800;
          letter-spacing: 0.3px;
          text-decoration: none;
          transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .orbit-cta:hover {
          border-color: rgba(245, 181, 36, 0.9);
          box-shadow: 0 0 20px rgba(245, 181, 36, 0.12);
          transform: translateY(-1px);
        }
        .orbit-cta .arrow {
          margin-left: 6px;
        }
      `}</style>
    </main>
  );
}
