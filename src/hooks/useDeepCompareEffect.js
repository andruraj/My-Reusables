import { useEffect, useRef } from "react";
import PropTypes from "prop-types";

import { isDeepEqual } from "@utils/isEqual"; // Import your isEqual function

/**
 * Custom hook that triggers an effect callback when any of the dependencies change deeply.
 * @param {Function} callback - The callback function to execute when dependencies change.
 * @param {Array} dependencies - The dependencies to watch for changes (compared deeply).
 *
 * @example
 * // Example usage:
 * useDeepCompareEffect(() => {
 *   // Effect logic to execute when dependencies change
 *   console.log('Dependencies have changed:', dependencies);
 * }, [obj1, obj2]);
 */
export const useDeepCompareEffect = (callback, dependencies) => {
  const currentDependenciesRef = useRef(dependencies);

  if (!isDeepEqual(currentDependenciesRef.current, dependencies)) {
    currentDependenciesRef.current = dependencies;
  }

  useEffect(callback, [currentDependenciesRef.current]);
};

// PropTypes for useDeepCompareEffect hook
useDeepCompareEffect.propTypes = {
  callback: PropTypes.func.isRequired,
  dependencies: PropTypes.array.isRequired,
};
