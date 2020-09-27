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
