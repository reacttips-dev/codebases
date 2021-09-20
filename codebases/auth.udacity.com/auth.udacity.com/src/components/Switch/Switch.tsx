import React from "react";
import classNames from "classnames";
import VisuallyHidden from "../VisuallyHidden/VisuallyHidden";

export const PREFIX = "vds-switch";

/** Switch Props */

export interface SwitchProps {
  /** Unique ID to associate the label with the switch */
  id: string;

  /**
   * Text label associated with the Switch (required for a11y).
   * If you use HTML instead of a string, please ensure it includes proper a11y
   * labels/props.
   */
  label: string | React.ReactNode;

  /**
   * Automatically give input focus when the page loads
   */
  autoFocus?: boolean;

  /**
   * Controlled switched on state (for controlled components). Requires
   * `onChange` handler
   */
  checked?: boolean;

  /** Initial switched on state (for uncontrolled components) */
  defaultChecked?: boolean;

  /** Disable switch */
  disabled?: boolean;

  /** Hide label visually */
  hiddenLabel?: boolean;

  /** Callback when Switch toggled on or off */
  onChange?(evt?: React.ChangeEvent<HTMLInputElement>): void;

  /** A unique value for `data-testid` to serve as a hook for automated tests. */
  testID?: string;

  /** Indicates that the switch must be flipped on before submitting */
  required?: boolean;
}

/**
 * Switch is a single control for quickly toggling between two mutally exclusive
 * states. They always have a default value, and trigger immediate results that
 * don't require submission.
 */
const Switch: React.FC<SwitchProps> = ({
  id,
  label,
  autoFocus,
  checked,
  defaultChecked,
  disabled,
  required,
  hiddenLabel,
  onChange,
  testID
}: SwitchProps) => {
  const className = classNames(PREFIX, hiddenLabel && `${PREFIX}--hidden`);

  const labelMarkup = hiddenLabel ? (
    <VisuallyHidden>{label}</VisuallyHidden>
  ) : (
    label
  );

  return (
    <div className={className}>
      <input
        autoFocus={autoFocus}
        checked={checked}
        className={`${PREFIX}__input`}
        data-testid={testID}
        defaultChecked={defaultChecked}
        disabled={disabled}
        id={id}
        required={required}
        role="switch"
        onChange={onChange}
        type="checkbox"
      />
      <span className={`${PREFIX}__toggle`} />
      <label className={`${PREFIX}__label`} htmlFor={id}>
        {labelMarkup}
      </label>
    </div>
  );
};

export default Switch;
