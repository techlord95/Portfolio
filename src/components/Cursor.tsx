'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import styles from './Cursor.module.css';

// Settings for the trail
const TRAIL_LENGTH = 20;
const SMOOTHING = 0.2;

interface Point {
  x: number;
  y: number;
}

export default function Cursor() {
  const [points, setPoints] = useState<Point[]>([]);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [isHovering, setIsHovering] = useState(false);
  const historyRef = useRef<Point[]>([]);

  useEffect(() => {
    // Initial fill
    historyRef.current = Array(TRAIL_LENGTH).fill({ x: -100, y: -100 });
    
    const onMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
     
      // Update hover state
      const target = e.target as HTMLElement;
      const isClickable = target.closest('a') || target.closest('button') || target.hasAttribute('data-hover');
      setIsHovering(!!isClickable);

      // Shift history and add new point
      const newPoint = { x: e.clientX, y: e.clientY };
      // We'll update the history in the animation loop for smoother 60fps
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [cursorX, cursorY]);

  // Animation loop to smooth out the trail
  useEffect(() => {
    let animationFrameId: number;

    const render = () => {
      const currentX = cursorX.get();
      const currentY = cursorY.get();
      const currentPoint = { x: currentX, y: currentY };
      
      const history = historyRef.current;
      
      // Basic approach: Shift everything down one slot, add new head
      // To add "delay" or "drag", we can interpolate towards the mouse
      const prevHead = history[0];
      const dx = currentX - prevHead.x;
      const dy = currentY - prevHead.y;
      
      // Only update if moved enough, or force update for smooth decay?
      // For a simple trail, we just unshift the current mouse position.
      // To make it smooth, let's keep a history buffer.
      
      history.unshift(currentPoint);
      if (history.length > TRAIL_LENGTH) {
        history.pop();
      }

      setPoints([...history]);
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [cursorX, cursorY]);

  // Convert points to SVG path string (Catmull-Rom spline or simple polyline)
  // For simplicity and "tech" look, a Polyline is fine, or a quadratic Bezier.
  const getPath = (points: Point[]) => {
    if (points.length < 2) return "";
    
    // Simple line join
    return points.reduce((acc, point, i, a) => {
        if (i === 0) return `M ${point.x} ${point.y}`;
        // Bezier smoothing for mind-bending fluid feel
        // Use midpoint of this and next point as control
        // Simply LineTo for now to ensure accuracy, create curve with CSS stroke-linejoin
        return `${acc} L ${point.x} ${point.y}`;
    }, "");
  };

  // Create a smooth curved path
  const getSmoothPath = (points: Point[]) => {
    if (points.length < 2) return "";
    
    let d = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length - 1; i++) {
        const p0 = points[i - 1];
        const p1 = points[i];
        const p2 = points[i + 1];
        
        // Midpoints
        const mp0x = (p0.x + p1.x) / 2;
        const mp0y = (p0.y + p1.y) / 2;
        const mp1x = (p1.x + p2.x) / 2;
        const mp1y = (p1.y + p2.y) / 2;
        
        // Logic for cubic bezier or quadratic...
        // Simplified: Quadratic curve to midpoint of next segment
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;
        
        d += ` Q ${p1.x} ${p1.y} ${midX} ${midY}`;
    }
    
    return d;
  };

  return (
    <>
      <svg className={styles.cursorTrail} width="100%" height="100%">
        <motion.path 
            d={getSmoothPath(points)} 
            className={styles.trailPath}
            animate={{
                stroke: isHovering ? "var(--accent-color)" : "var(--pointer-color)",
                strokeWidth: isHovering ? 6 : 2
            }}
            transition={{ duration: 0.2 }}
        />
      </svg>
      <motion.div 
        className={styles.cursorDot}
        style={{
            x: cursorX,
            y: cursorY,
            translateX: -4, // Center the 8px dot
            translateY: -4,
            scale: isHovering ? 0 : 1 // Hide dot on hover to focus on the thick path or expand it? Let's hide it for effect.
        }}
      />
    </>
  );
}
