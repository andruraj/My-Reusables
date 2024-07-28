import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import PropTypes from "prop-types";
import { twMerge } from "tailwind-merge";

/**
 * IPadScrollView Component
 * A custom scrollable container with ipad like scrollbar thumbs for both vertical and horizontal scrolling.
 *
 * @typedef {object} IPadScrollViewProps
 * @property {React.ReactNode} children - The content to be displayed inside the scrollable container.
 * @property {string} className - Additional classes to apply to the container.
 * @property {import("react").CSSProperties} style - Inline styles to apply to the container.
 */
export const IPadScrollView = ({ children, className, style }) => {
  const contentRef = useRef(null);
  const verticalThumbRef = useRef(null);
  const horizontalThumbRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [initialScroll, setInitialScroll] = useState({ top: 0, left: 0 });
  const [scrollStartPosition, setScrollStartPosition] = useState({
    x: 0,
    y: 0,
  });
  const [thumbSize, setThumbSize] = useState({ height: 20, width: 20 });
  const [showVerticalThumb, setShowVerticalThumb] = useState(false);
  const [showHorizontalThumb, setShowHorizontalThumb] = useState(false);

  /**
   * Handles the start of dragging the scrollbar thumb.
   * @param {MouseEvent} e - The mouse down event.
   * @param {string} direction - The direction of the scroll ('vertical' or 'horizontal').
   */
  const handleThumbMousedown = useCallback((e, direction) => {
    e.preventDefault();
    setIsDragging(direction);
    setInitialScroll({
      top: contentRef.current.scrollTop,
      left: contentRef.current.scrollLeft,
    });
    setScrollStartPosition({ x: e.clientX, y: e.clientY });
  }, []);

  /**
   * Handles the end of dragging the scrollbar thumb.
   */
  const handleThumbMouseup = useCallback(() => {
    setIsDragging(false);
  }, []);

  /**
   * Handles mouse movement while dragging the scrollbar thumb.
   * @param {MouseEvent} e - The mouse move event.
   */
  const handleThumbMousemove = useCallback(
    (e) => {
      if (isDragging) {
        const content = contentRef.current;
        const { scrollHeight, scrollWidth, clientHeight, clientWidth } =
          content;

        if (isDragging === "vertical") {
          const deltaY = e.clientY - scrollStartPosition.y;
          const newScrollTop =
            initialScroll.top + (deltaY * scrollHeight) / clientHeight;
          content.scrollTop = Math.min(
            newScrollTop,
            scrollHeight - clientHeight
          );
        }

        if (isDragging === "horizontal") {
          const deltaX = e.clientX - scrollStartPosition.x;
          const newScrollLeft =
            initialScroll.left + (deltaX * scrollWidth) / clientWidth;
          content.scrollLeft = Math.min(
            newScrollLeft,
            scrollWidth - clientWidth
          );
        }
      }
    },
    [isDragging, initialScroll, scrollStartPosition]
  );

  /**
   * Updates the scrollbar thumb position based on the content's scroll position.
   */
  const handleThumbPosition = useCallback(() => {
    const content = contentRef.current;
    if (content) {
      const verticalThumb = verticalThumbRef.current;
      const horizontalThumb = horizontalThumbRef.current;

      if (verticalThumb) {
        const scrollRatioY = content.scrollTop / content.scrollHeight;
        const thumbTop = scrollRatioY * content.clientHeight;

        verticalThumb.style.top = `${thumbTop}px`;
      }

      if (horizontalThumb) {
        const scrollRatioX = content.scrollLeft / content.scrollWidth;
        const thumbLeft = scrollRatioX * content.clientWidth;
        horizontalThumb.style.left = `${thumbLeft}px`;
      }
    }
  }, []);

  /**
   * Adjusts the size of the scrollbar thumbs and determines if they should be visible.
   */
  const handleResize = useCallback(() => {
    const content = contentRef.current;
    if (content) {
      const { clientHeight, clientWidth, scrollHeight, scrollWidth } = content;

      setThumbSize({
        height: Math.max((clientHeight / scrollHeight) * clientHeight, 20),
        width: Math.max((clientWidth / scrollWidth) * clientWidth, 20),
      });

      setShowVerticalThumb(scrollHeight > clientHeight);
      setShowHorizontalThumb(scrollWidth > clientWidth);

      handleThumbPosition();
    }
  }, [handleThumbPosition]);

  // Add and clean up event listeners for resize, scroll, and mouse events
  useEffect(() => {
    handleResize();
    const content = contentRef.current;
    const observer = new MutationObserver(handleResize);

    observer.observe(content, {
      childList: true,
      subtree: true,
      attributes: true,
    });
    content.addEventListener("scroll", handleThumbPosition);
    window.addEventListener("resize", handleResize);

    return () => {
      observer.disconnect();
      content.removeEventListener("scroll", handleThumbPosition);
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize, handleThumbPosition]);

  useEffect(() => {
    document.addEventListener("mousemove", handleThumbMousemove);
    document.addEventListener("mouseup", handleThumbMouseup);
    return () => {
      document.removeEventListener("mousemove", handleThumbMousemove);
      document.removeEventListener("mouseup", handleThumbMouseup);
    };
  }, [handleThumbMousemove, handleThumbMouseup]);

  // Vertical Scroll Thumb
  const VerticalThumb = useMemo(
    () => (
      <div
        ref={verticalThumbRef}
        onMouseDown={(e) => handleThumbMousedown(e, "vertical")}
        className="absolute right-0 w-1 mr-0.5 bg-black/25 hover:bg-black/35 rounded"
        style={{
          height: `${thumbSize.height}px`,
          display: showVerticalThumb ? "block" : "none",
        }}
      ></div>
    ),
    [showVerticalThumb, thumbSize]
  );

  // Horizontal Scroll Thumb
  const HorizontalThumb = useMemo(
    () => (
      <div
        ref={horizontalThumbRef}
        onMouseDown={(e) => handleThumbMousedown(e, "horizontal")}
        className="absolute bottom-0 h-1 mb-0.5 bg-black/25 hover:bg-black/35 rounded"
        style={{
          width: `${thumbSize.width}px`,
          display: showHorizontalThumb ? "block" : "none",
        }}
      ></div>
    ),
    [showHorizontalThumb, thumbSize]
  );

  return (
    <div
      className={twMerge("relative h-full w-full overflow-hidden", className)}
      style={style}
    >
      <div
        ref={contentRef}
        className="h-full w-full overflow-auto"
        style={{ scrollbarWidth: "none" }} // Hide default scrollbar for Firefox
      >
        {children}
      </div>

      {VerticalThumb}

      {HorizontalThumb}
    </div>
  );
};

IPadScrollView.propTypes = {
  children: PropTypes.node.isRequired,
};
