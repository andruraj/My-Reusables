import { twMerge } from "tailwind-merge";

/**
 *
 * @param {{children: React.ReactNode, className: string} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>} param0
 * @returns
 */
export const RoundedIconButton = ({ children, className, ...props }) => (
  <span
    className={twMerge(
      "cursor-pointer border shadow shadow-gray-200 bg-bgGray rounded-full p-2",
      className
    )}
    {...props}
  >
    {children}
  </span>
);
