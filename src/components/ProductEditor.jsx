import { useState, useEffect } from 'react';
import ImageUploader from './ImageUploader';

function ProductEditor({ product, onSave, onCancel, apiUrl, existingProducts }) {
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        description: '',
        category: '',
        subcategory: '',
        specs: {},
        tags: [],
        imageUrl: '',
        hasRealImage: false,
        imageType: 'product'
    });

    const [newSpecKey, setNewSpecKey] = useState('');
    const [newSpecValue, setNewSpecValue] = useState('');
    const [newTag, setNewTag] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState({});

    // Initialize form with product data
    useEffect(() => {
        if (product) {
            setFormData({
                ...product,
                specs: product.specs || {},
                tags: product.tags || []
            });
        }
    }, [product]);

    // Handle basic field changes
    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error for this field
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    // Handle spec changes
    const handleSpecChange = (key, value) => {
        setFormData(prev => ({
            ...prev,
            specs: { ...prev.specs, [key]: value }
        }));
    };

    // Add new spec
    const handleAddSpec = () => {
        if (newSpecKey.trim() && newSpecValue.trim()) {
            console.log('Adding manual spec:', newSpecKey, newSpecValue);
            // alert(`Debug: Adding spec ${newSpecKey.trim()} with value ${newSpecValue.trim()}`);
            handleSpecChange(newSpecKey.trim(), newSpecValue.trim());
            setNewSpecKey('');
            setNewSpecValue('');
        } else {
            alert('Please enter both name and value');
        }
    };

    // Delete spec
    const handleDeleteSpec = (key) => {
        setFormData(prev => {
            const newSpecs = { ...prev.specs };
            delete newSpecs[key];
            return { ...prev, specs: newSpecs };
        });
    };

    // Add tag
    const handleAddTag = () => {
        if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, newTag.trim()]
            }));
            setNewTag('');
        }
    };

    // Delete tag
    const handleDeleteTag = (tag) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(t => t !== tag)
        }));
    };

    // Handle image upload
    const handleImageUpload = (imageUrl) => {
        setFormData(prev => ({
            ...prev,
            imageUrl,
            hasRealImage: true,
            imageType: 'product'
        }));
    };

    // Validate form
    const validate = () => {
        const newErrors = {};

        if (!formData.id.trim()) {
            newErrors.id = 'Product ID is required';
        }

        if (!formData.name.trim()) {
            newErrors.name = 'Product name is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle save
    const handleSave = async () => {
        if (!validate()) {
            return;
        }

        try {
            setIsSaving(true);
            await onSave(formData);
        } catch (error) {
            alert(`Error saving product: ${error.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    const isNewProduct = !product;

    // Common spec fields for quick add
    const commonSpecs = [
        'Frequency range',
        'Peak gain',
        'Polarization',
        'Connector type',
        'Dimensions',
        'Operation temperature',
        'VSWR',
        'Efficiency',
        'Radiation pattern'
    ];

    return (
        <div className="product-editor">
            <div className="editor-header">
                <h2>{isNewProduct ? '➕ Add New Product' : `✏️ Edit Product: ${product.id}`}</h2>
                <div className="editor-actions">
                    <button
                        className="btn-primary"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : '💾 Save'}
                    </button>
                    <button className="btn-secondary" onClick={onCancel}>
                        ❌ Cancel
                    </button>
                </div>
            </div>

            <div className="editor-content">
                {/* Basic Information */}
                <section className="editor-section">
                    <h3>Basic Information</h3>
                    <div className="form-grid-2col">
                        <div className="form-field">
                            <label>Product ID *</label>
                            <input
                                type="text"
                                value={formData.id}
                                onChange={(e) => handleChange('id', e.target.value)}
                                disabled={!isNewProduct}
                                className={errors.id ? 'error' : ''}
                            />
                            {errors.id && <span className="error-text">{errors.id}</span>}
                        </div>

                        <div className="form-field">
                            <label>Name *</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className={errors.name ? 'error' : ''}
                            />
                            {errors.name && <span className="error-text">{errors.name}</span>}
                        </div>

                        <div className="form-field full-width">
                            <label>Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                rows="3"
                            />
                        </div>

                        <div className="form-field">
                            <label>Category</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <select
                                    value={formData.category}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val === '__NEW__') {
                                            handleChange('category', '');
                                            document.getElementById('manual-category-input')?.focus();
                                        } else {
                                            handleChange('category', val);
                                        }
                                    }}
                                    style={{ flex: 1 }}
                                >
                                    <option value="">Select Category...</option>
                                    {[...new Set((existingProducts || []).map(p => p.category).filter(Boolean))].map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                    <option value="__NEW__">+ Enter manually...</option>
                                </select>
                            </div>
                            {(formData.category === '' || !([...new Set((existingProducts || []).map(p => p.category).filter(Boolean))].includes(formData.category))) && (
                                <input
                                    id="manual-category-input"
                                    type="text"
                                    value={formData.category}
                                    onChange={(e) => handleChange('category', e.target.value)}
                                    placeholder="Enter category name"
                                    style={{ marginTop: '0.5rem' }}
                                />
                            )}
                        </div>

                        <div className="form-field">
                            <label>Subcategory</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <select
                                    value={formData.subcategory}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val === '__NEW__') {
                                            handleChange('subcategory', '');
                                            document.getElementById('manual-subcategory-input')?.focus();
                                        } else {
                                            handleChange('subcategory', val);
                                        }
                                    }}
                                    style={{ flex: 1 }}
                                >
                                    <option value="">Select Subcategory...</option>
                                    {[...new Set((existingProducts || [])
                                        .filter(p => !formData.category || p.category === formData.category)
                                        .map(p => p.subcategory).filter(Boolean)
                                    )].map(sub => (
                                        <option key={sub} value={sub}>{sub}</option>
                                    ))}
                                    <option value="__NEW__">+ Enter manually...</option>
                                </select>
                            </div>
                            {(formData.subcategory === '' || !([...new Set((existingProducts || [])
                                .filter(p => !formData.category || p.category === formData.category)
                                .map(p => p.subcategory).filter(Boolean)
                            )].includes(formData.subcategory))) && (
                                    <input
                                        id="manual-subcategory-input"
                                        type="text"
                                        value={formData.subcategory}
                                        onChange={(e) => handleChange('subcategory', e.target.value)}
                                        placeholder="Enter subcategory name"
                                        style={{ marginTop: '0.5rem' }}
                                    />
                                )}
                        </div>
                    </div>
                </section>

                {/* Image Upload */}
                <section className="editor-section">
                    <h3>Product Image</h3>
                    <ImageUploader
                        productId={formData.id}
                        currentImage={formData.imageUrl}
                        onImageUpload={handleImageUpload}
                        apiUrl={apiUrl}
                    />
                </section>

                {/* Specifications */}
                <section className="editor-section">
                    <h3>Specifications</h3>

                    {/* Common specs quick add */}
                    <div className="common-specs">
                        <label>Quick add:</label>
                        <div className="spec-buttons">
                            {commonSpecs.map(spec => (
                                !formData.specs[spec] && (
                                    <button
                                        key={spec}
                                        className="btn-spec"
                                        onClick={() => {
                                            handleSpecChange(spec, '');
                                            // Optional: Focus logic could be added here if we had refs to the list inputs
                                        }}
                                    >
                                        + {spec}
                                    </button>
                                )
                            ))}
                        </div>
                    </div>

                    {/* Existing specs */}
                    <div className="specs-list">
                        {Object.entries(formData.specs).map(([key, value]) => (
                            <div key={key} className="spec-item">
                                <input
                                    type="text"
                                    value={key}
                                    onChange={(e) => {
                                        const newKey = e.target.value;
                                        const newSpecs = { ...formData.specs };
                                        delete newSpecs[key];
                                        newSpecs[newKey] = value;
                                        setFormData(prev => ({ ...prev, specs: newSpecs }));
                                    }}
                                    className="spec-key"
                                />
                                <input
                                    type="text"
                                    value={value}
                                    onChange={(e) => handleSpecChange(key, e.target.value)}
                                    className="spec-value"
                                />
                                <button
                                    className="btn-icon btn-delete"
                                    onClick={() => handleDeleteSpec(key)}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Add new spec */}
                    <div className="add-spec">
                        <input
                            type="text"
                            placeholder="Specification name"
                            value={newSpecKey}
                            onChange={(e) => setNewSpecKey(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && document.getElementById('newSpecValue')?.focus()}
                        />
                        <input
                            id="newSpecValue"
                            type="text"
                            placeholder="Value"
                            value={newSpecValue}
                            onChange={(e) => setNewSpecValue(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddSpec()}
                        />
                        <button className="btn-primary" onClick={handleAddSpec}>
                            + Add Spec
                        </button>
                    </div>
                </section>

                {/* Tags */}
                <section className="editor-section">
                    <h3>Tags</h3>
                    <div className="tags-container">
                        {formData.tags.map(tag => (
                            <span key={tag} className="tag">
                                {tag}
                                <button onClick={() => handleDeleteTag(tag)}>×</button>
                            </span>
                        ))}
                    </div>
                    <div className="add-tag">
                        <input
                            type="text"
                            placeholder="Add tag"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                        />
                        <button className="btn-primary" onClick={handleAddTag}>
                            + Add Tag
                        </button>
                    </div>
                    {/* Available Tags Selection */}
                    <div className="common-specs" style={{ marginTop: '1rem' }}>
                        <label className="stat-label">Select from existing tags:</label>
                        <div className="spec-buttons">
                            {[...new Set((existingProducts || [])
                                .flatMap(p => p.tags)
                                .filter(Boolean)
                            )]
                                .filter(tag => !formData.tags.includes(tag))
                                .sort()
                                .map(tag => (
                                    <button
                                        key={tag}
                                        className="btn-spec"
                                        onClick={() => {
                                            if (!formData.tags.includes(tag)) {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    tags: [...prev.tags, tag]
                                                }));
                                            }
                                        }}
                                    >
                                        + {tag}
                                    </button>
                                ))}
                        </div>
                    </div>
                </section>
            </div>

            {/* Footer Actions */}
            <div className="editor-footer">
                <button className="btn-secondary" onClick={onCancel}>
                    ❌ Cancel
                </button>
                <button
                    className="btn-primary"
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    {isSaving ? 'Saving...' : '💾 Save Product'}
                </button>
            </div>
        </div>
    );
}

export default ProductEditor;
