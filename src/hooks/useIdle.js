import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTimeout } from "./useTimeout";
import { useEventListener } from "./useEventListener";

/**
 * Custom hook that tracks user activity to determine if the user is idle.
 * @param {number} timeout - Timeout duration in milliseconds to determine idle state.
 * @returns {boolean} Boolean indicating whether the user is idle (true) or active (false).
 *
 * @example
 * // Example usage:
 * const isIdle = useIdle(30000); // Sets idle state after 30 seconds of inactivity
 * // Use isIdle to conditionally render UI or trigger actions based on user activity.
 */
export const useIdle = (timeout = 5 * 60 * 1000) => {
  const [idle, setIdle] = useState(false);
  const { reset, clear } = useTimeout(() => setIdle(true), timeout);

  useEffect(() => {
    const handleActivity = () => {
      setIdle(false);
      reset();
    };

    // Set up event listeners for mousemove and keydown
    useEventListener("mousemove", handleActivity);
    useEventListener("keydown", handleActivity);

    // Reset timeout initially and whenever timeout changes
    reset();

    return () => {
      clear(); // Clean up timeout when component unmounts
    };
  }, [timeout, reset, clear]);

  return idle;
};

// PropTypes for useIdle hook
useIdle.propTypes = {
  timeout: PropTypes.number.isRequired,
};
