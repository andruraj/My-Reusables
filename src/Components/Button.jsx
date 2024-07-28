import { twMerge } from "tailwind-merge";

/**
 * The above code exports a Button component in JavaScript that accepts various props such as
 * className, children, size, and variant, and renders a button element with different styles based on
 * the provided props.
 *
 * @param {{
 * className: string,
 * children: React.ReactNode,
 * size: "xs" | "sm" | "md" | "lg" | "xl",
 * variant: "primary" | "warning" | "error" | "link",
 * } & React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>}
 */
export const Button = ({
  className,
  children,
  size = "md",
  variant = "primary",
  ...props
}) => (
  <button
    type={props.type ?? "button"}
    className={twMerge(
      "cursor-pointer select-none [outline:none] disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500 disabled:shadow-inner",
      size === "xs" ? "text-xs px-4 py-0.5" : "",
      size === "sm" ? "text-sm px-5 py-0.5" : "",
      size === "md" ? "text-base px-6 py-1" : "",
      size === "lg" ? "text-lg px-8 py-1.5" : "",
      size === "xl" ? "text-xl px-10 py-2" : "",
      variant === "link" ? "text-blue-400 underline font-medium" : "",
      variant === "primary"
        ? "focus-within:[box-shadow:inset_0_1px_1px_rgba(0,0,0,.075),0_0_8px_rgba(82,168,236,.6)] shadow-md text-black font-semibold bg-[#fafafa] border border-accent"
        : "",
      variant === "error"
        ? "focus-within:[box-shadow:inset_0_1px_1px_rgba(0,0,0,.075),0_0_8px_rgba(82,168,236,.6)] shadow-md text-black font-semibold bg-error border border-accent"
        : "",
      variant === "warning"
        ? "focus-within:[box-shadow:inset_0_1px_1px_rgba(0,0,0,.075),0_0_8px_rgba(82,168,236,.6)] shadow-md text-black font-semibold bg-warning border border-warningHighlight"
        : "",
      className
    )}
    {...props}
  >
    {children}
  </button>
);
