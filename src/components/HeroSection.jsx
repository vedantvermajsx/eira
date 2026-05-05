import { useEffect, useRef, useCallback } from 'react';
import useBreakpoint from '../hooks/useBreakpoint';

const FRAME_COUNT = 240;

const FRAMES = [];
for (let i = 1; i <= FRAME_COUNT; i++) {
  FRAMES.push(`https://raw.githubusercontent.com/vedantvermajsx/eira/refs/heads/master/public/frames/frame${i}.avif`);
}

export default function HeroSection({ onFramesReady }) {
  const { isMobile } = useBreakpoint();
  const canvasRef = useRef(null);
  const sectionRef = useRef(null);
  const overlayRef = useRef(null);
  const tp1Ref = useRef(null);
  const tp2Ref = useRef(null);
  const tp3Ref = useRef(null);
  const hudRef = useRef(null);
  const progRef = useRef(null);
  const imgObjs = useRef(new Array(FRAME_COUNT));
  const currentIdx = useRef(0);

  const clamp01 = (v) => Math.max(0, Math.min(1, v));

  const renderFrame = useCallback((idx) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const i = Math.max(0, Math.min(FRAME_COUNT - 1, Math.floor(idx)));
    const img = imgObjs.current[i];
    if (!img || !img.complete) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const scale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
  }, []);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    renderFrame(currentIdx.current);
  }, [renderFrame]);

  useEffect(() => {
    resize();
    window.addEventListener('resize', resize);
    let loaded = 0;

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.onload = () => {
        loaded++;
        const pct = Math.round((loaded / FRAME_COUNT) * 100);
        const ldBar = document.getElementById('ld-bar');
        const ldPct = document.getElementById('ld-pct');
        if (ldBar) ldBar.style.width = pct + '%';
        if (ldPct) ldPct.textContent = pct + '%';
        if (loaded === FRAME_COUNT) {
          renderFrame(0);
          if (onFramesReady) onFramesReady();
        }
      };
      img.src = FRAMES[i];
      imgObjs.current[i] = img;
    }

    return () => window.removeEventListener('resize', resize);
  }, [resize, renderFrame, onFramesReady]);

  useEffect(() => {
    let animationId;

    const updateFrame = () => {
      const section = sectionRef.current;
      if (!section) {
        animationId = requestAnimationFrame(updateFrame);
        return;
      }

      const rect = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      const t = Math.min(1, scrolled / scrollable);

      const fi = t * (FRAME_COUNT - 1);
      currentIdx.current = fi;
      renderFrame(fi);

      if (hudRef.current)
        hudRef.current.textContent =
          String(Math.floor(fi)).padStart(3, '0') + ' / ' + String(FRAME_COUNT).padStart(3, '0');
      if (progRef.current) progRef.current.style.width = t * 100 + '%';

      if (overlayRef.current) {
        overlayRef.current.style.opacity = Math.max(0, 1 - t * 6);
        overlayRef.current.style.transform = `translateY(${t * -40}px)`;
      }

      const p1 = t < 0.22 ? clamp01(t * 12) : clamp01(1 - (t - 0.22) * 12);
      const p2 = t > 0.30 && t < 0.65
        ? clamp01((t - 0.30) * 10)
        : t >= 0.65 ? clamp01(1 - (t - 0.65) * 10) : 0;
      const p3 = t > 0.72 ? clamp01((t - 0.72) * 10) : 0;

      if (tp1Ref.current) {
        tp1Ref.current.style.opacity = p1;
        tp1Ref.current.style.transform = `translateX(${(1 - p1) * 24}px)`;
      }
      if (tp2Ref.current) {
        tp2Ref.current.style.opacity = p2;
        tp2Ref.current.style.transform = `translateX(${(1 - p2) * -24}px)`;
      }
      if (tp3Ref.current) {
        tp3Ref.current.style.opacity = p3;
        tp3Ref.current.style.transform = `translateX(-50%) translateY(${(1 - p3) * 20}px)`;
      }

      animationId = requestAnimationFrame(updateFrame);
    };

    animationId = requestAnimationFrame(updateFrame);
    return () => cancelAnimationFrame(animationId);
  }, [renderFrame]);

  const panel = { position: 'absolute', zIndex: 15, pointerEvents: 'none', transition: 'opacity 0.4s ease, transform 0.4s ease', opacity: 0 };
  const tag = { fontFamily: "'Jost', sans-serif", fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase', color: '#c9a84c', display: 'block', marginBottom: '12px', fontWeight: 300 };
  const h2s = { fontFamily: "'Cinzel', serif", fontSize: 'clamp(28px,3.5vw,52px)', lineHeight: 1.15, letterSpacing: '3px', fontWeight: 400, color: '#f0ece4' };
  const subp = { fontFamily: "'Cormorant Garamond', serif", fontSize: '15px', color: 'rgba(240,236,228,1)', maxWidth: '260px', marginTop: '12px', lineHeight: 1.9, fontStyle: 'italic', fontWeight: 300 };

  return (
    <section ref={sectionRef} style={{ position: 'relative', height: '600vh' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />

        <div style={{ position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none', background: 'radial-gradient(ellipse at center, transparent 40%, rgba(5,5,10,0.85) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 6, pointerEvents: 'none', background: 'linear-gradient(to bottom, rgba(5,5,10,0.6) 0%, transparent 18%, transparent 80%, rgba(5,5,10,0.8) 100%)' }} />

        <div ref={overlayRef} style={{ position: 'relative', zIndex: 10, textAlign: 'center', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '11px', letterSpacing: '6px', textTransform: 'uppercase', color: '#c9a84c', marginBottom: '20px', animation: 'fadeUp 1s 0.4s both', fontWeight: 300 }}>Maison de Haute Joaillerie</p>
          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(52px, 9vw, 120px)', lineHeight: 1.0, letterSpacing: '6px', animation: 'fadeUp 1s 0.6s both', fontWeight: 400 }}>
            <span style={{ WebkitTextStroke: '1px rgba(201,168,76,1)', color: 'transparent', display: 'block' }}>ETERNAL</span>
            <span style={{ WebkitTextStroke: '1px rgba(201,168,76,1)', color: 'transparent', display: 'block' }}>DIAMONDS</span>
          </h1>
          <p style={{ marginTop: '28px', fontSize: '14px', color: 'rgba(237, 229, 7, 1)', letterSpacing: '1.2px', maxWidth: '420px', lineHeight: 1.9, animation: 'fadeUp 1s 0.8s both', fontWeight: 500, fontStyle: 'italic', fontFamily: "'Cormorant Garamond', serif" }}>
            Where light becomes legend. Each stone, a universe of brilliance —<br />handcrafted for those who seek the extraordinary.
          </p>
        </div>

        {!isMobile && (
          <div ref={tp1Ref} style={{ ...panel, bottom: '22%', left: '6%' }}>
            <span style={tag}>I — Brilliance</span>
            <h2 style={h2s}>BORN<br />FROM<br />LIGHT</h2>
            <p style={subp}>Each diamond is selected for its singular brilliance — a rarity that transcends time.</p>
          </div>
        )}

        {!isMobile && (
          <div ref={tp2Ref} style={{ ...panel, top: '30%', right: '6%', textAlign: 'right' }}>
            <span style={{ ...tag }}>II — Craft</span>
            <h2 style={h2s}>MASTER<br />ARTISAN<br />HANDS</h2>
            <p style={{ ...subp, marginLeft: 'auto' }}>Over two centuries of savoir-faire, passed from generation to generation in our Parisian atelier.</p>
          </div>
        )}

        {!isMobile && (
          <div ref={tp3Ref} style={{ ...panel, bottom: '18%', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
            <span style={tag}>III — Legacy</span>
            <h2 style={h2s}>YOUR<br />FOREVER</h2>
            <p style={{ ...subp, margin: '10px auto 0' }}>An Eira piece is not merely worn — it is inherited, cherished, and passed on to eternity.</p>
          </div>
        )}

        {!isMobile && (
          <div ref={hudRef} style={{ position: 'absolute', bottom: '48px', right: '48px', fontFamily: "'Jost', sans-serif", fontSize: '10px', letterSpacing: '3px', color: 'rgba(201,168,76,0.25)', zIndex: 20, pointerEvents: 'none', fontWeight: 300, textTransform: 'uppercase' }}>000 / 240</div>
        )}

        <div ref={progRef} style={{ position: 'absolute', bottom: 0, left: 0, height: '1px', width: '0%', background: 'linear-gradient(90deg, #c9a84c, rgba(201,168,76,0.3))', boxShadow: '0 0 12px rgba(201,168,76,0.4)', zIndex: 20 }} />

        <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', zIndex: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', animation: 'fadeUp 1s 1.3s both', pointerEvents: 'none' }}>
            <span style={{ fontFamily: "'Jost', sans-serif", fontSize: '9px', letterSpacing: '4px', textTransform: 'uppercase', color: 'rgba(201,168,76,1)', fontWeight: 300 }}>Scroll</span>
            <div style={{ width: '1px', height: '55px', background: 'linear-gradient(to bottom, #c9a84c, transparent)', animation: 'scanDown 1.8s ease-in-out infinite' }} />
          </div>
        </div>

      </div>
    </section>
  );
}

