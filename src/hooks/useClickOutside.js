import { useEventListener } from "./useEventListener";
import PropTypes from "prop-types";

/**
 * Custom hook that invokes a callback when a click occurs outside a specified DOM element.
 * @param {React.RefObject<HTMLElement>} ref - Reference to the DOM element that triggers the click outside behavior.
 * @param {Function} callback - Callback function to execute when a click occurs outside the specified element.
 *
 * @example
 * // Example usage:
 * const dropdownRef = useRef(null);
 * const closeDropdown = () => {
 *   // Close dropdown logic
 * };
 * useClickOutside(dropdownRef, closeDropdown);
 */
export const useClickOutside = (ref, callback) => {
  if (typeof window !== "undefined") {
    useEventListener(
      "click",
      (e) => {
        if (ref.current === null || ref.current.contains(e.target)) return;

        callback(e);
      },
      document
    );
  }
};

let PropTypesHTMLElement = PropTypes.any; // Default to any type

if (typeof HTMLElement !== "undefined") {
  PropTypesHTMLElement = PropTypes.instanceOf(HTMLElement);
}

// PropTypes for useClickOutside hook
useClickOutside.propTypes = {
  ref: PropTypes.shape({
    current: PropTypesHTMLElement,
  }).isRequired,
  callback: PropTypes.func.isRequired,
};
