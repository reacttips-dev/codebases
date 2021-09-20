import React, { Children, cloneElement } from "react";
import classNames from "classnames";
import { RadioProps } from "../Radio/Radio";

const PREFIX = "vds-radio-group";

/** RadioGroup Props */

export interface RadioGroupProps {
  /** `Radio` components for group */
  children: React.ReactElement<RadioProps> | React.ReactElement<RadioProps>[];

  /** Text above RadioGroup (required for a11y) */
  title: string;

  /** Hide title visually */
  hiddenTitle?: boolean;

  /** Display multiple radio buttons side by side */
  inline?: boolean;

  /** Used to uniquely define a group of radio buttons */
  name?: string;

  /** Callback when a child in the group is selected */
  onChange?(evt?: React.ChangeEvent<HTMLInputElement>): void;
}

/** RadioGroup allows a single selection to be made from two or more list options. */

const RadioGroup: React.FC<RadioGroupProps> = ({
  children,
  title,
  hiddenTitle,
  inline,
  name = "vds-radio",
  onChange
}: RadioGroupProps) => {
  const className = classNames(PREFIX, inline && `${PREFIX}--inline`);

  const titleClassName = classNames(
    `${PREFIX}__title`,
    hiddenTitle && `vds-visually-hidden`
  );

  const radioChildren = Children.map(children, (child) => {
    return cloneElement(child, { name, onChange });
  });

  return (
    <fieldset className={className}>
      <legend className={titleClassName}>{title}</legend>
      {radioChildren}
    </fieldset>
  );
};

export default RadioGroup;
