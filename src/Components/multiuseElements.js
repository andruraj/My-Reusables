//library imports
import React from "react";
import ReactDOM from "react-dom";

//comp imports
import GetSvgFilter from "./SvgColor";

//static imports
import Eye from "../../../static/icons/duotone/eye.svg";
import EyeSlash from "../../../static/icons/duotone/eye-slash.svg";
import Times from "../../../static/icons/duotone/times.svg";
import TimesCircle from "../../../static/icons/duotone/times-circle.svg";
import CaretRight from "../../../static/icons/duotone/caret-right.svg";
import CaretDown from "../../../static/icons/duotone/caret-down.svg";
import CircleNotch from "../../../static/icons/duotone/circle-notch.svg";
import ExclamationCircle from "../../../static/icons/duotone/exclamation-circle.svg";

import "./miscellaneous elements.css";

let portalRoot = document.getElementById("portal-root");

//comps
export const rgbToSvgFilter = hex => {
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
        ...style
      }}
      {...props}
    />
  );
};

export const usePrevious = value => {
  const ref = React.useRef();
  React.useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

export const OutsideClick = ({ handler, children, ...props }) => {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const listener = event => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
    };
  }, [handler]);

  return (
    <div ref={ref} className="wrapperRef" {...props}>
      {children}
    </div>
  );
};

class Portal extends React.Component {
  constructor(props) {
    super(props);
    // 1: Create a new div that wraps the component
    this.el = document.createElement("div");
    this.el.classList.add("Portal");
    if (!checkEmpty(props.className)) {
      this.el.classList.add(props.className);
    }
  }
  // 2: Append the element to the DOM when it mounts
  componentDidMount = () => {
    portalRoot.appendChild(this.el);
  };
  // 3: Remove the element when it unmounts
  componentWillUnmount = () => {
    portalRoot.removeChild(this.el);
  };
  render() {
    // 4: Render the element's children in a Portal
    const { children } = this.props;
    return ReactDOM.createPortal(children, this.el);
  }
}

