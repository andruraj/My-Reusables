import { useEffect, useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { twMerge } from "tailwind-merge";
import { DebouncedInput } from "./DebouncedInput";

import MagnifyingGlass from "@duotoneicons/magnifying-glass.svg?react";
import Sort from "@icons/solid/sort.svg?react";
import SortUp from "@icons/solid/sort-up.svg?react";
import SortDown from "@icons/solid/sort-down.svg?react";

/**
 * Column Definition
 * @typedef {object} ColumnDef
 * @property {string | number} id - Column unique id
 * @property {string | number} accessorKey - Column unique key to access its values
 * @property {(props) => React.ReactNode} header - Column header to be displayed/rendered
 * @property {(props) => React.ReactNode} cell - Column cells to be rendered
 * @property {"asc" | "desc"} sort - Default order in which the column has to be sorted
 * @property {number} size - Width of the Column
 * @property {number} minSize - Min Width of the Column
 * @property {number} maxSize - Max Width of the Column
 * @property {boolean} enableResizing - Enable or Display Dynamic Resizing fot this Column
 * @property {import("react").CSSProperties} style - Style of Cell
 * @property {import("react").CSSProperties} headerStyle - Style of Header
 *
 *
 * Table built using tanstack react table v8
 * @typedef {Object} TableProps - Table Props
 * @property {[any]} data - Input data - array of objects.
 * @property {ColumnDef} columns - Array of Column options.
 * @property {boolean} enableSearch - Enable or Disable Search.
 * @property {boolean} enableMultiSort - Enable or Disable MultiSort.
 * @property {boolean} enablePageSizeChange - Enable or Disable PageSizeChange.
 * @property {boolean} enablePageInfo - Enable or Disable PageInfo.
 * @property {boolean} enablePageInput - Enable or Disable PageInput.
 * @property {boolean} enablePagination - Enable or Disable Pagination.
 * @property {boolean} enableColumnResizing - Enable or Disable Column Resizing.
 * @property {number} defaultPageSize - Specify initial or default pageSize in the 'shows' select.
 * @property {(number) => void} onPageSizeChange - returns the page index or page number when a change is made in go to page.
 *
 * @param {TableProps} params
 * @returns {JSX.Element}
 */
export const Table = ({
  data: inputData = [],
  columns: inputColumns = [],
  enableSearch = true,
  enableMultiSort = true,
  enablePageSizeChange = true,
  enablePageInfo = true,
  enablePageInput = true,
  enablePagination = true,
  enableColumnResizing = true,
  defaultPageSize = 10,
  onPageSizeChange,
  //   showStatus = "row",
}) => {
  const [data, setData] = useState(() => [...inputData]);
  // const [columns, setColumns] = useState(() => [...inputColumns]);

  const memorizedData = useMemo(() => [...inputData], [inputData]);

  const memorizedColumns = useMemo(() => [...inputColumns], [inputColumns]);

  const [pageSize, setPageSize] = useState(() => defaultPageSize ?? 10);

  const [globalFilter, setGlobalFilter] = useState("");

  const [sorting, setSorting] = useState(
    memorizedColumns
      .filter((col) => !!col?.sort)
      .map((col) => ({
        id: col.accessorKey ? col.accessorKey : col.id,
        desc: col?.sort?.toLowerCase() === "desc" ? true : false,
      }))
  );

  const table = useReactTable({
    data: memorizedData,
    columns: memorizedColumns,
    state: {
      globalFilter,
      sorting,
    },
    initialState: {
      pagination: {
        pageSize: pageSize,
      },
    },
    sortingFns: {
      default: (rowA, rowB, columnId) => {
        const nestedKeys = columnId.split(".").splice(1); // Split the columnId by '.'

        // Helper function to safely access nested properties
        const getNestedValue = (obj, keys) => {
          return keys.reduce(
            (acc, key) =>
              acc && acc[key] !== "undefined" ? acc[key] : undefined,
            obj
          );
        };

        const a = getNestedValue(rowA.original, nestedKeys);
        const b = getNestedValue(rowB.original, nestedKeys);

        if (
          rowA.columnFiltersMeta[columnId] &&
          rowB.columnFiltersMeta[columnId]
        ) {
          return compareItems(
            rowA.columnFiltersMeta[columnId]?.itemRank,
            rowB.columnFiltersMeta[columnId]?.itemRank
          );
        }

        // Check for null or undefined values
        if (a === null && b !== null && typeof b !== "undefined") return -1;
        if (a !== null && typeof a !== "undefined" && b === null) return 1;
        if (
          (a === null || typeof a === "undefined") &&
          (b === null || typeof b === "undefined")
        )
          return 0;

        // Check for boolean values
        if (typeof a === "boolean" && typeof b === "boolean") {
          return a === b ? 0 : a ? 1 : -1;
        }

        // Check for number values
        if (typeof a === "number" && typeof b === "number") {
          return a - b;
        }

        // Check for date values
        if (a instanceof Date && b instanceof Date) {
          return a - b;
        }

        // Default to string comparison
        return String(a).localeCompare(String(b));
      },
    },
    sortDescFirst: false,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableMultiSort: enableMultiSort,
    getPaginationRowModel: getPaginationRowModel(),
    columnResizeMode: "onChange",
    meta: {
      updateData: (rowIndex, columnId, value) =>
        setData((prev) =>
          prev.map((row, index) =>
            index === rowIndex
              ? {
                  ...prev[rowIndex],
                  [columnId]: value,
                }
              : row
          )
        ),
    },
  });

  //Calculate Widths for Columns
  const columnSizeVars = useMemo(() => {
    const headers = table.getFlatHeaders();
    /** @type {[key: string]: number} */
    const colSizes = {};
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i];
      colSizes[`--header-${header.id}-size`] = header.getSize();
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize();
    }
    return colSizes;
  }, [table.getState().columnSizingInfo]);

  return (
    <div
      id="table-container"
      className="h-full w-full flex flex-col gap-2 overflow-hidden"
    >
      {enableSearch || enablePageSizeChange ? (
        <header className="flex items-center justify-between">
          {enableSearch && (
            <SearchFilter
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
              noOfRecords={table.getCoreRowModel().rows.length}
            />
          )}
          {enablePageSizeChange && (
            <PageSizeModifier
              pageSize={table.getState().pagination.pageSize}
              setPageSize={table.setPageSize}
              onPageSizeChange={onPageSizeChange}
            />
          )}
        </header>
      ) : null}

      <div className="relative overflow-auto border border-primary/20">
        <table
          className="w-full text-sm text-left rtl:text-right text-black"
          style={{
            ...columnSizeVars, //Define column sizes on the <table> element
          }}
        >
          <thead className="text-xs bg-primary text-white sticky top-0">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="divide-x divide-primary/20">
                {headerGroup.headers.map((header) => (
                  <th
                    scope="col"
                    key={header.id}
                    className="relative uppercase font-semibold"
                    style={{
                      // minWidth: header.column.columnDef?.width,
                      // width: header.column.columnDef?.width,
                      // maxWidth: header.column.columnDef?.width,
                      cursor: header.column.getCanSort()
                        ? "pointer"
                        : "default",
                      minWidth: `calc(var(--header-${header?.id}-size) * 1px)`,
                      width: `calc(var(--header-${header?.id}-size) * 1px)`,
                      maxWidth: `calc(var(--header-${header?.id}-size) * 1px)`,
                      ...header.column.columnDef?.headerStyle,
                    }}
                    // style={{width: header.column.getSize()}}
                    colSpan={header.colSpan}
                  >
                    <div
                      onClick={() =>
                        header.column.toggleSorting(
                          null,
                          header.column.getCanMultiSort()
                        )
                      }
                      className="flex items-center justify-between px-3 py-2"
                    >
                      <span
                        className="w-full overflow-hidden whitespace-nowrap text-ellipsis ..."
                        title={
                          typeof header.column.columnDef.header === "string"
                            ? header.column.columnDef.header
                            : header.column.id ??
                              header.column.columnDef.accessorKey
                        }
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </span>
                      {header.column.getCanSort()
                        ? {
                            asc: (
                              <SortUp className="w-4 h-4 block fill-white" />
                            ),
                            desc: (
                              <SortDown className="w-4 h-4 block fill-white" />
                            ),
                            false: (
                              <Sort className="w-4 h-4 block fill-white" />
                            ),
                          }[header.column.getIsSorted()] ?? null
                        : null}
                    </div>
                    {enableColumnResizing &&
                    header.column.columnDef.enableResizing !== false ? (
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        id="resizer"
                        className={twMerge(
                          "absolute opacity-0 top-0 right-0 h-full w-1 bg-accent cursor-col-resize select-none touch-none rounded-md",
                          header.column.getIsResizing()
                            ? "bg-accentHighlight opacity-100"
                            : "bg-accent group-hover/th:opacity-100"
                        )}
                      ></div>
                    ) : null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="h-full w-full">
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="divide-x divide-primary/20 even:bg-primary/10"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      scope="row"
                      className="px-3 py-2 overflow-hidden"
                      key={cell.id}
                      style={{
                        // minWidth: cell.column.columnDef?.width,
                        // width: cell.column.columnDef?.width,
                        // maxWidth: cell.column.columnDef?.width,
                        minWidth: `calc(var(--col-${cell.column.id}-size) * 1px)`,
                        width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
                        maxWidth: `calc(var(--col-${cell.column.id}-size) * 1px)`,
                        ...cell.column.columnDef?.style,
                      }}
                    >
                      {" "}
                      {flexRender(
                        cell.column.columnDef?.editable
                          ? EditableCell
                          : cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr className="w-full">
                <td
                  colSpan={table.getAllColumns().length}
                  className="text-center py-2 px-3"
                >
                  No Records Found!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {enablePageInfo || enablePageInput || enablePagination ? (
        <footer className="flex items-center justify-between">
          {/* Row Status */}
          {/* {showStatus === "row" ? ( */}
          {enablePageInfo ? (
            <div className="">
              Showing{" "}
              {table.getRowModel().rows.length
                ? table.getState().pagination.pageIndex *
                    table.getState().pagination.pageSize +
                  1
                : 0}{" "}
              to{" "}
              {(table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize <
              table.getCoreRowModel().rows.length
                ? (table.getState().pagination.pageIndex + 1) *
                  table.getState().pagination.pageSize
                : table.getCoreRowModel().rows.length}{" "}
              of {table.getCoreRowModel().rows.length} Records
            </div>
          ) : null}
          {/* ) : null} */}

          {/* Page Status */}
          {/* {showStatus === "page" ? (
          <div className="">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
        ) : null} */}

          {/* Go to Page */}
          {enablePageInput ? (
            <div className="flex items-center gap-1">
              Go to page:
              <input
                className="bg-transparent border border-transparent border-b-gray-400 text-gray-900 text-sm outline-none focus:border-b-[#256fa3] py-1 w-5 text-center"
                type="text"
                value={table.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                  const res = e.target.value.replace(/\D+/g, "");

                  const IpgNo = Number(res);
                  let FpgNo = 1;
                  if (IpgNo > table.getPageCount())
                    FpgNo = table.getPageCount();
                  else if (Number.isNaN(IpgNo) || IpgNo < 1) FpgNo = 1;
                  else FpgNo = IpgNo;

                  e.target.style.width = String(FpgNo).length + 2 + "ch";
                  table.setPageIndex(Number(FpgNo) - 1);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowUp") {
                    table.setPageIndex((v) =>
                      v < table.getPageCount() - 1
                        ? v + 1
                        : table.getPageCount() - 1
                    );
                  }
                  if (e.key === "ArrowDown") {
                    table.setPageIndex((v) => (v > 1 ? v - 1 : 0));
                  }
                }}
              />{" "}
              of {table.getPageCount()}
            </div>
          ) : null}

          {/* Pagination */}
          {/* {!isEmpty(customPagination) && isValidElement(customPagination) ? (
          customPagination
        ) : ( */}
          {enablePagination ? (
            <Pagination
              currentPage={table.getState().pagination.pageIndex + 1}
              totalPages={table.getPageCount()}
              onPageChange={(n) => table.setPageIndex(n - 1)}
            />
          ) : null}
          {/* )} */}
        </footer>
      ) : null}
    </div>
  );
};

const EditableCell = ({ getValue, row, column, table }) => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="w-full overflow-hidden text-ellipsis whitespace-nowrap"
      onBlur={() => table.options.meta?.updateData(row.index, column.id, value)}
    />
  );
};

const SearchFilter = ({ globalFilter, setGlobalFilter, noOfRecords }) => (
  <div className="flex items-center gap-1 rounded-sm w-fit">
    <MagnifyingGlass className="w-4 h-4 block bg-transparent pointer-events-none" />
    <DebouncedInput
      type="text"
      className="p-0.5 bg-transparent outline-none border-b-2 hover:border-primary focus-within:border-primary duration-300"
      placeholder={`Search ${noOfRecords} Records...`}
      value={globalFilter ?? ""}
      onChange={(e) => setGlobalFilter(e.target.value)}
    />
  </div>
);

const PageSizeModifier = ({ setPageSize, pageSize, onPageSizeChange }) => {
  return (
    <select
      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded outline-none focus:ring-[#256fa3] focus:border-[#256fa3] block py-1"
      value={pageSize}
      onChange={(e) => {
        setPageSize(Number(e.target.value));
        typeof onPageSizeChange === "function"
          ? onPageSizeChange(Number(e.target.value))
          : null;
      }}
    >
      {[5, 10, 25, 50, 100, 500].map((size) => (
        <option key={size} value={size}>
          Show {size}
        </option>
      ))}
    </select>
  );
};

/**
 *
 *
 * @param {{
 *   currentPage: number;
 *   totalPages: number;
 *   onPageChange: (page: number) => void;
 * }} {
 *   currentPage,
 *   totalPages,
 *   onPageChange,
 * }
 * @return {*}
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = useMemo(() => {
    const current = currentPage + 1;
    let startPage = 1;
    let endPage;

    if (totalPages <= 5) {
      // less than 5 total pages so show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // more than 5 total pages so calculate start and end pages
      if (current <= 2) {
        startPage = 1;
        endPage = 3;
      } else if (current >= totalPages) {
        startPage = totalPages - 2;
        endPage = totalPages;
      } else {
        startPage = current - 2;
        endPage = current;
      }
    }

    return [...Array(endPage - startPage + 1)]
      .map((_, i) => startPage + i)
      .map((p) => (
        <NumberButton
          active={currentPage === p}
          key={p}
          onClick={() => onPageChange(Number(p))}
        >
          {p}
        </NumberButton>
      ));
  }, [currentPage, totalPages]);

  return (
    <div>
      <div className="inline-flex -space-x-px text-sm">
        <button
          type="button"
          onClick={() => {
            let current = currentPage;
            if (currentPage > 1) {
              current = current - 1;
            }
            onPageChange(current);
          }}
          disabled={currentPage <= 1}
          className="outline-none focus-visible:ring-[1px] flex items-center justify-center px-3 h-8 leading-tight text-white bg-primary border border-gray-300 hover:bg-accent cursor-pointer disabled:cursor-not-allowed disabled:bg-transparent/10 disabled:text-neutral-400"
        >
          Previous
        </button>

        {pageNumbers}

        <button
          type="button"
          onClick={() => {
            let current = currentPage;
            if (currentPage < totalPages) {
              current = current + 1;
            }
            onPageChange(current);
          }}
          disabled={currentPage >= totalPages}
          className="outline-none focus-visible:ring-[1px] flex items-center justify-center px-3 h-8 leading-tight text-white bg-primary border border-gray-300 hover:bg-accent cursor-pointer disabled:cursor-not-allowed disabled:bg-transparent/10 disabled:text-neutral-400"
        >
          Next
        </button>
      </div>
    </div>
  );
};

/**
 *
 * @param {{children: React.ReactNode, active: boolean, className: string}
 * & React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>} params
 * @returns {React.ReactNode}
 */
const NumberButton = ({ children, active, className, ...props }) => (
  <button
    type="button"
    className={twMerge(
      "outline-none focus-visible:ring-[1px] flex items-center justify-center px-3 h-8 leading-tight  border border-gray-300 cursor-pointer",
      active
        ? "bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
        : "bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700"
    )}
    {...props}
  >
    {children}
  </button>
);

/**
 * Table built using tanstack react table v8
 * @typedef {Object} TableProps - Table Props
 * @property {[any]} data - Input data - array of objects.
 * @property {[import("@tanstack/react-table").Column]} columns - Array of Column options.
 * @property {boolean} enableSearch - Enable or Disable Search.
 * @property {boolean} enableMultiSort - Enable or Disable MultiSort.
 * @property {boolean} enablePageSizeChange - Enable or Disable PageSizeChange.
 * @property {boolean} enablePageInfo - Enable or Disable PageInfo.
 * @property {boolean} enablePageInput - Enable or Disable PageInput.
 * @property {boolean} enablePagination - Enable or Disable Pagination.
 * @property {number} defaultPageSize - Specify initial or default pageSize in the 'shows' select.
 * @property {(number) => void} onPageSizeChange - returns the page index or page number when a change is made in go to page.
 *
 * @param {TableProps} params
 * @returns {JSX.Element}
 */
export const TableWDivs = ({
  data: inputData = [],
  columns: inputColumns = [],
  enableSearch = true,
  enableMultiSort = true,
  enablePageSizeChange = true,
  enablePageInfo = true,
  enablePageInput = true,
  enablePagination = true,
  defaultPageSize = 10,
  onPageSizeChange,
  //   showStatus = "row",
}) => {
  const [data, setData] = useState(() => [...inputData]);
  // const [columns, setColumns] = useState(() => [...inputColumns]);

  const memorizedData = useMemo(() => [...inputData], [inputData]);

  const memorizedColumns = useMemo(() => [...inputColumns], [inputColumns]);

  const [pageSize, setPageSize] = useState(() => defaultPageSize ?? 10);

  const [globalFilter, setGlobalFilter] = useState("");

  const [sorting, setSorting] = useState(
    memorizedColumns
      .filter((col) => !!col?.sort)
      .map((col) => ({
        id: col.accessorKey ? col.accessorKey : col.id,
        desc: col?.sort?.toLowerCase() === "desc" ? true : false,
      }))
  );

  const headerRefs = useRef([]);
  const [colWidths, setColWidths] = useState(() =>
    memorizedColumns.map((c) => c?.columnDef?.width || null)
  );
  const [bodyHeight, setBodyHeight] = useState(0);

  useEffect(() => {
    // console.log(headerRefs.current, Object.values(headerRefs.current));
    const newColWidths = Object.values(headerRefs.current).map((ref, i) => {
      const columnWidth = ref?.clientWidth ?? ref?.width;
      return columnWidth ? columnWidth : ref.offsetWidth;
    });

    const headH =
      Object.values(headerRefs.current)[0]?.parentNode?.offsetHeight || 0;
    const bodyH = Object.values(headerRefs.current)[0]?.parentNode?.parentNode
      ?.parentNode?.parentNode?.offsetHeight;

    setColWidths((prevWidths) =>
      JSON.stringify(newColWidths) !== JSON.stringify(prevWidths)
        ? newColWidths
        : prevWidths
    );
    setBodyHeight(bodyH - headH - 80);
  }, [memorizedColumns]);

  const gridTemplateColumns = useMemo(
    () => colWidths.map((w) => (w ? `${w}px` : "auto")).join(" "),
    [colWidths]
  );

  const table = useReactTable({
    data: memorizedData,
    columns: memorizedColumns,
    state: {
      globalFilter,
      sorting,
    },
    initialState: {
      pagination: {
        pageSize: pageSize,
      },
    },
    sortingFns: {
      default: (rowA, rowB, columnId) => {
        const nestedKeys = columnId.split(".").splice(1); // Split the columnId by '.'

        // Helper function to safely access nested properties
        const getNestedValue = (obj, keys) => {
          return keys.reduce(
            (acc, key) =>
              acc && acc[key] !== "undefined" ? acc[key] : undefined,
            obj
          );
        };

        const a = getNestedValue(rowA.original, nestedKeys);
        const b = getNestedValue(rowB.original, nestedKeys);

        if (
          rowA.columnFiltersMeta[columnId] &&
          rowB.columnFiltersMeta[columnId]
        ) {
          return compareItems(
            rowA.columnFiltersMeta[columnId]?.itemRank,
            rowB.columnFiltersMeta[columnId]?.itemRank
          );
        }

        // Check for null or undefined values
        if (a === null && b !== null && typeof b !== "undefined") return -1;
        if (a !== null && typeof a !== "undefined" && b === null) return 1;
        if (
          (a === null || typeof a === "undefined") &&
          (b === null || typeof b === "undefined")
        )
          return 0;

        // Check for boolean values
        if (typeof a === "boolean" && typeof b === "boolean") {
          return a === b ? 0 : a ? 1 : -1;
        }

        // Check for number values
        if (typeof a === "number" && typeof b === "number") {
          return a - b;
        }

        // Check for date values
        if (a instanceof Date && b instanceof Date) {
          return a - b;
        }

        // Default to string comparison
        return String(a).localeCompare(String(b));
      },
    },
    sortDescFirst: false,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableMultiSort: enableMultiSort,
    getPaginationRowModel: getPaginationRowModel(),
    columnResizeMode: "onChange",
    meta: {
      updateData: (rowIndex, columnId, value) =>
        setData((prev) =>
          prev.map((row, index) =>
            index === rowIndex
              ? {
                  ...prev[rowIndex],
                  [columnId]: value,
                }
              : row
          )
        ),
    },
  });

  return (
    <div
      id="table-container"
      className="h-full w-full flex flex-col gap-2 overflow-hidden"
    >
      {enableSearch || enablePageSizeChange ? (
        <header className="flex items-center justify-between">
          {enableSearch && (
            <SearchFilter
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
              noOfRecords={table.getCoreRowModel().rows.length}
            />
          )}
          {enablePageSizeChange && (
            <PageSizeModifier
              pageSize={table.getState().pagination.pageSize}
              setPageSize={table.setPageSize}
              onPageSizeChange={onPageSizeChange}
            />
          )}
        </header>
      ) : null}

      <div className="relative overflow-x-auto overflow-y-hidden">
        <div className="w-full text-sm text-left rtl:text-right text-black border border-slate-500 divide-y divide-slate-500">
          {table.getHeaderGroups().map((headerGroup) => (
            <div
              key={headerGroup.id}
              className="w-full grid divide-x divide-slate-500 bg-primary text-white"
              style={{
                gridTemplateColumns,
              }}
            >
              {headerGroup.headers.map((header) => (
                <div
                  key={header.id}
                  ref={(el) => (headerRefs.current[header.id] = el)}
                  style={{
                    width: colWidths[header.id],
                    cursor: header.column.getCanSort() ? "pointer" : "default",
                    ...header.column.columnDef?.headerStyle,
                  }}
                >
                  <div
                    onClick={() =>
                      header.column.toggleSorting(
                        null,
                        header.column.getCanMultiSort()
                      )
                    }
                    className="w-full flex items-center justify-between px-3 py-2 h-9"
                  >
                    <span className="w-full overflow-hidden text-ellipsis ...">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </span>
                    {header.column.getCanSort()
                      ? {
                          asc: <SortUp className="w-4 h-4 block fill-white" />,
                          desc: (
                            <SortDown className="w-4 h-4 block fill-white" />
                          ),
                          false: <Sort className="w-4 h-4 block fill-white" />,
                        }[header.column.getIsSorted()] ?? null
                      : null}
                  </div>
                  {header.column.columnDef.enableResizing ? (
                    <div
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                      id="resizer"
                      className={twMerge(
                        "absolute opacity-0 top-0 right-0 h-full w-1 bg-accent cursor-col-resize select-none touch-none rounded-md",
                        header.column.getIsResizing()
                          ? "bg-accentHighlight opacity-100"
                          : "bg-accent group-hover/th:opacity-100"
                      )}
                    ></div>
                  ) : null}
                </div>
              ))}
            </div>
          ))}
          <div
            className="w-full overflow-y-auto overflow-x-hidden divide-slate-500 divide-y"
            style={{ maxHeight: bodyHeight + "px" }}
          >
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <div
                  key={row.id}
                  className="grid divide-x divide-slate-500"
                  style={{
                    gridTemplateColumns,
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <div
                      key={cell.id}
                      className="px-3 py-2 h-9 whitespace-nowrap text-ellipsis overflow-hidden ..."
                      style={{
                        width: colWidths[cell.id],
                        ...cell.column.columnDef?.style,
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef?.editable
                          ? EditableCell
                          : cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <div className="w-full">
                <div className="w-full text-center py-2 px-3">
                  No Records Found!
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {enablePageInfo || enablePageInput || enablePagination ? (
        <footer className="flex items-center justify-between">
          {/* Row Status */}
          {/* {showStatus === "row" ? ( */}
          {enablePageInfo ? (
            <div className="">
              Showing{" "}
              {table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                1}{" "}
              to{" "}
              {(table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize <
              table.getCoreRowModel().rows.length
                ? (table.getState().pagination.pageIndex + 1) *
                  table.getState().pagination.pageSize
                : table.getCoreRowModel().rows.length}{" "}
              of {table.getCoreRowModel().rows.length} Records
            </div>
          ) : null}
          {/* ) : null} */}

          {/* Page Status */}
          {/* {showStatus === "page" ? (
          <div className="">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
        ) : null} */}

          {/* Go to Page */}
          {enablePageInput ? (
            <div className="flex items-center gap-1">
              Go to page:
              <input
                className="bg-transparent border border-transparent border-b-gray-400 text-gray-900 text-sm outline-none focus:border-b-[#256fa3] py-1 w-5 text-center"
                type="text"
                value={table.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                  const res = e.target.value.replace(/\D+/g, "");

                  const IpgNo = Number(res);
                  let FpgNo = 1;
                  if (IpgNo > table.getPageCount())
                    FpgNo = table.getPageCount();
                  else if (Number.isNaN(IpgNo) || IpgNo < 1) FpgNo = 1;
                  else FpgNo = IpgNo;

                  e.target.style.width = String(FpgNo).length + 2 + "ch";
                  table.setPageIndex(Number(FpgNo) - 1);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowUp") {
                    table.setPageIndex((v) =>
                      v < table.getPageCount() - 1
                        ? v + 1
                        : table.getPageCount() - 1
                    );
                  }
                  if (e.key === "ArrowDown") {
                    table.setPageIndex((v) => (v > 1 ? v - 1 : 0));
                  }
                }}
              />{" "}
              of {table.getPageCount()}
            </div>
          ) : null}

          {/* Pagination */}
          {/* {!isEmpty(customPagination) && isValidElement(customPagination) ? (
          customPagination
        ) : ( */}
          {enablePagination ? (
            <Pagination
              currentPage={table.getState().pagination.pageIndex + 1}
              totalPages={table.getPageCount()}
              onPageChange={(n) => table.setPageIndex(n - 1)}
            />
          ) : null}
          {/* )} */}
        </footer>
      ) : null}
    </div>
  );
};
