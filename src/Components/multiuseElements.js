//library imports
import React from "react";
import ReactDOM from "react-dom";

//comp imports

//static imports
import "./multiuseElements.css";

//components
export const Popup = ({
  content,
  children,
  style,
  trigger = {
    hover: "hover",
    click: "click",
  },
  spacing = 0,
  placement = {
    top: "top",
    left: "left",
    right: "right",
    bottom: "bottom",
    topLeft: "topLeft",
    topRight: "topRight",
    bottomLeft: "bottomLeft",
    bottomRight: "bottomRight",
    leftTop: "leftTop",
    leftBottom: "leftBottom",
    rightTop: "rightTop",
    rightBottom: "rightBottom",
  },
}) => {
  const [open, setOpen] = React.useState(false);
  const [pos, setPos] = React.useState({
    top: 0,
    left: 0,
  });
  const [popPos, setPopPos] = React.useState({});

  React.useEffect(() => {
    const popup = document.querySelector(".popup");
    if (popup) {
      setPopPos(popup.getBoundingClientRect());
    }
  }, []);

  const sePosition = (e) => {
    const rect = e.getBoundingClientRect();
    let pl = {
      top: rect.y + window.scrollX,
    };
    switch (placement) {
      case "topRight":
        pl = {
          top: rect.top - popPos.height - parseInt(spacing) + window.scrollY,
          left: rect.right + window.scrollX,
        };
        break;
      case "topLeft":
        pl = {
          top: rect.top - popPos.height - parseInt(spacing) + window.scrollY,
          left: rect.left - popPos.width + window.scrollX,
        };
        break;
      case "top":
        pl = {
          top: rect.top - popPos.height - parseInt(spacing) + window.scrollY,
          left:
            rect.left -
            (rect.width > popPos.width
              ? rect.width - popPos.width
              : popPos.width - rect.width) /
              2 +
            window.scrollX,
        };
        break;
      case "bottom":
        pl = {
          top: rect.bottom + parseInt(spacing) + window.scrollY,
          left:
            rect.left -
            (rect.width > popPos.width
              ? rect.width - popPos.width
              : popPos.width - rect.width) /
              2 +
            window.scrollX,
        };
        break;
      case "bottomRight":
        pl = {
          top: rect.bottom + parseInt(spacing) + window.scrollY,
          left: rect.right + window.scrollX,
        };
        break;
      case "bottomLeft":
        pl = {
          top: rect.bottom + parseInt(spacing) + window.scrollY,
          left: rect.left - popPos.width + window.scrollX,
        };
        break;
      case "left":
        pl = {
          top:
            rect.top -
            (rect.height > popPos.height
              ? rect.height - popPos.height
              : popPos.height - rect.height) /
              2 +
            window.scrollY,
          left: rect.left - popPos.width - parseInt(spacing) + window.scrollX,
        };
        break;
      case "leftTop":
        pl = {
          top: rect.top - popPos.height + window.scrollY,
          left: rect.left - popPos.width - parseInt(spacing) + window.scrollX,
        };
        break;
      case "leftBottom":
        pl = {
          top: rect.bottom + window.scrollY,
          left: rect.left - popPos.width - parseInt(spacing) + window.scrollX,
        };
        break;
      case "right":
        pl = {
          top:
            rect.top -
            (rect.height > popPos.height
              ? rect.height - popPos.height
              : popPos.height - rect.height) /
              2 +
            window.scrollY,
          left: rect.right + parseInt(spacing) + window.scrollX,
        };
        break;
      case "rightTop":
        pl = {
          top: rect.top - popPos.height + window.scrollY,
          left: rect.right + parseInt(spacing) + window.scrollX,
        };
        break;
      case "rightBottom":
        pl = {
          top: rect.bottom + window.scrollY,
          left: rect.right + parseInt(spacing) + window.scrollX,
        };
        break;
      default:
        const screen = window.screen;
        console.log(window.scrollX, window.scrollY);
        pl = {
          top: `calc(50% + ${window.scrollY}px)`,
          left: `calc(50% + ${window.scrollX}px)`,
          transform: "translate(-50%,-50%)",
        };
        break;
    }
    setPos(pl);
  };

  return (
    <span className="popupWrapper">
      {ReactDOM.createPortal(
        <>
          <span
            className={`popup`}
            style={{
              ...pos,
              ...style,
              visibility: open ? "visible" : "hidden",
              opacity: open ? 1 : 0,
            }}
          >
            {content}
          </span>
          {/* <span className="pointer"></span> */}
        </>,
        document.body
      )}
      <span
        className="targetElement"
        onClick={(e) => {
          if (trigger !== "hover") {
            setOpen(!open);
          }
          sePosition(e.target);
        }}
        onMouseEnter={(e) => {
          if (trigger === "hover") setOpen(true);
          sePosition(e.target);
        }}
        onMouseLeave={(e) => {
          if (trigger === "hover") setOpen(false);
          sePosition(e.target);
        }}
      >
        {children}
      </span>
    </span>
  );
};

