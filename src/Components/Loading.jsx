import { twMerge } from "tailwind-merge";
import { ModalOverlay } from "./ModalOverlay";

export const LoadingIcon = ({ size = 5, color = "#06233e" }) => {
  return (
    <span className="p-2 inline-block" style={{ color }}>
      <svg
        className="animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        style={{
          height: size + "rem",
          width: size + "rem",
        }}
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth={4}
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </span>
  );
};

export const LoadingItem = ({
  loadingText = "Loading...",
  size = 3,
  gap = 1,
  row = false,
  textSize = "12px",
  infoText = null,
}) => {
  return (
    <div
      className={twMerge(
        "flex items-center justify-center w-fit h-fit",
        `gap-${gap}`,
        row ? "flex-row" : "flex-col"
      )}
    >
      {loadingText !== null && loadingText?.length > 0 && (
        <span className="text-secondary" style={{ fontSize: textSize }}>
          {loadingText}
        </span>
      )}
      <LoadingIcon size={size} />
      {infoText !== null && infoText?.length > 0 && (
        <span className="w-3/4 text-center text-sm">{infoText}</span>
      )}
    </div>
  );
};

export const LoadingItemBordered = (props) => (
  <div className="flex items-center justify-center w-full h-full text-xl bg-transparent">
    <div className="px-8 py-4 border border-gray-200 shadow-lg bg-bgToolBar rounded-lg">
      <LoadingItem {...props} />
    </div>
  </div>
);

export const Loading = () => (
  <div className="w-full h-full flex items-center justify-center">
    <LoadingItem />
  </div>
);

export const LoadingFullScreen = () => (
  <ModalOverlay id="loading">
    <LoadingItemBordered />
  </ModalOverlay>
);

export const LoadingFullScreenWStatus = ({ statusText = "" }) => (
  <ModalOverlay id="loading">
    <div className="flex items-center justify-center w-full h-full text-xl bg-transparent">
      <div className="border border-gray-200 shadow-lg bg-bgToolBar rounded flex items-center max-w-[20rem] max-h-40 overflow-hidden">
        {!!statusText ? (
          <div className="m-4 text-sm line-clamp-6 overflow-hidden">
            {statusText}
          </div>
        ) : null}

        <LoadingIcon />
      </div>
    </div>
  </ModalOverlay>
);
