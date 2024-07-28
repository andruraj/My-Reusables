import { isValidElement, useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { isEmpty } from "@utils/isEmpty";
import PropTypes from "prop-types";

/**
 * @typedef {Object} CollapsibleProps
 * @property {string | number | React.ReactNode} header - The title of the expandable list.
 * @property {string | number | React.ReactNode} content - The content of the expandable list.
 * @property {boolean} [isCollapsed=true] - Boolean flag to control expansion state from outside.
 * @property {string} [headerClassName=''] - Custom TailwindCSS classes for the header.
 * @property {string} [contentClassName=''] - Custom TailwindCSS classes for the content.
 * @property {React.ReactNode} [expandIcon] - Custom Icon for Expand Option
 * @property {React.ReactNode} [collapseIcon] - Custom Icon for Collapse Option
 */

/**
 * Collapsible component.
 * @param {CollapsibleProps & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>} props
 */
export const Collapsible = ({
  header,
  content,
  isCollapsed,
  headerClassName,
  contentClassName,
  expandIcon,
  collapseIcon,
  ...props
}) => {
  /**
   * Manages the state for open/close functionality.
   */
  const [isOpen, setIsOpen] = useState(false);

  // Update internal state when 'isCollapsed' prop changes from outside
  useEffect(() => {
    if (!isEmpty(isCollapsed)) {
      setIsOpen(!isCollapsed);
    }
  }, [isCollapsed]);

  /**
   * Toggles the open/close state.
   * @param {React.MouseEvent<HTMLSpanElement>} e - The click event.
   */
  const toggleOpen = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen((p) => !p);
  };

  return (
    <div className="w-full h-fit select-none" {...props}>
      <div
        className={twMerge(
          "flex justify-start items-center w-full font-semibold",
          headerClassName
        )}
      >
        {!!content && (
          <span
            className={twMerge(
              "cursor-pointer inline-block",
              isOpen ? "px-1" : "px-[4.9px]"
            )}
            onClick={toggleOpen}
            tabIndex={0}
            onKeyDown={(e) =>
              (e.key === "Enter" || e.key === " ") && toggleOpen(e)
            }
            aria-expanded={isOpen}
          >
            {isOpen ? (
              isValidElement(collapseIcon) ? (
                collapseIcon
              ) : (
                <>&#11167;</>
              )
            ) : isValidElement(expandIcon) ? (
              expandIcon
            ) : (
              <>&#11166;</>
            )}
          </span>
        )}
        {header}
      </div>
      <div
        className={twMerge(
          "flex-col items-start w-full pl-4",
          isOpen ? "flex" : "hidden",
          contentClassName
        )}
      >
        {!isEmpty(content) &&
        (typeof content === "string" ||
          typeof content === "number" ||
          isValidElement(content)) ? (
          content
        ) : (
          // Handle unexpected content types gracefully
          <div className="w-full h-full grid place-items-center">
            Invalid Content Type
          </div>
        )}
      </div>
    </div>
  );
};

// PropTypes
Collapsible.propTypes = {
  header: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.node,
  ]).isRequired,
  content: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.node,
  ]).isRequired,
  isCollapsed: PropTypes.bool,
  headerClassName: PropTypes.string,
  contentClassName: PropTypes.string,
};
