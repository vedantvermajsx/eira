import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

const S = {
  label: { fontFamily: "'Jost',sans-serif", fontSize: '9px', letterSpacing: '2.5px', textTransform: 'uppercase', color: 'rgba(212,175,55,0.4)', fontWeight: 300, display: 'block', marginBottom: '8px' },
  input: { width: '100%', background: 'rgba(212,175,55,0.02)', border: '1px solid rgba(212,175,55,0.1)', color: 'rgba(245,245,245,0.8)', fontFamily: "'Jost',sans-serif", fontSize: '12px', letterSpacing: '1px', padding: '11px 14px', outline: 'none', transition: 'all 0.2s' },
  button: { width: '100%', background: '#D4AF37', color: '#0B0B0B', border: 'none', padding: '14px', fontFamily: "'Jost',sans-serif", fontSize: '12px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s' },
};

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await AuthService.login(username, password);
      if (response.success) {
        localStorage.setItem('eira_auth', 'true');
        localStorage.setItem('eira_token', response.token);
        navigate('/admin');
      } else {
        setError(response.error || 'Login failed');
      }
    } catch (err) {
      setError(err.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0B0B0B', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ width: '100%', maxWidth: '400px', padding: '40px', border: '1px solid rgba(212,175,55,0.1)', background: 'rgba(212,175,55,0.01)' }}>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: '24px', color: '#D4AF37', textAlign: 'center', marginBottom: '32px', letterSpacing: '2px' }}>ADMIN LOGIN</h2>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={S.label}>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={S.input}
                placeholder="admin"
              />
            </div>
            <div>
              <label style={S.label}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={S.input}
                placeholder="••••••••"
              />
            </div>

            {error && <p style={{ color: 'rgba(239, 68, 68, 0.8)', fontSize: '11px', fontFamily: "'Jost', sans-serif", textAlign: 'center' }}>{error}</p>}

            <button 
              type="submit" 
              style={{...S.button, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer'}} 
              disabled={loading}
              onMouseEnter={e => !loading && (e.target.style.background = '#E5C158')} 
              onMouseLeave={e => !loading && (e.target.style.background = '#D4AF37')}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
