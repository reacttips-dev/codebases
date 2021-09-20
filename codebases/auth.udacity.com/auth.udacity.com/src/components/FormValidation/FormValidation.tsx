import React from "react";
import classNames from "classnames";

const PREFIX = "vds-form-validation";

/** FormValidation Props */

export interface FormValidationProps {
  /** Message to display inside of component */
  message: string;

  /** Visual style of validation */
  variant?: "error" | "warning" | "success";
}

const IconWarning = (
  <i className="vds-icon" role="img" aria-hidden="true">
    <svg viewBox="0 0 32 32">
      <path
        d="M16.874 6.514l10 18A1 1 0 0 1 26 26H6a1 1 0 0 1-.874-1.486l10-18a1 1 0 0 1 1.748 0zM7.7 24h16.6L16 9.06 7.7 24zm8.3-2a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm-1-8a1 1 0 0 1 2 0v4a1 1 0 0 1-2 0v-4z"
        fillRule="nonzero"
      />
    </svg>
  </i>
);

const IconChecked = (
  <i className="vds-icon" role="img" aria-hidden="true">
    <svg viewBox="0 0 32 32">
      <path d="M16 6c5.523 0 10 4.477 10 10s-4.477 10-10 10S6 21.523 6 16 10.477 6 16 6zm0 2a8 8 0 100 16 8 8 0 000-16zm3.143 3.486a1 1 0 011.714 1.028l-4.8 8a1 1 0 01-1.564.193l-3.2-3.2a1 1 0 011.414-1.414l2.294 2.294z" />
    </svg>
  </i>
);

/** FormValidation provides a helpful message for validating data in a form component. */

const FormValidation: React.FC<FormValidationProps> = ({
  message,
  variant = "error",
}: FormValidationProps) => {
  const className = classNames(PREFIX, variant && `${PREFIX}--${variant}`);

  return (
    <div className={className} role="alert">
      <span>{message}</span>
      {variant === "success" ? IconChecked : IconWarning}
    </div>
  );
};

export default FormValidation;
