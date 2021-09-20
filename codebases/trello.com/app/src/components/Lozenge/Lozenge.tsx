import React from 'react';
import styles from './Lozenge.less';
import cx from 'classnames';

export interface LozengeProps {
  color: 'green' | 'blue' | 'purple';
  verticallyBottom?: boolean;
  inlineFlex?: boolean;
}

export const Lozenge: React.FunctionComponent<LozengeProps> = ({
  color,
  verticallyBottom,
  inlineFlex,
  children,
}) => (
  <span
    className={cx(
      styles.lozenge,
      styles[color],
      verticallyBottom && styles.verticallyBottom,
      inlineFlex && styles.inlineFlex,
    )}
  >
    {children}
  </span>
);
