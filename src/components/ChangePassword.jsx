import { useState } from 'react';

function ChangePassword({ onClose }) {
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

                <div style={{
                    padding: '1.5rem',
                    background: '#fffbeb',
                    borderRadius: '8px',
                    border: '1px solid #fcd34d',
                    marginBottom: '1.5rem'
                }}>
                    <div style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>⚠️</div>
                    <p style={{ margin: 0, color: '#92400e', fontSize: '0.9rem', lineHeight: '1.5' }}>
                        비밀번호 변경은 환경변수에서 관리됩니다.<br />
                        <code>.env.local</code> 파일의 <code>VITE_ADMIN_PASSWORD_HASH</code> 값을 변경해 주세요.
                    </p>
                </div>

                <div style={{
                    padding: '1rem',
                    background: '#f0f9ff',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    color: '#0369a1',
                    marginBottom: '1.5rem'
                }}>
                    <strong>💡 비밀번호 해시 생성 방법:</strong>
                    <ol style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.5rem', lineHeight: '1.8' }}>
                        <li>브라우저 개발자 도구 (F12) → Console 탭 열기</li>
                        <li>아래 코드를 붙여넣기 후 실행:
                            <div style={{
                                background: '#1e293b',
                                color: '#e2e8f0',
                                padding: '0.75rem',
                                borderRadius: '6px',
                                marginTop: '0.5rem',
                                fontFamily: 'monospace',
                                fontSize: '0.8rem',
                                wordBreak: 'break-all'
                            }}>
                                {`crypto.subtle.digest('SHA-256', new TextEncoder().encode('새비밀번호')).then(b => console.log(Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2,'0')).join('')))`}
                            </div>
                        </li>
                        <li>출력된 해시값을 <code>.env.local</code>의 <code>VITE_ADMIN_PASSWORD_HASH</code>에 설정</li>
                        <li>개발 서버 재시작</li>
                    </ol>
                </div>

                <button
                    onClick={onClose}
                    style={{
                        width: '100%',
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
                    Close
                </button>
            </div>
        </div>
    );
}

export default ChangePassword;
