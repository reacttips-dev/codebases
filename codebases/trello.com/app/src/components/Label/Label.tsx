import React, { useCallback } from 'react';
import cx from 'classnames';
import styles from './Label.less';

export interface LabelType {
  id: string;
  name: string;
  color?: string | null;
}

interface LabelProps {
  label: LabelType;
  className?: string;
  onClick?: (label: LabelType) => void;
  /**
   * Whether or not to enable hover states for the label output. Adding an
   * `onClick` handler will have the same output, but this is a fallback in case
   * hover colors are desired without any click interactions.
   */
  isHoverable?: boolean;
}

/**
 * Canonical representation of a label in Trello. Intentionally flat for the
 * sake of simple overriding; this component provides some sensible defaults,
 * like color attribution, colorblind respect, and truncation, but width and
 * height vary a lot across the app. If desired (and with design support), it
 * might be good to implement a `size` prop, but for now we're optimizing for
 * override ease.
 */
export const Label: React.FC<LabelProps> = ({
  label,
  className,
  onClick,
  isHoverable,
}) => {
  const { id, name, color } = label;
  const onClickLabel = useCallback(() => onClick?.(label), [label, onClick]);
  return (
    <div
      key={id}
      className={cx(
        styles.label,
        color && styles[color],
        (onClick || isHoverable) && styles.isHoverable,
        className,
      )}
      onClick={onClickLabel}
      role={onClick ? 'button' : undefined}
      title={name}
    >
      {name}
    </div>
  );
};
