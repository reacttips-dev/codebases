import React from 'react';
import cx from 'classnames';
import styles from './CardBackSectionHeading.less';

interface CardBackSectionHeadingProps {
  title: string;
  icon?: React.ReactNode;
  className?: string;
}

export const CardBackSectionHeading: React.FC<CardBackSectionHeadingProps> = ({
  title,
  icon,
  className,
}) => {
  return (
    <div
      className={cx({
        [styles.heading]: true,
        [String(className)]: !!className,
      })}
    >
      {icon && <div className={styles.icon}>{icon}</div>}

      <h3 className={styles.title} dir="auto">
        {title}
      </h3>
    </div>
  );
};