export const Tooltip = ({
  content,
  children,
  style,
  placement = {
    top: "top",
    left: "left",
    right: "right",
    bottom: "bottom",
    topLeft: "topLeft",
    topRight: "topRight",
    bottomLeft: "bottomLeft",
    bottomRight: "bottomRight",
    leftTop: "leftTop",
    leftBottom: "leftBottom",
    rightTop: "rightTop",
    rightBottom: "rightBottom",
  },
  ...props
}) => {
  return (
    <Popup
      content={content}
      placement={placement}
      trigger="hover"
      {...props}
      style={{
        backgroundColor: "#000",
        color: "#fff",
        borderRadius: "5px",
        border: "none",
        ...style,
      }}
    >
      {children}
    </Popup>
  );
};

export const rgbToSvgFilter = (hex) => {
  const result = GetSvgFilter(hex);
  return result.filter;
};

export const SvgIcon = ({
  src,
  spin = false,
  size = "1",
  color = "#fff",
  shadow = false,
  style,
  ...props
}) => {
  return (
    <img
      className={`svg-icon${spin ? " spin" : ""}`}
      src={src}
      alt=""
      style={{
        width: size ? size + "em" : null,
        height: size ? size + "em" : null,
        filter: color
          ? shadow
            ? rgbToSvgFilter(color).concat(" drop-shadow(1px 1px 2px #000)")
            : rgbToSvgFilter(color)
          : null,
        verticalAlign: "middle",
        ...style,
      }}
      {...props}
    />
  );
};

