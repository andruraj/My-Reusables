import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { isEmpty } from "@utils/isEmpty";
import { twMerge } from "tailwind-merge";

/**
 * A segmented control component for selecting from a list of items.
 * @param {Object} props - Component props.
 * @param {Array} props.items - The list of items to be displayed in the segmented control.
 * @param {React.CSSProperties} [props.style={}] - Css Styles for Container
 * @param {React.CSSProperties} [props.itemsStyle={}] - Css styles for items
 * @param {string|number} props.selected - The currently selected item.
 * @param {Function} props.onChange - Function to handle item selection change.
 * @returns {JSX.Element} SwitchItems component.
 */
export const SwitchItems = ({
  items = ["Item1", "Item2"],
  style,
  itemsStyle,
  selected,
  onChange,
}) => {
  // Validate props
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Items prop must be a non-empty array.");
  }

  const active = useMemo(() => {
    if (!isEmpty(selected)) {
      if (typeof selected === "string") {
        return items.indexOf(selected);
      }
      if (
        typeof selected === "number" &&
        selected >= 0 &&
        selected < items.length
      ) {
        return selected;
      }
    }
    return -1; // Default to no active item
  }, [selected, items]);

  return (
    <div
      className="bg-accent text-white shadow rounded inline-block py-0.5 px-1 select-none"
      style={{ ...style }}
    >
      {items.map((item, i) => (
        <div
          className={twMerge(
            "rounded inline-block py-2 px-3 cursor-pointer",
            active === i
              ? "bg-white text-accent font-bold shadow shadow-black animate-bounce"
              : "bg-transparent"
          )}
          onClick={() => onChange(item)}
          style={{ ...itemsStyle }}
          key={i}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

// Prop types validation
SwitchItems.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  selected: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
};
