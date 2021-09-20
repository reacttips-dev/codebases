import React, { Children } from "react";
import classNames from "classnames";

const PREFIX = "vds-flex";

/** Flex Props */

export interface FlexProps {
  children: React.ReactNode;

  /** Item alignment along cross axis */
  align?: "start" | "end" | "center" | "baseline" | "stretch";

  /** Shortcut to vertically and horizontally center items. Often combined with `full` */
  center?: boolean;

  /** Flow direction of items along main axis */
  direction?: "row" | "column" | "row-reverse" | "column-reverse";

  /** Sets height, width, and flex-basis to 100%. Often combined with `center` */
  full?: boolean;

  /** Makes Flex container behave like an inline element. Flex is block-level by default. */
  inline?: boolean;

  /** Item alignment along main axis */
  justify?:
    | "start"
    | "end"
    | "center"
    | "around"
    | "between"
    | "evenly"
    | "stretch";

  /** Amount of consistent spacing between items */
  spacing?: "none" | "half" | "1x" | "2x" | "3x" | "4x" | "6x";

  /** Determines how items behave if items overflow */
  wrap?: "wrap" | "none" | "reverse";
}

/** Flex is an invisible wrapper used to lay out other components in a flexible manner, with control over alignment, spacing and wrapping.
 *  The API is adapted from the [Flexbox Layout module](https://css-tricks.com/snippets/css/a-guide-to-flexbox/) for performing small-scale layouts,
 *  rather than full page layouts.
 */

const Flex: React.FC<FlexProps> = ({
  children,
  align = "start",
  center,
  direction = "row",
  full,
  inline,
  justify = "start",
  spacing = "2x",
  wrap = "wrap"
}: FlexProps) => {
  const className = classNames(
    PREFIX,
    align && !center && `${PREFIX}--align-${align}`,
    center && `${PREFIX}--center`,
    direction !== "row" && `${PREFIX}--direction-${direction}`,
    full && `${PREFIX}--full`,
    inline && `${PREFIX}--inline`,
    justify && !center && `${PREFIX}--justify-${justify}`,
    spacing !== "none" && `${PREFIX}--spacing-${spacing}`,
    wrap !== "wrap" && `${PREFIX}--wrap-${wrap}`
  );

  return (
    <div className={className}>
      {Children.toArray(children).map((child, i) => (
        <div className={`${PREFIX}__item`} key={i.toString()}>
          {child}
        </div>
      ))}
    </div>
  );
};

export default Flex;
