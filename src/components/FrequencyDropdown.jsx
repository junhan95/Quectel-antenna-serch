import { useState, useRef, useEffect } from 'react'

function FrequencyDropdown({ category, bands, selectedBands, onSelectionChange }) {
    const [isOpen, setIsOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const dropdownRef = useRef(null)

    const selectedCount = selectedBands.length

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const filteredBands = bands.filter(b =>
        b.band.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const toggleBand = (band) => {
        if (selectedBands.includes(band)) {
            onSelectionChange(selectedBands.filter(b => b !== band))
        } else {
            onSelectionChange([...selectedBands, band])
        }
    }

    const clearSelection = (e) => {
        e.stopPropagation()
        onSelectionChange([])
    }

    const formatBandLabel = (bandData) => {
        const { band, uplink, downlink, frequency, mode } = bandData
        if (frequency) {
            return `${band} (${frequency} MHz)`
        }
        const freqParts = []
        if (uplink) freqParts.push(`UL: ${uplink}`)
        if (downlink) freqParts.push(`DL: ${downlink}`)
        const freqStr = freqParts.join(', ')
        return `${band}${mode ? ` [${mode}]` : ''} ${freqStr ? `(${freqStr} MHz)` : ''}`
    }

    return (
        <div className="frequency-dropdown" ref={dropdownRef}>
            <button
                className={`frequency-dropdown-trigger ${isOpen ? 'open' : ''} ${selectedCount > 0 ? 'has-selection' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="dropdown-label">{category}</span>
                {selectedCount > 0 && (
                    <span className="selection-count">{selectedCount}</span>
                )}
                <svg
                    className={`dropdown-arrow ${isOpen ? 'rotated' : ''}`}
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </button>

            {isOpen && (
                <div className="frequency-dropdown-menu">
                    <div className="dropdown-header">
                        <input
                            type="text"
                            placeholder={`Search ${category}...`}
                            className="dropdown-search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                        />
                        {selectedCount > 0 && (
                            <button className="clear-btn" onClick={clearSelection}>
                                Clear
                            </button>
                        )}
                    </div>
                    <div className="dropdown-items">
                        {filteredBands.map((bandData) => (
                            <label key={bandData.band} className="dropdown-item">
                                <input
                                    type="checkbox"
                                    checked={selectedBands.includes(bandData.band)}
                                    onChange={() => toggleBand(bandData.band)}
                                />
                                <span className="band-name">{bandData.band}</span>
                                <span className="band-info">
                                    {bandData.frequency
                                        ? `${bandData.frequency} MHz`
                                        : bandData.uplink || bandData.downlink
                                            ? `${bandData.uplink || bandData.downlink} MHz`
                                            : ''
                                    }
                                </span>
                            </label>
                        ))}
                        {filteredBands.length === 0 && (
                            <div className="no-results">No bands found</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default FrequencyDropdown
