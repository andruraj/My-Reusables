import { useCallback, useRef, useState } from "react";
import PropTypes from "prop-types";

/**
 * Custom hook to manage state with history and undo/redo functionality.
 * @param {any} defaultValue - The initial value of the state.
 * @param {Object} options - Options for the hook.
 * @param {number|null} options.capacity - The maximum number of history entries to keep. Pass null for unlimited capacity.
 * @param {Array<Function>} [options.middleware=[]] - Array of middleware functions.
 * @returns {[any, HistoryObject]} - The current value, a setter function, and an object with history management functions.
 *
 * @typedef {object} HistoryObject
 * @property {Array} history - The history of state values.
 * @property {number} pointer - The current pointer in the history.
 * @property {boolean} canUndo - If undo available.
 * @property {Function} undo - Function to undo the last state change.
 * @property {boolean} canRedo - If redo available.
 * @property {Function} redo - Function to redo the last undone state change.
 * @property {(number) => void} goto - Function to go to a specific history index.
 * @property {(number) => void} set - Function to set value of state.
 */
export const useStateWithHistory = (
  defaultValue,
  { capacity = null, middleware = [] } = {}
) => {
  const [value, setValue] = useState(defaultValue);

  const historyRef = useRef([value]);
  const pointerRef = useRef(0);

  const executeMiddleware = useCallback(() => {
    middleware.forEach((mw) => {
      try {
        mw(historyRef.current[pointerRef.current]);
      } catch (error) {
        console.error(`Middleware Error: ${error.message}`);
        // Optionally, handle or log the error in a different way, such as notifying the user.
      }
    });
  }, [middleware]);

  const set = useCallback(
    (v) => {
      const resolvedValue = typeof v === "function" ? v(value) : v;

      if (historyRef.current[pointerRef.current] !== resolvedValue) {
        historyRef.current = [
          ...historyRef.current.slice(0, pointerRef.current + 1),
          resolvedValue,
        ];

        if (capacity !== null && historyRef.current.length > capacity) {
          historyRef.current = historyRef.current.slice(
            historyRef.current.length - capacity
          );
        }

        pointerRef.current = historyRef.current.length - 1;
      }

      setValue(resolvedValue);

      executeMiddleware();
    },
    [capacity, executeMiddleware, value]
  );

  const undo = useCallback(() => {
    if (pointerRef.current <= 0) return;

    pointerRef.current--;
    setValue(historyRef.current[pointerRef.current]);

    executeMiddleware();
  }, [executeMiddleware]);

  const redo = useCallback(() => {
    if (pointerRef.current >= historyRef.current.length - 1) return;

    pointerRef.current++;
    setValue(historyRef.current[pointerRef.current]);

    executeMiddleware();
  }, [executeMiddleware]);

  const goto = useCallback(
    (index) => {
      if (
        index < 0 ||
        index >= historyRef.current.length ||
        index === pointerRef.current
      )
        return;

      pointerRef.current = index;
      setValue(historyRef.current[pointerRef.current]);

      executeMiddleware();
    },
    [executeMiddleware]
  );

  const canUndo = historyRef.current.length > 0;

  const canRedo = historyRef.current.length - 1 > pointerRef.current;

  return [
    value,
    {
      history: historyRef.current,
      pointer: pointerRef.current,
      canUndo,
      undo,
      canRedo,
      redo,
      goto,
      set,
    },
  ];
};

// PropTypes
useStateWithHistory.propTypes = {
  defaultValue: PropTypes.any.isRequired,
  options: PropTypes.shape({
    capacity: PropTypes.number,
    middleware: PropTypes.arrayOf(PropTypes.func),
  }),
};
