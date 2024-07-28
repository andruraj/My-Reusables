import { Link } from "react-router-dom";

/**
 * @param {{
 * href: string,
 * icon: React.ReactNode,
 * name: string,
 * mandatory: boolean,
 * linkOut: boolean,
 * } & React.DetailedHTMLProps<React.HTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>} params
 * @returns {React.ReactNode}
 */
export const CardLink = ({
  href,
  linkOut = true,
  icon,
  name,
  mandatory,
  ...props
}) => {
  const className =
    "w-48 h-52 flex flex-col items-center justify-center gap-4 text-center text-secondary cursor-pointer shadow-lg border hover:border-accentHighlight";
  return linkOut ? (
    <a
      className={className}
      href={href}
      target={!!href ? "_blank" : "_self"}
      rel="noopener noreferrer"
      {...props}
    >
      {icon}
      <div>
        {name}
        {mandatory && (
          <span className="text-red-500 text-3xl font-bold">*</span>
        )}
      </div>
    </a>
  ) : (
    <Link to={href} className={className} {...props}>
      {icon}
      <div>
        {name}
        {mandatory && (
          <span className="text-red-500 text-3xl font-bold">*</span>
        )}
      </div>
    </Link>
  );
};
