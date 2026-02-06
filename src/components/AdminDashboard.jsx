import { useState, useEffect } from 'react';
import ProductList from './ProductList';
import ProductEditor from './ProductEditor';
import Login from './Login';
import ChangePassword from './ChangePassword';
import InquiryList from './InquiryList';
import antennasData from '../data/antennas.json';
import '../admin.css';

function AdminDashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [products, setProducts] = useState([]);
    const [stats, setStats] = useState(null);
    const [view, setView] = useState('dashboard'); // 'dashboard', 'products', 'editor', 'inquiries'
    const [inquiries, setInquiries] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [showChangePassword, setShowChangePassword] = useState(false);

    const API_URL = 'http://localhost:3000/api';

    // Load products from local JSON
    const fetchProducts = async () => {
        try {
            setIsLoading(true);
            // Simulate async operation
            await new Promise(resolve => setTimeout(resolve, 100));
            setProducts(antennasData);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Calculate statistics from local data
    const fetchStats = async () => {
        try {
            const categories = new Set(products.map(p => p.category).filter(Boolean));
            const subcategories = new Set(products.map(p => p.subcategory).filter(Boolean));
            const withImages = products.filter(p => p.hasRealImage).length;

            setStats({
                totalProducts: products.length,
                totalCategories: categories.size,
                totalSubcategories: subcategories.size,
                withImages,
                withoutImages: products.length - withImages
            });
        } catch (err) {
            console.error('Error calculating stats:', err);
        }
    };

    // Fetch inquiries (disabled - requires backend API)
    const fetchInquiries = async () => {
        try {
            setIsLoading(true);
            // No backend API - set empty inquiries
            await new Promise(resolve => setTimeout(resolve, 100));
            setInquiries([]);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle delete single inquiry
    const handleDeleteInquiry = async (timestamp) => {
        try {
            const response = await fetch(`${API_URL}/inquiries/${timestamp}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete inquiry');
            await fetchInquiries(); // Refresh the list
        } catch (err) {
            setError(err.message);
        }
    };

    // Handle delete multiple inquiries
    const handleDeleteInquiries = async (timestamps) => {
        try {
            const response = await fetch(`${API_URL}/inquiries`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ timestamps })
            });
            if (!response.ok) throw new Error('Failed to delete inquiries');
            await fetchInquiries(); // Refresh the list
        } catch (err) {
            setError(err.message);
        }
    };

    // Check if user is already authenticated (from sessionStorage)
    useEffect(() => {
        const auth = sessionStorage.getItem('adminAuth');
        if (auth === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    // Fetch data when authenticated
    useEffect(() => {
        if (isAuthenticated) {
            fetchProducts();
            fetchStats();
            fetchInquiries();
        }
    }, [isAuthenticated]);

    // Handle login
    const handleLogin = () => {
        setIsAuthenticated(true);
        sessionStorage.setItem('adminAuth', 'true');
    };

    // Handle logout
    const handleLogout = () => {
        setIsAuthenticated(false);
        sessionStorage.removeItem('adminAuth');
    };

    // Handle product save (disabled - no backend)
    const handleSaveProduct = async (productData) => {
        alert('⚠️ Product editing is currently disabled.\n\nThis admin dashboard requires a backend API server to save changes.\nThe current deployment uses static JSON data.');
        throw new Error('Product editing disabled - no backend API');
    };

    // Handle product delete (disabled - no backend)
    const handleDeleteProduct = async (productId) => {
        alert('⚠️ Product deletion is currently disabled.\n\nThis admin dashboard requires a backend API server to delete products.\nThe current deployment uses static JSON data.');
    };

    // Handle export
    const handleExport = async () => {
        try {
            const response = await fetch(`${API_URL}/export`);
            const data = await response.json();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `antennas_export_${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            setError('Failed to export data');
        }
    };

    // Handle backup
    const handleBackup = async () => {
        try {
            const response = await fetch(`${API_URL}/backup`, { method: 'POST' });
            const data = await response.json();
            alert('Backup created successfully!');
        } catch (err) {
            setError('Failed to create backup');
        }
    };

    // Filter products
    const filteredProducts = products.filter(product => {
        const matchesSearch =
            product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.description || '').toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = filterCategory === 'All' || product.category === filterCategory;

        return matchesSearch && matchesCategory;
    });

    const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];

    // If not authenticated, show login page
    if (!isAuthenticated) {
        return <Login onLogin={handleLogin} />;
    }

    return (
        <div className="admin-container">
            {/* Header */}
            <header className="admin-header">
                <div>
                    <h1>🔧 Quectel Antenna Admin</h1>
                    <p>Product Management Dashboard</p>
                </div>
                <div className="admin-header-actions">
                    <button onClick={() => window.location.href = '/'} className="btn-secondary">
                        ← Back to Search
                    </button>
                    <button onClick={() => setShowChangePassword(true)} className="btn-secondary">
                        🔑 Change Password
                    </button>
                    <button onClick={handleLogout} className="btn-secondary">
                        🚪 Logout
                    </button>
                </div>
            </header>

            {/* Navigation */}
            <nav className="admin-nav">
                <button
                    className={view === 'dashboard' ? 'active' : ''}
                    onClick={() => setView('dashboard')}
                >
                    📊 Dashboard
                </button>
                <button
                    className={view === 'products' ? 'active' : ''}
                    onClick={() => setView('products')}
                >
                    📦 Products ({products.length})
                </button>
                <button
                    className={view === 'inquiries' ? 'active' : ''}
                    onClick={() => setView('inquiries')}
                >
                    📧 Inquiries
                </button>
            </nav>

            {/* Error Message */}
            {error && (
                <div className="error-message">
                    ⚠️ {error}
                    <button onClick={() => setError(null)}>×</button>
                </div>
            )}

            {/* Loading Overlay */}
            {isLoading && (
                <div className="loading-overlay">
                    <div className="spinner"></div>
                    <p>Loading...</p>
                </div>
            )}

            {/* Main Content */}
            <main className="admin-main">
                {view === 'dashboard' && (
                    <div className="dashboard-view">
                        <h2>Dashboard</h2>

                        {/* Statistics */}
                        {stats && (
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <div className="stat-value">{stats.totalProducts}</div>
                                    <div className="stat-label">Total Products</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-value">{stats.totalCategories}</div>
                                    <div className="stat-label">Categories</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-value">{stats.totalSubcategories}</div>
                                    <div className="stat-label">Subcategories</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-value">{stats.withImages}</div>
                                    <div className="stat-label">With Images</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-value">{stats.withoutImages}</div>
                                    <div className="stat-label">Without Images</div>
                                </div>
                            </div>
                        )}

                        {/* Quick Actions */}
                        <div className="quick-actions">
                            <h3>Quick Actions</h3>
                            <div className="action-buttons">
                                <button
                                    className="btn-primary"
                                    onClick={() => {
                                        setSelectedProduct(null);
                                        setView('editor');
                                    }}
                                >
                                    ➕ Add New Product
                                </button>
                                <button className="btn-secondary" onClick={handleExport}>
                                    📥 Export Data
                                </button>
                                <button className="btn-secondary" onClick={handleBackup}>
                                    💾 Create Backup
                                </button>
                                <button
                                    className="btn-secondary"
                                    onClick={() => setView('products')}
                                >
                                    📋 View All Products
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {view === 'products' && (
                    <ProductList
                        products={filteredProducts}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        filterCategory={filterCategory}
                        setFilterCategory={setFilterCategory}
                        categories={categories}
                        onEdit={(product) => {
                            setSelectedProduct(product);
                            setView('editor');
                        }}
                        onDelete={handleDeleteProduct}
                        onAddNew={() => {
                            setSelectedProduct(null);
                            setView('editor');
                        }}
                    />
                )}

                {view === 'editor' && (
                    <ProductEditor
                        product={selectedProduct}
                        onSave={handleSaveProduct}
                        onCancel={() => {
                            setSelectedProduct(null);
                            setView('products');
                        }}
                        apiUrl={API_URL}
                    />
                )}

                {view === 'inquiries' && (
                    <InquiryList
                        inquiries={inquiries}
                        onDelete={handleDeleteInquiry}
                        onDeleteMultiple={handleDeleteInquiries}
                    />
                )}
            </main>

            {/* Change Password Modal */}
            {showChangePassword && (
                <ChangePassword
                    onClose={() => setShowChangePassword(false)}
                    onSuccess={() => {
                        setShowChangePassword(false);
                        alert('Password changed successfully! Please login again with your new password.');
                        handleLogout();
                    }}
                />
            )}
        </div>
    );
}

export default AdminDashboard;
