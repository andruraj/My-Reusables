import { useCallback, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useTimeout } from "./useTimeout";

/**
 * Custom hook that throttles the execution of a callback function.
 * @param {Function} callback - The function to be throttled.
 * @param {number} delay - The throttle delay in milliseconds.
 * @returns {Function} Throttled function that can be called without throttling until the delay has passed.
 *
 * @example
 * // Example usage:
 * const throttledFunction = useThrottle(() => { console.log("Throttled function called"); }, 1000);
 * // Call throttledFunction to execute the callback, throttled to once per 1000ms.
 */
export const useThrottle = (callback, delay) => {
  const { reset, clear } = useTimeout(callback, delay);
  const throttledCallback = useRef(reset);

  useEffect(() => {
    throttledCallback.current = reset;
  }, [reset]);

  const throttle = useCallback(() => {
    if (!throttledCallback.current) return;
    throttledCallback.current();
  }, []);

  return throttle;
};

// PropTypes for useThrottle hook
useThrottle.propTypes = {
  callback: PropTypes.func.isRequired,
  delay: PropTypes.number.isRequired,
};
