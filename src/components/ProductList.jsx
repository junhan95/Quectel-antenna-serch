import { useState } from 'react';

function ProductList({
    products,
    searchTerm,
    setSearchTerm,
    filterCategory,
    setFilterCategory,
    categories,
    onEdit,
    onDelete,
    onAddNew
}) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    // Pagination
    const totalPages = Math.ceil(products.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProducts = products.slice(startIndex, endIndex);

    return (
        <div className="product-list-view">
            <div className="product-list-header">
                <h2>Products ({products.length})</h2>
                <button className="btn-primary" onClick={onAddNew}>
                    ➕ Add New Product
                </button>
            </div>

            {/* Filters */}
            <div className="product-filters">
                <input
                    type="text"
                    placeholder="Search by ID, name, or description..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="search-input-admin"
                />
                <select
                    value={filterCategory}
                    onChange={(e) => {
                        setFilterCategory(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="filter-select"
                >
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            {/* Product Table */}
            <div className="product-table-container">
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Subcategory</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProducts.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                                    No products found
                                </td>
                            </tr>
                        ) : (
                            currentProducts.map(product => (
                                <tr key={product.id}>
                                    <td>
                                        <div className="product-thumbnail">
                                            {product.imageUrl ? (
                                                <img
                                                    src={product.imageUrl}
                                                    alt={product.name}
                                                    onError={(e) => {
                                                        e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><rect fill="%23ddd"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999">No Image</text></svg>';
                                                    }}
                                                />
                                            ) : (
                                                <div className="no-image">📷</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="product-id">{product.id}</td>
                                    <td>
                                        <div className="product-name">{product.name}</div>
                                        <div className="product-desc">{product.description?.substring(0, 60)}...</div>
                                    </td>
                                    <td>{product.category || '-'}</td>
                                    <td>{product.subcategory || '-'}</td>
                                    <td>
                                        <div className="action-buttons-cell">
                                            <button
                                                className="btn-icon btn-edit"
                                                onClick={() => onEdit(product)}
                                                title="Edit"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className="btn-icon btn-delete"
                                                onClick={() => onDelete(product.id)}
                                                title="Delete"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                    >
                        ← Previous
                    </button>
                    <span className="pagination-info">
                        Page {currentPage} of {totalPages}
                        <span className="pagination-range">
                            (Showing {startIndex + 1}-{Math.min(endIndex, products.length)} of {products.length})
                        </span>
                    </span>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                    >
                        Next →
                    </button>
                </div>
            )}
        </div>
    );
}

export default ProductList;
