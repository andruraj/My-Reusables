import { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Portal } from "./Portal";
import { useClickOutside } from "@hooks/useClickOutside";

/**
 * Popup component that displays content in a popup based on trigger and position.
 *
 * @typedef {object} PopupProps - Popup component props.
 * @property {React.ReactNode} popupContent - Content to be displayed in the popup.
 * @property {React.ReactNode} children - Element triggering the popup.
 * @property {boolean} [isOpen=false] - Visibility of the popup when it is controlled.
 * @property {"click" | "hover"} [trigger="click"] - How the popup is triggered ('hover' or 'click').
 * @property {number} [gap=0] - Gap between the trigger element and the popup.
 * @property {"top" | "topLeft" | "topRight" | "left" | "leftTop" | "leftBottom" | "right" | "rightTop" | "rightBottom" | "bottom" | "bottomLeft" | "bottomRight"} [placement="center"] - Placement of the popup.
 * @property {number} [zIndex=10] - Z-index of the popup.
 * @property {number} [triggerDuration=0] - Delay for closing on hover (in milliseconds).
 * @property {boolean} [maskClosable=false] - Whether to Close the Popup on Clicking Outside Popup
 *
 * @param {PopupProps} props - Popup Component Props
 * @returns {JSX.Element} - Popup component UI.
 */
