import { useState, useEffect } from 'react';
import ProductList from './ProductList';
import ProductEditor from './ProductEditor';
import Login from './Login';
import ChangePassword from './ChangePassword';
import InquiryList from './InquiryList';
import { isSupabaseConfigured } from '../lib/supabase';
import * as productService from '../services/productService';
import * as inquiryService from '../services/inquiryService';
import '../admin.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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
    const [supabaseEnabled, setSupabaseEnabled] = useState(false);

    // Check Supabase configuration on mount
    useEffect(() => {
        setSupabaseEnabled(isSupabaseConfigured());
    }, []);

    // Load products from Supabase or local JSON
    const fetchProducts = async () => {
        try {
            setIsLoading(true);
            const data = await productService.getProducts();
            setProducts(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Calculate statistics
    const fetchStats = async () => {
        try {
            const statsData = await productService.getProductStats();
            setStats(statsData);
        } catch (err) {
            console.error('Error calculating stats:', err);
        }
    };

    // Fetch inquiries from Supabase
    const fetchInquiries = async () => {
        try {
            setIsLoading(true);
            const data = await inquiryService.getInquiries();
            setInquiries(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle delete single inquiry
    const handleDeleteInquiry = async (id) => {
        if (!supabaseEnabled) {
            alert('⚠️ Supabase not configured. Cannot delete inquiries.');
            return;
        }
        try {
            await inquiryService.deleteInquiry(id);
            await fetchInquiries();
        } catch (err) {
            setError(err.message);
        }
    };

    // Handle delete multiple inquiries
    const handleDeleteInquiries = async (ids) => {
        if (!supabaseEnabled) {
            alert('⚠️ Supabase not configured. Cannot delete inquiries.');
            return;
        }
        try {
            await inquiryService.deleteInquiries(ids);
            await fetchInquiries();
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

    // Handle product save
    const handleSaveProduct = async (productData) => {
        if (!supabaseEnabled) {
            alert('⚠️ Supabase not configured. Cannot save products.');
            throw new Error('Supabase not configured');
        }
        try {
            setIsLoading(true);
            console.log('Saving product:', productData);
            if (selectedProduct) {
                await productService.updateProduct(selectedProduct.id, productData);
            } else {
                await productService.createProduct(productData);
            }
            await fetchProducts();
            await fetchStats();
            setView('products');
            setSelectedProduct(null);
            setError(null);
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Handle product delete
    const handleDeleteProduct = async (productId) => {
        if (!supabaseEnabled) {
            alert('⚠️ Supabase not configured. Cannot delete products.');
            return;
        }
        if (!confirm(`Are you sure you want to delete product ${productId}?`)) {
            return;
        }
        try {
            setIsLoading(true);
            await productService.deleteProduct(productId);
            await fetchProducts();
            await fetchStats();
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle export
    const handleExport = async () => {
        try {
            const data = await productService.getProducts();
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
                    <button onClick={() => window.location.href = window.location.pathname + '#/'} className="btn-secondary">
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
                                        console.log('Adding new product from Dashboard');
                                        setSelectedProduct(null);
                                        setView('editor');
                                        window.scrollTo(0, 0);
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
                            console.log('Adding new product from List');
                            setSelectedProduct(null);
                            setView('editor');
                            window.scrollTo(0, 0);
                        }}
                    />
                )}

                {view === 'editor' && (
                    <ProductEditor
                        key={selectedProduct ? selectedProduct.id : 'new'}
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