export const usePrevious = (value) => {
  const ref = React.useRef();
  React.useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

export const DropdownThemed = ({
  field,
  listKey,
  List = [],
  theme = false,
  placeholder,
  allowClear = false,
  onClear,
  // allowSearch = true,
  value = "",
  onChange,
  style,
  width = null,
  ...props
}) => {
  const [search, setSearch] = React.useState("");
  const [slist, setSlist] = React.useState([]);
  const [val, setVal] = React.useState(null);
  const [collapse, setCollapse] = React.useState(false);
  const dropdownRef = React.useRef();
  outsideClick(dropdownRef, () => setCollapse(false));

  React.useEffect(() => {
    // setVal(value);
    setSearch(value);
  }, [value]);

  const prevVal = usePrevious(val);
  React.useEffect(() => {
    // if (!checkEmpty(val) && prevVal !== val) {
    if (!checkEmpty(onChange) && (!checkEmpty(val) || !checkEmpty(search))) {
      onChange(val, search);
    }
    // }

    {
      async () => {
        if (typeof List[0] === "string" && search !== val) {
          setVal(null);
        }
        if (typeof List[0] === "object" && search !== val[field]) {
          setVal(null);
        }
      };
    }
  }, [val, search]);

  return (
    <div
      className={`dropdown-themed ${theme ? "light" : "dark"}`}
      style={{ width: width ? width + "px" : null, ...style }}
      ref={dropdownRef}
      onFocus={(e) => setCollapse(true)}
    >
      <div className={`select-box`}>
        <input
          {...props}
          type="text"
          placeholder={placeholder}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            let newlist = [];
            List.filter((l) => {
              if (typeof l === "string") {
                if (
                  l
                    ?.toLowerCase()
                    ?.toLowerCase()
                    ?.indexOf(e.target.value.toLowerCase()) > -1
                ) {
                  newlist.push(l);
                }
              }
              if (typeof l === "object" && !l?.hasOwnProperty("child")) {
                if (
                  l[field]
                    ?.toLowerCase()
                    ?.indexOf(e.target.value.toLowerCase()) > -1
                ) {
                  newlist.push(l);
                }
              }
              if (typeof l === "object" && l?.hasOwnProperty("child")) {
                let newL = JSON.parse(JSON.stringify(l));
                newL.child = [];
                const grplist = l?.child?.map((lc) => {
                  if (typeof lc === "string") {
                    if (
                      lc?.toLowerCase()?.indexOf(e.target.value.toLowerCase()) >
                      -1
                    ) {
                      newL.child = [...newL.child, lc];
                    }
                  }
                  if (typeof lc === "object") {
                    if (
                      lc[field]
                        ?.toLowerCase()
                        ?.indexOf(e.target.value.toLowerCase()) > -1
                    ) {
                      newL.child = [...newL.child, lc];
                    }
                  }
                });
                if (newL.child.length > 0) {
                  newlist.push(newL);
                }
                return grplist;
              }
            });
            setSlist(newlist);
          }}
        />
        {checkEmpty(search) ? null : allowClear ? (
          <SvgIcon
            className="clear"
            onClick={(e) => {
              setCollapse(false);
              setSearch("");
              setVal("");
              checkEmpty(onClear) ? null : onClear();
            }}
            src={TimesCircle}
            color={theme ? "#000" : "#fff"}
            size="0.8"
          />
        ) : null}
      </div>
      <div
        className="options"
        style={{
          visibility: collapse ? "visible" : "hidden",
          opacity: collapse ? 1 : 0,
        }}
      >
        <div className="options-container">
          {checkEmpty(search)
            ? !checkEmpty(List) &&
              List?.map((l, li) => {
                if (typeof l === "string") {
                  return (
                    <div
                      className="option"
                      key={l[listKey] || l.key || li}
                      onClick={(e) => {
                        setSearch(l);
                        setVal(l);
                        setCollapse(false);
                      }}
                    >
                      {l}
                    </div>
                  );
                }
                if (typeof l === "object" && !l?.hasOwnProperty("child")) {
                  return (
                    <div
                      className="option"
                      key={l[listKey] || l.key || li}
                      onClick={(e) => {
                        setSearch(l[field]);
                        setVal(l);
                        setCollapse(false);
                      }}
                    >
                      {l[field]}
                    </div>
                  );
                }

                if (typeof l === "object" && l?.hasOwnProperty("child")) {
                  return (
                    // <div className="optgrp" key={l.key || li}>
                    // <div className="optgrp-title">{l[field]}</div>
                    <Collapse
                      title={l[field]}
                      key={l[listKey] || l.key || li}
                      content={l?.child?.map((lc, lci) => {
                        if (typeof lc === "string") {
                          return (
                            <div
                              className="option"
                              key={lc[listKey] || lc.key || lci}
                              onClick={(e) => {
                                setSearch(lc);
                                setVal(lc);
                                setCollapse(false);
                              }}
                            >
                              {lc}
                            </div>
                          );
                        }
                        if (typeof lc === "object") {
                          return (
                            <div
                              className="option"
                              key={lc[listKey] || lc.key || lci}
                              onClick={(e) => {
                                setSearch(lc[field]);
                                setVal(lc);
                                setCollapse(false);
                              }}
                            >
                              {lc[field]}
                            </div>
                          );
                        }
                      })}
                      titleColor={theme ? "#000" : "#fff"}
                      titleBg={theme ? "rgb(243, 242, 241)" : "rgb(32, 31, 31)"}
                      defaultOpen
                    />
                    // </div>
                  );
                }
              })
            : slist?.map((l, li) => {
                if (typeof l === "string") {
                  return (
                    <div
                      className="option"
                      key={l[listKey] || l.key || li}
                      onClick={(e) => {
                        setSearch(l);
                        setVal(l);
                        setCollapse(false);
                      }}
                    >
                      {l}
                    </div>
                  );
                }
                if (typeof l === "object" && !l?.hasOwnProperty("child")) {
                  return (
                    <div
                      className="option"
                      key={l[listKey] || l.key || li}
                      onClick={(e) => {
                        setSearch(l[field]);
                        setVal(l);
                        setCollapse(false);
                      }}
                    >
                      {l[field]}
                    </div>
                  );
                }

                if (typeof l === "object" && l?.hasOwnProperty("child")) {
                  return (
                    // <div className="optgrp" key={l.key || li}>
                    //   <div className="optgrp-title">{l[field]}</div>
                    <Collapse
                      title={l[field]}
                      key={l[listKey] || l.key || li}
                      content={l?.child?.map((lc, lci) => {
                        if (typeof lc === "string") {
                          return (
                            <div
                              className="option"
                              key={lc[listKey] || lc.key || lci}
                              onClick={(e) => {
                                setSearch(lc);
                                setVal(lc);
                                setCollapse(false);
                              }}
                            >
                              {lc}
                            </div>
                          );
                        }
                        if (typeof lc === "object") {
                          return (
                            <div
                              className="option"
                              key={lc[listKey] || lc.key || lci}
                              onClick={(e) => {
                                setSearch(lc[field]);
                                setVal(lc);
                                setCollapse(false);
                              }}
                            >
                              {lc[field]}
                            </div>
                          );
                        }
                      })}
                      titleColor={theme ? "#000" : "#fff"}
                      titleBg={theme ? "rgb(243, 242, 241)" : "rgb(32, 31, 31)"}
                      defaultOpen
                    />
                  );
                }
              })}
        </div>
      </div>
    </div>
  );
};

