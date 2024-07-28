import { useEffect, useMemo, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { isEmpty } from "@utils/isEmpty";
import { Portal } from "./Portal";
import { Collapsible } from "./Collapsible";
import { ArrowIconC, CloseButton } from "./BasicIcons";

/**
 * @typedef {object} GroupOptions
 * @property {string} groupName - Header or Group name
 * @property {(string[] | object[])} options - List of distinct options for the group
 * @property {string[]} [keyProp] - List of Groups and its distinct options
 *
 *
 * @typedef {object} SelectProps
 * @property {string} value - Currently selected value.
 * @property {(currentOptionString: string, currentOptionObject: object, search: string) => void} onChange - Function called when a new value is selected.
 * @property {boolean} [searchable=true] - Boolean indicating if the dropdown is searchable.
 * @property {string} [placeholder] - Placeholder text for the input field.
 * @property {(string[] | object[] | GroupOptions[])} options - List of options to display in the dropdown.
 * @property {string} [keyProp] - Property to be used as a key within the objects of the options list. Mandatory if options is a list of string or object
 * @property {boolean} [disabled] - Disable Select
 * @property {string | number} [width] - Width
 * @property {number} [zIndex] - zIndex
 * @property {"xs"|"sm"|"md"|"lg"|"xl"} [size] - Size
 * @property {boolean} [required] - Required
 *
 * Select component
 * @param {SelectProps & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>} props - Select component props.
 * @returns {JSX.Element} - React JSX Element
 */
export const Select = ({
  value,
  onChange,
  options = [],
  keyProp,
  searchable = true,
  placeholder = "Select an Option",
  disabled,
  width,
  zIndex,
  size = "md", // Default size
  required = false,
  onBlur,
  onInvalid,
  ...props
}) => {
  const [selectState, setSelectState] = useState({
    collapse: true,
    highlighted: "",
    selected: value ?? "",
  });
  const [search, setSearch] = useState("");

  const { collapse, highlighted, selected } = selectState;

  const mainContainerRef = useRef();
  const optionsContainerRef = useRef();

  // Effect to synchronize external value changes with internal state
  useEffect(() => {
    if (selectState.selected !== value) {
      setSelectState((prevState) => ({ ...prevState, selected: value ?? "" }));
    }
  }, [value]);

  // Effect to handle click outside the component to collapse dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        mainContainerRef.current &&
        !mainContainerRef.current.contains(e.target) &&
        optionsContainerRef.current &&
        !optionsContainerRef.current.contains(e.target)
      ) {
        setSelectState((prevState) => ({
          ...prevState,
          collapse: true,
          highlighted: "",
        }));
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("focusin", handleClickOutside);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("focusin", handleClickOutside);
    };
  }, []);

  // Effect to position the dropdown options dynamically
  useEffect(() => {
    if (optionsContainerRef.current && mainContainerRef.current) {
      const selectDimensions = mainContainerRef.current.getBoundingClientRect();
      const optionsDimensions =
        optionsContainerRef.current.getBoundingClientRect();
      const gap = 2;
      const windowHeight = window.innerHeight;

      let optionsTop;

      if (
        selectDimensions.bottom + gap + optionsDimensions.height >
        windowHeight
      )
        optionsTop = selectDimensions.top - gap - optionsDimensions.height;
      else optionsTop = selectDimensions.bottom + gap;

      optionsContainerRef.current.style.top = optionsTop + "px";

      optionsContainerRef.current.style.left = selectDimensions.left + "px";
      optionsContainerRef.current.style.width =
        typeof width === "number"
          ? `${width}px`
          : selectDimensions.width + "px";
    }
  }, [optionsContainerRef, mainContainerRef, collapse, size]);

  // Memoized value to determine if options are grouped
  const isGrouped = useMemo(() => {
    if (!isEmpty(options)) {
      for (const option of options) {
        if (
          option &&
          typeof option === "object" &&
          option.hasOwnProperty("groupName")
        ) {
          return true;
        }
      }
    }
    return false;
  }, [options]);

  // Effect to scroll to highlighted option when navigating with arrow keys
  useEffect(() => {
    if (!!optionsContainerRef.current && !!highlighted) {
      const selectedElement = optionsContainerRef.current.querySelector(
        `[data-value="${
          isGrouped ? highlighted.match(/_group_(.+)/)[1] : highlighted
        }"]`
      );

      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: "instant",
          block: "nearest",
        });
      }
    }
  }, [highlighted, isGrouped]);

  // Function to handle keyboard events within the Select component
  const handleKeyPress = (e) => {
    if (collapse) return;

    const fromOptions = !isGrouped
      ? filteredOptions
      : [].concat(
          ...filteredOptions.map((g) =>
            g.options.map(
              (go) =>
                g.groupName +
                "_group_" +
                (typeof go === "object" ? go[g.keyProp] : go)
            )
          )
        );

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        e.stopPropagation();
        const nextIndex = Math.min(
          fromOptions.indexOf(highlighted) + 1,
          fromOptions.length - 1
        );
        setSelectState((prevState) => ({
          ...prevState,
          highlighted: fromOptions[nextIndex],
        }));
        break;
      case "ArrowUp":
        e.preventDefault();
        e.stopPropagation();
        const prevIndex = Math.max(fromOptions.indexOf(highlighted) - 1, 0);
        setSelectState((prevState) => ({
          ...prevState,
          highlighted: fromOptions[prevIndex],
        }));
        break;
      case "Enter":
      case " ":
        if (!isEmpty(highlighted)) {
          e.preventDefault();
          e.stopPropagation();
          const highlightedValue = isGrouped
            ? highlighted.match(/_group_(.+)/)[1]
            : typeof highlighted === "object" && !!keyProp
            ? highlighted[keyProp]
            : highlighted;

          if (highlightedValue === selectState.selected) return;

          setSelectState((prevState) => ({
            ...prevState,
            selected: highlightedValue,
            collapse: true,
            highlighted: "",
          }));
          setSearch("");
          onChange(
            highlightedValue,
            isGrouped
              ? options.filter(
                  (g) => g.groupName === highlighted.match(/(.+)_group_/)[1]
                )
              : highlighted,
            search
          );
        }
        break;
      case "Escape":
        e.preventDefault();
        setSelectState((prevState) => ({
          ...prevState,
          collapse: true,
          highlighted: "",
        }));
        setSearch("");
        break;
      default:
        break;
    }
  };

  // Function to handle option click within the dropdown
  const handleOptionClick = (item, e, itemKeyProp = undefined) => {
    e.preventDefault();
    e.stopPropagation();

    const itemValue =
      typeof item === "object" && !!itemKeyProp ? item[itemKeyProp] : item;

    if (itemValue === selectState.selected) return;

    setSelectState((prevState) => ({
      ...prevState,
      collapse: true,
      highlighted: "",
      selected: itemValue,
    }));
    setSearch("");

    onChange(itemValue, item, search);
  };

  // Memoized filtered options based on search and grouping
  const filteredOptions = useMemo(() => {
    const searchFilter = (opts, key) => {
      if (!Array.isArray(opts)) return [];
      if (!searchable || isEmpty(String(search).trim())) return opts;

      return opts.filter((item) =>
        typeof item === "object"
          ? String(item[key])
              ?.toLowerCase()
              ?.includes(String(search).trim().toLowerCase())
          : String(item)
              .toLowerCase()
              .includes(String(search).trim().toLowerCase())
      );
    };

    if (isGrouped) {
      return options.map((group) => ({
        groupName: group.groupName,
        options: searchFilter(group.options, group.keyProp),
        keyProp: group.keyProp,
      }));
    }

    return searchFilter(options, keyProp);
  }, [options, keyProp, search, searchable]);

  // Determine the width of the Select component
  const selectWidth = typeof width === "number" ? `${width}px` : width;

  // Define size-based styles
  const sizeStyles = {
    xs: "text-xs leading-tight",
    sm: "text-sm leading-snug",
    md: "text-base leading-normal",
    lg: "text-lg leading-6",
    xl: "text-xl leading-7",
  };

  return (
    <div
      id="select"
      className={twMerge(
        "flex flex-col h-fit bg-white text-black",
        disabled ? "opacity-50 touch-none pointer-events-none" : ""
      )}
      style={{
        minWidth: selectWidth,
        width: selectWidth,
        maxWidth: selectWidth,
      }}
      ref={mainContainerRef}
      onKeyDown={handleKeyPress}
    >
      <div
        className={twMerge(
          "flex items-center justify-between w-full bg-white text-black border divide-x cursor-pointer outline-none focus:border-sky-500/50 py-1",
          sizeStyles[size],
          collapse ? "" : "border-sky-500/50"
        )}
        onClick={() =>
          setSelectState((prevState) => ({
            ...prevState,
            collapse: !prevState.collapse,
          }))
        }
        role="combobox"
        aria-expanded={!collapse}
        aria-haspopup="listbox"
        aria-controls="options-list"
        aria-owns="options-list"
        id="selected"
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();
            setSelectState((prevState) => ({
              ...prevState,
              collapse: !prevState.collapse,
            }));
          }
        }}
        aria-label="Toggle dropdown"
        tabIndex={0}
        onBlur={onBlur}
        data-input
      >
        <div
          className={twMerge(
            "px-2 flex items-center justify-between w-full overflow-hidden",
            isEmpty(selected) ? "text-[#a9a9ac]" : "text-black"
          )}
        >
          <div className="w-full overflow-hidden">
            {isEmpty(selected) ? (
              <div className="w-full overflow-clip whitespace-nowrap text-ellipsis ...">
                {placeholder}
              </div>
            ) : null}

            <div
              className="w-full overflow-clip text-ellipsis whitespace-nowrap ..."
              data-mandatory={required}
              title={selected}
            >
              {!isEmpty(selected) ? selected : null}

              <input
                type="hidden"
                value={selected}
                onInvalid={onInvalid}
                {...props}
              />
            </div>
          </div>
          <div className="w-fit">
            {isEmpty(selected) ? null : !searchable ? null : (
              <CloseButton
                shape="circle"
                size="xs"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  setSelectState((prevState) => ({
                    ...prevState,
                    collapse: false,
                    highlighted: "",
                    selected: "",
                  }));
                  setSearch("");

                  onChange("", null, "");
                }}
                onKeyDown={(e) => {
                  if (e.key === " " || e.key === "Enter") {
                    e.preventDefault();
                    e.stopPropagation();

                    setSelectState((prevState) => ({
                      ...prevState,
                      collapse: false,
                      highlighted: "",
                      selected: "",
                    }));
                    setSearch("");

                    onChange("", null, "");
                  }
                }}
                tabIndex={0}
              />
            )}
          </div>
        </div>
        <div className="px-2 w-fit">
          {collapse ? (
            <ArrowIconC direction="down" />
          ) : (
            <ArrowIconC direction="up" />
          )}
        </div>
      </div>

      <Portal id="select-options">
        <div
          id="options"
          className={twMerge(
            "flex flex-col gap-[2px] w-full absolute bg-white text-black border overflow-hidden border-sky-500/50",
            sizeStyles[size]
          )}
          style={{
            display: collapse ? "none" : "flex",
            zIndex: zIndex ?? 1,
          }}
          ref={optionsContainerRef}
          role="listbox"
          aria-labelledby="options-list"
        >
          {searchable ? (
            <div
              className={twMerge(
                "flex items-center justify-between w-full",
                sizeStyles[size]
              )}
            >
              <div className="px-2 w-full">
                <input
                  className="outline-none bg-transparent border-b border-black/25 py-1 w-full"
                  type="text"
                  value={search}
                  placeholder="Search..."
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus
                  tabIndex={0}
                  aria-autocomplete="list"
                  aria-controls="options-list"
                  aria-label="Search"
                />
              </div>
              <div className="pr-2">
                {isEmpty(search) ? null : (
                  <CloseButton
                    shape="circle"
                    size="xs"
                    onClick={() => setSearch("")}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === " " || e.key === "Enter") {
                        e.preventDefault();
                        e.stopPropagation();

                        setSearch("");

                        const searchElement =
                          e.target?.parentElement?.previousElementSibling
                            ?.children[0];

                        if (searchElement) searchElement.focus();
                      }
                    }}
                  />
                )}
              </div>
            </div>
          ) : null}

          <div className="flex flex-col w-full overflow-auto max-h-[170px]">
            {filteredOptions.length < 1 ? (
              <div
                className="px-2 py-1 cursor-default select-none bg-white text-black"
                onClick={() =>
                  setSelectState((p) => ({ ...p, collapse: true }))
                }
              >
                No Data Available
              </div>
            ) : isGrouped ? (
              filteredOptions.map((group, groupIndex) => (
                <Collapsible
                  key={groupIndex}
                  isCollapsed={false}
                  header={group.groupName}
                  content={
                    <div className="flex flex-col w-full text-black bg-white">
                      {group.options.map((item, index) => (
                        <div
                          key={index}
                          className={twMerge(
                            "px-2 py-1 cursor-pointer bg-white text-black hover:bg-accentHighlight hover:text-white w-full overflow-clip text-ellipsis whitespace-nowrap ...",
                            !!highlighted &&
                              highlighted.indexOf(group.groupName) !== -1 &&
                              highlighted.indexOf(
                                typeof item === "object"
                                  ? item[group.keyProp]
                                  : item
                              ) !== -1
                              ? "bg-accentHighlight text-white"
                              : !!selected && selected === item && !highlighted
                              ? "bg-gray-200"
                              : ""
                          )}
                          onClick={(e) =>
                            handleOptionClick(item, e, group.keyProp)
                          }
                          data-key={
                            typeof item === "object"
                              ? item[group.keyProp]
                              : item
                          }
                          title={
                            typeof item === "object"
                              ? item[group.keyProp]
                              : item
                          }
                        >
                          {typeof item === "object"
                            ? item[group.keyProp]
                            : item}
                        </div>
                      ))}
                    </div>
                  }
                />
              ))
            ) : (
              filteredOptions.map((item, index) => (
                <div
                  key={index}
                  className={twMerge(
                    "px-2 py-1 cursor-pointer bg-white text-black hover:bg-accentHighlight hover:text-white w-full overflow-clip text-ellipsis whitespace-nowrap ...",
                    !!highlighted && highlighted === item
                      ? "bg-accentHighlight text-white"
                      : !!selected && selected === item
                      ? "bg-gray-200"
                      : ""
                  )}
                  onClick={(e) => handleOptionClick(item, e, keyProp)}
                  data-key={index}
                  data-value={typeof item === "object" ? item[keyProp] : item}
                  title={typeof item === "object" ? item[keyProp] : item}
                >
                  {typeof item === "object" ? item[keyProp] : item}
                </div>
              ))
            )}
          </div>
        </div>
      </Portal>
    </div>
  );
};
