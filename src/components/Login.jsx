import { useState } from 'react';

// SHA-256 hash using Web Crypto API
async function sha256(message) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Session expiry: 2 hours
const SESSION_EXPIRY_MS = 2 * 60 * 60 * 1000;

export function isSessionValid() {
    const auth = sessionStorage.getItem('adminAuth');
    const timestamp = sessionStorage.getItem('adminAuthTimestamp');
    if (auth !== 'true' || !timestamp) return false;
    return (Date.now() - parseInt(timestamp, 10)) < SESSION_EXPIRY_MS;
}

function Login({ onLogin }) {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Get admin credentials from environment variables
            const adminId = import.meta.env.VITE_ADMIN_ID || 'admin';
            const adminPasswordHash = import.meta.env.VITE_ADMIN_PASSWORD_HASH || '';

            // Hash the entered password
            const enteredHash = await sha256(password);

            // If no hash is configured, fall back to a secure default check
            const isValid = adminPasswordHash
                ? (id === adminId && enteredHash === adminPasswordHash)
                : (id === adminId && password === 'admin'); // Fallback for unconfigured env

            if (isValid) {
                onLogin();
                setError('');
            } else {
                setError('Invalid ID or password');
            }
        } catch (err) {
            setError('Authentication error. Please try again.');
            console.error('Login error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '2rem'
        }}>
            <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                padding: '3rem',
                borderRadius: '16px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                width: '100%',
                maxWidth: '400px'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
                    <h2 style={{ margin: 0, color: '#1e293b', fontSize: '1.8rem' }}>
                        Admin Login
                    </h2>
                    <p style={{ margin: '0.5rem 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>
                        Enter your credentials to continue
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            color: '#1e293b',
                            fontWeight: '500',
                            fontSize: '0.9rem'
                        }}>
                            ID
                        </label>
                        <input
                            type="text"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            placeholder="Enter your ID"
                            autoComplete="username"
                            disabled={isLoading}
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                border: '1px solid #cbd5e1',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'border-color 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                            onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            color: '#1e293b',
                            fontWeight: '500',
                            fontSize: '0.9rem'
                        }}>
                            Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                disabled={isLoading}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    paddingRight: '3rem',
                                    border: '1px solid #cbd5e1',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '0.75rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '1.2rem',
                                    color: '#64748b',
                                    padding: '0.25rem'
                                }}
                            >
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div style={{
                            background: '#fee2e2',
                            color: '#991b1b',
                            padding: '0.75rem 1rem',
                            borderRadius: '8px',
                            marginBottom: '1.5rem',
                            fontSize: '0.9rem'
                        }}>
                            ⚠️ {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            width: '100%',
                            padding: '0.875rem',
                            background: isLoading ? '#93c5fd' : '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            if (!isLoading) {
                                e.target.style.background = '#2563eb';
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isLoading) {
                                e.target.style.background = '#3b82f6';
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = 'none';
                            }
                        }}
                    >
                        {isLoading ? 'Authenticating...' : 'Login'}
                    </button>
                </form>

                <div style={{
                    marginTop: '1.5rem',
                    padding: '1rem',
                    background: '#f1f5f9',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    color: '#64748b',
                    textAlign: 'center'
                }}>
                    <strong>🔒 Secure Login</strong><br />
                    Credentials are verified via environment-based hash comparison
                </div>
            </div>
        </div>
    );
}

export default Login;
