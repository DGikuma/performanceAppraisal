import React, { useMemo } from "react";
import styles from "./AnimatedBackground.module.css";

const COLORS = ["#60a5fa", "#f87171", "#facc15", "#34d399", "#a78bfa", "#fb923c"];

const AnimatedBackground = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => {
      const size = `${Math.random() * 24 + 16}px`; // 16px to 40px
      const left = `${Math.random() * 100}%`;
      const duration = `${15 + Math.random() * 15}s`;
      const delay = `${Math.random() * 10}s`;
      const drift = `${Math.random() * 60 - 30}px`; // Horizontal drift
      const opacity = Math.random().toFixed(2);
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];

      return (
        <span
          key={i}
          className={styles.particle}
          style={
            {
              "--left": left,
              "--size": size,
              "--drift": drift,
              "--duration": duration,
              "--delay": delay,
              "--opacity": opacity,
              "--color": color,
            } as React.CSSProperties
          }
        />
      );
    });
  }, []);

  return (
    <div className="absolute inset-0 -z-10 pointer-events-none">
      <div className="absolute inset-0 bg-gray-100 dark:bg-gray-900" />
      <div className="absolute inset-0 overflow-hidden">{particles}</div>
    </div>
  );
};

export default AnimatedBackground;
