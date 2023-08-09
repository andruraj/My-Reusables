import {
  useState,
  useMemo,
  ReactNode,
  ComponentPropsWithRef,
  ElementType,
} from "react";

type Column = {
  id: string;
  header?: ReactNode;
  cell?: (args: any) => ReactNode;
  props?: ComponentPropsWithRef<ElementType<any>>;
};

export const Table = ({
  data = [],
  columns = [],
  pageSize = 5,
}: {
  data: any[];
  columns: Column[];
  pageSize?: number;
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / pageSize);

  const cols = useMemo(() => {
    const end = currentPage * pageSize;
    const start = end - pageSize;

    return columns.map((c, id) => (
      <div className="flex flex-col" key={id}>
        <div className="bg-[#f5f5f5]">
          {!!c.header ? (
            <div>{c.header}</div>
          ) : (
            <div
              className="p-2 uppercase text-sm text-gray-500 font-semibold"
              key={id}
              {...c.props}
            >
              {c.id}
            </div>
          )}
        </div>
        {data.slice(start, end).map((d, id) => (
          <div key={id}>{!!c.cell ? c.cell(d) : d[c.id]}</div>
        ))}
      </div>
    ));
  }, [data]);

  return (
    <div>
      <div className="flex items-center shadow w-fit rounded overflow-hidden">
        {cols}
      </div>

      <nav
        className="flex items-center justify-between pt-4"
        aria-label="Table navigation"
      >
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
          Showing{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {currentPage}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {totalPages}
          </span>
        </span>

        <div className="flex bg-white rounded-lg font-[Poppins]">
          <button
            onClick={() => {
              if (currentPage > 1) {
                setCurrentPage((p) => p - 1);
              }
            }}
            className="h-12 border-2 border-r-0 border-indigo-600
               px-4 rounded-l-lg hover:bg-indigo-600 hover:text-white"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
                fillRule="evenodd"
              ></path>
            </svg>
          </button>
          {/* {pages.map((pg, i) => (
            <button
              key={i}
              onClick={() => setCur(pg.page)}
              className={`h-12 border-2 border-r-0 border-indigo-600
               w-12 ${cur === pg.page && "bg-indigo-600 text-white"}`}
            >
              {pg.page}
            </button>
          ))} */}
          <button
            onClick={() => {
              if (currentPage < totalPages) {
                setCurrentPage((p) => p + 1);
              }
            }}
            className="h-12 border-2  border-indigo-600
               px-4 rounded-r-lg hover:bg-indigo-600 hover:text-white"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
                fillRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
      </nav>
    </div>
  );
};
