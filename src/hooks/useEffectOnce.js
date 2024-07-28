import { useEffect } from "react";
import PropTypes from "prop-types";

/**
 * Custom hook that triggers a callback function once when the component mounts.
 * @param {Function} callback - The callback function to execute once.
 *
 * @example
 * // Example usage:
 * useEffectOnce(() => {
 *   console.log('Component mounted');
 *   // Additional initialization logic
 * });
 */
export const useEffectOnce = (callback) => {
  useEffect(callback, []);
};

// PropTypes for useEffectOnce hook
useEffectOnce.propTypes = {
  callback: PropTypes.func.isRequired,
};
