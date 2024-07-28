import { forwardRef } from "react";
import { Portal } from "./Portal";

export const ModalOverlay = forwardRef(
  /**
   * @param {{children: React.ReactNode} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>}
   */
  ({ children, ...props }, forwardedRef) => (
    <Portal id="modal-overlay">
      <div
        className="fixed z-10 top-0 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center overflow-hidden inset-0 w-screen h-screen"
        ref={forwardedRef}
        {...props}
      >
        {children}
      </div>
    </Portal>
  )
);
