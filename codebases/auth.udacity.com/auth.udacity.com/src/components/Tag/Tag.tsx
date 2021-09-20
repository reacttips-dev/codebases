import React from "react";
import classNames from "classnames";

export const PREFIX = "vds-tag";

/** Tag props */
export interface TagProps {
  /** Disable the tag */
  disabled?: boolean;

  /** Opens href URL in new tab */
  external?: boolean;

  /** If href is provided, Tag will render as an anchor rather than a button. */
  href?: string;

  /** One of the `Icon` components to show to the left of the label */
  icon?: React.ReactNode;

  /** Text label for the tag. Always required for acecssibility purposes. */
  label: string;

  /** Callback when clicked */
  onClick?(evt?: React.MouseEvent): void;

  /** A unique value for `data-testid` to serve as a hook for automated tests */
  testID?: string;

  /** Tag variant */
  variant?: "primary" | "secondary" | "dark";
}

/** Tags are used to show at-a-glance information. */

const Tag: React.FC<TagProps> = ({
  disabled,
  external,
  href,
  icon,
  label,
  onClick,
  testID,
  variant = "primary"
}: TagProps) => {
  const className = classNames(
    PREFIX,
    variant && `${PREFIX}--${variant}`,
    icon && `${PREFIX}--icon`,
    (onClick || href) && `${PREFIX}--clickable`
  );

  // Consolidate Props
  const buttonAttributes = {
    className,
    disabled,
    onClick
  };

  const linkAttributes = {
    ...buttonAttributes,
    href,
    role: "button",
    target: external ? "_blank" : undefined
  };

  const combinedAttributes = href ? linkAttributes : buttonAttributes;

  // Use a div when not clickable, otherwise use a button or anchor tag
  const Element = onClick ? "button" : href ? "a" : "div";

  return (
    <Element {...combinedAttributes} data-testid={testID}>
      <span className={`${PREFIX}__content`}>
        {icon}
        {label}
      </span>
    </Element>
  );
};

export default Tag;
