import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const VectorVisualizer = () => {
  const [vectors, setVectors] = useState([
    { x: 100, y: 50, color: '#ff0000' },
    { x: 50, y: 100, color: '#0000ff' },
    { x: 75, y: -75, color: '#000000' }
  ]);

  const addVector = () => {
    const randomX = Math.random() * 200 - 100; // Random between -100 and 100
    const randomY = Math.random() * 200 - 100;
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
    
    setVectors([...vectors, { x: randomX, y: randomY, color: randomColor }]);
  };

  return (
    <div>
      <button onClick={addVector} style={{ margin: '10px' }}>
        Add Random Vector
      </button>
      
      <svg width="600" height="400" style={{ border: '1px solid black' }}>
        <line x1="0" y1="200" x2="600" y2="200" stroke="#ccc" />
        <line x1="300" y1="0" x2="300" y2="400" stroke="#ccc" />
        
        {vectors.map((vec, i) => (
          <VectorArrow key={i} x={vec.x} y={vec.y} color={vec.color} />
        ))}
      </svg>
    </div>
  );
};

const VectorArrow = ({ x, y, color, originX = 300, originY = 200 }) => {
  const markerId = `arrowhead-${color.replace('#', '')}`;
  
  return (
    <>
      <defs>
        <marker
          id={markerId}
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill={color} />
        </marker>
      </defs>
      <line
        x1={originX}
        y1={originY}
        x2={originX + x}
        y2={originY - y}
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        markerEnd={`url(#${markerId})`}
      />
    </>
  );
};

export default VectorVisualizer
