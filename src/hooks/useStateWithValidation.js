import { useCallback, useState } from "react";
import PropTypes from "prop-types";

/**
 * Custom hook to manage state with validation and track validity.
 * @param {Function} validationFunc - Function to validate the state value.
 * @param {any} initialValue - Initial value for the state.
 * @returns {[any, Function, boolean]} Tuple containing state value, function to update state with validation, and boolean indicating validity.
 *
 * @example
 * // Example usage:
 * const isNotEmpty = (value) => value.trim() !== "";
 * const [name, setName, isNameValid] = useStateWithValidation(isNotEmpty, "");
 * // Renders based on name state and isNameValid indicating validity.
 */
export const useStateWithValidation = (validationFunc, initialValue) => {
  const [state, setState] = useState(initialValue);
  const [isValid, setIsValid] = useState(() => validationFunc(initialValue));

  /**
   * Function to update state value and validate it.
   * @param {any|Function} nextState - Next state value or function to compute next state based on current state.
   */
  const onChange = useCallback(
    (nextState) => {
      const value =
        typeof nextState === "function" ? nextState(state) : nextState;

      setState(value);
      setIsValid(validationFunc(value));
    },
    [state, validationFunc]
  );

  return [state, onChange, isValid];
};

// PropTypes for useStateWithValidation hook
useStateWithValidation.propTypes = {
  validationFunc: PropTypes.func.isRequired,
  initialValue: PropTypes.any,
};
