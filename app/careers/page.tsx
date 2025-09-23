'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useRef } from 'react';

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
    meta: 'Remote • ~2 hrs/day • Unpaid (certified)',
  },
  {
    title: 'Research Projects Developer Intern',
    slug: 'research-projects-developer-intern',
    href: '/research-projects-developer-intern',
    blurb: 'Build 4-week, code-backed workshop projects with milestones & rubrics.',
    meta: 'Remote • ~2–3 hrs/day • Unpaid (certified)',
  },
  {
    title: 'Research Engineer Intern',
    slug: 'research-engineer-intern',
    href: '/research-engineer-intern',
    blurb: 'Own and ship a research-grade repo with CI, docs, and tests.',
    meta: 'Remote • ~3-4 hrs/day • Unpaid (certified)',
  },
];

const jobs: Role[] = [
  {
    title: 'Business Operations Associate',
    slug: 'business-operations-associate',
    href: '/business-operations-associate',
    blurb:
      'Help run cadence, trackers, hiring support, docs & follow-ups across Ops.',
    meta: 'Remote • ~3-4 hrs/day • Unpaid (certified)',
  },
];

export default function CareersPage() {
  const bgCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // ---- Background Animation (slowed neural curves; no custom cursor) ----
  useEffect(() => {
    const canvas = bgCanvasRef.current;
    if (!canvas) return;

    const maybe = canvas.getContext('2d');
    if (!maybe) return;
    const ctx: CanvasRenderingContext2D = maybe;

    let width = 0;
    let height = 0;
    let raf = 0;

    // Mouse + gating
    let mouseX = -1e6;
    let mouseY = -1e6;
    let lastMouseMove = 0;

    // Tunables (slower behavior)
    const NODE_SPACING = 60;
    const INTERACTION_RADIUS = 110;      // smaller = fewer active nodes
    const SPAWN_INTERVAL_MS = 220;       // higher = slower global spawning
    const NODE_COOLDOWN_MS = 450;        // per-node pairing cooldown
    const MAX_LINKS = 28;                // cap simultaneous links
    const ENERGY_HIT = 1.0;              // energy spike on hover
    const ENERGY_DECAY = 0.975;          // energy decay per frame
    const ACTIVE_THRESHOLD = 0.72;       // only “very active” nodes can pair
    const NEED_RECENT_MOVE_MS = 120;     // require very recent mouse movement

    interface Node {
      x: number;
      y: number;
      energy: number;
      radius: number;
      cooldownUntil: number; // timestamp until which node cannot spawn
    }

    class Link {
      start: Node;
      end: Node;
      life: number;
      constructor(start: Node, end: Node) {
        this.start = start;
        this.end = end;
        this.life = 1;
      }
      update() {
        this.life -= 0.03; // fade speed (visual only)
      }
      draw() {
        ctx.beginPath();
        ctx.moveTo(this.start.x, this.start.y);
        const ctrlX =
          (this.start.x + this.end.x) / 2 + (this.end.y - this.start.y) * 0.2;
        const ctrlY =
          (this.start.y + this.end.y) / 2 + (this.start.x - this.end.x) * 0.2;
        ctx.quadraticCurveTo(ctrlX, ctrlY, this.end.x, this.end.y);
        ctx.strokeStyle = `rgba(192, 38, 211, ${this.life * 0.7})`; // purple
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    const nodes: Node[] = [];
    const links: Link[] = [];

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;

      nodes.length = 0;
      for (let y = 0; y < height; y += NODE_SPACING) {
        for (let x = 0; x < width; x += NODE_SPACING) {
          nodes.push({
            x: x + (Math.random() * 20 - 10),
            y: y + (Math.random() * 20 - 10),
            energy: 0,
            radius: 1,
            cooldownUntil: 0,
          });
        }
      }
    };

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      lastMouseMove = performance.now();
    };

    let lastSpawn = 0;

    const animate = () => {
      const now = performance.now();
      ctx.clearRect(0, 0, width, height);

      // update + draw nodes
      for (const n of nodes) {
        const dist = Math.hypot(n.x - mouseX, n.y - mouseY);
        if (dist < INTERACTION_RADIUS) n.energy = ENERGY_HIT;
        n.energy *= ENERGY_DECAY;

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius + n.energy * 2, 0, Math.PI * 2);
        const opacity = 0.18 + n.energy * 0.6;
        ctx.fillStyle = `rgba(56, 189, 248, ${opacity})`; // cyan-ish dots
        ctx.fill();
      }

      // Spawn throttling & gating
      const canTrySpawn =
        now - lastSpawn >= SPAWN_INTERVAL_MS &&
        now - lastMouseMove <= NEED_RECENT_MOVE_MS &&
        links.length < MAX_LINKS;

      if (canTrySpawn) {
        // Energetic nodes ready to pair (and off cooldown)
        const ready = nodes.filter(
          (n) => n.energy > ACTIVE_THRESHOLD && now >= n.cooldownUntil
        );

        if (ready.length > 1) {
          // Pick two distinct nodes that are not too far apart
          const a = ready[Math.floor(Math.random() * ready.length)];
          let b: Node | null = null;
          // try up to 6 picks to find a reasonably close partner
          for (let tries = 0; tries < 6; tries++) {
            const cand = ready[Math.floor(Math.random() * ready.length)];
            if (cand !== a && Math.hypot(cand.x - a.x, cand.y - a.y) < 260) {
              b = cand;
              break;
            }
          }
          if (b && a !== b) {
            links.push(new Link(a, b));
            a.cooldownUntil = now + NODE_COOLDOWN_MS;
            b.cooldownUntil = now + NODE_COOLDOWN_MS;
            lastSpawn = now;
          } else {
            // even if we didn't find a partner, don't hammer spawn attempts
            lastSpawn = now - (SPAWN_INTERVAL_MS * 0.5);
          }
        } else {
          // not enough eligible nodes; back off a bit
          lastSpawn = now - (SPAWN_INTERVAL_MS * 0.4);
        }
      }

      // Update/draw links and prune
      for (let i = links.length - 1; i >= 0; i--) {
        const L = links[i];
        L.update();
        L.draw();
        if (L.life <= 0) links.splice(i, 1);
      }

      raf = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('resize', resize);
    resize();
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', resize);
    };
  }, []);

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
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      alignItems: 'stretch',
    }),
    []
  );

  const cardInner: React.CSSProperties = { display: 'grid', gap: 12, height: '100%' };
  const metaStyle: React.CSSProperties = { color: 'var(--muted)', fontSize: 15 };
  const heroWrap: React.CSSProperties = { marginTop: 8, marginBottom: 28 };
  const heroTitle: React.CSSProperties = {
    margin: 0, fontWeight: 900, fontSize: 'clamp(30px, 5vw, 60px)', lineHeight: 1.16, letterSpacing: '-0.02em',
  };
  const heroSub: React.CSSProperties = { color: 'var(--muted)', marginTop: 14, fontSize: 18 };
  const heroBtns: React.CSSProperties = { display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' };
  const hotLine: React.CSSProperties = { marginTop: 18, fontSize: 16, color: 'var(--muted)' };
  const sectionH2: React.CSSProperties = {
    fontWeight: 900, fontSize: 'clamp(22px, 2.2vw, 32px)', marginTop: 44, marginBottom: 16, letterSpacing: '-0.01em',
  };

  return (
    <main className="careers-page" style={{ position: 'relative' }}>
      {/* Fixed background canvas */}
      <canvas
        ref={bgCanvasRef}
        aria-hidden
        style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', zIndex: -1, display: 'block' }}
      />

      {/* Logo row */}
      <header className="logo-bar">
        <Image src="/rocketiq-white.png" alt="RocketiQ" width={320} height={44} priority style={{ height: 'auto' }} />
      </header>

      <div className="apply-shell">
        {/* HERO */}
        <section style={heroWrap} aria-labelledby="careers-hero-title">
          <h1 id="careers-hero-title" style={heroTitle}>
            Start your career in <span style={{ color: 'var(--accent)' }}>Space Science &amp; Technology</span>
          </h1>
          <p style={heroSub}>India’s first research-native Space edtech startup</p>

          <div style={heroBtns}>
            <a href="#internships" className="btn-primary btn-size btn-glow" style={{ textDecoration: 'none' }}>
              Internships
            </a>
            <a href="#jobs" className="btn-ghost btn-size btn-glow" style={{ textDecoration: 'none' }}>
              Jobs
            </a>
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
          <div className="grid-3" style={grid}>
            {internships.map((r) => (
              <article key={r.slug} className="card-dk lift-card" style={cardInner}>
                <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: 'var(--accent)' }}>{r.title}</h3>
                {r.meta && <div style={metaStyle}>{r.meta}</div>}
                <p style={{ margin: '6px 0 12px', fontSize: 16 }}>{r.blurb}</p>
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
          <h2 id="jobs-title" style={sectionH2}>Jobs</h2>
          <div className="grid-3" style={grid}>
            {jobs.map((r) => (
              <article key={r.slug} className="card-dk lift-card" style={cardInner}>
                <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: 'var(--accent)' }}>{r.title}</h3>
                {r.meta && <div style={metaStyle}>{r.meta}</div>}
                <p style={{ margin: '6px 0 12px', fontSize: 16 }}>{r.blurb}</p>
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

        <p style={{ textAlign: 'center', color: '#9aa4b2', fontSize: 12, marginTop: 30 }}>
          © {new Date().getFullYear()} RocketiQ Next-Gen Learning. All rights reserved.
        </p>
      </div>

      {/* Page-scoped enhancements */}
      <style jsx global>{`
        html { scroll-behavior: smooth; }
        .careers-page .btn-size {
          width: 160px; text-align: center; padding: 12px 16px; border-radius: 12px; font-weight: 700;
        }
        .careers-page .btn-ghost { border: 1px solid var(--accent); color: var(--accent); background: transparent; }
        .careers-page .btn-glow {
          transition: transform 0.2s ease, box-shadow 0.25s ease, filter 0.2s ease; will-change: transform, box-shadow, filter;
        }
        .careers-page .btn-glow:hover {
          transform: translateY(-1px);
          box-shadow: 0 0 0 2px rgba(255, 200, 60, 0.35) inset, 0 0 24px rgba(255, 200, 60, 0.35);
          filter: saturate(1.05);
        }
        .careers-page .lift-card {
          position: relative; transition: transform 0.25s ease, box-shadow 0.25s ease; will-change: transform, box-shadow;
        }
        .careers-page .lift-card:hover {
          transform: translateY(-6px) scale(1.015);
          box-shadow: 0 0 0 1px rgba(255, 200, 60, 0.35) inset, 0 16px 36px rgba(0, 0, 0, 0.35), 0 0 40px rgba(255, 200, 60, 0.12);
        }
        @media (min-width: 1024px) {
          .careers-page .grid-3 { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
        }
      `}</style>
    </main>
  );
}
