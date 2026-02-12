import { useState, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import antennasData from '../data/antennas.json'
import datasheetLinks from '../data/datasheetLinks'
import { frequencyBands, getBandFrequencyRanges, parseAntennaFrequencyRange, antennaSupportsFrequency } from '../data/frequencyBands'
import FrequencyDropdown from './FrequencyDropdown'
import SelectedBandsTags from './SelectedBandsTags'
import Navbar from './Navbar'
import Footer from './Footer'

import SEO from './SEO'

function SearchApp() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('simple');
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [selectedSubcategories, setSelectedSubcategories] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

    // Detailed Search States - Band Selection
    const [selectedBands, setSelectedBands] = useState({
        '5G NR': [],
        '4G LTE': [],
        'NB-IoT': [],
        'WiFi': [],
        'GPS': []
    })

    // Handle inquiry button click
    const handleInquiryClick = (antenna) => {
        navigate(`/inquiry?productId=${encodeURIComponent(antenna.id)}`);
    };

    // Extract unique categories
    const categories = useMemo(() => {
        const cats = new Set(antennasData.map(a => a.category || 'Unknown'))
        const uniqueCats = Array.from(cats).filter(c => c !== 'Unknown')

        const priorityOrder = ['Embedded antennas', 'External antennas', 'Evaluation Boards', 'Cables']

        const sortedCats = uniqueCats.sort((a, b) => {
            const indexA = priorityOrder.indexOf(a)
            const indexB = priorityOrder.indexOf(b)

            // Both in priority list: sort by priority index
            if (indexA !== -1 && indexB !== -1) return indexA - indexB
            // Only A in priority list: A comes first
            if (indexA !== -1) return -1
            // Only B in priority list: B comes first
            if (indexB !== -1) return 1
            // Neither in priority list: sort alphabetically
            return a.localeCompare(b)
        })

        return ['All', ...sortedCats]
    }, [])

    // Extract unique subcategories for filters (excluding 'All')
    const subcategories = useMemo(() => {
        const subcats = new Set(antennasData.map(a => a.subcategory || 'Unknown'))
        return Array.from(subcats).filter(s => s !== 'Unknown').sort()
    }, [])

    // Toggle subcategory selection
    const toggleSubcategory = (subcat) => {
        setSelectedSubcategories(prev => {
            if (prev.includes(subcat)) {
                return prev.filter(s => s !== subcat)
            } else {
                return [...prev, subcat]
            }
        })
        setCurrentPage(1); // Reset to first page when filter changes
    }

    // Handle band selection change for a category
    const handleBandSelectionChange = (category, bands) => {
        setSelectedBands(prev => ({
            ...prev,
            [category]: bands
        }))
        setCurrentPage(1)
    }

    // Remove a single band
    const handleRemoveBand = (category, band) => {
        setSelectedBands(prev => ({
            ...prev,
            [category]: prev[category].filter(b => b !== band)
        }))
        setCurrentPage(1)
    }

    // Clear all selected bands
    const handleClearAllBands = () => {
        setSelectedBands({
            '5G NR': [],
            '4G LTE': [],
            'NB-IoT': [],
            'WiFi': [],
            'GPS': []
        })
        setCurrentPage(1)
    }

    // Check if any bands are selected
    const hasSelectedBands = Object.values(selectedBands).some(bands => bands.length > 0)

    const filteredAntennas = useMemo(() => {
        return antennasData.filter(antenna => {
            const matchesCategory = selectedCategory === 'All' || antenna.category === selectedCategory;

            if (activeTab === 'simple') {
                const matchesSearch =
                    antenna.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    antenna.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    antenna.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (antenna.specs?.['Frequency range'] || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (antenna.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

                const matchesSubcategory = selectedSubcategories.length === 0 ||
                    selectedSubcategories.includes(antenna.subcategory);
                return matchesSearch && matchesSubcategory && matchesCategory;
            } else {
                // Detailed Search: Check if antenna supports all selected bands
                if (!hasSelectedBands) {
                    return matchesCategory; // No bands selected, show all
                }

                const antennaFreqStr = antenna.specs?.['Frequency range'] || ''
                const antennaRanges = parseAntennaFrequencyRange(antennaFreqStr)

                if (antennaRanges.length === 0) return false

                // Check each category's selected bands
                for (const [category, bands] of Object.entries(selectedBands)) {
                    if (bands.length === 0) continue

                    const categoryBands = frequencyBands[category] || []

                    for (const bandName of bands) {
                        const bandData = categoryBands.find(b => b.band === bandName)
                        if (!bandData) continue

                        const bandRanges = getBandFrequencyRanges(bandData)
                        if (!antennaSupportsFrequency(antennaRanges, bandRanges)) {
                            return false // Antenna doesn't support this band
                        }
                    }
                }

                return matchesCategory
            }
        })
    }, [activeTab, searchTerm, selectedSubcategories, selectedCategory, selectedBands, hasSelectedBands])

    // Pagination
    const totalPages = Math.ceil(filteredAntennas.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentAntennas = filteredAntennas.slice(startIndex, endIndex);

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 10;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 6) {
                for (let i = 1; i <= 8; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 5) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 7; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 2; i <= currentPage + 2; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
        }
        return pages;
    };

    // Reset to page 1 when filters change
    const handleCategoryChange = (cat) => {
        setSelectedCategory(cat);
        setCurrentPage(1);
    };

    const handleSearchChange = (value) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    // Handle page change with scroll to top
    const handlePageChange = (page) => {
        setCurrentPage(page);
        // Scroll to show "Found X antennas" text at the top (container padding-top is 80px)
        window.scrollTo(0, 80);
    };

    return (
        <>
            <SEO />
            <Navbar />
            <div className="container" style={{ paddingTop: '80px' }}>
                <header className="header">
                    <h1 className="title">Quectel Antenna Search</h1>
                    <p className="subtitle">Find the perfect antenna for your application</p>
                </header>

                {/* 1. Search Bar (Simple Mode) */}
                {activeTab === 'simple' && (
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search by model, frequency, tags, or specifications..."
                            className="search-input glass"
                            value={searchTerm}
                            onChange={(e) => handleSearchChange(e.target.value)}
                        />
                    </div>
                )}

                {/* 2. Category Filter (Always visible) */}
                <div style={{ marginBottom: '1rem' }}>
                    <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: '500' }}>Category</div>
                    <div className="filters">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`filter-badge ${selectedCategory === cat ? 'active' : ''}`}
                                onClick={() => handleCategoryChange(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 3. Subcategory (Simple Mode) */}
                {activeTab === 'simple' && (
                    <div>
                        <div style={{
                            color: '#94a3b8',
                            fontSize: '0.875rem',
                            marginBottom: '0.5rem',
                            fontWeight: '500',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <span>Subcategory (Multi-select)</span>
                            {selectedSubcategories.length > 0 && (
                                <button
                                    onClick={() => {
                                        setSelectedSubcategories([]);
                                        setCurrentPage(1);
                                    }}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#60a5fa',
                                        fontSize: '0.75rem',
                                        cursor: 'pointer',
                                        textDecoration: 'underline'
                                    }}
                                >
                                    Clear all ({selectedSubcategories.length})
                                </button>
                            )}
                        </div>
                        <div className="filters">
                            {subcategories.map(subcat => (
                                <button
                                    key={subcat}
                                    className={`filter-badge ${selectedSubcategories.includes(subcat) ? 'active' : ''}`}
                                    onClick={() => toggleSubcategory(subcat)}
                                >
                                    {subcat}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* 4. Tabs */}
                <div className="tabs">
                    <button
                        className={`tab-btn ${activeTab === 'simple' ? 'active' : ''}`}
                        onClick={() => setActiveTab('simple')}
                    >
                        Simple Search
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'detailed' ? 'active' : ''}`}
                        onClick={() => setActiveTab('detailed')}
                    >
                        Detailed Search
                    </button>
                </div>

                {/* 5. Detailed Search - Frequency Band Selection */}
                {activeTab === 'detailed' && (
                    <div className="detailed-search glass-card" style={{ padding: '1.5rem', marginBottom: '10rem' }}>
                        <div className="detailed-search-header">Select frequency bands to filter antennas (AND logic)</div>
                        <div className="frequency-dropdowns-container">
                            {Object.keys(frequencyBands).map(category => (
                                <FrequencyDropdown
                                    key={category}
                                    category={category}
                                    bands={frequencyBands[category]}
                                    selectedBands={selectedBands[category]}
                                    onSelectionChange={(bands) => handleBandSelectionChange(category, bands)}
                                />
                            ))}
                        </div>
                        <SelectedBandsTags
                            selections={selectedBands}
                            onRemove={handleRemoveBand}
                            onClearAll={handleClearAllBands}
                        />
                    </div>
                )}

                {/* Results */}
                <div style={{
                    marginBottom: '1rem',
                    color: '#cbd5e1',
                    fontSize: '0.9rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        Found {filteredAntennas.length} antenna{filteredAntennas.length !== 1 ? 's' : ''}
                        {filteredAntennas.length > 0 && (
                            <span style={{ marginLeft: '1rem', opacity: 0.7 }}>
                                (Showing {startIndex + 1}-{Math.min(endIndex, filteredAntennas.length)})
                            </span>
                        )}
                    </div>

                    {/* View Mode Toggle */}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            onClick={() => setViewMode('grid')}
                            style={{
                                padding: '0.5rem',
                                background: viewMode === 'grid' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                                border: viewMode === 'grid' ? '2px solid #3b82f6' : '2px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                width: '36px',
                                height: '36px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            title="Grid View"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={viewMode === 'grid' ? '#3b82f6' : '#cbd5e1'} strokeWidth="2">
                                <rect x="3" y="3" width="7" height="7" />
                                <rect x="14" y="3" width="7" height="7" />
                                <rect x="3" y="14" width="7" height="7" />
                                <rect x="14" y="14" width="7" height="7" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            style={{
                                padding: '0.5rem',
                                background: viewMode === 'list' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                                border: viewMode === 'list' ? '2px solid #3b82f6' : '2px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                width: '36px',
                                height: '36px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            title="List View"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={viewMode === 'list' ? '#3b82f6' : '#cbd5e1'} strokeWidth="2">
                                <line x1="8" y1="6" x2="21" y2="6" />
                                <line x1="8" y1="12" x2="21" y2="12" />
                                <line x1="8" y1="18" x2="21" y2="18" />
                                <line x1="3" y1="6" x2="3.01" y2="6" />
                                <line x1="3" y1="12" x2="3.01" y2="12" />
                                <line x1="3" y1="18" x2="3.01" y2="18" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className={viewMode === 'grid' ? 'grid' : 'list-view'}>
                    {currentAntennas.map(antenna => (
                        <div key={antenna.id} className="glass-card">
                            {antenna.imageUrl && (
                                <Link to={`/product/${antenna.id}`} style={{ display: 'block', textDecoration: 'none' }}>
                                    <div style={{
                                        width: '100%',
                                        height: '200px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        borderRadius: '12px 12px 0 0',
                                        overflow: 'hidden',
                                        position: 'relative'
                                    }}>
                                        <img
                                            src={antenna.imageUrl}
                                            alt={antenna.name}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                            style={{
                                                maxWidth: '100%',
                                                maxHeight: '100%',
                                                objectFit: 'contain',
                                                padding: '1rem'
                                            }}
                                        />
                                        {!antenna.hasRealImage && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '0.5rem',
                                                right: '0.5rem',
                                                background: 'rgba(59, 130, 246, 0.9)',
                                                color: 'white',
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '4px',
                                                fontSize: '0.7rem',
                                                fontWeight: '500'
                                            }}>
                                                Representative
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            )}
                            <div className="card-content">
                                <Link to={`/product/${antenna.id}`} style={{ textDecoration: 'none' }}>
                                    <h3 className="card-title" style={{ cursor: 'pointer', display: 'inline-block' }}>{antenna.name}</h3>
                                </Link>
                                <p className="card-desc">{antenna.description}</p>
                                <div className="specs-list" style={{ background: 'transparent', padding: 0 }}>
                                    {viewMode === 'grid' ? (
                                        // Grid View: Basic Info
                                        (() => {
                                            const basicKeys = ['Frequency range', 'Efficiency', 'Peak gain', 'Mounting type', 'Dimensions'];
                                            if (!antenna.specs) return null;
                                            return basicKeys.map(key => {
                                                const value = antenna.specs[key];
                                                if (!value) return null;
                                                return (
                                                    <div key={key} className="spec-item">
                                                        <span className="spec-label">{key}:</span>
                                                        <span className="spec-value">{value}</span>
                                                    </div>
                                                );
                                            });
                                        })()
                                    ) : (
                                        // List View: Detailed Info
                                        (() => {
                                            const electricalKeys = ['Frequency range', 'Efficiency', 'Peak gain', 'Radiation pattern', 'Polarization', 'VSWR', 'Impedance'];

                                            const electrical = [];
                                            const mechanical = [];

                                            if (antenna.specs) {
                                                Object.entries(antenna.specs).forEach(([key, value]) => {
                                                    if (electricalKeys.includes(key)) {
                                                        electrical.push({ key, value });
                                                    } else {
                                                        mechanical.push({ key, value });
                                                    }
                                                });
                                            }

                                            return (
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                                    {electrical.length > 0 && (
                                                        <div>
                                                            <h4 className="spec-section-title">Electrical data</h4>
                                                            {electrical.map(({ key, value }) => (
                                                                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                                                    <span style={{ color: '#94a3b8', fontWeight: '500' }}>{key}</span>
                                                                    <span style={{ color: 'white', fontWeight: '600' }}>{value}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {mechanical.length > 0 && (
                                                        <div>
                                                            <h4 className="spec-section-title">Mechanical data</h4>
                                                            {mechanical.map(({ key, value }) => (
                                                                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                                                    <span style={{ color: '#94a3b8', fontWeight: '500' }}>{key}</span>
                                                                    <span style={{ color: 'white', fontWeight: '600' }}>{value}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })()
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div style={{ marginTop: 'auto', alignSelf: 'flex-end', display: 'flex', gap: '0.5rem' }}>
                                    {/* Datasheet Button */}
                                    {datasheetLinks[antenna.id] && (
                                        <button
                                            onClick={() => window.open(datasheetLinks[antenna.id], '_blank')}
                                            title="Datasheet"
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                padding: '0',
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                border: 'none',
                                                borderRadius: '50%',
                                                color: 'white',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transition: 'all 0.3s',
                                                boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.5)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)';
                                            }}
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                                <polyline points="14 2 14 8 20 8" />
                                                <line x1="16" y1="13" x2="8" y2="13" />
                                                <line x1="16" y1="17" x2="8" y2="17" />
                                                <polyline points="10 9 9 9 8 9" />
                                            </svg>
                                        </button>
                                    )}
                                    {/* Inquiry Button */}
                                    <button
                                        onClick={() => handleInquiryClick(antenna)}
                                        title="Inquiry"
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            padding: '0',
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            border: 'none',
                                            borderRadius: '50%',
                                            color: 'white',
                                            fontSize: '0.9rem',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.3s',
                                            boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.5)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)';
                                        }}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                            <polyline points="22,6 12,13 2,6" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="pagination-container">
                        <button
                            className="pagination-btn"
                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                        >
                            Prev
                        </button>

                        {getPageNumbers().map((page, index) => (
                            page === '...' ? (
                                <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>
                            ) : (
                                <button
                                    key={page}
                                    className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                                    onClick={() => handlePageChange(page)}
                                >
                                    {page}
                                </button>
                            )
                        ))}

                        <button
                            className="pagination-btn"
                            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
            <Footer />
        </>
    )
}

export default SearchApp
