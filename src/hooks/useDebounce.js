import { useEffect } from "react";
import PropTypes from "prop-types";
import { useTimeout } from "./useTimeout";

/**
 * Custom hook that debounces a callback function based on a specified delay.
 * @param {Function} callback - The callback function to debounce.
 * @param {number} delay - The delay in milliseconds after which the callback should be invoked.
 * @param {Array} dependencies - The dependencies to watch for changes and trigger debouncing.
 *
 * @example
 * // Example usage:
 * const handleSearch = (query) => {
 *   // Perform search logic
 * };
 * const debouncedSearch = useDebounce(handleSearch, 500, [query]);
 * // debouncedSearch is now a debounced version of handleSearch function.
 */
export const useDebounce = (callback, delay, dependencies) => {
  const { reset, clear } = useTimeout(callback, delay);

  useEffect(() => {
    reset();
    return clear;
  }, [...dependencies, reset, clear]);

  useEffect(() => clear, []); // Cleanup the timeout on unmount

  return { reset, clear };
};

// PropTypes for useDebounce hook
useDebounce.propTypes = {
  callback: PropTypes.func.isRequired,
  delay: PropTypes.number.isRequired,
  dependencies: PropTypes.array.isRequired,
};
