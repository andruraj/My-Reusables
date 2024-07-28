import { isDeepEqual } from "@utils/isEqual";
import { useState, useCallback } from "react";

/**
 * @typedef {Object} State
 * @property {Array<any>} past - Array of past states.
 * @property {any} present - The current state.
 * @property {Array<any>} future - Array of future states.
 */

/**
 * Initializes the state for useStateNavigator hook.
 * @param {any} initialValue - The initial state value.
 * @returns {State} The initial state object.
 */
const initialState = (initialValue) => ({
  past: [],
  present: initialValue,
  future: [],
});

/**
 * Custom hook for managing undo, redo, and reset functionality.
 * @param {any} initialValue - The initial state value.
 * @param {Array<Function>} [middleware=[]] - Array of middleware functions.
 * @param {number|null} [MAX_HISTORY_LENGTH=null] - Maximum length for history.
 * @returns {[
 *  state: State,
 * {
 *  set: (newState: any) => void,
 *  undo: () => void,
 *  redo: () => void,
 *  reset: (newState: any) => void,
 *  canUndo: boolean,
 *  canRedo: boolean
 * }]}
 */
export const useStateNavigator = (
  initialValue,
  middleware = [],
  MAX_HISTORY_LENGTH = null
) => {
  const [state, setState] = useState(initialState(initialValue));

  const enhancedSetState = (updateFn) => {
    setState((prevState) => {
      const nextState = updateFn(prevState);
      middleware.forEach((mw) => {
        try {
          mw(prevState, nextState);
        } catch (error) {
          console.error("Middleware Error: ", error);
        }
      });
      return nextState;
    });
  };

  const set = useCallback(
    (newState) => {
      enhancedSetState((currentState) => {
        if (isDeepEqual(newState, currentState.present)) return currentState;

        const newPast = !!MAX_HISTORY_LENGTH
          ? [...currentState.past, currentState.present].slice(
              -MAX_HISTORY_LENGTH
            )
          : [...currentState.past, currentState.present];
        return {
          past: newPast,
          present: newState,
          future: [],
        };
      });
    },
    [MAX_HISTORY_LENGTH]
  );

  const undo = useCallback(() => {
    enhancedSetState((currentState) => {
      if (currentState.past.length === 0) return currentState;
      const previous = currentState.past[currentState.past.length - 1];
      const newPast = currentState.past.slice(0, -1);
      return {
        past: newPast,
        present: previous,
        future: [currentState.present, ...currentState.future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    enhancedSetState((currentState) => {
      if (currentState.future.length === 0) return currentState;
      const next = currentState.future[0];
      const newFuture = currentState.future.slice(1);
      return {
        past: [...currentState.past, currentState.present],
        present: next,
        future: newFuture,
      };
    });
  }, []);

  const reset = useCallback((newState) => {
    setState(initialState(newState));
  }, []);

  const canUndo = state.past.length !== 0;
  const canRedo = state.future.length !== 0;

  return [
    state,
    {
      set,
      undo,
      redo,
      reset,
      canUndo,
      canRedo,
    },
  ];
};
