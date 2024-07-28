import { useEffect, useState } from "react";
import PropTypes from "prop-types";

/**
 * Custom hook to handle asynchronous operations with loading state, error state, and data retrieval.
 * @param {Function} asyncFunction - The asynchronous function to execute.
 * @param {Array} [dependencies=[]] - Dependencies array to watch for changes and trigger async function.
 * @returns {AsyncState} Object containing loading state, error state, and fetched data.
 *
 * @typedef {Object} AsyncState
 * @property {boolean} isLoading - Indicates if the async operation is currently loading.
 * @property {boolean} isError - Indicates if an error occurred during the async operation.
 * @property {any} error - The error object if isError is true, otherwise undefined.
 * @property {any} data - The data retrieved from the async operation, undefined until data is fetched successfully.
 *
 * @example
 * // Example usage:
 * const { isLoading, isError, error, data } = useAsync(() => fetchData(userId), [userId]);
 * // Renders based on isLoading, isError, error, and data states.
 */
export const useAsync = (asyncFunction, dependencies = []) => {
  const [fetch, states] = useLazyAsync(asyncFunction);

  useEffect(() => {
    fetch();
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps

  return states;
};

// PropTypes for useAsync hook
useAsync.propTypes = {
  asyncFunction: PropTypes.func.isRequired,
  dependencies: PropTypes.array,
};

/**
 * Custom hook to handle lazy asynchronous operations with loading state, error state, and data retrieval.
 * @param {Function} asyncFunction - The asynchronous function to execute.
 * @returns {[Function, AsyncState]} An array containing a function to trigger the async operation and an object with loading state, error state, and fetched data.
 *
 * @typedef {Object} AsyncState
 * @property {boolean} isLoading - Indicates if the async operation is currently loading.
 * @property {boolean} isError - Indicates if an error occurred during the async operation.
 * @property {any} error - The error object if isError is true, otherwise undefined.
 * @property {any} data - The data retrieved from the async operation, undefined until data is fetched successfully.
 *
 * @typedef {Function} TriggerFunction
 * @param {Array} [dependencies=[]] - Dependencies array to watch for changes and trigger async function.
 *
 * @example
 * // Example usage:
 * const [fetchData, { isLoading, isError, error, data }] = useLazyAsync(() => fetchData(userId));
 * // To fetch data:
 * fetchData([userId]);
 * // Renders based on isLoading, isError, error, and data states.
 */
export const useLazyAsync = (asyncFunction) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const fetchData = async (dependencies = []) => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    setData(null);

    try {
      const result = await asyncFunction(...dependencies);
      setData(result);
    } catch (error) {
      setError(error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return [
    fetchData,
    {
      isLoading,
      isError,
      error,
      data,
    },
  ];
};

// PropTypes for useLazyAsync hook
useLazyAsync.propTypes = {
  asyncFunction: PropTypes.func.isRequired,
};
