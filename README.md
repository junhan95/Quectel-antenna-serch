# Quectel Antenna Search Engine

A modern, responsive web application for searching and filtering Quectel antenna products by frequency bands, specifications, and categories.

## Features

- 🔍 **Simple Search**: Quick text-based search across all antenna properties
- 🎯 **Detailed Search**: Advanced filtering by frequency bands (5G NR, 4G LTE, NB-IoT, WiFi, GPS)
- 📊 **Multiple View Modes**: Switch between grid and list views
- 📱 **Responsive Design**: Optimized for desktop and mobile devices
- 🏷️ **Category Filtering**: Filter by antenna categories and subcategories
- 📧 **Inquiry System**: Contact form for product inquiries (requires backend setup)

## Technology Stack

- **Frontend**: React 19, React Router, Vite
- **Styling**: Custom CSS with glassmorphism effects
- **Backend**: Node.js, Express (for inquiry form)

## Local Development

### Prerequisites
- Node.js 20+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start backend server (for inquiry functionality)
npm run server
```

The application will be available at `http://localhost:5173`

## Deployment

### GitHub Pages

```bash
# Build and deploy to GitHub Pages
npm run deploy
```

### Manual Build

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
├── src/
│   ├── components/          # React components
│   │   ├── SearchApp.jsx    # Main search interface
│   │   ├── AntennaDetail.jsx
│   │   ├── FrequencyDropdown.jsx
│   │   └── ...
│   ├── data/
│   │   ├── antennas.json    # Antenna product data
│   │   └── frequencyBands.js # Frequency band definitions
│   └── index.css            # Global styles
├── public/
│   └── images/              # Antenna product images
└── server.js                # Backend API server
```

## Features Detail

### Frequency Band Filtering
- **5G NR**: 70+ bands (n1-n263)
- **4G LTE**: 70+ bands (b1-b108)  
- **NB-IoT**: 35+ bands
- **WiFi**: 9 standards (802.11a/b/g/n/ac/ad/af/ah/ax) with dual-band support
- **GPS**: L1, L2, L5 bands

### Filtering Logic
- **Cellular bands**: Antenna must support ALL selected band frequencies
- **WiFi dual-band**: Antenna must support at least ONE frequency range
- **AND logic**: When multiple bands are selected, antenna must support all

## License

Proprietary - Quectel Korea

## Contact

For inquiries about Quectel antenna products, please use the inquiry form in the application.
