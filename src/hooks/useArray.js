import { useState } from "react";
import PropTypes from "prop-types";

/**
 * Custom hook to manage an array state with various helper functions.
 * @param {Array} defaultValue - The initial value of the array.
 * @returns {ReturnObject} - An object containing the array, functions to manipulate the array, and the array length.
 *
 * @typedef {object} ReturnObject
 * @property {Array} array - The current array state.
 * @property {Function} set - The function to set the array state.
 * @property {(element: any) => void} pushBottom - Function to add an element to the bottom of the array.
 * @property {(element: any) => void} pushTop - Function to add an element to the top of the array.
 * @property {(element: any) => void} removeBottom - Function to remove the last element from the array.
 * @property {(element: any) => void} removeTop - Function to remove the first element from the array.
 * @property {(callback: Function) => void} filter - Function to filter the array based on a callback.
 * @property {(index: number, newElement: any) => void} update - Function to update an element at a specific index.
 * @property {(index: number) => void} remove - Function to remove an element at a specific index.
 * @property {() => void} clear - Function to clear the array.
 * @property {() => number} size - The length of the array.
 * @property {any} first - First element of the array.
 * @property {any} last - Last element of the array.
 */
export const useArray = (defaultValue) => {
  const [array, setArray] = useState(defaultValue);

  const pushBottom = (element) => setArray((a) => [...a, element]);

  const pushTop = (element) => setArray((a) => [element, ...a]);

  const removeBottom = () => setArray((a) => a.pop());

  const removeTop = () => setArray((a) => a.shift());

  const size = () => array.length;

  const first = () => array[0];

  const last = () => array[array.length - 1];

  const filter = (callback) => setArray((a) => a.filter(callback));

  const update = (index, newElement) =>
    setArray((a) => [...a.slice(0, index), newElement, ...a.slice(index + 1)]);

  const remove = (index) =>
    setArray((a) => [...a.slice(0, index), ...a.slice(index + 1)]);

  const clear = () => setArray([]);

  return {
    array,
    set: setArray,
    pushTop,
    pushBottom,
    filter,
    update,
    remove,
    removeTop,
    removeBottom,
    clear,
    first,
    last,
    size,
  };
};

useArray.propTypes = {
  defaultValue: PropTypes.array.isRequired,
};
