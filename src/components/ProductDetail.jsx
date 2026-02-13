import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from './Navbar';
import Footer from './Footer';
import SEO from './SEO';
import antennasData from '../data/antennas.json';
import datasheetLinks from '../data/datasheetLinks';

function ProductDetail() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        const found = antennasData.find(p => p.id === productId);
        setProduct(found);
    }, [productId]);

    if (!product) {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
                    <Link to="/" className="text-blue-400 hover:text-blue-300">Return to Home</Link>
                </div>
            </div>
        );
    }

    const {
        name,
        description,
        imageUrl,
        specs,
        hasRealImage,
        category,
        subcategory
    } = product;

    // Construct SEO data
    const seoTitle = `${name} - Quectel ${subcategory || category} Antenna`;
    const seoDesc = `${description}. ${specs?.['Frequency range'] ? `Frequency: ${specs['Frequency range']}.` : ''} ${specs?.['Mounting type'] ? `Mounting: ${specs['Mounting type']}.` : ''} Get a quote or datasheet.`;
    const canonicalUrl = `https://quectel-antenna.com/product/${productId}`;

    // Product structured data for Google rich results
    const productJsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": name,
        "description": description,
        "brand": {
            "@type": "Brand",
            "name": "Quectel"
        },
        "category": `${category}${subcategory ? ' > ' + subcategory : ''}`,
        "url": canonicalUrl,
        ...(imageUrl ? { "image": imageUrl } : {}),
        ...(specs ? {
            "additionalProperty": Object.entries(specs).map(([key, value]) => ({
                "@type": "PropertyValue",
                "name": key,
                "value": value
            }))
        } : {})
    };

    return (
        <>
            <SEO
                title={seoTitle}
                description={seoDesc}
                url={canonicalUrl}
                image={imageUrl}
            />
            <Helmet>
                <script type="application/ld+json">
                    {JSON.stringify(productJsonLd)}
                </script>
            </Helmet>
            <Navbar />
            <div className="container" style={{ paddingTop: '100px', minHeight: 'calc(100vh - 200px)' }}>
                {/* Breadcrumbs */}
                <div className="breadcrumbs" style={{ marginBottom: '2rem', color: '#94a3b8', fontSize: '0.9rem' }}>
                    <Link to="/" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Home</Link>
                    <span style={{ margin: '0 0.5rem' }}>/</span>
                    <span style={{ color: '#3b82f6' }}>{name}</span>
                </div>

                <div className="product-detail-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: '3rem',
                    '@media (min-width: 768px)': { gridTemplateColumns: '1fr 1fr' }
                }}>
                    {/* Left Column: Image */}
                    <div className="product-image-container" style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '16px',
                        padding: '2rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                    }}>
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt={`Quectel ${name} ${subcategory || category} antenna product image`}
                                style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }}
                            />
                        ) : (
                            <div style={{ padding: '4rem', color: '#64748b' }}>No Image Available</div>
                        )}

                        {!hasRealImage && imageUrl && (
                            <div style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                background: 'rgba(59, 130, 246, 0.9)',
                                color: 'white',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '4px',
                                fontSize: '0.75rem',
                                fontWeight: '500'
                            }}>
                                Representative
                            </div>
                        )}
                    </div>

                    {/* Right Column: Details */}
                    <div className="product-info">
                        <div style={{ marginBottom: '0.5rem' }}>
                            <span style={{
                                background: 'rgba(59, 130, 246, 0.2)',
                                color: '#60a5fa',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '999px',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                marginRight: '0.5rem'
                            }}>
                                {category}
                            </span>
                            {subcategory && (
                                <span style={{
                                    background: 'rgba(148, 163, 184, 0.2)',
                                    color: '#cbd5e1',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '999px',
                                    fontSize: '0.75rem',
                                    fontWeight: '500'
                                }}>
                                    {subcategory}
                                </span>
                            )}
                        </div>

                        <h1 style={{
                            fontSize: '2.5rem',
                            fontWeight: '700',
                            margin: '0.5rem 0 1.5rem',
                            background: 'linear-gradient(to right, #fff, #94a3b8)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            {name}
                        </h1>

                        <p style={{
                            fontSize: '1.1rem',
                            lineHeight: '1.6',
                            color: '#cbd5e1',
                            marginBottom: '2rem'
                        }}>
                            {description}
                        </p>

                        <div className="action-buttons" style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
                            {datasheetLinks[productId] && (
                                <button
                                    onClick={() => window.open(atob(datasheetLinks[productId]), '_blank')}
                                    style={{
                                        flex: 1,
                                        padding: '1rem',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    <span>📄</span> Datasheet
                                </button>
                            )}
                            <button
                                onClick={() => navigate(`/inquiry?productId=${productId}`)}
                                style={{
                                    flex: 1,
                                    padding: '1rem',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <span>💬</span> Get a Quote / Inquiry
                            </button>
                        </div>

                        {/* Specs Table */}
                        {specs && (
                            <div className="specs-container">
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: 'white' }}>Technical Specifications</h3>
                                <div style={{
                                    background: 'rgba(30, 41, 59, 0.5)',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    border: '1px solid rgba(255, 255, 255, 0.1)'
                                }}>
                                    {Object.entries(specs).map(([key, value], index) => (
                                        <div key={key} style={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 2fr',
                                            padding: '1rem',
                                            background: index % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.03)',
                                            borderBottom: index === Object.entries(specs).length - 1 ? 'none' : '1px solid rgba(255, 255, 255, 0.05)'
                                        }}>
                                            <span style={{ color: '#94a3b8', fontWeight: '500' }}>{key}</span>
                                            <span style={{ color: 'white', fontWeight: '400' }}>{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default ProductDetail;
