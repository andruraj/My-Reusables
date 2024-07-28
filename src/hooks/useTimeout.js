import { useCallback, useEffect, useRef } from "react";
import PropTypes from "prop-types";

/**
 * Custom hook to handle timeout operations in React components.
 * @param {function} callback - The callback function to execute when the timeout completes.
 * @param {number} delay - The delay in milliseconds before the callback is invoked.
 * @returns {object} An object containing functions to reset and clear the timeout.
 *
 * @example
 * // Example usage:
 * const { reset, clear } = useTimeout(() => {
 *   console.log("Timeout completed!");
 * }, 1000);
 * // Use reset to restart the timeout and clear to cancel it.
 */
export const useTimeout = (callback, delay) => {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef();

  // Update callbackRef.current if callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Set the timeout
  const set = useCallback(() => {
    timeoutRef.current = setTimeout(() => callbackRef.current(), delay);
  }, [delay]);

  // Clear the timeout
  const clear = useCallback(() => {
    timeoutRef.current && clearTimeout(timeoutRef.current);
  }, []);

  // Set timeout on mount and clear on unmount, update on delay change
  useEffect(() => {
    set();
    return clear;
  }, [delay, set, clear]);

  // Reset timeout
  const reset = useCallback(() => {
    clear();
    set();
  }, [clear, set]);

  return { reset, clear };
};

useTimeout.propTypes = {
  callback: PropTypes.func.isRequired,
  delay: PropTypes.number.isRequired,
};
