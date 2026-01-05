# Vector Visualizer

An interactive web-based vector visualization tool built with React and Vite. This application provides a dynamic, pannable, and zoomable coordinate grid system for visualizing mathematical vectors in 2D space.

![Vector Visualizer](https://img.shields.io/badge/React-19.2.0-blue) ![Vite](https://img.shields.io/badge/Vite-7.2.4-yellow) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.18-blue)

## Features

- **Interactive Cartesian Grid**: Full-featured coordinate system with customizable axes and gridlines
- **Pan & Zoom**: 
  - Click and drag to pan the grid anywhere in the infinite coordinate plane
  - Mouse wheel to zoom in/out with intelligent scaling that centers on your cursor
  - Smooth transitions with throttled updates (60fps) for optimal performance
- **Adaptive Scaling**: Automatically adjusts grid unit sizes and intervals as you zoom
- **Smart Label Positioning**: Grid labels stick to screen edges (bottom for X-axis, right for Y-axis) when axes move off-screen
- **Vector Rendering**: Display vectors with arrow heads showing direction and magnitude
- **Responsive Design**: Adapts to window size changes in real-time
- **Customizable Appearance**: Configure gridline colors, stroke widths, and axis styling
- **Infinite Canvas**: Pan and zoom to any coordinate without bounds
- **Scientific Notation**: Automatic formatting for very large or small numbers

## Demo

The application displays an infinite, interactive coordinate grid where you can:
- Visualize vectors from start points to end points
- Pan around the coordinate plane
- Zoom in for detailed precision or zoom out for a wider view
- See automatic grid spacing adjustments for optimal readability at any scale

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd vector-visualizer
```

2. Install dependencies:
```bash
npm install
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

### Build

Create a production build:
```bash
npm run build
```

The optimized files will be in the `dist/` directory.

### Preview Production Build

Preview the production build locally:
```bash
npm run preview
```

## Usage

### Basic Vector Display

In [App.jsx](src/App.jsx), you can define vectors to visualize:

```jsx
import Grid from "./components/Grid"

const App = () => {
  return <Grid vectors={[
    { xStart: 0, yStart: 0, xEnd: 3, yEnd: 4 },
    { xStart: 1, yStart: 2, xEnd: 5, yEnd: 6 }
  ]}/>
}

export default App
```

### Vector Object Structure

Each vector is an object with four properties:
- `xStart`: Starting x-coordinate
- `yStart`: Starting y-coordinate
- `xEnd`: Ending x-coordinate
- `yEnd`: Ending y-coordinate

### Grid Component Props

The `Grid` component accepts the following optional props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `vectors` | Array | `[]` | Array of vector objects to display |
| `width` | String | `'w-full'` | Tailwind CSS width class |
| `height` | String | `'h-full'` | Tailwind CSS height class |
| `gridlineStroke` | String | `'grey'` | Color of minor gridlines |
| `gridlineStrokeWidth` | Number | `1` | Width of minor gridlines |
| `majorGridlineStroke` | String | `'dimgrey'` | Color of major gridlines |
| `axisStroke` | String | `'black'` | Color of x and y axes |
| `axisStrokeWidth` | Number | `3` | Width of x and y axes |

### Example with Custom Styling

```jsx
<Grid 
  vectors={[
    { xStart: 0, yStart: 0, xEnd: 3, yEnd: 4 }
  ]}
  gridlineStroke="lightgray"
  majorGridlineStroke="gray"
  axisStroke="darkblue"
  axisStrokeWidth={4}
/>
```

## Controls

- **Pan**: Click and drag anywhere on the grid to move around the coordinate plane
- **Zoom**: Use mouse wheel to zoom in/out
  - Zoom centers on your cursor position for precise navigation
  - The grid automatically adjusts scale and unit intervals for optimal visibility
  - Labels stick to screen edges for consistent readability
- **Reset**: Refresh the page to return to the origin (0, 0)

## Technical Details

### Architecture

- **React 19.2.0**: Latest React with hooks and modern features
- **Vite 7.2.4**: Lightning-fast build tool and dev server
- **TailwindCSS 4.1.18**: Utility-first CSS framework
- **SVG Rendering**: High-quality vector graphics using native SVG

### Key Components

- **Grid**: Main component handling the coordinate system, pan/zoom interactions, and vector rendering
- **XAxis/YAxis**: Render the coordinate axes
- **XGridline/YGridline**: Render grid lines with labels
- **Vector**: Render individual vectors with arrow heads

### Performance Optimizations

- Throttled mouse events (60fps) for smooth interactions
- `useMemo` hooks to prevent unnecessary re-renders of gridlines
- `useCallback` for optimized event handlers
- Efficient gridline rendering: only calculates and renders visible gridlines
- Smart range calculation prevents performance issues at extreme zoom levels
- Automatic cleanup of off-screen elements

### Scaling Algorithm

The grid implements an intelligent scaling system that:
1. Maintains optimal visual density as you zoom in and out
2. Automatically switches between unit sizes (1, 2, 5) for clean intervals
3. Adjusts major gridline intervals (every 4th or 5th line) based on unit size
4. Handles decimal multipliers for extreme zoom levels (0.001 to 1000+)
5. Uses scientific notation for very large or very small numbers (< 0.001 or ≥ 10000)
6. Calculates visible range efficiently to prevent rendering thousands of off-screen gridlines
7. Preserves zoom center point at cursor position for intuitive navigation

## Project Structure

```
vector-visualizer/
├── src/
│   ├── components/
│   │   └── Grid.jsx          # Main grid component
│   ├── hooks/
│   │   └── useWindowDimensions.js  # Window size tracking hook
│   ├── App.jsx               # Main application component
│   ├── main.jsx              # Application entry point
│   └── index.css             # Global styles
├── public/                   # Static assets
├── index.html                # HTML template
├── package.json              # Dependencies and scripts
├── vite.config.js            # Vite configuration
└── eslint.config.js          # ESLint configuration
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Browser Support

This application works in all modern browsers that support:
- ES6+ JavaScript features
- SVG rendering
- CSS Grid and Flexbox
- Mouse wheel events for zooming
- High precision floating point calculations

Tested on:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Future Enhancements

Potential features for future development:
- Multiple vector colors
- Vector labels and annotations
- Vector addition/subtraction visualization
- Angle and magnitude display
- Export to image functionality
- Touch device support
- Vector input UI
- Grid coordinate display on hover

## License

This project is open source and available under the MIT License.

## Acknowledgments

Built with modern web technologies:
- [React](https://react.dev/)
- [Vite](https://vite.dev/)
- [TailwindCSS](https://tailwindcss.com/)
