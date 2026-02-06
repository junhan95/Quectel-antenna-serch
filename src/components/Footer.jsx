function Footer() {
    return (
        <footer style={{
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(10px)',
            padding: '2rem',
            marginTop: '4rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#94a3b8',
            textAlign: 'center'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '2rem',
                    marginBottom: '2rem',
                    textAlign: 'left'
                }}>
                    <div>
                        <h3 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.1rem' }}>
                            Quectel Antenna Search
                        </h3>
                        <p style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                            Find the perfect antenna for your IoT and wireless communication applications.
                        </p>
                    </div>

                    <div>
                        <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '1rem' }}>
                            Quick Links
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            <li style={{ marginBottom: '0.5rem' }}>
                                <a href="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                                    Home
                                </a>
                            </li>
                            <li style={{ marginBottom: '0.5rem' }}>
                                <a href="/admin" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                                    Admin Dashboard
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '1rem' }}>
                            Contact
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            <li style={{ marginBottom: '0.5rem' }}>
                                <a
                                    href="https://www.quectel.com/ko/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        color: '#94a3b8',
                                        textDecoration: 'none',
                                        transition: 'color 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.target.style.color = '#60a5fa'}
                                    onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
                                >
                                    Quectel Korea
                                </a>
                            </li>
                            <li style={{ marginBottom: '0.5rem' }}>
                                <a
                                    href="https://www.quectel.com/product-selector/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        color: '#94a3b8',
                                        textDecoration: 'none',
                                        transition: 'color 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.target.style.color = '#60a5fa'}
                                    onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
                                >
                                    Antenna Solutions
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div style={{
                    paddingTop: '1.5rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    fontSize: '0.85rem'
                }}>
                    <p>© {new Date().getFullYear()} Quectel Korea. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
