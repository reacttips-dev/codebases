import React, { ButtonHTMLAttributes } from 'react';
import cx from 'classnames';
import { CanonicalCard } from '@trello/test-ids';
import styles from './Buttons.less';
import OverflowButtonHorizontalIcon from '../icons/OverflowButtonHorizontalIcon';
import OverflowButtonVerticalIcon from '../icons/OverflowButtonVerticalIcon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button: React.FC<ButtonProps> = ({ className, ...props }) => (
  <button className={cx(styles.button, className)} {...props} />
);

export const ButtonLink: React.FC<ButtonProps> = (props) => (
  <span className={styles.linkButtonContainer}>
    <button className={styles.linkButton} {...props} />
  </span>
);

interface IconButtonProps extends ButtonProps {
  icon: React.ReactNode;
}

export const Icon: React.FC = (props) => (
  <span className={styles.icon} {...props} />
);

export const IconButton: React.FC<IconButtonProps> = ({
  children,
  icon,
  ...buttonProps
}) => (
  <Button {...buttonProps}>
    <span className={styles.iconContainer}>{icon}</span>
    {children}
  </Button>
);

interface OverflowButtonProps extends ButtonProps {
  isVertical?: boolean;
}

export const OverflowButton: React.FC<OverflowButtonProps> = ({
  isVertical,
  className,
  ...buttonProps
}) => (
  <Button
    className={cx(styles.overflowButton, className)}
    data-test-class={CanonicalCard.OverflowDetailsButton}
    {...buttonProps}
  >
    <span className={styles.overflowIcon}>
      {isVertical ? (
        <OverflowButtonVerticalIcon />
      ) : (
        <OverflowButtonHorizontalIcon />
      )}
    </span>
  </Button>
);
