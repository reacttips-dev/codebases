import React from "react";
import classNames from "classnames";

const PREFIX = "vds-loading";

/** Loading Props */

export interface LoadingProps {
  /** Toggles on loading indicator and opacity when wrapping children */
  busy?: boolean;

  /** Pass a block of content as a child to apply loading styles */
  children?: React.ReactNode;

  /** Descriptive [`aria-label`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-label_attribute) text to label Loading for accessibility */
  label?: string;

  /** Size of loading indicator */
  size?: "sm" | "md" | "lg";
}

/** Loading indicates that an action is being processed. */

const Loading: React.FC<LoadingProps> = ({
  busy,
  children,
  label = "Loading…",
  size = "md"
}: LoadingProps) => {
  const className = classNames(
    PREFIX,
    `${PREFIX}--${size}`,
    busy && `${PREFIX}--busy`
  );

  const spinnerMarkup = <i className={`${PREFIX}__spinner`} />;

  const childrenMarkup = (
    <div className={`${PREFIX}__children`}>{children}</div>
  );

  return (
    <div className={className} role="status" aria-label={label}>
      {!children || busy ? spinnerMarkup : null}
      {children && childrenMarkup}
    </div>
  );
};

export default Loading;
