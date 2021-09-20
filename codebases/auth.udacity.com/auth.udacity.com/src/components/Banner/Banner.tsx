import React from "react";
import classNames from "classnames";
import Icon from "../Icon/Icon";
import RoundButton from "../RoundButton/RoundButton";

const PREFIX = "vds-banner";

/** Banner Props  */
export interface BannerProps {
  /** Text for the banner which can contain `Links` */
  children: React.ReactNode;

  /** Displays an icon-only close button */
  closeable?: boolean;

  /** The close button's `aria-label` text for accessibility */
  closeLabel?: string;

  /** Displays banner as embedded in a container */
  embedded?: boolean;

  /** An `Icon` component */
  icon?: React.ReactNode;

  /** Callback when Banner is closed */
  onClose?(evt?: React.MouseEvent): void;

  /** ARIA `role` for accessibility: use [alert](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_alert_role) for static banners or [alertdialog](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_alertdialog_role) for banners with interactive controls */
  role?: "alert" | "alertdialog";

  /** Visual style of the banner */
  variant?:
    | "default"
    | "inverse"
    | "information"
    | "error"
    | "warning"
    | "success";
}

/** Banners are used to capture the attention of a user in an intrusive way about important information or persistent conditions. */

const Banner: React.FC<BannerProps> = ({
  children,
  closeable,
  closeLabel = "Close banner",
  embedded,
  icon,
  onClose,
  role = "alert",
  variant = "default"
}: BannerProps) => {
  const className = classNames(
    PREFIX,
    icon && `${PREFIX}--icon`,
    closeable && `${PREFIX}--closeable`,
    embedded && `${PREFIX}--embedded`,
    variant && `${PREFIX}--${variant}`
  );

  const roleType = closeable ? "alertdialog" : role;

  const closeIcon = (
    <Icon color="silver">
      <svg viewBox="0 0 32 32">
        <path
          d="M14.586 16L7.293 8.707a1 1 0 0 1 1.414-1.414L16 14.586l7.293-7.293a1 1 0 0 1 1.414 1.414L17.414 16l7.293 7.293a1 1 0 0 1-1.414 1.414L16 17.414l-7.293 7.293a1 1 0 1 1-1.414-1.414L14.586 16z"
          fillRule="nonzero"
        />
      </svg>
    </Icon>
  );

  const closeButton = closeable ? (
    <div className={`${PREFIX}__close-button`}>
      <RoundButton
        label={closeLabel}
        icon={closeIcon}
        onClick={onClose}
        small
        variant="minimal-inverse"
      />
    </div>
  ) : (
    false
  );

  return (
    <div className={className} role={roleType}>
      <div className={`${PREFIX}__content`}>
        {icon}
        <div className={`${PREFIX}__message`}>{children}</div>
      </div>
      {closeButton}
    </div>
  );
};

export default Banner;
