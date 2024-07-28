import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Modal } from "./Modal";

/**
 * Prompt Component
 * @component
 * @param {object} props
 * @param {string} props.message - The message to display in the prompt.
 * @param {function} props.onConfirm - Function to call when OK button is clicked.
 * @param {function} props.onCancel - Function to call when Cancel button is clicked.
 * @param {boolean} props.when - Condition to determine if the prompt should be shown.
 * @example
 * return (
 *   <Prompt
 *     message="Are you sure?"
 *     onConfirm={() => console.log('Confirmed')}
 *     onCancel={() => console.log('Cancelled')}
 *     when={true}
 *   />
 * )
 */
export const Prompt = ({
  when,
  message = "Are you sure?",
  onConfirm = () => {},
  onCancel = () => {},
}) => {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (when) setIsOpen(true);
    else setIsOpen(false);
  }, [isOpen]);

  const handleConfirm = () => {
    onConfirm();
    setIsOpen(false);
  };

  const handleCancel = () => {
    onCancel();
    setIsOpen(false);
  };

  return !isOpen ? null : (
    <Modal
      placement="center"
      width={400}
      okBtn
      cancelBtn
      okText="Yes"
      cancelText="No"
      onOk={handleConfirm}
      onCancel={handleCancel}
    >
      {message}
    </Modal>
  );
};

Prompt.propTypes = {
  message: PropTypes.string.isRequired,
  when: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
};

/**
 * PromptExit Component
 * @component
 * @param {object} props
 * @param {string} props.message - The message to display in the prompt.
 * @param {function} props.onConfirm - Function to call when OK button is clicked.
 * @param {function} props.onCancel - Function to call when Cancel button is clicked.
 * @param {boolean} props.when - Condition to determine if the prompt should be shown.
 * @example
 * return (
 *   <PromptExit
 *     message="Are you sure you want to leave?"
 *     onConfirm={() => console.log('Confirmed')}
 *     onCancel={() => console.log('Cancelled')}
 *     when={true}
 *   />
 * )
 */
export const PromptExit = ({
  when,
  message = "Changes you made may not be saved. Are you sure you want to leave?",
  onConfirm = () => {},
  onCancel = () => {},
}) => {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (when) {
        const confirmationMessage =
          message || "Changes you made may not be saved.";
        event.returnValue = confirmationMessage;
        return confirmationMessage;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [message, when]);

  useEffect(() => {
    if (when) {
      const handleRouteChange = () => {
        setIsOpen(true);
        return false; // Prevents navigation
      };

      window.addEventListener("popstate", handleRouteChange);

      return () => {
        window.removeEventListener("popstate", handleRouteChange);
      };
    }
  }, [when]);

  const handleConfirm = () => {
    onConfirm();
    setIsOpen(false);
  };

  const handleCancel = () => {
    onCancel();
    setIsOpen(false);
  };

  return !isOpen ? null : (
    <Modal
      placement="center"
      width={400}
      okBtn
      cancelBtn
      okText="Yes"
      cancelText="No"
      onOk={handleConfirm}
      onCancel={handleCancel}
    >
      {message}
    </Modal>
  );
};

PromptExit.propTypes = {
  message: PropTypes.string.isRequired,
  when: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
};
