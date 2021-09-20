import React from 'react';

import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';

import styles from './section-header.less';

interface SectionHeaderButtonProps
  extends React.DOMAttributes<HTMLButtonElement> {
  iconName?: string;
}

export const SectionHeaderButton: React.FunctionComponent<SectionHeaderButtonProps> = ({
  children,
  iconName,
  ...props
}) => (
  <button {...props} className={styles.button}>
    {iconName && (
      <span className={styles.buttonIcon}>
        <span
          className={classNames(
            'icon-sm',
            `icon-${iconName}`,
            styles.buttonIconSpan,
          )}
        />
      </span>
    )}
    <span className={styles.buttonText}>{children}</span>
  </button>
);

interface FixedSectionHeaderButtonProps extends SectionHeaderButtonProps {
  shouldShow?: boolean;
}

export const FixedSectionHeaderButton: React.FunctionComponent<FixedSectionHeaderButtonProps> = ({
  shouldShow,
  ...props
}) => (
  <CSSTransition
    timeout={200}
    in={shouldShow}
    mountOnEnter
    unmountOnExit
    classNames={{
      enter: styles.slideEnter,
      enterActive: styles.slideEnterActive,
      exitActive: styles.slideExitActive,
    }}
  >
    <div className={styles.fixedButton}>
      <SectionHeaderButton {...props} />
    </div>
  </CSSTransition>
);

interface SectionHeaderProps {
  icon?: JSX.Element;
  button?: React.ReactNode;
  noMargin?: boolean;
  noFixedHeight?: boolean;
}

export const SectionHeader: React.FunctionComponent<SectionHeaderProps> = ({
  button,
  children,
  icon,
  noMargin,
  noFixedHeight,
  ...props
}) => (
  <div
    {...props}
    className={classNames(styles.header, {
      [styles.noMargin]: noMargin,
      [styles.noFixedHeight]: noFixedHeight,
    })}
  >
    {icon && (
      <div className={styles.icon}>
        {React.cloneElement(icon, {
          color: 'quiet',
          size: 'small',
        })}
      </div>
    )}
    <div className={styles.text}>{children}</div>
    {button}
  </div>
);
