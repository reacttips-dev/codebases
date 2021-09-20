import React from "react";
import classNames from "classnames";
import { ButtonBaseProps } from "../Button/Button";
import VisuallyHidden from "../VisuallyHidden/VisuallyHidden";
import { logging } from "../../utils";

export const PREFIX = "vds-round-button";
const COMPONENT = "RoundButton";

/** RoundButton Props */

export interface RoundButtonProps extends ButtonBaseProps {
  /** The `Icon` component */
  icon?: React.ReactNode;

  /** The `Icon` component, displayed on the right */
  iconRight?: React.ReactNode;

  /** Whether or not to show the label */
  showLabel?: boolean;
}

/** Buttons trigger actions throughout the interface. They can also be used for navigation. */

const RoundButton: React.FC<RoundButtonProps> = ({
  icon,
  iconRight,
  showLabel,
  label,
  disabled,
  external,
  href,
  loading,
  onClick,
  small,
  testID,
  type = "button",
  variant = "default"
}: RoundButtonProps) => {
  if (iconRight && !showLabel) {
    logging.throwError(
      COMPONENT,
      '"iconRight" will not show up without "showLabel".'
    );
  }

  if (!icon && !iconRight) {
    logging.throwError(
      COMPONENT,
      'You must either specify "icon" or "iconRight"'
    );
  }

  if (
    (icon as React.ReactElement)?.props?.size ||
    (iconRight as React.ReactElement)?.props?.size
  ) {
    logging.warning(
      COMPONENT,
      'Setting "size" on an icon within a RoundButton will have no effect.'
    );
  }

  // ClassName Logic
  const className = classNames(
    PREFIX,
    variant && `${PREFIX}--${variant}`,
    small && `${PREFIX}--small`,
    showLabel && `${PREFIX}--with-label`,
    icon && `${PREFIX}--icon`,
    showLabel && iconRight && `${PREFIX}--icon-right`,
    loading && `${PREFIX}--loading`
  );

  const contentClassName = `${PREFIX}__content`;

  // Consolidate Props
  const buttonAttributes = {
    "aria-busy": loading,
    disabled,
    type
  };

  const linkAttributes = {
    href,
    role: "button",
    tabIndex: 0,
    target: external ? "_blank" : undefined
  };

  const combinedAttributes = href ? linkAttributes : buttonAttributes;

  // Only show the label visually when showLabel is enabled
  const labelMarkup = showLabel ? (
    label
  ) : (
    <VisuallyHidden>{label}</VisuallyHidden>
  );

  // Only show an icon on the right if the label is being shown
  const showRightIcon = showLabel && iconRight;

  // Show animation if loading
  const loadingMarkup = loading && (
    <div className={`${PREFIX}__loader`}>
      <div />
      <div />
      <div />
    </div>
  );

  // Use an anchor if link button
  const Element = href ? "a" : "button";

  return (
    <Element
      className={className}
      data-testid={testID}
      onClick={onClick}
      {...combinedAttributes}
    >
      <span className={contentClassName}>
        {icon}
        {labelMarkup}
        {showRightIcon ? iconRight : null}
      </span>
      {loadingMarkup}
    </Element>
  );
};

export default RoundButton;
