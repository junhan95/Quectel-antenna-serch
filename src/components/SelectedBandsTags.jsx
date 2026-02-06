function SelectedBandsTags({ selections, onRemove, onClearAll }) {
    // Flatten all selections into a single array with category info
    const allTags = []

    Object.entries(selections).forEach(([category, bands]) => {
        bands.forEach(band => {
            allTags.push({ category, band })
        })
    })

    if (allTags.length === 0) {
        return null
    }

    return (
        <div className="selected-bands-container">
            <div className="selected-bands-tags">
                {allTags.map(({ category, band }) => (
                    <span key={`${category}-${band}`} className="band-tag">
                        <span className="tag-category">{category.split(' ')[0]}</span>
                        <span className="tag-band">{band}</span>
                        <button
                            className="tag-remove"
                            onClick={() => onRemove(category, band)}
                            title="Remove"
                        >
                            ×
                        </button>
                    </span>
                ))}
            </div>
            {allTags.length > 1 && (
                <button className="clear-all-btn" onClick={onClearAll}>
                    Clear All ({allTags.length})
                </button>
            )}
        </div>
    )
}

export default SelectedBandsTags
