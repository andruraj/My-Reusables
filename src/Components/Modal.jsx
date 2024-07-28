import { isValidElement, useEffect, useState } from "react";
import { isEmpty } from "@utils/isEmpty";
import { Portal } from "./Portal";
import { Button } from "./Button";
import { twMerge } from "tailwind-merge";

import X from "@icons/solid/x.svg?react";

export const Modal = ({
  placement,
  title = null,
  className,
  footer = null,
  okBtn = false,
  okText = "Okay",
  cancelBtn = false,
  cancelText = "Cancel",
  visible = true,
  closeBtn = true,
  width = null,
  height,
  maskClosable = false,
  onClose,
  onOk,
  onCancel,
  children,
  mask = true,
  zIndex = 11,
  divide = false,
  customContent,
  ...props
}) => {
  const [showModal, setShowModal] = useState(visible);

  useEffect(() => {
    setShowModal(visible);
  }, [visible]);

  const closeModal = () => {
    !isEmpty(onClose) ? onClose() : setShowModal(false);
  };

  const placementStyle = (val) => {
    switch (val) {
      case "top":
        return "top-0";
      case "bottom":
        return "bottom-0";
      case "left":
        return "left-0";
      case "right":
        return "right-0";
      case "topLeft":
        return "top-0 left-0";
      case "topRight":
        return "top-0 right-0";
      case "bottomLeft":
        return "bottom-0 left-0";
      case "bottomRight":
        return "bottom-0 right-0";
      case "center":
        return "top-1/2 transform -translate-y-1/2 left-1/2 -translate-x-1/2";
      default:
        return "top-1/2 transform -translate-y-1/2 left-1/2 -translate-x-1/2";
    }
  };

  return showModal ? (
    <Portal className="Modal">
      {mask ? (
        <div
          className="fixed top-0 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center overflow-hidden inset-0 w-screen h-screen"
          id="modal-overlay"
          style={{ zIndex }}
          onClick={(e) => {
            if (maskClosable) {
              if (e.target.id === "modal-overlay") {
                closeModal();
              }
            }
          }}
          tabIndex="0"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              closeModal();
            }
          }}
        >
          <DefaultContent
            className={className}
            placement={placementStyle(placement)}
            title={title}
            closeModal={closeModal}
            children={children}
            footer={footer}
            okBtn={okBtn}
            okText={okText}
            cancelBtn={cancelBtn}
            cancelText={cancelText}
            onOk={onOk}
            onClose={onClose}
            onCancel={onCancel}
            closeBtn={closeBtn}
            width={width}
            height={height}
            customContent={customContent}
            divide={divide}
            {...props}
          />
        </div>
      ) : (
        <DefaultContent
          className={className}
          mask={mask}
          zIndex={zIndex}
          placement={placementStyle(placement)}
          title={title}
          closeModal={closeModal}
          children={children}
          footer={footer}
          okBtn={okBtn}
          okText={okText}
          cancelBtn={cancelBtn}
          cancelText={cancelText}
          onOk={onOk}
          onClose={onClose}
          onCancel={onCancel}
          closeBtn={closeBtn}
          width={width}
          height={height}
          customContent={customContent}
          divide={divide}
          {...props}
        />
      )}
    </Portal>
  ) : null;
};

const DefaultContent = ({
  className,
  mask,
  zIndex,
  placement,
  title,
  closeModal,
  children,
  footer,
  okBtn,
  okText,
  cancelBtn,
  cancelText,
  onOk,
  onClose,
  onCancel,
  closeBtn,
  width,
  height,
  customContent,
  divide,
  ...props
}) =>
  isValidElement(customContent) ? (
    customContent
  ) : (
    <div
      className={twMerge(
        "p-4 shadow-lg bg-bgToolBar text-blak flex flex-col gap-2 max-h-[90%] max-w-[90%] overflow-auto",
        divide ? "divide-y divide-neutral-500" : "",
        mask ? "relative" : "absolute",
        placement,
        className
      )}
      style={
        (!mask && { zIndex },
        {
          height: isEmpty(height) ? "auto" : height + "px",
          width: isEmpty(width) ? "fit-content" : width + "px",
          ...props.style,
        })
      }
      {...props}
    >
      {!isEmpty(title) ? (
        <DefaultHeader
          header={title}
          onClose={() => closeModal()}
          closeBtn={closeBtn}
        />
      ) : (
        !!closeBtn && (
          <div>
            <span className="absolute top-0 right-0 w-fit h-fit inline-block px-1.5 py-2">
              <CloseButton onClick={() => closeModal()} />
            </span>
          </div>
        )
      )}

      {children}

      {!isEmpty(footer) ? (
        footer
      ) : okBtn || cancelBtn ? (
        <div className="pt-2 flex items-center justify-evenly flex-nowrap">
          {okBtn ? (
            <Button onClick={(e) => (isEmpty(onOk) ? closeModal() : onOk())}>
              {okText}
            </Button>
          ) : null}
          {cancelBtn ? (
            <Button
              variant={"error"}
              onClick={(e) => (isEmpty(onCancel) ? closeModal() : onCancel())}
            >
              {cancelText}
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );

const DefaultHeader = ({ header, onClose, closeBtn }) => (
  <header
    id="header"
    className="flex items-start justify-between h-fit w-full capitalize"
  >
    <div className="text-xl font-semibold w-full mr-2">{header}</div>
    {!!closeBtn && (
      <CloseButton
        onClick={(e) => {
          e.preventDefault();
          onClose();
        }}
      />
    )}
  </header>
);

const CloseButton = ({ onClick }) => (
  <span className="" onClick={onClick}>
    <X className="w-4 h-4 inline-block fill-current cursor-pointer text-[#F00] absolute right-2 top-3" />
  </span>
);
