import { useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";

/**
 * Hook to confirm exit when navigation occurs.
 * @param {function} confirmExit - Function to confirm exit.
 * @param {boolean} [when=true] - Condition to enable/disable the prompt.
 * @example
 * const confirmExit = () => {
 *   return window.confirm("Are you sure you want to leave?");
 * };
 * useConfirmExit(confirmExit, true);
 */
function useConfirmExit(confirmExit, when = true) {
  const history = useHistory();

  useEffect(() => {
    if (!when) {
      return;
    }

    const unblock = history.block((tx) => {
      const result = confirmExit();
      if (result !== false) {
        unblock();
        tx.retry();
      }
    });

    return () => {
      unblock();
    };
  }, [history, confirmExit, when]);
}

useConfirmExit.propTypes = {
  confirmExit: PropTypes.func.isRequired,
  when: PropTypes.bool,
};

/**
 * Hook to prompt the user with a message when they try to exit the page.
 * @param {string} message - The message to display in the prompt.
 * @param {boolean} [when=true] - Condition to enable/disable the prompt.
 * @example
 * usePrompt("Are you sure you want to leave?", true);
 */
export function usePrompt(message, when = true) {
  useEffect(() => {
    if (when) {
      const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = message;
        return message;
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, [message, when]);

  const confirmExit = useCallback(() => {
    return window.confirm(message);
  }, [message]);

  useConfirmExit(confirmExit, when);
}

usePrompt.propTypes = {
  message: PropTypes.string.isRequired,
  when: PropTypes.bool,
};
