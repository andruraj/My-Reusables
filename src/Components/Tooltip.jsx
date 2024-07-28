import { twMerge } from "tailwind-merge";
import { Popup } from "./Popup";

/**
 * The Tooltip function is a React component that displays a tooltip when hovered over, with the
 * tooltip content and position specified as props.
 *
 * @param {{tooltipText: string,
 * children: React.ReactNode,
 * position: "top" | "bottom" | "left" | "right",
 * gap: number,
 * type: "primary" | "secondary" | "warning" | "error" | "default" | "accent",
 * width: number | string,
 * } & React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>} params
 *
 * @returns {React.ReactNode}
 */
export const Tooltip = ({
  tooltipText,
  children,
  position,
  gap,
  type = "default",
  width,
  style,
  ...props
}) => (
  <span className="relative cursor-pointer group">
    {children}
    <span
      className={twMerge(
        "text-white px-1 py-0.5 rounded text-xs absolute hidden group-hover:flex w-max",
        position === "top" ? "bottom-full left-1/2 -translate-x-1/2" : "",
        position === "bottom" ? "top-full left-1/2 -translate-x-1/2" : "",
        position === "left" ? "right-full top-1/2 -translate-y-1/2" : "",
        position === "right" ? "left-full top-1/2 -translate-y-1/2" : "",
        type === "default" ? "bg-black" : "",
        type === "warning" ? "bg-warning" : "",
        type === "error" ? "bg-red-500" : "",
        type === "accent" ? "bg-accent" : ""
      )}
      style={{
        marginBottom: position === "top" ? gap : "unset",
        marginTop: position === "bottom" ? gap : "unset",
        marginLeft: position === "right" ? gap : "unset",
        marginRight: position === "left" ? gap : "unset",
        maxWidth: width,
        ...style,
      }}
      {...props}
    >
      {tooltipText}
    </span>
  </span>
);

/**
 * @param {{
 * content: React.ReactNode,
 * children: React.ReactNode,
 * style: React.CSSProperties,
 * placement: "top" | "left" | "right" | "bottom" |
 * "topLeft" | "topRight" | "bottomLeft" | "bottomRight" |
 * "leftTop" | "leftBottom" | "rightTop" | "rightBottom",
 * spacing: number | string,
 * width: number | string,
 * zIndex: number,
 * } & {
 * content: React.ReactNode;
 * children: React.ReactNode;
 * bgColor: string;
 * textColor: string;
 * width: string | number;
 * style: React.CSSProperties;
 * visible: boolean;
 * onClose: () => void;
 * closeBtn: boolean;
 * closeBtnColor: string;
 * spacing: number;
 * placement: "top" | "left" | "right" | "bottom" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom";
 * zIndex: number;
 * trigger: "hover" | "click";
 * hoverCloseDelay: number;
 * }} params
 * @returns {React.ReactNode}
 */
export const TooltipGlobal = ({
  content,
  children,
  style,
  placement,
  spacing,
  width,
  zIndex = 10,
  ...props
}) => (
  <Popup
    content={content}
    placement={placement}
    spacing={spacing}
    trigger="hover"
    {...props}
    style={{
      ...style,
      overflow: "auto",
      overflowWrap: "anywhere",
      maxHeight: "250px",
    }}
    width={width}
    zIndex={zIndex}
  >
    {children}
  </Popup>
);
