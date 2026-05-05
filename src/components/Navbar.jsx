import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useBreakpoint from '../hooks/useBreakpoint';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isMobile } = useBreakpoint();

  useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      setScrolled(currentScrollY > 60);
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [lastScrollY]);


  const linkStyle = {
    fontFamily: "'Jost', sans-serif", fontSize: '10px', letterSpacing: '4px',
    textTransform: 'uppercase', color: 'rgba(245,245,245,0.4)', textDecoration: 'none',
    fontWeight: 300, transition: 'color 0.3s',
  };

  const navLinks = [
    { label: 'Collections', to: '/collections', isRouter: true },
    { label: 'Atelier', to: '/#atelier', isRouter: false },
    { label: 'Heritage', to: '#atelier', isRouter: false },
    { label: 'Contact', to: '#atelier', isRouter: false },
  ];

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: isMobile ? '20px 24px' : '28px 64px',
        background: scrolled || menuOpen ? 'rgba(11,11,11,0.96)' : 'transparent',
        backdropFilter: scrolled || menuOpen ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(212,175,55,0.08)' : '1px solid transparent',
        transition: 'all 0.5s cubic-bezier(0.19, 1, 0.22, 1)',
        transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
      }}>

        {!isMobile && (
          <ul style={{ display: 'flex', gap: '48px', listStyle: 'none' }}>
            <li>
              <Link to="/collections" style={linkStyle}
                onMouseEnter={e => e.target.style.color = '#D4AF37'}
                onMouseLeave={e => e.target.style.color = 'rgba(245,245,245,0.4)'}
              >Collections</Link>
            </li>
            <li>
              <a href="/#atelier" style={{ ...linkStyle, opacity: 0, pointerEvents: 'none' }}
                onMouseEnter={e => e.target.style.color = '#D4AF37'}
                onMouseLeave={e => e.target.style.color = 'rgba(245,245,245,0.4)'}
              >Atelier</a>
            </li>
          </ul>
        )}

        {isMobile && <div style={{ width: '32px' }} />}

        <Link to="/" style={{
          fontFamily: "'Cinzel', serif",
          fontSize: isMobile ? '14px' : '18px',
          letterSpacing: isMobile ? '6px' : '10px',
          color: '#D4AF37', fontWeight: 400,
          position: 'absolute', left: '50%', transform: 'translateX(-50%)',
          textShadow: '0 0 40px rgba(212,175,55,0.2)', textDecoration: 'none',
        }}>EIRA</Link>

        {!isMobile && (
          <ul style={{ display: 'flex', gap: '48px', listStyle: 'none' }}>
            {['Heritage', 'Contact'].map(link => (
              <li key={link}>
                <a href="#atelier" style={link === 'Heritage' ? { ...linkStyle, opacity: 0, pointerEvents: 'none' } : linkStyle}
                  onMouseEnter={e => e.target.style.color = '#D4AF37'}
                  onMouseLeave={e => e.target.style.color = 'rgba(245,245,245,0.4)'}
                >{link}</a>
              </li>
            ))}
          </ul>
        )}

        {isMobile && (
          <button
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '4px', display: 'flex', flexDirection: 'column',
              gap: '5px', zIndex: 1100,
            }}
          >
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                display: 'block', width: '22px', height: '1px',
                background: '#D4AF37',
                transformOrigin: 'center',
                transition: 'transform 0.35s ease, opacity 0.35s ease',
                transform:
                  menuOpen
                    ? i === 0 ? 'translateY(6px) rotate(45deg)'
                      : i === 1 ? 'scaleX(0)'
                        : 'translateY(-6px) rotate(-45deg)'
                    : 'none',
                opacity: menuOpen && i === 1 ? 0 : 1,
              }} />
            ))}
          </button>
        )}
      </nav>

      {isMobile && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999,
          background: 'rgba(11,11,11,0.97)',
          backdropFilter: 'blur(24px)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: '48px',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'all' : 'none',
          transition: 'opacity 0.4s ease',
        }}>
          {navLinks
            .filter(link => link.label !== 'Atelier' && link.label !== 'Heritage')
            .map((link, i) => (
              link.isRouter ? (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    fontFamily: "'Cinzel', serif", fontSize: '22px', letterSpacing: '6px',
                    color: 'rgba(245,245,245,0.7)', textDecoration: 'none',
                    textTransform: 'uppercase', fontWeight: 400,
                    transition: 'color 0.3s',
                    opacity: menuOpen ? 1 : 0,
                    transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
                    transitionDelay: `${i * 60}ms`,
                    transitionProperty: 'opacity, transform, color',
                    transitionDuration: '0.5s',
                  }}
                  onMouseEnter={e => e.target.style.color = '#D4AF37'}
                  onMouseLeave={e => e.target.style.color = 'rgba(245,245,245,0.7)'}
                >{link.label}</Link>
              ) : (
                <a
                  key={link.label}
                  href={link.to}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    fontFamily: "'Cinzel', serif", fontSize: '22px', letterSpacing: '6px',
                    color: 'rgba(245,245,245,0.7)', textDecoration: 'none',
                    textTransform: 'uppercase', fontWeight: 400,
                    transition: 'color 0.3s',
                    opacity: menuOpen ? 1 : 0,
                    transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
                    transitionDelay: `${i * 60}ms`,
                    transitionProperty: 'opacity, transform, color',
                    transitionDuration: '0.5s',
                  }}
                  onMouseEnter={e => e.target.style.color = '#D4AF37'}
                  onMouseLeave={e => e.target.style.color = 'rgba(245,245,245,0.7)'}
                >{link.label}</a>
              )
            ))}

          <div style={{ width: '40px', height: '1px', background: 'rgba(212,175,55,0.25)' }} />
          <p style={{
            fontFamily: "'Jost', sans-serif", fontSize: '9px', letterSpacing: '4px',
            color: 'rgba(212,175,55,0.25)', textTransform: 'uppercase', fontWeight: 300,
          }}>Maison de Haute Joaillerie</p>
        </div>
      )}
    </>
  );
}