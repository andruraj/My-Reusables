import { useEffect, useRef } from "react";
import PropTypes from "prop-types";

/**
 * Custom hook that triggers a callback on updates (after the initial render).
 * @param {Function} callback - The callback function to execute on update.
 * @param {Array} dependencies - Dependencies array to watch for changes and trigger the callback.
 *
 * @example
 * // Example usage:
 * useUpdateEffect(() => {
 *   console.log("Component updated");
 * }, [someDependency]);
 */
export const useUpdateEffect = (callback, dependencies) => {
  const firstRenderRef = useRef(true);

  useEffect(() => {
    if (firstRenderRef.current) {
      // Skip the effect on the initial render
      firstRenderRef.current = false;
      return;
    }
    // Execute the callback on subsequent renders
    return callback();
  }, dependencies);
};

// PropTypes for useUpdateEffect hook
useUpdateEffect.propTypes = {
  callback: PropTypes.func.isRequired,
  dependencies: PropTypes.array.isRequired,
};
