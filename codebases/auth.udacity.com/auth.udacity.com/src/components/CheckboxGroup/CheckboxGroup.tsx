import React, { Children, cloneElement } from "react";
import classNames from "classnames";
import { CheckboxProps } from "../Checkbox/Checkbox";

const PREFIX = "vds-checkbox-group";

/** CheckboxGroup Props */
export interface CheckboxGroupProps {
  /** `Checkbox` component for group */
  children:
    | React.ReactElement<CheckboxProps>[]
    | React.ReactElement<CheckboxProps>;

  /** Text above CheckboxGroup (required for a11y) */
  title: string;

  /** Hide title visually */
  hiddenTitle?: boolean;

  /** Used to uniquely define a group of checkboxes */
  name?: string;

  /** Callback when a child in the group is selected */
  onChange?(evt?: React.ChangeEvent<HTMLInputElement>): void;
}

/** CheckboxGroup allows multiple values to be selected from a list. */

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  children,
  title,
  hiddenTitle,
  name = "vds-checkbox",
  onChange
}: CheckboxGroupProps) => {
  const className = classNames(PREFIX);

  const titleClassName = classNames(
    `${PREFIX}__title`,
    hiddenTitle && `vds-visually-hidden`
  );

  const checkboxChildren = Children.map(children, (child) => {
    return cloneElement(child, { name, onChange });
  });

  return (
    <fieldset className={className}>
      <legend className={titleClassName}>{title}</legend>
      {checkboxChildren}
    </fieldset>
  );
};

export default CheckboxGroup;
