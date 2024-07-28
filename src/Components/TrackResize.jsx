import React, { useEffect, useRef } from "react";

export const TrackResize = ({ children, onResize, ...props }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        onResize({ width, height });
      }
    });

    if (container) {
      resizeObserver.observe(container);
    }

    return () => {
      if (container) {
        resizeObserver.unobserve(container);
      }
    };
  }, [onResize]);

  return (
    <div ref={containerRef} {...props}>
      {children}
    </div>
  );
};