export const DropdownThemed = ({
  field,
  listKey,
  List = [],
  theme = false,
  placeholder,
  allowClear = false,
  onClear,
  allowSearch = true,
  value = "",
  onChange,
  style,
  width = null,
  disabled,
  ...props
}) => {
  const [search, setSearch] = React.useState("");
  const [pos, setPos] = React.useState({});
  const [slist, setSlist] = React.useState([]);
  const [val, setVal] = React.useState(null);
  const [collapse, setCollapse] = React.useState(false);
  const dropdownRef = React.useRef();
  // outsideClick(dropdownRef, () => setCollapse(false));

  React.useEffect(() => {
    const dropdown = dropdownRef.current;
    if (dropdown && pos !== dropdown.getBoundingClientRect()) {
      setPos(dropdown.getBoundingClientRect());
    }
  }, [dropdownRef, collapse]);

  React.useEffect(() => {
    setSearch(value);
  }, [value]);

  React.useEffect(
    React.useCallback(() => {
      if (!checkEmpty(onChange)) {
        onChange(val, search);
      }
    }, [val, search, onChange]),
    [val, search]
  );

  return (
    <div
      className={`dropdown-themed ${theme ? "light" : "dark"}`}
      style={{
        width: width ? width + "px" : null,
        ...style,
        pointerEvents: disabled ? "none" : "auto",
        filter: disabled ? "contrast(.75)" : "none"
      }}
      ref={dropdownRef}
      onFocus={e => setCollapse(true)}
    >
      <div
        className={`select-box`}
        style={{
          color: theme ? " rgb(0, 0, 0)" : " rgb(255, 255, 255)",
          background: theme ? " rgb(243, 242, 241)" : "rgb(0, 0, 0)"
        }}
      >
        <input
          {...props}
          disabled={!allowSearch}
          style={{
            color: theme ? " rgb(0, 0, 0)" : " rgb(255, 255, 255)",
            background: theme ? " rgb(243, 242, 241)" : "rgb(0, 0, 0)"
          }}
          type="text"
          placeholder={placeholder}
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            let newlist = [];
            List.filter(l => {
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
                const grplist = l?.child?.map(lc => {
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
        {checkEmpty(search) ? (
          !allowSearch &&
          !collapse && (
            <SvgIcon
              onClick={() => setCollapse(true)}
              src={CaretDown}
              color={theme ? "#000" : "#fff"}
              // size="0.8"
            />
          )
        ) : allowClear ? (
          <SvgIcon
            className="clear"
            onClick={e => {
              setSearch("");
              setVal(null);
              !checkEmpty(onClear) && onClear();
              setCollapse(true);
            }}
            src={TimesCircle}
            color={theme ? "#000" : "#fff"}
            size="0.8"
          />
        ) : null}
      </div>

      <Portal className="Dropdown-Options">
        <OutsideClick handler={e => setCollapse(false)}>
          <div
            className="options"
            style={{
              visibility: collapse ? "visible" : "hidden",
              opacity: collapse ? 1 : 0,
              position: "absolute",
              top: pos?.bottom,
              left: pos?.left,
              width: pos?.width,
              color: theme ? " rgb(0, 0, 0)" : " rgb(255, 255, 255)",
              background: theme ? " rgb(243, 242, 241)" : "rgb(0, 0, 0)"
            }}
          >
            <div
              className="options-container"
              style={{
                color: theme ? " rgb(0, 0, 0)" : " rgb(255, 255, 255)",
                background: theme ? " rgb(243, 242, 241)" : "rgb(0, 0, 0)"
              }}
            >
              {checkEmpty(search) ? (
                !checkEmpty(List) ? (
                  List.map((l, li) => {
                    if (typeof l === "string") {
                      return (
                        <div
                          className="option"
                          key={l[listKey] || l.key || li}
                          onClick={e => {
                            setSearch(l);
                            setVal(l);
                            setCollapse(false);
                          }}
                        >
                          {l}
                        </div>
                      );
                    }
                    if (typeof l === "object" && !l.hasOwnProperty("child")) {
                      return (
                        <div
                          className="option"
                          key={l[listKey] || l.key || li}
                          onClick={e => {
                            setSearch(l[field]);
                            setVal(l);
                            setCollapse(false);
                          }}
                        >
                          {l[field]}
                        </div>
                      );
                    }
                    if (typeof l === "object" && l.hasOwnProperty("child")) {
                      return (
                        <Collapse
                          titleColor={theme ? "#000" : "#fff"}
                          titleBg={
                            theme ? "rgb(243, 242, 241)" : "rgb(32, 31, 31)"
                          }
                          defaultOpen
                          title={l[field]}
                          key={l[listKey] || l.key || li}
                          content={
                            !checkEmpty(l) && !checkEmpty(l.child) ? (
                              l?.child?.map((lc, lci) => {
                                if (typeof lc === "string") {
                                  return (
                                    <div
                                      className="option"
                                      key={lc[listKey] || lc.key || lci}
                                      onClick={e => {
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
                                      onClick={e => {
                                        setSearch(lc[field]);
                                        setVal(lc);
                                        setCollapse(false);
                                      }}
                                    >
                                      {lc[field]}
                                    </div>
                                  );
                                }
                              })
                            ) : (
                              <div
                                style={{
                                  textAlign: "center",
                                  height: "1.5rem"
                                }}
                              >
                                <span>Loading...</span>
                                <SvgIcon
                                  src={CircleNotch}
                                  spin
                                  color={"#000"}
                                />
                              </div>
                            )
                          }
                        />
                      );
                    }
                  })
                ) : (
                  <div style={{ textAlign: "center", height: "1.5rem" }}>
                    <span>Loading...</span>
                    <SvgIcon src={CircleNotch} spin color={"#000"} />
                  </div>
                )
              ) : !checkEmpty(slist) ? (
                slist.map((l, li) => {
                  if (typeof l === "string") {
                    return (
                      <div
                        className="option"
                        key={l[listKey] || l.key || li}
                        onClick={e => {
                          setSearch(l);
                          setVal(l);
                          setCollapse(false);
                        }}
                      >
                        {l}
                      </div>
                    );
                  }
                  if (typeof l === "object" && !l.hasOwnProperty("child")) {
                    return (
                      <div
                        className="option"
                        key={l[listKey] || l.key || li}
                        onClick={e => {
                          setSearch(l[field]);
                          setVal(l);
                          setCollapse(false);
                        }}
                      >
                        {l[field]}
                      </div>
                    );
                  }
                  if (typeof l === "object" && l.hasOwnProperty("child")) {
                    return (
                      <Collapse
                        titleColor={theme ? "#000" : "#fff"}
                        titleBg={
                          theme ? "rgb(243, 242, 241)" : "rgb(32, 31, 31)"
                        }
                        defaultOpen
                        title={l[field]}
                        key={l[listKey] || l.key || li}
                        content={l.child.map((lc, lci) => {
                          if (typeof lc === "string") {
                            return (
                              <div
                                className="option"
                                key={lc[listKey] || lc.key || lci}
                                onClick={e => {
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
                                onClick={e => {
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
                      />
                    );
                  }
                })
              ) : (
                <div
                  style={{
                    color: "var(--disabled-text-color)",
                    margin: "5px",
                    textAlign: "center"
                  }}
                >
                  Not Found
                </div>
              )}
            </div>
          </div>
        </OutsideClick>
      </Portal>
    </div>
  );
};

export const Input = ({ type = "text", className, width, ...props }) => {
  const [eye, setEye] = React.useState(false);
  return (
    <span
      className={`custom-input${checkEmpty(className) ? "" : " " + className}`}
      style={{ ...props.style }}
    >
      {type === "password" ? (
        <input
          style={{ width: width ? width + "px" : null }}
          type={eye ? "text" : "password"}
          {...props}
        />
      ) : (
        <input
          style={{ width: width ? width + "px" : null }}
          type={type}
          {...props}
        />
      )}
      {type === "password" ? (
        <span onClick={e => setEye(!eye)}>
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

export const Modal = ({
  placement = {
    top: "top",
    bottom: "bottom",
    left: "left",
    right: "right",
    topLeft: "topLeft",
    topRight: "topRight",
    bottomLeft: "bottomLeft",
    bottomRight: "bottomRight"
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
    !checkEmpty(onClose) ? onClose() : setShowModal(false);
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
    <Portal className="Modal">
      <div className="modal" style={plcStyle} {...props}>
        <div
          className={`${nomask ? "" : "modal-overlay"}`}
          id="modal-overlay"
          onClick={e => {
            if (maskClosable) {
              if (e.target.id === "modal-overlay") {
                closeModal();
              }
            }
          }}
          onKeyDown={e => {
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
              ...style
            }}
          >
            {closeBtn ? (
              <div className="close-btn">
                <SvgIcon src={Times} onClick={() => closeModal()} />
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
                  justifyContent: "space-evenly"
                }}
              >
                {okBtn ? (
                  <button
                    className="btn-green"
                    onClick={e => (checkEmpty(onOk) ? closeModal() : onOk())}
                  >
                    {okText}
                  </button>
                ) : null}
                {cancelBtn ? (
                  <button
                    className="btn-red"
                    onClick={e =>
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
    </Portal>
  ) : null;
};

export const PopupConfirm = ({
  placement = {
    top: "top",
    bottom: "bottom",
    left: "left",
    right: "right"
  },
  iconType = {
    warning: "warning",
    error: "error"
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
      <span onClick={e => setShow(true)}>{children}</span>
      <Modal
        width={width}
        visible={show}
        style={{
          border: "0.1px solid rgb(255,255,255,0.3)",
          ...style
        }}
        placement={placement}
        closeBtn={false}
        onClose={e => {
          setShow(false);
        }}
        onOk={e => {
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
            justifyContent: "space-evenly"
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
        onClick={e => setOpen(!open)}
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

export const Popup = ({
  content,
  children,
  style,
  visible,
  onClose,
  closeBtn = false,
  trigger = {
    hover: "hover",
    click: "click"
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
    rightBottom: "rightBottom"
  }
}) => {
  const [open, setOpen] = React.useState(
    !checkEmpty(visible) ? visible : false
  );
  const [pos, setPos] = React.useState({
    top: 0,
    left: 0
  });
  const [popPos, setPopPos] = React.useState({});

  const popRef = React.useRef(null);
  const tarRef = React.useRef(null);

  //update visibility
  React.useEffect(() => {
    if (!checkEmpty(visible)) {
      setOpen(visible);
    }
  }, [visible]);

  //get pixel points for position
  React.useEffect(() => {
    const popup = popRef.current;
    if (popup) {
      setPopPos(popup.getBoundingClientRect());
    }
  }, []);

  //set position according to input
  const sePosition = () => {
    const rect = tarRef.current.getBoundingClientRect();
    let pl = {
      top: rect.y + window.scrollX
    };
    switch (placement) {
      case "topRight":
        pl = {
          top: rect.top - popPos.height - parseInt(spacing) + window.scrollY,
          left: rect.right + window.scrollX
        };
        break;
      case "topLeft":
        pl = {
          top: rect.top - popPos.height - parseInt(spacing) + window.scrollY,
          left: rect.left - popPos.width + window.scrollX
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
            window.scrollX
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
            window.scrollX
        };
        break;
      case "bottomRight":
        pl = {
          top: rect.bottom + parseInt(spacing) + window.scrollY,
          left: rect.right + window.scrollX
        };
        break;
      case "bottomLeft":
        pl = {
          top: rect.bottom + parseInt(spacing) + window.scrollY,
          left: rect.left - popPos.width + window.scrollX
        };
        break;
      case "left":
        pl = {
          top:
            rect.top +
            (rect.height > popPos.height
              ? rect.height - popPos.height
              : popPos.height - rect.height) /
              2 +
            window.scrollY,
          left: rect.left - popPos.width - parseInt(spacing) + window.scrollX
        };
        break;
      case "leftTop":
        pl = {
          top: rect.top - popPos.height + window.scrollY,
          left: rect.left - popPos.width - parseInt(spacing) + window.scrollX
        };
        break;
      case "leftBottom":
        pl = {
          top: rect.bottom + window.scrollY,
          left: rect.left - popPos.width - parseInt(spacing) + window.scrollX
        };
        break;
      case "right":
        pl = {
          top:
            rect.top +
            (rect.height > popPos.height
              ? rect.height - popPos.height
              : popPos.height - rect.height) /
              2 +
            window.scrollY,
          left: rect.right + parseInt(spacing) + window.scrollX
        };
        break;
      case "rightTop":
        pl = {
          top: rect.top - popPos.height + window.scrollY,
          left: rect.right + parseInt(spacing) + window.scrollX
        };
        break;
      case "rightBottom":
        pl = {
          top: rect.bottom + window.scrollY,
          left: rect.right + parseInt(spacing) + window.scrollX
        };
        break;
      default:
        pl = {
          top: `calc(50% + ${window.scrollY}px)`,
          left: `calc(50% + ${window.scrollX}px)`,
          transform: "translate(-50%,-50%)"
        };
        break;
    }
    setPos(pl);
  };

  return (
    <span className="popupWrapper">
      <Portal className="Popup">
        <span
          ref={popRef}
          className={`popup`}
          style={{
            ...pos,
            ...style,
            visibility: open ? "visible" : "hidden",
            opacity: open ? 1 : 0
          }}
        >
          {closeBtn && (
            <div className="clear-popup">
              <SvgIcon
                onClick={() =>
                  checkEmpty(onClose) ? setOpen(false) : onClose(false)
                }
                color="#000"
                src={TimesCircle}
                size="0.8"
              />
            </div>
          )}
          {content}
        </span>
      </Portal>
      <span
        ref={tarRef}
        className="targetElement"
        onClick={e => {
          if (trigger !== "hover") {
            checkEmpty(visible) && setOpen(!open);
            sePosition();
          }
        }}
        onMouseEnter={e => {
          if (trigger === "hover") {
            checkEmpty(visible) && setOpen(true);
            sePosition();
          }
        }}
        onMouseLeave={e => {
          if (trigger === "hover") {
            checkEmpty(visible) && setOpen(false);
            sePosition();
          }
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
    rightBottom: "rightBottom"
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
        ...style
      }}
    >
      {children}
    </Popup>
  );
};

export const TabControl = ({
  TabList = [],
  getActive,
  setActive,
  width,
  height,
  animated = true,
  centeredHeader = false
}) => {
  const [tab, setTab] = React.useState(0);

  React.useEffect(() => {
    if (!checkEmpty(setActive) && setActive !== tab) {
      setTab(setActive);
      setActive = undefined;
    }
  }, [setActive]);

  React.useEffect(() => {
    getActive && getActive(tab);
  }, [tab]);

  return (
    <div
      className="tab-control"
      style={{
        width: width ? width + "px" : null
      }}
    >
      <header>
        {TabList.map((t, i) => (
          <span
            className={tab === i ? "tab-header active" : "tab-header"}
            style={centeredHeader ? { flex: 1 } : { padding: "0 10px" }}
            key={i}
            onClick={e => setTab(i)}
          >
            {t.header}
          </span>
        ))}
      </header>
      {!animated ? (
        <main
          style={{
            height: height ? height + "px" : null
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
            height: height ? height + "px" : null
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

export const LoadingMasked = ({
  loadingText = "Loading...",
  size = 5,
  visible,
  ...props
}) => {
  const [showModal, setShowModal] = React.useState(visible);

  React.useEffect(() => {
    setShowModal(visible);
  }, [visible]);

  return (
    <Portal className="Loading-Masked">
      <div className="modal">
        <div className="modal-overlay">
          <div className="center-content-2">
            <div
              style={{ color: "var(--primary-text-color)", fontSize: "2rem" }}
            >
              {loadingText}
            </div>{" "}
            <br /> <br />
            <div>
              <SvgIcon src={CircleNotch} spin size={size} />
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export const checkEmpty = val => {
  return (
    val === undefined ||
    val === null ||
    (typeof val === "object" && Object.keys(val).length === 0) ||
    (typeof val === "string" && val.trim().length === 0) ||
    (typeof val === "string" && val === " ")
  );
};

export const setCookie = (cname, cvalue, expires, path) => {
  if (!checkEmpty(cname) && !checkEmpty(cvalue)) {
    if (!checkEmpty(expires)) {
      let d = new Date();
      const exStr = expires.charAt(expires.length - 1);
      if (exStr === "h") {
        d.setTime(d.getTime() + expires * 60 * 60 * 1000);
      } else if (exStr === "m") {
        d.setTime(d.getTime() + expires * 60 * 1000);
      } else if (exStr === "s") {
        d.setTime(d.getTime() + expires * 1000);
      } else if (exStr === "d") {
        d.setTime(d.getTime() + expires * 24 * 60 * 60 * 1000);
      }
      if (!checkEmpty(path)) {
        document.cookie = `${cname}=${cvalue};expires=${d.toUTCString()};path=${path}`;
      } else {
        document.cookie = `${cname}=${cvalue};expires=${d.toUTCString()}`;
      }
    } else if (!checkEmpty(path)) {
      document.cookie = `${cname}=${cvalue};path=${path}`;
    } else {
      document.cookie = `${cname}=${cvalue};`;
    }
  }
};

export const removeCookie = cname => {
  document.cookie = `${cname}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
};

export const getCookies = () => {
  const decodedCookie = decodeURIComponent(document.cookie).split(";");
  let arr = decodedCookie.map(d => {
    let tmp = d.split("=");
    return { name: tmp[0]?.trim(), value: tmp[1]?.trim() };
  });
  return arr;
};

export const getCookie = cname => {
  return getCookies().find(c => c.name === cname);
};

export const removeAllCookies = () => {
  getCookies().forEach(c => {
    document.cookie = `${c.name}=${
      c.value
    };expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
  });
};
