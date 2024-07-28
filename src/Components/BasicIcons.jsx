import { twMerge } from "tailwind-merge";
import CircleCheck from "@duotoneicons/circle-check.svg?react";
import CircleXmark from "@duotoneicons/circle-xmark.svg?react";

/**
 * The `ButtonRect` function is a React component that renders a button with rounded corners and
 * specific styling.
 * @param {React.HTMLAttributes<HTMLButtonElement>} props
 */
export const ButtonRect = ({ className, ...props }) => (
  <button
    type="button"
    className={twMerge(
      "text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center justify-center w-fit h-fit",
      className
    )}
    data-modal-toggle="defaultModal"
    {...props}
  >
    {props.children}
  </button>
);

export const Close = () => (
  <svg
    className="w-5 h-5"
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
      clipRule="evenodd"
    ></path>
  </svg>
);

export const Edit = () => (
  <svg
    className="w-5 h-5"
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      opacity="0.4"
      d="M15.48 3H7.52C4.07 3 2 5.06 2 8.52V16.47C2 19.94 4.07 22 7.52 22H15.47C18.93 22 20.99 19.94 20.99 16.48V8.52C21 5.06 18.93 3 15.48 3Z"
    />
    <path d="M21.0195 2.97979C19.2295 1.17979 17.4795 1.13979 15.6395 2.97979L14.5095 4.09979C14.4095 4.19979 14.3795 4.33979 14.4195 4.46979C15.1195 6.91979 17.0795 8.87979 19.5295 9.57979C19.5595 9.58979 19.6095 9.58979 19.6395 9.58979C19.7395 9.58979 19.8395 9.54979 19.9095 9.47979L21.0195 8.35979C21.9295 7.44979 22.3795 6.57979 22.3795 5.68979C22.3795 4.78979 21.9295 3.89979 21.0195 2.97979Z" />
    <path d="M17.8591 10.4198C17.5891 10.2898 17.3291 10.1598 17.0891 10.0098C16.8891 9.88984 16.6891 9.75984 16.4991 9.61984C16.3391 9.51984 16.1591 9.36984 15.9791 9.21984C15.9591 9.20984 15.8991 9.15984 15.8191 9.07984C15.5091 8.82984 15.1791 8.48984 14.8691 8.11984C14.8491 8.09984 14.7891 8.03984 14.7391 7.94984C14.6391 7.83984 14.4891 7.64984 14.3591 7.43984C14.2491 7.29984 14.1191 7.09984 13.9991 6.88984C13.8491 6.63984 13.7191 6.38984 13.5991 6.12984C13.4691 5.84984 13.3691 5.58984 13.2791 5.33984L7.89912 10.7198C7.54912 11.0698 7.20912 11.7298 7.13912 12.2198L6.70912 15.1998C6.61912 15.8298 6.78912 16.4198 7.17912 16.8098C7.50912 17.1398 7.95912 17.3098 8.45912 17.3098C8.56912 17.3098 8.67912 17.2998 8.78912 17.2898L11.7591 16.8698C12.2491 16.7998 12.9091 16.4698 13.2591 16.1098L18.6391 10.7298C18.3891 10.6498 18.1391 10.5398 17.8591 10.4198Z" />
  </svg>
);

export const Delete = () => (
  <svg
    className="w-5 h-5"
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M3 6.38597C3 5.90152 3.34538 5.50879 3.77143 5.50879L6.43567 5.50832C6.96502 5.49306 7.43202 5.11033 7.61214 4.54412C7.61688 4.52923 7.62232 4.51087 7.64185 4.44424L7.75665 4.05256C7.8269 3.81241 7.8881 3.60318 7.97375 3.41617C8.31209 2.67736 8.93808 2.16432 9.66147 2.03297C9.84457 1.99972 10.0385 1.99986 10.2611 2.00002H13.7391C13.9617 1.99986 14.1556 1.99972 14.3387 2.03297C15.0621 2.16432 15.6881 2.67736 16.0264 3.41617C16.1121 3.60318 16.1733 3.81241 16.2435 4.05256L16.3583 4.44424C16.3778 4.51087 16.3833 4.52923 16.388 4.54412C16.5682 5.11033 17.1278 5.49353 17.6571 5.50879H20.2286C20.6546 5.50879 21 5.90152 21 6.38597C21 6.87043 20.6546 7.26316 20.2286 7.26316H3.77143C3.34538 7.26316 3 6.87043 3 6.38597Z" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.42543 11.4815C9.83759 11.4381 10.2051 11.7547 10.2463 12.1885L10.7463 17.4517C10.7875 17.8855 10.4868 18.2724 10.0747 18.3158C9.66253 18.3592 9.29499 18.0426 9.25378 17.6088L8.75378 12.3456C8.71256 11.9118 9.01327 11.5249 9.42543 11.4815Z"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.5747 11.4815C14.9868 11.5249 15.2875 11.9118 15.2463 12.3456L14.7463 17.6088C14.7051 18.0426 14.3376 18.3592 13.9254 18.3158C13.5133 18.2724 13.2126 17.8855 13.2538 17.4517L13.7538 12.1885C13.795 11.7547 14.1625 11.4381 14.5747 11.4815Z"
    />
    <path
      opacity="0.5"
      d="M11.5956 22.0001H12.4044C15.1871 22.0001 16.5785 22.0001 17.4831 21.1142C18.3878 20.2283 18.4803 18.7751 18.6654 15.8686L18.9321 11.6807C19.0326 10.1037 19.0828 9.31524 18.6289 8.81558C18.1751 8.31592 17.4087 8.31592 15.876 8.31592H8.12405C6.59127 8.31592 5.82488 8.31592 5.37105 8.81558C4.91722 9.31524 4.96744 10.1037 5.06788 11.6807L5.33459 15.8686C5.5197 18.7751 5.61225 20.2283 6.51689 21.1142C7.42153 22.0001 8.81289 22.0001 11.5956 22.0001Z"
    />
  </svg>
);

