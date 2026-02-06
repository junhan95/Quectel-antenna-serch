import { useState, useRef } from 'react';

function ImageUploader({ productId, currentImage, onImageUpload, apiUrl }) {
    const [preview, setPreview] = useState(currentImage);
    const [isUploading, setIsUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    // Handle file selection
    const handleFileSelect = async (file) => {
        if (!file) return;

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            alert('Only JPEG, PNG, and WEBP images are allowed');
            return;
        }

        // Validate file size (2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert('File size must be less than 2MB');
            return;
        }

        // Show preview
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target.result);
        reader.readAsDataURL(file);

        // Upload file
        if (productId) {
            await uploadFile(file);
        }
    };

    // Upload file to server
    const uploadFile = async (file) => {
        try {
            setIsUploading(true);

            const formData = new FormData();
            formData.append('image', file);
            formData.append('productId', productId);

            const response = await fetch(`${apiUrl}/upload`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            onImageUpload(data.imageUrl);
            setPreview(data.imageUrl);
            alert('Image uploaded successfully!');
        } catch (error) {
            alert(`Upload failed: ${error.message}`);
        } finally {
            setIsUploading(false);
        }
    };

    // Handle drag events
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    // Handle drop
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    // Handle file input change
    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
        }
    };

    // Handle remove image
    const handleRemove = () => {
        setPreview(null);
        onImageUpload('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="image-uploader">
            {!productId && (
                <div className="upload-warning">
                    ⚠️ Please save the product first to enable image upload
                </div>
            )}

            <div
                className={`upload-area ${dragActive ? 'drag-active' : ''} ${!productId ? 'disabled' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => productId && fileInputRef.current?.click()}
            >
                {preview ? (
                    <div className="image-preview">
                        <img src={preview} alt="Preview" />
                        {productId && (
                            <div className="image-overlay">
                                <button
                                    className="btn-change"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        fileInputRef.current?.click();
                                    }}
                                >
                                    Change Image
                                </button>
                                <button
                                    className="btn-remove"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemove();
                                    }}
                                >
                                    Remove
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="upload-placeholder">
                        <div className="upload-icon">📷</div>
                        <p>Drag and drop image here</p>
                        <p className="upload-hint">or click to browse</p>
                        <p className="upload-requirements">
                            JPEG, PNG, WEBP • Max 2MB
                        </p>
                    </div>
                )}

                {isUploading && (
                    <div className="upload-loading">
                        <div className="spinner"></div>
                        <p>Uploading...</p>
                    </div>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleChange}
                style={{ display: 'none' }}
                disabled={!productId}
            />

            {currentImage && currentImage !== preview && (
                <div className="current-image-info">
                    Current image: {currentImage}
                </div>
            )}
        </div>
    );
}

export default ImageUploader;
