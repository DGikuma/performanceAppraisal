import React from 'react';
import './DashboardLoader.css';

type DashboardLoaderProps = {
  show?: boolean;
  text?: string;
  size?: number;
};

const DashboardLoader: React.FC<DashboardLoaderProps> = ({
  show = true,
  text = "Loading",
  size = 160,
}) => {
  if (!show) return null;

  return (
    <div className="pa-loader-overlay" role="alert" aria-busy="true" aria-live="polite">
      <div className="pa-loader-container">
        <div className="pa-badge" style={{ width: size, height: size }}>
          <svg
            viewBox="0 0 120 120"
            className="pa-badge-ring"
            style={{ width: size, height: size }}
          >
            <defs>
              {['#00e0ff', '#10b981', '#f97316', '#a855f7', '#ec4899'].map((color, index) => (
                <linearGradient key={index} id={`grad${index + 1}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                  <stop offset="50%" stopColor={color} stopOpacity="1" />
                  <stop offset="100%" stopColor={color} stopOpacity="0.3" />
                </linearGradient>
              ))}
            </defs>

            <circle className="ring arc ring-1" cx="60" cy="60" r="54" stroke="url(#grad1)" />
            <circle className="ring arc ring-2" cx="60" cy="60" r="45" stroke="url(#grad2)" />
            <circle className="ring arc ring-3" cx="60" cy="60" r="36" stroke="url(#grad3)" />
            <circle className="ring arc ring-4" cx="60" cy="60" r="27" stroke="url(#grad4)" />
            <circle className="ring arc ring-5" cx="60" cy="60" r="18" stroke="url(#grad5)" />
          </svg>

        <svg
          className="dash-ring"
          viewBox="0 0 120 120"
          style={{ width: size * 0.75, height: size * 0.75 }}
        >
        <circle className="dash dash-blue" cx="58" cy="60" r="10" />
        <circle className="dash dash-pink" cx="70" cy="60" r="10" />
        </svg>
        </div>

        <p className="pa-loading-text">
          {text}
          <span className="pa-dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </p>
      </div>
    </div>
  );
};

export default DashboardLoader;
