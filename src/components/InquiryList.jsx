import { useState } from 'react';

function InquiryList({ inquiries, onDelete, onDeleteMultiple }) {
    const [sortColumn, setSortColumn] = useState('timestamp');
    const [sortDirection, setSortDirection] = useState('desc');
    const [selectedInquiries, setSelectedInquiries] = useState([]);
    const [detailView, setDetailView] = useState(null);

    if (!inquiries || inquiries.length === 0) {
        return (
            <div className="card-content" style={{ textAlign: 'center', padding: '3rem' }}>
                <p style={{ color: '#cbd5e1' }}>No inquiries found.</p>
            </div>
        );
    }

    // Sorting logic
    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const sortedInquiries = [...inquiries].sort((a, b) => {
        let aVal, bVal;

        switch (sortColumn) {
            case 'timestamp':
                aVal = new Date(a.timestamp);
                bVal = new Date(b.timestamp);
                break;
            case 'name':
                aVal = a.name.toLowerCase();
                bVal = b.name.toLowerCase();
                break;
            case 'company':
                aVal = (a.company || '').toLowerCase();
                bVal = (b.company || '').toLowerCase();
                break;
            case 'email':
                aVal = a.email.toLowerCase();
                bVal = b.email.toLowerCase();
                break;
            case 'subject':
                aVal = a.subject.toLowerCase();
                bVal = b.subject.toLowerCase();
                break;
            default:
                return 0;
        }

        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    // Selection logic
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedInquiries(inquiries.map(inq => inq.timestamp));
        } else {
            setSelectedInquiries([]);
        }
    };

    const handleSelectOne = (timestamp) => {
        if (selectedInquiries.includes(timestamp)) {
            setSelectedInquiries(selectedInquiries.filter(t => t !== timestamp));
        } else {
            setSelectedInquiries([...selectedInquiries, timestamp]);
        }
    };

    // Delete handlers
    const handleDeleteSelected = async () => {
        if (selectedInquiries.length === 0) return;

        if (confirm(`Delete ${selectedInquiries.length} selected inquiry(ies)?`)) {
            await onDeleteMultiple(selectedInquiries);
            setSelectedInquiries([]);
        }
    };

    const handleDeleteAll = async () => {
        if (confirm(`Delete all ${inquiries.length} inquiries? This cannot be undone.`)) {
            await onDeleteMultiple([]);
            setSelectedInquiries([]);
        }
    };

    const handleDeleteOne = async (timestamp) => {
        if (confirm('Delete this inquiry?')) {
            await onDelete(timestamp);
        }
    };

    // Sort indicator
    const SortIndicator = ({ column }) => {
        if (sortColumn !== column) return <span style={{ opacity: 0.3 }}>↕</span>;
        return <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>;
    };

    // Table header style
    const thStyle = {
        padding: '1rem',
        color: '#94a3b8',
        cursor: 'pointer',
        userSelect: 'none',
        transition: 'color 0.2s'
    };

    return (
        <div className="inquiry-list">
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
            }}>
                <h2 style={{ margin: 0, color: '#e2e8f0' }}>
                    Inquiries ({inquiries.length})
                </h2>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {selectedInquiries.length > 0 && (
                        <button
                            onClick={handleDeleteSelected}
                            style={{
                                padding: '0.5rem 1rem',
                                background: '#dc2626',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.9rem'
                            }}
                        >
                            🗑️ Delete Selected ({selectedInquiries.length})
                        </button>
                    )}
                    <button
                        onClick={handleDeleteAll}
                        style={{
                            padding: '0.5rem 1rem',
                            background: '#991b1b',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.9rem'
                        }}
                    >
                        🗑️ Delete All
                    </button>
                </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: '#cbd5e1' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'left' }}>
                            <th style={{ padding: '1rem', width: '40px' }}>
                                <input
                                    type="checkbox"
                                    checked={selectedInquiries.length === inquiries.length}
                                    onChange={handleSelectAll}
                                    style={{ cursor: 'pointer' }}
                                />
                            </th>
                            <th style={thStyle} onClick={() => handleSort('timestamp')}>
                                Date <SortIndicator column="timestamp" />
                            </th>
                            <th style={thStyle} onClick={() => handleSort('name')}>
                                Name <SortIndicator column="name" />
                            </th>
                            <th style={thStyle} onClick={() => handleSort('company')}>
                                Company <SortIndicator column="company" />
                            </th>
                            <th style={thStyle} onClick={() => handleSort('email')}>
                                Contact <SortIndicator column="email" />
                            </th>
                            <th style={thStyle} onClick={() => handleSort('subject')}>
                                Subject <SortIndicator column="subject" />
                            </th>
                            <th style={{ padding: '1rem', color: '#94a3b8' }}>Message</th>
                            <th style={{ padding: '1rem', color: '#94a3b8', width: '80px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedInquiries.map((inquiry) => (
                            <tr
                                key={inquiry.timestamp}
                                style={{
                                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                                    background: selectedInquiries.includes(inquiry.timestamp)
                                        ? 'rgba(59, 130, 246, 0.1)'
                                        : 'transparent'
                                }}
                            >
                                <td style={{ padding: '1rem' }}>
                                    <input
                                        type="checkbox"
                                        checked={selectedInquiries.includes(inquiry.timestamp)}
                                        onChange={() => handleSelectOne(inquiry.timestamp)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                </td>
                                <td
                                    style={{ padding: '1rem', whiteSpace: 'nowrap', cursor: 'pointer' }}
                                    onClick={() => setDetailView(inquiry)}
                                >
                                    {new Date(inquiry.timestamp).toLocaleString()}
                                </td>
                                <td
                                    style={{ padding: '1rem', cursor: 'pointer' }}
                                    onClick={() => setDetailView(inquiry)}
                                >
                                    {inquiry.name}
                                </td>
                                <td
                                    style={{ padding: '1rem', cursor: 'pointer' }}
                                    onClick={() => setDetailView(inquiry)}
                                >
                                    {inquiry.company || '-'}
                                </td>
                                <td
                                    style={{ padding: '1rem', cursor: 'pointer' }}
                                    onClick={() => setDetailView(inquiry)}
                                >
                                    <div style={{ fontSize: '0.9rem' }}>{inquiry.email}</div>
                                    <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                                        {inquiry.phone || '-'}
                                    </div>
                                </td>
                                <td
                                    style={{ padding: '1rem', fontWeight: '500', color: '#e2e8f0', cursor: 'pointer' }}
                                    onClick={() => setDetailView(inquiry)}
                                >
                                    {inquiry.subject}
                                </td>
                                <td
                                    style={{ padding: '1rem', maxWidth: '300px', cursor: 'pointer' }}
                                    onClick={() => setDetailView(inquiry)}
                                >
                                    <div style={{
                                        maxHeight: '100px',
                                        overflowY: 'auto',
                                        fontSize: '0.9rem',
                                        lineHeight: '1.5',
                                        whiteSpace: 'pre-wrap'
                                    }}>
                                        {inquiry.message}
                                    </div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteOne(inquiry.timestamp);
                                        }}
                                        style={{
                                            padding: '0.4rem 0.8rem',
                                            background: '#dc2626',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontSize: '0.85rem'
                                        }}
                                    >
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Detail View Modal */}
            {detailView && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: '2rem'
                    }}
                    onClick={() => setDetailView(null)}
                >
                    <div
                        style={{
                            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                            borderRadius: '12px',
                            padding: '2rem',
                            maxWidth: '600px',
                            width: '100%',
                            maxHeight: '80vh',
                            overflowY: 'auto',
                            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '1.5rem',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                            paddingBottom: '1rem'
                        }}>
                            <h2 style={{ margin: 0, color: '#e2e8f0' }}>Inquiry Details</h2>
                            <button
                                onClick={() => setDetailView(null)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#94a3b8',
                                    fontSize: '1.5rem',
                                    cursor: 'pointer',
                                    padding: '0.25rem 0.5rem'
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        <div style={{ color: '#cbd5e1', lineHeight: '1.8' }}>
                            <div style={{ marginBottom: '1rem' }}>
                                <strong style={{ color: '#94a3b8' }}>Date:</strong>
                                <div style={{ marginTop: '0.25rem' }}>
                                    {new Date(detailView.timestamp).toLocaleString()}
                                </div>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <strong style={{ color: '#94a3b8' }}>Name:</strong>
                                <div style={{ marginTop: '0.25rem' }}>{detailView.name}</div>
                            </div>

                            {detailView.company && (
                                <div style={{ marginBottom: '1rem' }}>
                                    <strong style={{ color: '#94a3b8' }}>Company:</strong>
                                    <div style={{ marginTop: '0.25rem' }}>{detailView.company}</div>
                                </div>
                            )}

                            <div style={{ marginBottom: '1rem' }}>
                                <strong style={{ color: '#94a3b8' }}>Email:</strong>
                                <div style={{ marginTop: '0.25rem' }}>{detailView.email}</div>
                            </div>

                            {detailView.phone && (
                                <div style={{ marginBottom: '1rem' }}>
                                    <strong style={{ color: '#94a3b8' }}>Phone:</strong>
                                    <div style={{ marginTop: '0.25rem' }}>{detailView.phone}</div>
                                </div>
                            )}

                            <div style={{ marginBottom: '1rem' }}>
                                <strong style={{ color: '#94a3b8' }}>Subject:</strong>
                                <div style={{ marginTop: '0.25rem', fontWeight: '500', color: '#e2e8f0' }}>
                                    {detailView.subject}
                                </div>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <strong style={{ color: '#94a3b8' }}>Message:</strong>
                                <div style={{
                                    marginTop: '0.5rem',
                                    padding: '1rem',
                                    background: 'rgba(0, 0, 0, 0.3)',
                                    borderRadius: '8px',
                                    whiteSpace: 'pre-wrap',
                                    lineHeight: '1.6'
                                }}>
                                    {detailView.message}
                                </div>
                            </div>
                        </div>

                        <div style={{
                            marginTop: '2rem',
                            display: 'flex',
                            gap: '0.5rem',
                            justifyContent: 'flex-end'
                        }}>
                            <button
                                onClick={() => {
                                    handleDeleteOne(detailView.timestamp);
                                    setDetailView(null);
                                }}
                                style={{
                                    padding: '0.6rem 1.2rem',
                                    background: '#dc2626',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem'
                                }}
                            >
                                🗑️ Delete
                            </button>
                            <button
                                onClick={() => setDetailView(null)}
                                style={{
                                    padding: '0.6rem 1.2rem',
                                    background: '#334155',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem'
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default InquiryList;
