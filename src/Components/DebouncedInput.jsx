import { useEffect, useState, useCallback } from "react";

/**
 *
 * @typedef {object} DebouncedInput
 * @property {string} value - value for input
 * @property {function} onChange - onChange event
 * @property {number} debounce - time of debounce in milliseconds
 *
 * @param {DebouncedInput & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>} params
 * @returns {JSX.Element}
 */
export const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}) => {
  const [value, setValue] = useState(initialValue);
  const [changeEvent, setChangeEvent] = useState(null);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // 0.5s after setValue in state
  useEffect(() => {
    if (changeEvent !== null) {
      const timeout = setTimeout(() => {
        onChange(changeEvent);
      }, debounce);

      return () => clearTimeout(timeout);
    }
  }, [value, debounce, onChange, changeEvent]);

  const handleChange = useCallback((event) => {
    setValue(event.target.value);
    setChangeEvent(event);
  }, []);

  return <input {...props} value={value} onChange={handleChange} />;
};
