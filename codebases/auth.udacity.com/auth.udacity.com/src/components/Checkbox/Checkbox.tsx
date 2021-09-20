import React from "react";
import classNames from "classnames";
import VisuallyHidden from "../VisuallyHidden/VisuallyHidden";

export const PREFIX = "vds-checkbox";

/** Checkbox Props */
export interface CheckboxProps {
  /** Unique ID to associate the label with the button. In groups, each checkbox requires a unique ID for the group to work */
  id: string;

  /**
   * Text label associated with the Checkbox (required for a11y).
   * If you use HTML instead of a string, please ensure it includes proper a11y
   * labels/props.
   */
  label: string | React.ReactNode;

  /**
   * Automatically give input focus when the page loads
   */
  autoFocus?: boolean;

  /** Controlled checked state (for controlled components). Requires `onChange` handler */
  checked?: boolean;

  /** Initial checked state (for uncontrolled components) */
  defaultChecked?: boolean;

  /** Disable checkbox */
  disabled?: boolean;

  /** Hide label visually */
  hiddenLabel?: boolean;

  /** Used to uniquely define a group of checkboxes */
  name?: string;

  /** Callback when checked or unchecked */
  onChange?(evt?: React.ChangeEvent<HTMLInputElement>): void;

  /** Indicates that a user must choose a value before submitting */
  required?: boolean;

  /** A unique value for `data-testid` to serve as a hook for automated tests. */
  testID?: string;

  /** Value of the checkbox */
  value?: string;
}

/** Checkbox is a single control for toggling a choice. Use `CheckboxGroup` for multiple options. */

const Checkbox: React.FC<CheckboxProps> = ({
  id,
  label,
  autoFocus,
  checked,
  defaultChecked,
  disabled,
  hiddenLabel,
  name = PREFIX,
  onChange,
  required,
  testID,
  value
}: CheckboxProps) => {
  const className = classNames(PREFIX, hiddenLabel && `${PREFIX}--hidden`);

  const labelMarkup = hiddenLabel ? (
    <VisuallyHidden>{label}</VisuallyHidden>
  ) : (
    label
  );
  const labelId = `${PREFIX}--label--${id}`;

  return (
    <div className={className}>
      <input
        aria-labelledby={labelId}
        autoFocus={autoFocus}
        checked={checked}
        className={`${PREFIX}__input`}
        data-testid={testID}
        defaultChecked={defaultChecked}
        disabled={disabled}
        id={id}
        name={name}
        onChange={onChange}
        required={required}
        type="checkbox"
        value={value}
      />
      <label id={labelId} className={`${PREFIX}__label`} htmlFor={id}>
        {labelMarkup}
      </label>
      <i className="vds-icon vds-icon--sm" role="img" aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24">
          <path d="M17 5.3a1.2 1.2 0 1 1 2 1.4l-7.8 12c-.4.6-1.3.7-1.9.2l-4.2-4.2A1.3 1.3 0 0 1 7 12.9l3 3.1 7-10.7z" />
        </svg>
      </i>
    </div>
  );
};

export default Checkbox;
