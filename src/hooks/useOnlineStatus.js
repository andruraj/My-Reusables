import { useState } from "react";
import { useEventListener } from "./useEventListener";

/**
 * Custom hook that tracks the online status of the browser.
 * @returns {boolean} Boolean indicating whether the browser is online (true) or offline (false).
 *
 * @example
 * // Example usage:
 * const isOnline = useOnlineStatus();
 * // Use isOnline to conditionally render UI based on network connectivity.
 */
export const useOnlineStatus = () => {
  const [online, setOnline] = useState(navigator.onLine);

  // Add event listeners for online and offline events
  useEventListener("online", () => setOnline(true));
  useEventListener("offline", () => setOnline(false));

  return online;
};
