import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
// import { Turnstile } from '@marsidev/react-turnstile'; // Removed due to React 19 compatibility issues
import Navbar from './Navbar';
import Footer from './Footer';
import antennasData from '../data/antennas.json';
import SEO from './SEO';

import { submitInquiry } from '../services/inquiryService';

function Inquiry() {
    const location = useLocation();
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [turnstileToken, setTurnstileToken] = useState(null);
    const [debugLog, setDebugLog] = useState([]);
    const turnstileRef = useRef(null);

    // Helper to add logs
    const addLog = (msg) => {
        const timestamp = new Date().toLocaleTimeString();
        setDebugLog(prev => [`[${timestamp}] ${msg}`, ...prev]);
    };

    useEffect(() => {
        addLog('Component mounted. Checking for Turnstile...');
        let currentWidgetId = null;

        // Global callback for Cloudflare Turnstile
        window.onTurnstileSuccess = (token) => {
            addLog('Turnstile success: ' + token.substring(0, 10) + '...');
            setTurnstileToken(token);
        };

        window.onTurnstileError = (err) => {
            addLog('Turnstile error: ' + JSON.stringify(err));
            console.error('Turnstile error:', err);
            setTurnstileToken(null);
        };

        window.onTurnstileExpired = () => {
            addLog('Turnstile expired');
            setTurnstileToken(null);
        };

        const renderTurnstile = () => {
            if (window.turnstile && turnstileRef.current) {
                // If we already have a widget ID for this effect instance, don't render again
                if (currentWidgetId) return;

                try {
                    addLog('Attempting to render Turnstile...');
                    const id = window.turnstile.render(turnstileRef.current, {
                        sitekey: '0x4AAAAAAACZedU2x9L3MleV-',
                        callback: 'onTurnstileSuccess',
                        'error-callback': 'onTurnstileError',
                        'expired-callback': 'onTurnstileExpired'
                    });
                    currentWidgetId = id;
                    addLog('Turnstile rendered with ID: ' + id);
                } catch (e) {
                    addLog('Turnstile render error: ' + e.message);
                    console.warn('Turnstile render error', e);
                }
            } else {
                addLog('window.turnstile not found or ref missing');
            }
        };

        // Attempt to render immediately
        if (window.turnstile) {
            renderTurnstile();
        } else {
            addLog('window.turnstile not ready. Waiting...');
            // Retry a few times if script is async loading
            let attempts = 0;
            const intervalId = setInterval(() => {
                attempts++;
                if (window.turnstile) {
                    clearInterval(intervalId);
                    renderTurnstile();
                } else if (attempts > 20) { // Stop after ~10 seconds
                    clearInterval(intervalId);
                    addLog('Turnstile script load timeout');
                }
            }, 500);

            return () => {
                clearInterval(intervalId);
                // Clean up widget if it was created in this interval
                if (currentWidgetId && window.turnstile) {
                    try {
                        window.turnstile.remove(currentWidgetId);
                    } catch (e) { }
                }
            };
        }

        return () => {
            // Cleanup widget when component unmounts
            if (currentWidgetId && window.turnstile) {
                try {
                    addLog('Cleaning up Turnstile widget: ' + currentWidgetId);
                    window.turnstile.remove(currentWidgetId);
                } catch (e) {
                    console.warn('Turnstile remove error', e);
                }
            }
        };
    }, []);

    // Auto-fill form from URL query params
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const productId = params.get('productId');

        if (productId) {
            const product = antennasData.find(p => p.id === productId);

            if (product) {
                // Auto-fill subject
                const subject = `${product.id} 제품에 대한 견적문의 드립니다.`;

                // Auto-fill message with product details
                let message = `제품명: ${product.name}\n`;
                message += `제품설명: ${product.description}\n\n`;
                message += `주요 스펙:\n`;

                if (product.specs) {
                    Object.entries(product.specs).slice(0, 5).forEach(([key, value]) => {
                        message += `- ${key}: ${value}\n`;
                    });
                }

                message += `\n문의 내용을 입력해주세요:\n`;

                setFormData(prev => ({
                    ...prev,
                    subject,
                    message
                }));
            }
        }
    }, [location.search]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            const params = new URLSearchParams(location.search);
            const productId = params.get('productId');

            await submitInquiry({
                ...formData,
                productId // Pass the productId from URL
            });

            setSubmitStatus('success');
            setFormData({
                name: '',
                company: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });
            setTurnstileToken(null);
            if (window.turnstile) {
                try {
                    window.turnstile.reset();
                } catch (e) { }
            }

        } catch (error) {
            console.error('Error submitting inquiry:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <SEO
                title="Product Inquiry"
                description="Submit an inquiry for Quectel antennas. Get a quote or technical support."
                url="https://quectel-antenna.com/#/inquiry"
            />
            <Navbar />
            <div className="container" style={{ paddingTop: '80px', minHeight: 'calc(100vh - 200px)' }}>
                <header className="header">
                    <h1 className="title">Product Inquiry</h1>
                    <p className="subtitle">Send us your questions and we'll get back to you soon</p>
                </header>

                <div style={{
                    maxWidth: '800px',
                    margin: '0 auto',
                    background: 'rgba(30, 41, 59, 0.5)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '2.5rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)'
                }}>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label htmlFor="subject" style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontWeight: '500' }}>
                                Subject *
                            </label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                className="search-input"
                                placeholder="Brief description of your inquiry"
                                style={{ maxWidth: '100%' }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            <div className="form-group">
                                <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontWeight: '500' }}>
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="search-input"
                                    placeholder="Your name"
                                    style={{ maxWidth: '100%' }}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="company" style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontWeight: '500' }}>
                                    Company
                                </label>
                                <input
                                    type="text"
                                    id="company"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    className="search-input"
                                    placeholder="Company name"
                                    style={{ maxWidth: '100%' }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            <div className="form-group">
                                <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontWeight: '500' }}>
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="search-input"
                                    placeholder="your.email@example.com"
                                    style={{ maxWidth: '100%' }}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone" style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontWeight: '500' }}>
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="search-input"
                                    placeholder="+82 10-1234-5678"
                                    style={{ maxWidth: '100%' }}
                                />
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: '2rem' }}>
                            <label htmlFor="message" style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontWeight: '500' }}>
                                Message *
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                className="search-input"
                                placeholder="Please provide details about your inquiry..."
                                rows="8"
                                style={{ resize: 'vertical', minHeight: '150px', maxWidth: '100%' }}
                            />
                        </div>

                        {submitStatus === 'success' && (
                            <div style={{
                                background: 'rgba(34, 197, 94, 0.1)',
                                border: '1px solid rgba(34, 197, 94, 0.3)',
                                color: '#4ade80',
                                padding: '1rem',
                                borderRadius: '8px',
                                marginBottom: '1.5rem',
                                textAlign: 'center'
                            }}>
                                ✓ Your inquiry has been submitted successfully!
                            </div>
                        )}

                        {submitStatus === 'error' && (
                            <div style={{
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                color: '#f87171',
                                padding: '1rem',
                                borderRadius: '8px',
                                marginBottom: '1.5rem',
                                textAlign: 'center'
                            }}>
                                ✗ Failed to submit inquiry. Please try again.
                            </div>
                        )}

                        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center', minHeight: '65px' }}>
                            <div
                                ref={turnstileRef}
                                className="cf-turnstile"
                            // data-sitekey="0x4AAAAAAACZedU2x9L3MleV-" // Removing data attrs to rely on manual render in debug mode
                            ></div>
                        </div>

                        {/* Debug Log Box */}
                        <div style={{
                            marginTop: '1rem',
                            padding: '1rem',
                            background: '#000',
                            color: '#0f0',
                            fontSize: '0.8rem',
                            fontFamily: 'monospace',
                            borderRadius: '5px',
                            maxHeight: '150px',
                            overflowY: 'auto',
                            border: '1px solid #333'
                        }}>
                            <strong>Debug Log (Take a screenshot if widget is missing):</strong>
                            {debugLog.map((log, i) => <div key={i}>{log}</div>)}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || !turnstileToken}
                            style={{
                                width: '100%',
                                padding: '1rem 2rem',
                                background: isSubmitting || !turnstileToken ? '#64748b' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                cursor: isSubmitting || !turnstileToken ? 'not-allowed' : 'pointer',
                                transition: 'all 0.3s',
                                boxShadow: isSubmitting || !turnstileToken ? 'none' : '0 4px 15px rgba(102, 126, 234, 0.4)'
                            }}
                            onMouseEnter={(e) => {
                                if (!isSubmitting && turnstileToken) {
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = isSubmitting || !turnstileToken ? 'none' : '0 4px 15px rgba(102, 126, 234, 0.4)';
                            }}
                        >
                            {isSubmitting ? 'Submitting...' : '📝 Submit Inquiry'}
                        </button>
                    </form>

                    <div style={{
                        marginTop: '2rem',
                        padding: '1.5rem',
                        background: 'rgba(59, 130, 246, 0.1)',
                        borderRadius: '12px',
                        border: '1px solid rgba(59, 130, 246, 0.2)'
                    }}>
                        <h3 style={{ color: '#60a5fa', marginTop: 0, marginBottom: '1rem', fontSize: '1.1rem' }}>
                            📞 Contact Information
                        </h3>
                        <p style={{ color: '#cbd5e1', margin: '0.5rem 0', fontSize: '0.95rem' }}>
                            <strong>Email:</strong> junhanpark95@gmail.com
                        </p>
                        <p style={{ color: '#94a3b8', margin: '0.5rem 0', fontSize: '0.85rem' }}>
                            We typically respond within 24 hours during business days.
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Inquiry;
