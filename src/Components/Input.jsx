import { memo, useState } from "react";
import { Tooltip } from "./Tooltip";
import { twMerge } from "tailwind-merge";
import { Select } from "./Select";
import CircleInfo from "@duotoneicons/circle-info.svg?react";
import Eye from "@duotoneicons/eye.svg?react";
import EyeSlash from "@duotoneicons/eye-slash.svg?react";
import ToggleOn from "@duotoneicons/toggle-on.svg?react";
import ToggleOff from "@duotoneicons/toggle-off.svg?react";

export const Input = memo(
  /**
   *
   *
   * @param {{
   *     label: string,
   *     mandatory?: boolean,
   *     errorText?: string,
   *     className?: string, type: "text" | "password" | "number" | "date" | "select" | "textarea" | "toggle" | "others",
   *     customTypeComponent: React.ReactNode,
   *     options: [string],
   * } & (React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> | import("./Select").SelectProps)} parameters
   *
   * @return {*}
   */
  ({
    label,
    type = "text",
    mandatory = false,
    errorText = "Please fill out this field.",
    className,
    ...props
  }) => {
    const [validationText, setValidationText] = useState("");

    const id = label?.toString()?.replace(/\s+/g, "-");

    /**
     *
     *
     * @param {import("react").FormEvent} e
     */
    const onInvalid = (e) => {
      /** @type {HTMLInputElement} */
      const target = e.target;
      setValidationText(errorText ?? target.validationMessage);
    };

    /**
     *
     *
     * @param {import("react").FormEvent} e
     */
    const onInput = (e) => {
      /** @type {HTMLInputElement} */
      const target = e.target;
      setValidationText("");
    };

    /**
     *
     *
     * @param {import("react").FormEvent} e
     */
    const onBlur = (e) => {
      /** @type {HTMLInputElement} */
      const target = e.target;

      if (!!validationText) {
        setValidationText(errorText ?? target.validationMessage);
      }
    };

    return (
      <div
        className={twMerge(
          "flex flex-col bg-white px-2 py-1 border focus-within:[box-shadow:inset_0_1px_1px_rgba(0,0,0,.075),0_0_8px_rgba(82,168,236,.6)]",
          props.disabled
            ? "border-neutral-400 focus-within:border-neutral-500"
            : "border-accentHighlight focus-within:border-accent"
        )}
        style={{
          width: props.width,
          height: !!props.height ? props.height : "min-content",
        }}
      >
        <div className="flex items-center justify-between my-1 w-full">
          <span className="flex items-center justify-between w-full">
            <label
              className={twMerge(
                "text-xs font-semibold",
                props.disabled ? "text-neutral-500" : "text-accent"
              )}
              htmlFor={id}
            >
              {label}
              {mandatory ? (
                <span className="text-red-600 font-bold px-0.5">*</span>
              ) : null}
            </label>
          </span>

          <span className="text-xs text-red-600 font-semibold">
            {validationText.length > 10 ? (
              <Tooltip
                tooltipText={validationText}
                position="left"
                gap={7}
                width={200}
                type="error"
              >
                <CircleInfo className="h-4 w-4 inline-block fill-red-700" />
              </Tooltip>
            ) : (
              validationText
            )}
          </span>
        </div>
        {type === "text" ||
        type === "password" ||
        type === "number" ||
        type === "date" ? (
          type === "password" ? (
            <PassInput
              id={id}
              className={className}
              style={{ all: "unset" }}
              placeholder={props.placeholder ?? label}
              onInvalid={onInvalid}
              onBlur={onBlur}
              onInput={onInput}
              required={mandatory}
              {...props}
            />
          ) : (
            <input
              type={type}
              id={id}
              className={className}
              style={{ all: "unset" }}
              placeholder={props.placeholder ?? label}
              onInvalid={onInvalid}
              onBlur={onBlur}
              onInput={onInput}
              required={mandatory}
              {...props}
            />
          )
        ) : null}
        {type === "others" ? props.customTypeComponent : null}
        {type === "select" ? (
          <InputSelect
            id={id}
            className={className}
            style={{ all: "unset" }}
            placeholder={props.placeholder ?? label}
            onInvalid={onInvalid}
            onBlur={onBlur}
            onInput={onInput}
            mandatory={mandatory}
            {...props}
          />
        ) : null}
        {type === "textarea" ? (
          <textarea
            id={id}
            className={twMerge(
              className,
              "outline-none border border-transparent focus-within:border-accentHighlight"
            )}
            placeholder={props.placeholder ?? label}
            onInvalid={onInvalid}
            onBlur={onBlur}
            onInput={onInput}
            required={mandatory}
            {...props}
          />
        ) : null}
        {type === "toggle" ? (
          <span
            className="text-primary cursor-pointer h-6 flex items-center"
            onClick={() => props.onChange(!!!props.value)}
          >
            {!!props.value ? (
              <ToggleOn className="w-8 h-8 inline-block fill-accent" />
            ) : (
              <ToggleOff className="w-8 h-8 inline-block fill-accent" />
            )}
          </span>
        ) : null}
      </div>
    );
  }
);

/**
 * @param {{
 * id: string,
 * label: string,
 * mandatory: boolean
 * } & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>} params
 * @returns {React.ReactNode}
 */
const PassInput = ({
  id,
  className,
  style,
  placeholder,
  label,
  onInvalid,
  onBlur,
  onInput,
  mandatory,
  ...props
}) => {
  const [show, setShow] = useState(false);

  return (
    <span className="w-full flex items-center justify-between">
      <input
        type={show ? "text" : "password"}
        id={id}
        className={className}
        style={{ ...style, width: "100%" }}
        placeholder={placeholder ?? label}
        onInvalid={onInvalid}
        onBlur={onBlur}
        onInput={onInput}
        required={mandatory}
        {...props}
      />
      {show ? (
        <Eye
          className="w-4 h-4 cursor-pointer"
          tabIndex={0}
          onClick={() => setShow(false)}
          onKeyDown={(e) => {
            if (e.key === " " || e.key === "Enter") {
              e.preventDefault();
              e.stopPropagation();
              setShow(false);
            }
          }}
        />
      ) : (
        <EyeSlash
          className="w-4 h-4 cursor-pointer"
          tabIndex={0}
          onClick={() => setShow(true)}
          onKeyDown={(e) => {
            if (e.key === " " || e.key === "Enter") {
              e.preventDefault();
              e.stopPropagation();
              setShow(true);
            }
          }}
        />
      )}
    </span>
  );
};

const InputSelect = ({
  id,
  className,
  placeholder,
  onInvalid,
  onBlur,
  onInput,
  width,
  zIndex,
  mandatory,
  ...props
}) => (
  <Select
    id={id}
    className={className}
    placeholder={placeholder}
    onInvalid={onInvalid}
    onBlur={onBlur}
    onInput={onInput}
    width={
      !!width
        ? typeof width === "number"
          ? width - 15
          : `calc(${width}-15px)`
        : null
    }
    zIndex={!!zIndex ? zIndex : 11}
    required={mandatory}
    {...props}
  />
);