export const Input = ({ type = "text", className, ...props }) => {
  const [eye, setEye] = React.useState(false);
  return (
    <span
      className={`custom-input${checkEmpty(className) ? "" : " " + className}`}
    >
      {type === "password" ? (
        <input type={eye ? "text" : "password"} {...props} />
      ) : (
        <input type={type} {...props} />
      )}
      {type === "password" ? (
        <span onClick={(e) => setEye(!eye)}>
          <SvgIcon src={eye ? EyeSlash : Eye} color="#2d2c2b" />
        </span>
      ) : null}
    </span>
  );
};

export const Runningtime = () => {
  const [state, setState] = React.useState({ time: new Date() });
  React.useEffect(() => {
    let timer = setInterval(() => setState({ time: new Date() }), 1000);
    return () => clearTimeout(timer);
  });
  return <>{state.time.toString()}</>;
};

export const outsideClick = (ref, handler) => {
  React.useEffect(() => {
    const listener = (event) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      // if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      //   return;
      // }

      handler(event);
    };

    document.addEventListener("mousedown", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount
};

export const Modal = ({
  placement = {
    top: "top",
    bottom: "bottom",
    left: "left",
    right: "right",
    topLeft: "topLeft",
    topRight: "topRight",
    bottomLeft: "bottomLeft",
    bottomRight: "bottomRight",
  },
  title = null,
  footer = null,
  okBtn = false,
  okText = "OK",
  cancelBtn = false,
  cancelText = "Cancel",
  visible = true,
  centered = false,
  closeBtn = true,
  width = null,
  height,
  maskClosable = false,
  onClose,
  onOk,
  onCancel,
  children,
  style,
  nomask = false,
  ...props
}) => {
  const [showModal, setShowModal] = React.useState(visible);

  React.useEffect(() => {
    setShowModal(visible);
  }, [visible]);

  const closeModal = () => {
    onClose();
  };

  const placementStyle = () => {
    switch (placement) {
      case "top":
        return { position: "absolute", top: "0px" };
      case "bottom":
        return { position: "absolute", bottom: "0px" };
      case "left":
        return { position: "absolute", left: "0px" };
      case "right":
        return { position: "absolute", right: "0px" };
      case "right":
        return { position: "absolute", right: "0px" };
      case "topLeft":
        return { position: "absolute", top: "0px", left: "0px" };
      case "topRight":
        return { position: "absolute", top: "0px", right: "0px" };
      case "bottomLeft":
        return { position: "absolute", bottom: "0px", left: "0px" };
      case "bottomRight":
        return { position: "absolute", bottom: "0px", right: "0px" };
      default:
        return {};
    }
  };

  const plcStyle = placementStyle();

  return showModal ? (
    <div className="modal" style={plcStyle} {...props}>
      <div
        className={`${nomask ? "" : "modal-overlay"}`}
        id="modal-overlay"
        onClick={(e) => {
          if (maskClosable) {
            if (e.target.id === "modal-overlay") {
              closeModal();
            }
          }
        }}
        onKeyDown={(e) => {
          if (e.keyCode === 27) {
            closeModal();
          }
        }}
      >
        <div
          className={`modal-content${centered ? " center-content-3" : ""}`}
          style={{
            height: checkEmpty(height) ? "fit-content" : height + "px",
            width: checkEmpty(width) ? "fit-content" : width + "px",
            // minHeight: "75px",
            // minWidth: "150px",
            maxWidth: "100%",
            maxHeight: "100%",
            ...style,
          }}
        >
          {closeBtn ? (
            <div className="close-btn" onClick={() => closeModal()}>
              <SvgIcon src={Times} />
            </div>
          ) : null}

          {!checkEmpty(title) ? (
            <>
              <div className="title">{title}</div>
              <hr />
            </>
          ) : null}

          {children}

          {!checkEmpty(footer) ? (
            <div className="footer">
              <hr />
              {footer}
            </div>
          ) : okBtn || cancelBtn ? (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "nowrap",
                justifyContent: "space-evenly",
              }}
            >
              {okBtn ? (
                <button
                  className="btn-green"
                  onClick={(e) => (checkEmpty(onOk) ? closeModal() : onOk())}
                >
                  {okText}
                </button>
              ) : null}
              {cancelBtn ? (
                <button
                  className="btn-red"
                  onClick={(e) =>
                    checkEmpty(onCancel) ? closeModal() : onCancel()
                  }
                >
                  {cancelText}
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  ) : null;
};

export const PopupConfirm = ({
  placement = {
    top: "top",
    bottom: "bottom",
    left: "left",
    right: "right",
  },
  iconType = {
    warning: "warning",
    error: "error",
  },
  title = "Are You Sure?",
  onConfirm,
  onCancel,
  okText = "Yes",
  cancelText = "No",
  icon,
  children,
  style,
  width = "120",
  ...props
}) => {
  const [show, setShow] = React.useState(false);
  return (
    <span className="popup-confirm" {...props}>
      <span onClick={(e) => setShow(true)}>{children}</span>
      <Modal
        width={width}
        visible={show}
        style={{
          border: "0.1px solid rgb(255,255,255,0.3)",
          ...style,
        }}
        placement={placement}
        closeBtn={false}
        onClose={(e) => {
          setShow(false);
        }}
        onOk={(e) => {
          if (onConfirm) {
            onConfirm();
          }
        }}
        cancelBtn
        okBtn
        okText={okText}
        cancelText={cancelText}
        nomask
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          {checkEmpty(icon) ? (
            <SvgIcon
              src={ExclamationCircle}
              color={iconType === "warning" ? "#ffce46" : "#ff0000"}
            />
          ) : null}
          {title}
        </span>
      </Modal>
    </span>
  );
};

export const Collapse = ({
  title,
  content,
  defaultOpen = false,
  titleColor,
  titleBg,
  contentStyle,
  ...props
}) => {
  const [open, setOpen] = React.useState(defaultOpen);

  React.useEffect(() => {
    if (checkEmpty(content)) {
      setOpen(false);
    } else {
      setOpen(defaultOpen);
    }
  }, [defaultOpen, content]);

  return (
    <div className="collapse">
      <div
        className="collapse-title"
        onClick={(e) => setOpen(!open)}
        style={{ backgroundColor: titleBg, color: titleColor }}
      >
        <SvgIcon src={!open ? CaretRight : CaretDown} color={titleColor} />
        <span>{title}</span>
      </div>
      <div className="collapse-content" style={contentStyle}>
        {open ? content : null}
      </div>
    </div>
  );
};

export const TabControl = ({
  TabList = [],
  activeChild,
  width,
  height,
  animated = true,
  centeredHeader = false,
}) => {
  const [tab, setTab] = React.useState(0);

  React.useEffect(() => {
    if (!checkEmpty(activeChild) && activeChild !== tab) {
      setTab(activeChild);
    }
  }, [activeChild]);

  return (
    <div
      className="tab-control"
      style={{
        width: width ? width + "px" : null,
      }}
    >
      <header>
        {TabList.map((t, i) => (
          <span
            className={tab === i ? "tab-header active" : "tab-header"}
            style={centeredHeader ? { flex: 1 } : { padding: "0 10px" }}
            key={i}
            onClick={(e) => setTab(i)}
          >
            {t.header}
          </span>
        ))}
      </header>
      {!animated ? (
        <main
          style={{
            height: height ? height + "px" : null,
          }}
        >
          <div className="tab-content">
            {TabList.filter((t, i) => i === tab)[0]?.content}
          </div>
        </main>
      ) : (
        <main
          style={{
            transform: `translateX(${tab * -100}%)`,
            height: height ? height + "px" : null,
          }}
        >
          {TabList.map((t, i) => (
            <div className="tab-content" key={i}>
              {t.content && t.content}
            </div>
          ))}
        </main>
      )}
    </div>
  );
};
