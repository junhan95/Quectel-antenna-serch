import { useState } from 'react';

function ChangePassword({ onClose, onSuccess }) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [showPasswords, setShowPasswords] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Get stored credentials
        const storedPassword = localStorage.getItem('adminPassword') || 'admin';

        // Validate current password
        if (currentPassword !== storedPassword) {
            setError('Current password is incorrect');
            return;
        }

        // Validate new password
        if (newPassword.length < 4) {
            setError('New password must be at least 4 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        if (newPassword === storedPassword) {
            setError('New password must be different from current password');
            return;
        }

        // Save new password
        localStorage.setItem('adminPassword', newPassword);

        // Clear form
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setError('');

        if (onSuccess) {
            onSuccess();
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '2rem'
        }}>
            <div style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                width: '100%',
                maxWidth: '450px'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1.5rem'
                }}>
                    <h2 style={{ margin: 0, color: '#1e293b', fontSize: '1.5rem' }}>
                        🔑 Change Password
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            color: '#64748b',
                            padding: '0.25rem'
                        }}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            color: '#1e293b',
                            fontWeight: '500',
                            fontSize: '0.9rem'
                        }}>
                            Current Password
                        </label>
                        <input
                            type={showPasswords ? 'text' : 'password'}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Enter current password"
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                border: '1px solid #cbd5e1',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                            onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                        />
                    </div>

                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            color: '#1e293b',
                            fontWeight: '500',
                            fontSize: '0.9rem'
                        }}>
                            New Password
                        </label>
                        <input
                            type={showPasswords ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                border: '1px solid #cbd5e1',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                            onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                        />
                    </div>

                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            color: '#1e293b',
                            fontWeight: '500',
                            fontSize: '0.9rem'
                        }}>
                            Confirm New Password
                        </label>
                        <input
                            type={showPasswords ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                border: '1px solid #cbd5e1',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                            onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                        />
                    </div>

                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            color: '#64748b'
                        }}>
                            <input
                                type="checkbox"
                                checked={showPasswords}
                                onChange={(e) => setShowPasswords(e.target.checked)}
                                style={{ cursor: 'pointer' }}
                            />
                            Show passwords
                        </label>
                    </div>

                    {error && (
                        <div style={{
                            background: '#fee2e2',
                            color: '#991b1b',
                            padding: '0.75rem 1rem',
                            borderRadius: '8px',
                            marginBottom: '1.25rem',
                            fontSize: '0.9rem'
                        }}>
                            ⚠️ {error}
                        </div>
                    )}

                    <div style={{
                        display: 'flex',
                        gap: '0.75rem',
                        marginTop: '1.5rem'
                    }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                flex: 1,
                                padding: '0.75rem',
                                background: '#e2e8f0',
                                color: '#475569',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                fontWeight: '500',
                                cursor: 'pointer'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            style={{
                                flex: 1,
                                padding: '0.75rem',
                                background: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'background 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.background = '#2563eb'}
                            onMouseLeave={(e) => e.target.style.background = '#3b82f6'}
                        >
                            Change Password
                        </button>
                    </div>
                </form>

                <div style={{
                    marginTop: '1.5rem',
                    padding: '1rem',
                    background: '#f0f9ff',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    color: '#0369a1'
                }}>
                    <strong>💡 Password Requirements:</strong>
                    <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.5rem' }}>
                        <li>Minimum 4 characters</li>
                        <li>Must be different from current password</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default ChangePassword;
