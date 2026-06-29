import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const MouseOrb: React.FC = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth out the movement
  const springConfig = { damping: 25, stiffness: 150 };
  const orbX = useSpring(mouseX, springConfig);
  const orbY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 150); // Offset to center the 300px orb
      mouseY.set(e.clientY - 150);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      style={{
        x: orbX,
        y: orbY,
      }}
      className="fixed top-0 left-0 w-[300px] h-[300px] pointer-events-none z-[1] overflow-hidden rounded-full"
    >
      <div 
        className="w-full h-full bg-neonPink/20 blur-[100px]"
        style={{
          background: 'radial-gradient(circle, rgba(255,0,127,0.15) 0%, transparent 70%)'
        }}
      />
    </motion.div>
  );
};

export default MouseOrb;