export const Popup = ({
  popupContent,
  children,
  isOpen: defaultOpen,
  trigger = "click",
  gap = 0,
  placement = "center",
  zIndex = 10,
  triggerDuration = 0,
  maskClosable = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: -500, left: -500 });
  const popupWrapperRef = useRef(null);
  const popupContentRef = useRef(null);

  useClickOutside(popupContentRef, () => {
    if (trigger === "click" && maskClosable) {
      setIsOpen(false);
    }
  });

  const calculatePosition = useCallback(() => {
    const wrapperRect = popupWrapperRef.current.getBoundingClientRect();
    const popupRect = popupContentRef.current.getBoundingClientRect();
    const browserWindowHeight = window.innerHeight;
    const browserWindowWidth = window.innerWidth;

    let pos = JSON.parse(JSON.stringify(position));

    switch (placement) {
      case "top": {
        pos.top =
          wrapperRect.top - popupRect.height - gap < 0
            ? wrapperRect.bottom + gap
            : wrapperRect.top - popupRect.height - gap;
        pos.left =
          wrapperRect.left + wrapperRect.width / 2 - popupRect.width / 2;
        break;
      }
      case "topLeft": {
        pos.top =
          wrapperRect.top - popupRect.height - gap < 0
            ? wrapperRect.bottom + gap
            : wrapperRect.top - popupRect.height - gap;
        pos.left = wrapperRect.left;
        break;
      }
      case "topRight": {
        pos.top =
          wrapperRect.top - popupRect.height - gap < 0
            ? wrapperRect.bottom + gap
            : wrapperRect.top - popupRect.height - gap;
        pos.left = wrapperRect.right - popupRect.width;
        break;
      }
      case "left": {
        pos.top =
          wrapperRect.top + wrapperRect.height / 2 - popupRect.height / 2;
        pos.left =
          wrapperRect.left - popupRect.width - gap < 0
            ? wrapperRect.right + gap
            : wrapperRect.left - popupRect.width - gap;
        break;
      }
      case "leftTop": {
        pos.top = wrapperRect.top;
        pos.left =
          wrapperRect.left - popupRect.width - gap < 0
            ? wrapperRect.right + gap
            : wrapperRect.left - popupRect.width - gap;
        break;
      }
      case "leftBottom": {
        pos.top = wrapperRect.bottom - popupRect.height;
        pos.left =
          wrapperRect.left - popupRect.width - gap < 0
            ? wrapperRect.right + gap
            : wrapperRect.left - popupRect.width - gap;
        break;
      }
      case "right": {
        pos.top =
          wrapperRect.top + wrapperRect.height / 2 - popupRect.height / 2;
        pos.left =
          wrapperRect.right + popupRect.width + gap > browserWindowWidth
            ? wrapperRect.left - popupRect.width - gap
            : wrapperRect.right + gap;
        break;
      }
      case "rightTop": {
        pos.top = wrapperRect.top;
        pos.left =
          wrapperRect.right + popupRect.width + gap > browserWindowWidth
            ? wrapperRect.left - popupRect.width - gap
            : wrapperRect.right + gap;
        break;
      }
      case "rightBottom": {
        pos.top = wrapperRect.bottom - popupRect.height;
        pos.left =
          wrapperRect.right + popupRect.width + gap > browserWindowWidth
            ? wrapperRect.left - popupRect.width - gap
            : wrapperRect.right + gap;
        break;
      }
      case "bottom": {
        pos.top =
          wrapperRect.bottom + popupRect.height + gap > browserWindowHeight
            ? wrapperRect.top - popupRect.height - gap
            : wrapperRect.bottom + gap;
        pos.left =
          wrapperRect.left + wrapperRect.width / 2 - popupRect.width / 2;
        break;
      }
      case "bottomLeft": {
        pos.top =
          wrapperRect.bottom + popupRect.height + gap > browserWindowHeight
            ? wrapperRect.top - popupRect.height - gap
            : wrapperRect.bottom + gap;
        pos.left = wrapperRect.left;
        break;
      }
      case "bottomRight": {
        pos.top =
          wrapperRect.bottom + popupRect.height + gap > browserWindowHeight
            ? wrapperRect.top - popupRect.height - gap
            : wrapperRect.bottom + gap;
        pos.left = wrapperRect.right - popupRect.width;
        break;
      }
      case "center":
      default:
        {
          pos.top =
            wrapperRect.top + wrapperRect.height / 2 - popupRect.height / 2;
          pos.left =
            wrapperRect.left + wrapperRect.width / 2 - popupRect.width / 2;
        }
        break;
    }

    if (JSON.stringify(pos) !== JSON.stringify(position)) {
      setPosition(pos);
    }
  }, [gap, placement]);

  useEffect(() => {
    if (popupWrapperRef.current && popupContentRef.current) {
      calculatePosition();
    }

    window.addEventListener("resize", calculatePosition);
    return () => window.removeEventListener("resize", calculatePosition);
  }, [calculatePosition, popupWrapperRef.current, popupContentRef.current]);

  useEffect(() => {
    setIsOpen(!!defaultOpen);
  }, [defaultOpen]);

  return (
    <div
      id="popup-wrapper"
      className="cursor-pointer inline-block"
      onClick={
        trigger === "click"
          ? (e) => {
              e.preventDefault();
              e.stopPropagation();

              setIsOpen((p) => !p);
            }
          : undefined
      }
      onMouseEnter={
        trigger === "hover"
          ? (e) => {
              e.preventDefault();
              e.stopPropagation();

              setIsOpen(true);
            }
          : undefined
      }
      onMouseLeave={
        trigger === "hover"
          ? (e) => {
              e.preventDefault();
              e.stopPropagation();

              setIsOpen(false);
            }
          : undefined
      }
      ref={popupWrapperRef}
    >
      {children}

      <Portal>
        <div
          style={{
            position: "absolute",
            top: position.top,
            left: position.left,
            zIndex: zIndex,
            visibility: isOpen ? "visible" : "hidden",
            opacity: isOpen ? 1 : 0,
            transition: `all ${triggerDuration}s`,
          }}
          ref={popupContentRef}
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={(e) => e.stopPropagation()}
          onMouseLeave={(e) => e.stopPropagation()}
        >
          {popupContent}
        </div>
      </Portal>
    </div>
  );
};

Popup.propTypes = {
  popupContent: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
  isOpen: PropTypes.bool,
  trigger: PropTypes.oneOf(["click", "hover"]),
  gap: PropTypes.number,
  placement: PropTypes.oneOf([
    "top",
    "topLeft",
    "topRight",
    "left",
    "leftTop",
    "leftBottom",
    "right",
    "rightTop",
    "rightBottom",
    "bottom",
    "bottomLeft",
    "bottomRight",
  ]),
  zIndex: PropTypes.number,
  triggerDuration: PropTypes.number,
};
