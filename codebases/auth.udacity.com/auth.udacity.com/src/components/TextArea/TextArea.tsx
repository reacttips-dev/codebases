import React from "react";
import classNames from "classnames";

export const PREFIX = "vds-text-area";

/** TextArea Props */

export interface TextAreaProps {
  /** Unique ID to associate the label with the TextArea */
  id: string;

  /**
   * Text label associated with the TextArea (required for a11y).
   * If you use HTML instead of a string, please ensure it includes proper a11y
   * labels/props.
   */
  label: string | React.ReactNode;

  /**
   * Assists the browser with filling out field values.
   * Refer to [MDN docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#Values) for a list of values
   */
  autoComplete?: string;

  /**
   * Automatically give input focus when the page loads
   */
  autoFocus?: boolean;

  /** Initial TextArea value (for uncontrolled components) */
  defaultValue?: string;

  /** Indicates the TextArea is not available for interaction */
  disabled?: boolean;

  /** Hide label visually */
  hiddenLabel?: boolean;

  /** The name of the TextArea, submitted with the form data */
  name?: string;

  /** Callback when TextArea loses focus */
  onBlur?(evt?: React.ChangeEvent<HTMLTextAreaElement>): void;

  /** Callback when TextArea value changes */
  onChange?(evt?: React.ChangeEvent<HTMLTextAreaElement>): void;

  /** Callback when TextArea receives focus */
  onFocus?(evt?: React.FocusEvent<HTMLTextAreaElement>): void;

  /** Callback when TextArea receives a keypress event */
  onKeyDown?(evt?: React.KeyboardEvent<HTMLTextAreaElement>): void;

  /**
   * Text displayed next to label for non-required fields. Only use this prop to
   * internationalize the default string
   */
  optionalLabel?: string;

  /** A hint to the user of what can be entered in the control */
  placeholder?: string;

  /** Indicates that a user cannot modify the value of the TextArea */
  readOnly?: boolean;

  /** Indicates that a user must fill in a value before submitting */
  required?: boolean;

  /** The number of visible text lines in the TextArea */
  rows?: number;

  /** A unique value for `data-testid` to serve as a hook for automated tests */
  testID?: string;

  /** The `FormValidation` component */
  validation?: JSX.Element;

  /** Controlled TextArea value (for controlled components). Requires `onChange` handler */
  value?: string;
}

/** TextArea is a control that accepts large amounts of multi-line text. */

const TextArea: React.FC<TextAreaProps> = ({
  id,
  label,
  autoComplete,
  autoFocus,
  defaultValue,
  disabled,
  hiddenLabel,
  name,
  onBlur,
  onChange,
  onFocus,
  onKeyDown,
  optionalLabel = "Optional",
  placeholder,
  readOnly,
  required,
  rows = 4,
  testID,
  validation,
  value
}: TextAreaProps) => {
  // Null/undefined checks are necessary to catch all cases.
  // We assume the default prop value is applied when validation
  // is present, but the variant property is undefined.

  const isError =
    (validation && validation.props.variant === undefined) ||
    (validation && validation.props.variant === "error");

  const className = classNames(
    PREFIX,
    isError && `${PREFIX}--error`,
    !isError && validation && `${PREFIX}--${validation.props.variant}`
  );

  const labelClassName = classNames(
    `${PREFIX}__label`,
    hiddenLabel && `vds-visually-hidden`
  );

  return (
    <div className={className}>
      <label className={labelClassName} htmlFor={id}>
        {label}
        {!required && (
          <span className={`${PREFIX}__optional`}>{`(${optionalLabel})`}</span>
        )}
      </label>
      <textarea
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        aria-invalid={isError}
        className={`${PREFIX}__input`}
        data-testid={testID}
        defaultValue={defaultValue}
        disabled={disabled}
        id={id}
        name={name}
        onBlur={onBlur}
        onChange={onChange}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        readOnly={readOnly}
        required={required}
        rows={rows}
        value={value}
      />
      {validation}
    </div>
  );
};

export default TextArea;
