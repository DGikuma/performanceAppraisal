import React, { useEffect, useState } from 'react';
import './DashboardLoader.css';

const DashboardLoader: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setFadeOut(true);
          setTimeout(() => setDone(true), 800); // Remove after fade
          return 100;
        }
        return prev + 1;
      });
    }, 60);
    return () => clearInterval(timer);
  }, []);

  const circumference = 502;
  const offset = circumference - (progress / 100) * circumference;

  if (done) return null;

  return (
    <div className={`loader-overlay ${fadeOut ? 'fade-out' : ''}`}>
      <div className="loader-container">
        <div className="loader-text">{progress}%</div>
        <svg className="loader-svg" viewBox="0 0 200 200">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00e0ff" />
              <stop offset="100%" stopColor="#0077ff" />
            </linearGradient>
            <linearGradient id="ringGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff00cc" />
              <stop offset="100%" stopColor="#3333ff" />
            </linearGradient>
            <linearGradient id="ringGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00ffcc" />
              <stop offset="100%" stopColor="#0066ff" />
            </linearGradient>
            <linearGradient id="ringGrad3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffff00" />
              <stop offset="100%" stopColor="#ff6600" />
            </linearGradient>
          </defs>

          <circle className="spinning-ring ring-1" cx="100" cy="100" r="90" />
          <circle className="spinning-ring ring-2" cx="100" cy="100" r="70" />
          <circle className="spinning-ring ring-3" cx="100" cy="100" r="50" />

          <circle className="loader-circle-bg" cx="100" cy="100" r="80" />
          <circle
            className="loader-circle-fg"
            cx="100"
            cy="100"
            r="80"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
      </div>
    </div>
  );
};

export default DashboardLoader;
