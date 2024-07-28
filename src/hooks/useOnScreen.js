import { useEffect, useState } from "react";
import PropTypes from "prop-types";

/**
 * Custom hook to monitor if a specified element is within the viewport using IntersectionObserver.
 * @param {React.MutableRefObject} ref - Reference to the element to observe.
 * @param {number} [rootMargin=0] - Margin around the root (viewport) to adjust the visibility check.
 * @returns {boolean} isVisible - Boolean indicating if the observed element is currently visible in the viewport.
 *
 * @example
 * // Example usage:
 * const ref = useRef(null);
 * const isVisible = useOnScreen(ref, 100);
 * // Renders based on isVisible state indicating if the element is in viewport.
 */
export const useOnScreen = (ref, rootMargin = 0) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: `${rootMargin}px` }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
      observer.disconnect();
    };
  }, [ref, rootMargin]);

  return isVisible;
};

// PropTypes for useOnScreen hook
useOnScreen.propTypes = {
  ref: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }).isRequired,
  rootMargin: PropTypes.number,
};
