import { useEffect, useRef } from "react";

export const ClickOutsideComponent = ({ handler, children, ...props }) => {
  const ref = useRef(null);

  useEffect(() => {
    const listener = (event) => {
      if (ref?.current?.contains(event.target)) {
        return;
      }
      handler(event);
    };

    if (typeof window === "object") {
      document.addEventListener("mousedown", listener);
      return () => {
        document.removeEventListener("mousedown", listener);
      };
    }
  }, [handler]);

  return (
    <div ref={ref} className="wrapperRef" {...props}>
      {children}
    </div>
  );
};
