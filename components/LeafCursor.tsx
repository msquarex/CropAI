'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';

const LeafCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Adjust these values to fine-tune the leaf position
  const leafSize = 32; // Assuming the leaf is 32x32 pixels
  const horizontalOffset = leafSize ;
  const verticalOffset = leafSize-30; // Adjust this value to match the leaf's edge with the cursor

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  return (
    <motion.div
      className="leaf-cursor"
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
      animate={{
        x: mousePosition.x - horizontalOffset,
        y: mousePosition.y - verticalOffset,
      }}
      transition={{
        duration: 0
      }}
    >
      <Leaf className="h-8 w-8 text-emerald-900" />
    </motion.div>
  );
};

export default LeafCursor;