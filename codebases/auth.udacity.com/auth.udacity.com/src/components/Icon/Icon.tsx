import React from "react";
import classNames from "classnames";

const PREFIX = "vds-icon";

/** Icon Props */

export interface IconProps {
  /** SVG code of custom icon */
  children: React.ReactNode;

  /** Fill color of icon */
  color?:
    | "white"
    | "black"
    | "cerulean"
    | "cerulean-dark"
    | "slate"
    | "silver"
    | "red"
    | "orange"
    | "green"
    | "blue"
    | "purple"
    | "yellow"
    | "teal"
    | "magenta";

  /** Visual size of icon */
  size?: "sm" | "md" | "lg";

  /** Descriptive text to communicate icon meaning to screen readers. Required if "hidden" is false. */
  title?: string;

  /** Hide icon from screen readers. Should be used when icon is purely decorative. */
  hidden?: boolean;
}

/** Icons help clarify actions, status, and feedback on the interface. Check out the full `Icon` Library for specific icons. */

const Icon: React.FC<IconProps> = ({
  children,
  color,
  size = "md",
  title,
  hidden = false
}: IconProps) => {
  const className = classNames(
    PREFIX,
    size !== "md" && `${PREFIX}--${size}`,
    color && `vds-color--${color}`
  );

  return (
    <i className={className} role="img" aria-label={title} aria-hidden={hidden}>
      {children}
    </i>
  );
};

export default Icon;
