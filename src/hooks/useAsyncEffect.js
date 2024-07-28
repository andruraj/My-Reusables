import { useEffect } from "react";
import PropTypes from "prop-types";

/**
 * Custom hook that executes an async callback function and cleans up on component unmount or when dependencies change.
 * @param {Function} asyncCallback - The async function to be executed.
 * @param {Array} dependencies - Optional dependencies to watch for changes and trigger the async function.
 *
 * @example
 * // Example usage:
 * useAsyncEffect(async () => {
 *   const data = await fetchData();
 *   setData(data);
 * }, [userId]);
 * // Fetches data when userId changes and cleans up on component unmount.
 */
export const useAsyncEffect = (asyncCallback, dependencies = []) => {
  useEffect(() => {
    asyncCallback();

    return () => {}; // Cleanup function (optional)
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps
};

// PropTypes for useAsyncEffect hook
useAsyncEffect.propTypes = {
  asyncCallback: PropTypes.func.isRequired,
  dependencies: PropTypes.array,
};
