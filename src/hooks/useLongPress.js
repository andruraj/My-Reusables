import { useEffectOnce } from "./useEffectOnce";
import { useEventListener } from "./useEventListener";
import { useTimeout } from "./useTimeout";
import PropTypes from "prop-types";

/**
 * Custom hook to detect long press (press and hold) gesture on a DOM element.
 * @param {React.RefObject<HTMLElement>} ref - Reference to the DOM element on which to detect long press.
 * @param {Function} callback - Callback function to execute when a long press is detected.
 * @param {number} [delay=250] - Delay in milliseconds to determine the threshold for a long press.
 *
 * @example
 * // Example usage:
 * const buttonRef = useRef(null);
 * const handleLongPress = () => {
 *   console.log("Long press detected!");
 *   // Perform actions for long press
 * };
 * useLongPress(buttonRef, handleLongPress, { delay: 500 });
 */
export const useLongPress = (ref, callback, delay = 250) => {
  const { reset, clear } = useTimeout(callback, delay);

  useEffectOnce(clear);

  useEventListener("mousedown", reset, ref.current);
  useEventListener("touchstart", reset, ref.current);
  useEventListener("mouseup", clear, ref.current);
  useEventListener("mouseleave", clear, ref.current);
  useEventListener("touchend", clear, ref.current);
};

// PropTypes for useLongPress hook
useLongPress.propTypes = {
  ref: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }).isRequired,
  callback: PropTypes.func.isRequired,
  options: PropTypes.shape({
    delay: PropTypes.number,
  }),
};
