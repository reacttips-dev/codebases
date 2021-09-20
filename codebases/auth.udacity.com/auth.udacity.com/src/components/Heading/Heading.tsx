import React from "react";
import classNames from "classnames";

const PREFIX = "vds-heading";

/** Heading Props */

export interface HeadingProps {
  /** Heading content */
  children: React.ReactNode;

  /** Visual size and style of heading. By default, the rendered HTML element uses this value. To render a different tag, use the `as` prop */
  size: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

  /** Heading alignment */
  align?: "left" | "center" | "right";

  /** The `as` prop will render a different HTML element than the visual style to preserve semantic order on the page. Defaults to the value set in `size` */
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

  /** Color of text */
  color?:
    | "white"
    | "black"
    | "slate"
    | "silver"
    | "red"
    | "orange"
    | "green"
    | "blue";

  /** Amount of `margin-bottom` applied */
  spacing?: "none" | "half" | "1x" | "2x" | "3x" | "4x" | "6x";
}

/** Headings are used as the titles of important sections on a page of an interface. */

const Heading: React.FC<HeadingProps> = ({
  children,
  size: DefaultElement,
  align = "left",
  as: OverrideElement,
  color = "black",
  spacing = "3x"
}: HeadingProps) => {
  const className = classNames(
    DefaultElement && `${PREFIX}--${DefaultElement}`,
    align !== "left" && `vds-text-align--${align}`,
    `vds-spacing--stack-${spacing}`,
    color !== "black" && `vds-color--${color}`
  );

  if (OverrideElement) {
    return <OverrideElement className={className}>{children}</OverrideElement>;
  }
  return <DefaultElement className={className}>{children}</DefaultElement>;
};

export default Heading;
