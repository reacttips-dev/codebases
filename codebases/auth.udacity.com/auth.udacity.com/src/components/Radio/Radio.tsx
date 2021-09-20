import React from "react";
import classNames from "classnames";

import VisuallyHidden from "../VisuallyHidden/VisuallyHidden";

export const PREFIX = "vds-radio";

/** Radio Props */
export interface RadioProps {
  /** Unique ID to associate the label with the button. In groups, each radio button requires a unique ID for the group to work */
  id: string;

  /**
   * Text label associated with the radio button (required for a11y).
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

  /** Disable radio button */
  disabled?: boolean;

  /** Hide label visually */
  hiddenLabel?: boolean;

  /** Used to uniquely define a group of radio buttons */
  name?: string;

  /** Callback when selected */
  onChange?(evt?: React.ChangeEvent<HTMLInputElement>): void;

  /** Indicates that a user must choose a value before submitting */
  required?: boolean;

  /** A unique value for `data-testid` to serve as a hook for automated tests */
  testID?: string;

  /** Value of the radio button */
  value?: string;
}

/** Radio is a single control for selecting a choice. Use `RadioGroup` for multiple options. */

const Radio: React.FC<RadioProps> = ({
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
}: RadioProps) => {
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
        type="radio"
        value={value}
      />
      <label id={labelId} className={`${PREFIX}__label`} htmlFor={id}>
        {labelMarkup}
      </label>
    </div>
  );
};

export default Radio;
