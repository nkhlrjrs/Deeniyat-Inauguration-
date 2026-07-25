'use client';

import { useEffect, useState, useRef } from 'react';

const GRID_SIZE = 60; // Must match the background-size in globals.css
const MAX_PATHS = 8; // Maximum concurrent paths
const SPAWN_INTERVAL = 800; // ms between new paths

interface PathData {
  id: number;
  startX: number;
  startY: number;
  direction: 'horizontal' | 'vertical';
  distance: number;
  duration: number;
  progress: number;
}

export default function GridPathAnimator() {
  const [paths, setPaths] = useState<PathData[]>([]);
  const pathIdCounter = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const spawnPath = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const cols = Math.ceil(rect.width / GRID_SIZE);
      const rows = Math.ceil(rect.height / GRID_SIZE);

      // Random starting position (aligned to grid)
      const startCol = Math.floor(Math.random() * cols);
      const startRow = Math.floor(Math.random() * rows);

      // Random direction
      const direction: 'horizontal' | 'vertical' = Math.random() > 0.5 ? 'horizontal' : 'vertical';

      // Random distance (2-6 grid cells)
      const cells = Math.floor(Math.random() * 5) + 2;
      const distance = cells * GRID_SIZE;

      // Random duration (2-4 seconds)
      const duration = 2000 + Math.random() * 2000;

      const newPath: PathData = {
        id: pathIdCounter.current++,
        startX: startCol * GRID_SIZE,
        startY: startRow * GRID_SIZE,
        direction,
        distance,
        duration,
        progress: 0
      };

      setPaths(prev => [...prev.slice(-MAX_PATHS + 1), newPath]);
    };

    // Initial spawn
    spawnPath();

    // Continue spawning
    const interval = setInterval(spawnPath, SPAWN_INTERVAL);

    // Animation loop
    let lastTime = performance.now();
    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      setPaths(prev => {
        const updated = prev.map(path => {
          const progressDelta = (deltaTime / path.duration) * 100;
          const newProgress = Math.min(100, path.progress + progressDelta);
          return { ...path, progress: newProgress };
        });
        // Remove completed paths
        return updated.filter(p => p.progress < 100);
      });

      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      clearInterval(interval);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none">
      {paths.map(path => {
        // Calculate opacity based on progress (fade in, stay, fade out)
        let opacity = 0.6;
        if (path.progress < 10) opacity = (path.progress / 10) * 0.6;
        else if (path.progress > 90) opacity = ((100 - path.progress) / 10) * 0.6;

        // Calculate current position
        const currentDistance = (path.progress / 100) * path.distance;
        const x = path.direction === 'horizontal' ? path.startX + currentDistance : path.startX;
        const y = path.direction === 'vertical' ? path.startY + currentDistance : path.startY;

        // Trail length (last portion of the path)
        const trailLength = Math.min(60, path.distance);

        return (
          <div key={path.id}>
            {/* Glowing line trail */}
            {path.direction === 'horizontal' ? (
              <div
                className="absolute h-[2px] bg-gradient-to-l from-white/60 to-transparent blur-[1px]"
                style={{
                  left: `${x - trailLength}px`,
                  top: `${y - 1}px`,
                  width: `${trailLength}px`,
                  opacity,
                  boxShadow: '0 0 8px rgba(144, 238, 144, 0.5)'
                }}
              />
            ) : (
              <div
                className="absolute w-[2px] bg-gradient-to-t from-white/60 to-transparent blur-[1px]"
                style={{
                  left: `${x - 1}px`,
                  top: `${y - trailLength}px`,
                  height: `${trailLength}px`,
                  opacity,
                  boxShadow: '0 0 8px rgba(144, 238, 144, 0.5)'
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
