import React from 'react';
import '../styles/progress.css';

const CircularProgress = ({ percentage, size = 150, strokeWidth = 10, color = '#4caf50' }) => {
  // SVG parameters calculation
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="circular-progress-container" style={{ width: size, height: size }}>
      <svg className="circular-progress-svg" width={size} height={size}>
        {/* Background circle */}
        <circle 
          className="circular-progress-background"
          stroke="#e0e0e0"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress circle */}
        <circle 
          className="circular-progress-bar"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="circular-progress-text">
        {Math.round(percentage)}%
      </div>
    </div>
  );
};

export default CircularProgress;
