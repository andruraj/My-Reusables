import { useEffect, useRef } from "react";
import PropTypes from "prop-types";

/**
 * Custom hook to attach an event listener to a DOM element.
 * @param {'click' | 'contextmenu' | 'dblclick' | 'mousedown' | 'mouseenter' | 'mouseleave' | 'mousemove' | 'mouseover' | 'mouseout' | 'mouseup' | 'keydown' | 'keypress' | 'keyup' | 'focus' | 'blur' | 'change' | 'submit' | 'input' | 'scroll' | 'load' | 'unload' | 'resize' | 'error' | 'abort' | 'transitionend' | 'animationstart' | 'animationend' | 'animationiteration' | 'dragstart' | 'drag' | 'dragenter' | 'dragover' | 'dragleave' | 'drop' | 'dragend'} eventType - The type of event to listen for (e.g., 'click', 'keydown').
 * @param {function} callback - The callback function to execute when the event is triggered.
 * @param {HTMLElement} [element=window] - The DOM element to attach the event listener to (default is window).
 *
 * @example
 * // Example usage:
 * useEventListener('click', handleClick, buttonRef.current);
 */
export const useEventListener = (eventType, callback, element = window) => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const eventListener = (event) => callbackRef.current(event);
    element.addEventListener(eventType, eventListener);

    return () => {
      element.removeEventListener(eventType, eventListener);
    };
  }, [eventType, element]);
};

let PropTypesHTMLElement = PropTypes.any; // Default to any type

if (typeof HTMLElement !== "undefined") {
  PropTypesHTMLElement = PropTypes.instanceOf(HTMLElement);
}

// PropTypes for useEventListener hook
useEventListener.propTypes = {
  eventType: PropTypes.oneOf([
    "click",
    "contextmenu",
    "dblclick",
    "mousedown",
    "mouseenter",
    "mouseleave",
    "mousemove",
    "mouseover",
    "mouseout",
    "mouseup",
    "keydown",
    "keypress",
    "keyup",
    "focus",
    "blur",
    "change",
    "submit",
    "input",
    "scroll",
    "load",
    "unload",
    "resize",
    "error",
    "abort",
    "transitionend",
    "animationstart",
    "animationend",
    "animationiteration",
    "dragstart",
    "drag",
    "dragenter",
    "dragover",
    "dragleave",
    "drop",
    "dragend",
  ]).isRequired,
  callback: PropTypes.func.isRequired,
  element: PropTypesHTMLElement,
};
