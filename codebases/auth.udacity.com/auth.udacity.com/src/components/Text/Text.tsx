import React from "react";
import classNames from "classnames";

const PREFIX = "vds-text";

/** Text Props */

export interface TextProps {
  /** Text content */
  children: React.ReactNode;

  /** Text alignment */
  align?: "left" | "center" | "right";

  /** Color of text */
  color?: "white" | "black" | "slate" | "silver" | "red";

  /** Override text to span 100% width */
  full?: boolean;

  /** Use default for large areas of copy designed for prolonged reading */
  size?: "default" | "sm" | "xs";

  /** Amount of `margin-bottom` applied */
  spacing?: "none" | "half" | "1x" | "2x" | "3x" | "4x" | "6x";
}

/** Text is used for paragraphs of body copy. */

const Text: React.FC<TextProps> = ({
  children,
  align = "left",
  color = "black",
  full,
  size = "default",
  spacing = "3x"
}: TextProps) => {
  const className = classNames(
    size === "default" ? PREFIX : `${PREFIX}--${size}`,
    align !== "left" && `vds-text-align--${align}`,
    color !== "black" && `vds-color--${color}`,
    `vds-spacing--stack-${spacing}`,
    full && `${PREFIX}--full`
  );

  return <p className={className}>{children}</p>;
};

export default Text;
