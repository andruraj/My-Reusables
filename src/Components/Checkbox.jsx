import { twMerge } from "tailwind-merge";

/**
 * The CheckBox component is a reusable checkbox input with a label in JavaScript.
 * @returns {React.ReactNode} The code is returning a functional component called CheckBox.
 *
 * @param {{className: string, label: string | React.ReactNode}
 * & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>}
 */

export const Checkbox = ({ className, label, ...props }) => {
  // Generate a unique id
  const uniqueId = `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={twMerge("flex items-center gap-1 w-full", className)}>
      <input
        className="h-4 w-4 accent-green-500 cursor-pointer"
        type="checkbox"
        id={uniqueId}
        {...props}
      />
      <label className="w-full cursor-pointer" htmlFor={uniqueId}>
        {label ?? props.value}
      </label>
    </div>
  );
};
