# LINE SELECT - Premium Car Dealership Website

A minimalist, high-end automotive website built from scratch with clean design principles and luxury aesthetics.

## Features

- **Ultra-minimalist design** with black/white/gray color palette
- **Fullscreen video background** on homepage
- **360° car viewer** integration (Spins.com compatible)
- **Multilingual support** (EN/NL/DE)
- **Engine sound playback** with audio controls
- **Responsive design** optimized for all devices
- **Clean typography** with careful spacing and letter-spacing
- **Smooth interactions** without excessive animations

## File Structure

```
/
├── index.html          # Homepage with video hero and featured cars
├── product.html        # Individual car detail pages
├── styles.css          # Minimalist CSS styling
├── script.js           # JavaScript functionality
└── assets/             # Media files (to be added)
    ├── hero-video.mp4
    ├── car-1.jpg
    ├── car-2.jpg
    ├── car-3.jpg
    ├── car-360-preview.jpg
    └── engine-sound.mp3
```

## Required Assets

To complete the website, add these files to the `assets/` folder:

1. **hero-video.mp4** - Fullscreen background video of supercars
2. **car-1.jpg** - Porsche 911 GT3 image
3. **car-2.jpg** - McLaren 720S image  
4. **car-3.jpg** - Lamborghini Huracán image
5. **car-360-preview.jpg** - 360° viewer preview image
6. **engine-sound.mp3** - Engine sound audio file

## 360° Viewer Integration

The product page includes placeholder integration for Spins.com 360° viewer. To implement:

1. Sign up for Spins.com service
2. Upload car 360° photography
3. Replace placeholder URL in `product.html` with actual Spins data URL
4. The viewer will automatically initialize and become interactive

## Multilingual Support

The website supports three languages:
- English (EN) - Default
- Dutch (NL)
- German (DE)

Language switching updates all text content dynamically, including product descriptions.

## Responsive Design

The website is fully responsive with:
- Desktop: Full-width layout with grid system
- Tablet: Optimized layouts and touch controls
- Mobile: Single-column layout with touch-optimized 360° viewer

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Graceful degradation for older browsers

## Performance

- Lightweight CSS (no frameworks)
- Minimal JavaScript
- Optimized for fast loading
- Efficient video and image handling

## Customization

To modify the design:
1. Edit color values in `styles.css`
2. Update typography settings
3. Modify layout breakpoints for responsive design
4. Add/remove car data in `script.js`

## Usage

1. Clone/download the files
2. Add required assets to `assets/` folder
3. Open `index.html` in a web browser
4. Navigate through the minimalist interface

The website prioritizes clean aesthetics, premium feel, and smooth user experience over complex functionality.