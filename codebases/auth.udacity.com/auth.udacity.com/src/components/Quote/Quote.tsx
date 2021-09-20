import React from "react";
import classNames from "classnames";

const PREFIX = "vds-quote";

/** Quote Props */

export interface QuoteProps {
  /** Quoted text */
  children: React.ReactNode;

  /** Text alignment */
  align?: "center" | "left" | "right";
}

/**
 * @deprecated The Quote component is no longer supported or recommended for use.
 * Quote is for displaying quoted text, often used for testimonials.
 */
const Quote: React.FC<QuoteProps> = ({
  children,
  align = "center"
}: QuoteProps) => {
  const className = classNames(
    PREFIX,
    align !== "left" && `vds-text-align--${align}`
  );

  return <blockquote className={className}>{children}</blockquote>;
};

export default Quote;
