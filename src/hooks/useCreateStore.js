import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { isShallowEqual } from "@utils/isEqual";

/**
 * Creates a new store with an initial state and actions to update the state.
 * @param {function} initialState - A function returning the initial state of the store.
 * @returns {function} A custom hook to use the store.
 */
export const useCreateStore = (initialState) => {
  let state = initialState();
  let listeners = new Map();

  const setState = (partial) => {
    let updatedState = {};

    Object.keys(partial).forEach((key) => {
      const val = partial[key];
      updatedState[key] = typeof val === "function" ? val(state[key]) : val;
    });

    const newState = { ...state, ...updatedState };
    if (isShallowEqual(state, newState)) return; // Prevent unnecessary updates
    state = newState;
    listeners.forEach((listener) => listener(state));
  };

  const useStore = () => {
    const [, setRender] = useState(state);

    useEffect(() => {
      const listener = (newState) => setRender(newState);
      listeners.set(listener, listener);
      return () => {
        listeners.delete(listener);
      };
    }, []);

    return [state, setState];
  };

  return useStore;
};

/**
 * PropTypes for store state and actions.
 */
export const StorePropTypes = {
  state: PropTypes.object.isRequired,
  setState: PropTypes.func.isRequired,
};
