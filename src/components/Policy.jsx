```javascript
import { useNavigate } from 'react-router-dom';

function Policy() {
    const navigate = useNavigate();

    return (
        <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            padding: '4rem 2rem',
            color: '#e2e8f0'
        }}>
            <button
                onClick={() => navigate(-1)}
                style={{
                    marginBottom: '2rem',
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#94a3b8',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                    e.target.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.color = '#94a3b8';
                }}
            >
                ← Back
            </button>

            <h1 style={{ marginBottom: '2rem', fontSize: '2rem' }}>Website Policy (사이트 정책)</h1>

            <div style={{
                background: 'rgba(30, 41, 59, 0.5)',
                padding: '2rem',
                borderRadius: '12px',
                marginBottom: '2rem',
                border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#60a5fa' }}>English</h2>

                <p style={{ marginBottom: '1.5rem', lineHeight: '1.8' }}>
                    This website is an independent product search and inquiry platform
                    operated by an authorized distributor.
                </p>

                <p style={{ marginBottom: '1.5rem', lineHeight: '1.8' }}>
                    It provides structured access to publicly available information
                    regarding antenna products manufactured by Quectel,
                    for the purpose of supporting customer inquiries and sales consultation.
                </p>

                <p style={{ marginBottom: '0', lineHeight: '1.8' }}>
                    This website is not an official website of Quectel.
                    All trademarks and product names are the property of their respective owners.
                </p>
            </div>

            <div style={{
                background: 'rgba(30, 41, 59, 0.5)',
                padding: '2rem',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#60a5fa' }}>Korean (국문)</h2>

                <p style={{ marginBottom: '1.5rem', lineHeight: '1.8' }}>
                    본 사이트는 퀵텔의 공식 웹사이트가 아니며,
                    퀵텔 안테나 제품을 취급하는 공식 대리점이
                    고객 문의 및 제품 검색 편의를 위해 운영하는
                    독립적인 정보 제공 플랫폼입니다.
                </p>

                <p style={{ marginBottom: '1.5rem', lineHeight: '1.8' }}>
                    제품 상표 및 명칭에 대한 권리는 각 권리자에게 귀속됩니다.
                </p>

                <p style={{ marginBottom: '0', lineHeight: '1.8', color: '#94a3b8', fontSize: '0.95rem' }}>
                    ※ 본 페이지의 정보는 제조사가 공개한 자료를 기반으로
                    대리점 관점에서 정리된 참고용 정보입니다.
                    최종 사양 및 적용 가능 여부는 제조사 공식 문서를 기준으로 합니다.
                </p>
            </div>
        </div>
    );
}

export default Policy;
