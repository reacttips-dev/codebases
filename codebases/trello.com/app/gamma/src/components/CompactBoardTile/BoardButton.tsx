/* eslint-disable import/no-default-export */
import classNames from 'classnames';
import React from 'react';
import styles from './BoardButton.less';

interface OwnProps {
  className: string;
  icon?: JSX.Element;
  onClick: React.EventHandler<React.MouseEvent<HTMLButtonElement>>;
  onKeyDown: React.EventHandler<React.KeyboardEvent<HTMLButtonElement>>;
  tabIndex?: number;
  title: string;
}

function onFocusChange(e: React.FocusEvent) {
  e.stopPropagation();
}

export const BoardButton: React.FunctionComponent<OwnProps> = ({
  children,
  className,
  icon,
  onClick,
  onKeyDown,
  tabIndex,
  title,
}) => (
  <button
    className={classNames(styles.button, className)}
    onFocus={onFocusChange}
    onBlur={onFocusChange}
    onClick={onClick}
    onKeyDown={onKeyDown}
    tabIndex={tabIndex}
    title={title}
  >
    {icon &&
      React.cloneElement(icon, {
        dangerous_className: children && icon ? styles.iconWithPadding : '',
      })}
    {children}
  </button>
);
