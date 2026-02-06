import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            background: 'rgba(30, 41, 59, 0.95)',
            backdropFilter: 'blur(10px)',
            padding: '1rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 1000,
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
        }}>
            <Link to="/" style={{
                color: 'white',
                textDecoration: 'none',
                fontSize: '1.2rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
            }}>
                🔍 Quectel Antenna Search
            </Link>

            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <Link to="/" style={{
                    color: '#cbd5e1',
                    textDecoration: 'none',
                    fontSize: '0.95rem',
                    transition: 'color 0.2s'
                }}
                    onMouseEnter={(e) => e.target.style.color = 'white'}
                    onMouseLeave={(e) => e.target.style.color = '#cbd5e1'}
                >
                    Home
                </Link>
                <Link to="/inquiry" style={{
                    color: '#cbd5e1',
                    textDecoration: 'none',
                    fontSize: '0.95rem',
                    transition: 'color 0.2s'
                }}
                    onMouseEnter={(e) => e.target.style.color = 'white'}
                    onMouseLeave={(e) => e.target.style.color = '#cbd5e1'}
                >
                    Inquiry
                </Link>

            </div>
        </nav>
    );
}

export default Navbar;
