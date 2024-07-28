import { useEffect } from "react";
import PropTypes from "prop-types";

/**
 * Custom hook that executes a callback function at a specified interval.
 * @param {Function} callback - The function to be executed at each interval.
 * @param {number} delay - The interval duration in milliseconds.
 *
 * @example
 * // Example usage:
 * useInterval(() => { console.log("Interval executed"); }, 1000);
 * // Executes the callback function every 1000ms.
 */
export const useInterval = (callback, delay) => {
  useEffect(() => {
    const intervalId = setInterval(callback, delay);

    return () => clearInterval(intervalId);
  }, [callback, delay]);
};

// PropTypes for useInterval hook
useInterval.propTypes = {
  callback: PropTypes.func.isRequired,
  delay: PropTypes.number.isRequired,
};
