'use client';

import { useEffect, useState } from 'react';

export default function CustomCursorStyles() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  if (isTouchDevice) {
    return null;
  }

  return (
    <style jsx global>{`
      html, body, * {
        cursor: none !important;
      }
    `}</style>
  );
}