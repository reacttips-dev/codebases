import React from "react";
import classNames from "classnames";

const PREFIX = "vds-form-fieldset";

/** FormFieldset Props */
export interface FormFieldsetProps {
  /** Semantically related form elements to wrap in `fieldset` */
  children: React.ReactNode;

  /** Text to describe grouped form elements */
  title?: string;

  /** Disables all descendent form elements and controls */
  disabled?: boolean;

  /** Hide title visually */
  hiddenTitle?: boolean;
}

/** A FormFieldset groups related form elements together and improves accessibility. */

const FormFieldset: React.FC<FormFieldsetProps> = ({
  children,
  title,
  disabled,
  hiddenTitle
}: FormFieldsetProps) => {
  const className = classNames(PREFIX);

  const titleClassName = classNames(
    `${PREFIX}__title`,
    hiddenTitle && `vds-visually-hidden`
  );

  return (
    <fieldset className={className} disabled={disabled}>
      <legend className={titleClassName}>{title}</legend>
      {children}
    </fieldset>
  );
};

export default FormFieldset;