/* The `Arrow` function is a React component that renders an arrow icon. It takes two props:
`direction` and `className`. */
/**
 *
 * @param {{direction: "left" | "right" | "up" | "down", className: string}} params
 * @returns
 */
export const Arrow = ({ direction, className }) => (
  <span className="relative p-2 fill-current">
    <span
      className={twMerge(
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-[6px] border-l-transparent border-r-transparent border-b-0 border-t-current transition-[transform] fill-current",
        direction === "left" ? "rotate-90" : "",
        direction === "right" ? "-rotate-90" : "",
        direction === "up" ? "rotate-180" : "",
        direction === "down" ? "rotate-0" : "",
        className
      )}
    ></span>
  </span>
);

/**
 * CircleCheck fontawesome icon with color and 1.5rem size
 * @param {{shadow: boolean, className: string, size: number}} params
 * @returns {JSX.Element}
 */
export const SuccessIcon = ({ shadow, className, size = 1.5 }) => (
  <CircleCheck
    className={className}
    style={{
      height: !!size ? size + "rem" : "1.5rem",
      width: !!size ? size + "rem" : "1.5rem",
      boxShadow: !!shadow ? "1px 1px 2px #000" : "0 0 1px #009200",
      borderRadius: "50%",
      backgroundColor: "white",
      fill: "#009200",
      display: "inline-block",
    }}
  />
);

/**
 * CircleXmark fontawesome icon with color and 1.5rem size
 * @param {{shadow: boolean, className: string, size: number}} params
 * @returns {JSX.Element}
 */
export const ErrorIcon = ({ shadow, className, size = 1.5 }) => (
  <CircleXmark
    className={className}
    style={{
      height: !!size ? size + "rem" : "1.5rem",
      width: !!size ? size + "rem" : "1.5rem",
      boxShadow: !!shadow ? "1px 1px 2px #000" : "0 0 1px #B80000",
      borderRadius: "50%",
      backgroundColor: "white",
      fill: "#B80000",
      display: "inline-block",
    }}
  />
);

/**
 *
 * @param {React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>} props
 * @returns {JSX.Element}
 */
export const Xbtn = (props) => (
  <div
    className={twMerge(
      "h-4 w-4 flex items-center justify-center rounded-full bg-red-400 cursor-pointer",
      props.className
    )}
    {...props}
  >
    <div className="text-white font-bold text-xs leading-none -mt-0.5">
      &times;
    </div>
  </div>
);

/* The `Arrow` function is a React component that renders an arrow icon. It takes two props:
`direction` and `className`. */
/**
 *
 * @param {{direction: "left" | "right" | "up" | "down"}} params
 * @returns {JSX.Element}
 */
export const ArrowIconC = ({ direction }) => {
  switch (direction) {
    case "left":
      return <>&#11164;</>;
    case "up":
      return <>&#11165;</>;
    case "right":
      return <>&#11166;</>;
    case "down":
      return <>&#11167;</>;
    default:
      break;
  }
};

/* The `Arrow` function is a React component that renders an arrow icon. It takes two props:
`direction` and `className`. */
/**
 *
 * @param {{direction: "left" | "right" | "up" | "down"}} params
 * @returns {JSX.Element}
 */
export const ArrowIcon3D = ({ direction }) => {
  switch (direction) {
    case "left":
      return <>&#11160;</>;
    case "up":
      return <>&#11161;</>;
    case "right":
      return <>&#11162;</>;
    case "down":
      return <>&#11163;</>;
    default:
      break;
  }
};

/* The `Arrow` function is a React component that renders an arrow icon. It takes two props:
    `direction` and `className`. */
/**
 *
 * @param {{direction: "left" | "right" | "up" | "down", className: string}} params
 * @returns {JSX.Element}
 */
export const ArrowIcon = ({ direction, className }) => (
  <span
    className={twMerge(
      direction === "left" ? "rotate-90" : "",
      direction === "right" ? "-rotate-90" : "",
      direction === "up" ? "rotate-180" : "",
      direction === "down" ? "rotate-0" : "",
      className
    )}
  >
    &#10148;
  </span>
);

/**
 * RoundCloseButton component renders a circular close button.
 *
 * @param {{className: string, shape: "circle" | "square" | "plain", size: "xs" | "sm" | "md" | "lg" | "xl"} & HTMLButtonElement} props
 * @returns {JSX.Element}
 */
export const CloseButton = ({
  className,
  shape = "circle",
  size = "md",
  ...props
}) => (
  <button
    type={props.type ?? "button"}
    className={twMerge(
      "flex items-center justify-center focus:outline-none select-none cursor-pointer disabled:cursor-not-allowed",
      shape === "square" ? "rounded" : "rounded-full",
      shape === "plain"
        ? "disabled:text-gray-200 hover:text-red-500 text-red-500/65 bg-transparent"
        : "disabled:bg-gray-400 disabled:text-gray-200 hover:bg-red-500 bg-red-500/75 text-white",
      size === "xl" ? "h-8 w-8 p-6 text-4xl" : "",
      size === "lg" ? "h-6 w-6 p-[18px] text-2xl" : "",
      size === "md" ? "h-5 w-5 p-3.5 text-lg" : "",
      size === "sm" ? "h-4 w-4 p-2.5 text-sm" : "",
      size === "xs" ? "h-3 w-3 p-2 text-[10px]" : "",
      className
    )}
    aria-label="Close"
    {...props}
  >
    &#10006;
  </button>
);
