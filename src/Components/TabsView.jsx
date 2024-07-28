import { isValidElement, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

/**
 * @typedef {Object} Tab
 * @property {React.ReactNode} header - The header content for the tab.
 * @property {React.ReactNode} content - The content for the tab.
 */

/**
 * A multi-tab window component.
 * @param {Object} props - Component props.
 * @param {number} props.activeTab - The index of the initially active tab.
 * @param {Tab[]} [props.tabs] - An array of tabs containing header and content.
 * @param {function} props.onTabChange - Function to handle tab changes.
 * @returns {JSX.Element} TabsView component.
 */
export const TabsView = ({
  activeTab: propActiveTab = 0,
  onTabChange,
  tabs = [],
  className,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const contentRef = useRef(null);

  useEffect(() => {
    if (
      typeof propActiveTab === "number" &&
      propActiveTab >= 0 &&
      propActiveTab < tabs.length
    ) {
      setActiveTab(propActiveTab);
    } else {
      setActiveTab(0);
    }

    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [propActiveTab, tabs]);

  const handleTabClick = (index) => {
    setActiveTab(index);
    if (onTabChange) {
      onTabChange(index);
    }
  };

  const isRenderable = (element) =>
    (typeof element === "string" && element.trim().length > 0) ||
    isValidElement(element);

  if (!Array.isArray(tabs) || tabs.length === 0) {
    return null; // Don't render if tabs is not an array or is empty
  }

  return (
    <div className={twMerge("overflow-hidden h-full w-full", className)}>
      <div className="flex overflow-x-auto bg-transparent">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={twMerge(
              "py-2 px-4 cursor-pointer text-xs font-medium text-white rounded-t-md",
              activeTab === index
                ? "bg-secondary"
                : "bg-primary hover:bg-accent"
            )}
            onClick={() => handleTabClick(index)}
          >
            {isRenderable(tab.header) ? tab.header : "Invalid Header"}
          </div>
        ))}
      </div>
      <div
        className="w-full h-[calc(100%-32px)] border border-primary overflow-auto"
        ref={contentRef}
      >
        {tabs.map((tab, index) => (
          <div key={index} className={activeTab === index ? "block" : "hidden"}>
            {isRenderable(tab.content) ? tab.content : "Invalid Content"}
          </div>
        ))}
      </div>
    </div>
  );
};
