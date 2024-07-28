export const Badge = ({ children }) => {
  return (
    <span className="m-1 inline-block bg-accentHighlight text-white shadow px-1 rounded-full text-xs uppercase font-bold tracking-wide">
      {children}
    </span>
  );
};
