import React from "react";
import classNames from "classnames";

const PREFIX = "vds-spacing";

/** Space Props */

export interface SpaceProps {
  /** Component to receive spacing */
  children: React.ReactNode;

  /** Direction of spacing */
  type: "stack" | "inline" | "inset";

  /** Size value of spacing */
  size?: "half" | "1x" | "2x" | "3x" | "4x" | "6x";
}

/** Space adjusts the areas below, between, or within components. */

const Space: React.FC<SpaceProps> = ({
  children,
  type,
  size = "1x"
}: SpaceProps) => {
  const className = classNames(PREFIX, `${PREFIX}--${type}-${size}`);
  const Element = type === "inline" ? "span" : "div";

  return <Element className={className}>{children}</Element>;
};

export default Space;
