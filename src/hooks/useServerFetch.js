import { useEffect, useState } from "react";
import { apiCall } from "../serverActions/apiCall";
import PropTypes from "prop-types";

/**
 * Custom hook to handle fetching data from an API endpoint using fetch() with options and dependencies.
 * Fetch operation is initiated immediately upon hook invocation.
 * @param {string | URL | Request} url - The URL endpoint to fetch data from.
 * @param {RequestInit} [options={}] - Additional options to customize the fetch request (e.g., headers, method).
 * @param {Array} [dependencies=[]] - Dependencies array to watch for changes and trigger fetch request.
 * @returns {FetchState} Object containing loading state, error state, and fetched data.
 *
 * @typedef {Object} FetchState
 * @property {boolean} isLoading - Indicates if the fetch operation is currently loading.
 * @property {boolean} isError - Indicates if an error occurred during the fetch operation.
 * @property {boolean} isSuccess - Indicates if the response is ok during the fetch operation.
 * @property {any} error - The error object if isError is true, otherwise undefined.
 * @property {any} data - The data retrieved from the fetch operation, undefined until data is fetched successfully.
 * @property {Function} reset - Resets all states to its default values.
 *
 * @example
 * // Example usage:
 * const { isLoading, isError, error, data } = useFetch("https://api.example.com/data", { method: "GET" }, [userId]);
 * // Renders based on isLoading, isError, error, and data states.
 */
export const useServerFetch = (url, options = {}, dependencies = []) => {
  const [fetchData, states] = useLazyFetch(url);

  useEffect(() => {
    fetchData(options);
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps

  return states;
};

// PropTypes for useFetch hook
useServerFetch.propTypes = {
  url: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(URL),
    PropTypes.instanceOf(Request),
  ]).isRequired,
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
 * @property {boolean} isSuccess - Indicates if the response is ok during the fetch operation.
 * @property {any} error - The error object if isError is true, otherwise undefined.
 * @property {any} data - The data retrieved from the fetch operation, undefined until data is fetched successfully.
 * @property {Function} reset - Resets all states to default.
 * @property {Function} fetchData - Function to manually trigger the fetch operation.
 *
 * @param {string | URL | Request} url - The URL endpoint to fetch data from.
 * @returns {[typeof fetchData, FetchState]} Array containing a function to manually trigger fetch and an object with loading state, error state, success state, fetched data and a reset function.
 *
 * @example
 * // Example usage:
 * const [fetchData, { isLoading, isError, isSuccess, error, data, reset }] = useLazyFetch("https://api.example.com/data", { method: "GET" });
 * // Renders based on isLoading, isError, error, and data states, and triggers fetch using fetchData function.
 */
export const useLazyServerFetch = (url) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const reset = () => {
    setIsLoading(false);
    setIsError(false);
    setIsSuccess(false);
    setError(null);
    setData(null);
  };

  /**
   * @param {string | string[][] | Record<string, string> | URLSearchParams} queryParams - Query parameters to be included in the url
   * @param {RequestInit} [options={}] - Additional options to customize the fetch request (e.g., headers, method).
   * @returns {void}
   */
  const fetchData = async (queryParams = {}, options = {}) => {
    setIsLoading(false);
    setIsError(false);
    setIsSuccess(false);
    setError(null);
    setData(null);

    try {
      const queryString = new URLSearchParams(queryParams).toString();
      const fullUrl = queryString ? `${url}?${queryString}` : url;

      const res = await apiCall(fullUrl, options);

      setData(res);
    } catch (error) {
      setError(error);
      setIsError(true);
    } finally {
      setIsLoading(false);
      setIsSuccess(true);
    }
  };

  return [fetchData, { isLoading, isError, isSuccess, error, data, reset }];
};

// PropTypes for useLazyFetch hook
useLazyServerFetch.propTypes = {
  url: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(URL),
    PropTypes.instanceOf(Request),
  ]).isRequired,
  options: PropTypes.object,
};
