import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const DEFAULT_OPTIONS = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};

/**
 * Custom hook to handle fetching data from an API endpoint using fetch() with options and dependencies.
 * Fetch operation is initiated immediately upon hook invocation.
 * @param {string} url - The URL endpoint to fetch data from.
 * @param {Object} [options={}] - Additional options to customize the fetch request (e.g., headers, method).
 * @param {Array} [dependencies=[]] - Dependencies array to watch for changes and trigger fetch request.
 * @returns {FetchState} Object containing loading state, error state, and fetched data.
 *
 * @typedef {Object} FetchState
 * @property {boolean} isLoading - Indicates if the fetch operation is currently loading.
 * @property {boolean} isError - Indicates if an error occurred during the fetch operation.
 * @property {any} error - The error object if isError is true, otherwise undefined.
 * @property {any} data - The data retrieved from the fetch operation, undefined until data is fetched successfully.
 *
 * @example
 * // Example usage:
 * const { isLoading, isError, error, data } = useFetch("https://api.example.com/data", { method: "GET" }, [userId]);
 * // Renders based on isLoading, isError, error, and data states.
 */
export const useFetch = (url, options = {}, dependencies = []) => {
  const [fetchData, states] = useLazyFetch(url, options);

  useEffect(() => {
    fetchData();
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps

  return states;
};

// PropTypes for useFetch hook
useFetch.propTypes = {
  url: PropTypes.string.isRequired,
  options: PropTypes.object,
  dependencies: PropTypes.array,
};

/**
 * Custom hook to handle fetching data from an API endpoint using fetch() with options and dependencies.
 * Fetch operation is initiated on request via the fetchData function.
 *
 * @typedef {Object} FetchState
 * @property {boolean} isLoading - Indicates if the fetch operation is currently loading.
 * @property {boolean} isError - Indicates if an error occurred during the fetch operation.
 * @property {any} error - The error object if isError is true, otherwise undefined.
 * @property {any} data - The data retrieved from the fetch operation, undefined until data is fetched successfully.
 * @property {Function} fetchData - Function to manually trigger the fetch operation.
 *
 * @param {string} url - The URL endpoint to fetch data from.
 * @param {Object} [options={}] - Additional options to customize the fetch request (e.g., headers, method).
 * @returns {[Function, FetchState]} Array containing a function to manually trigger fetch and an object with loading state, error state, fetched data.
 *
 * @example
 * // Example usage:
 * const [fetchData, { isLoading, isError, error, data }] = useLazyFetch("https://api.example.com/data", { method: "GET" });
 * // Renders based on isLoading, isError, error, and data states, and triggers fetch using fetchData function.
 */
export const useLazyFetch = (url, options = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    setData(null);

    const mergedOptions = deepMerge(DEFAULT_OPTIONS, options);

    try {
      const res = await fetch(url, mergedOptions);

      if (!res.ok) {
        const errorResponse = await res.json();
        throw new Error(errorResponse.message || "Failed to fetch data");
      }

      const contentType = res.headers.get("Content-Type");
      const result =
        contentType && contentType.includes("application/json")
          ? await res.json()
          : await res.text();

      setData(result);
    } catch (error) {
      setError(error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return [fetchData, { isLoading, isError, error, data }];
};

// PropTypes for useLazyFetch hook
useLazyFetch.propTypes = {
  url: PropTypes.string.isRequired,
  options: PropTypes.object,
};
