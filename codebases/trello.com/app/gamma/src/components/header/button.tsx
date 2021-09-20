/* eslint-disable import/no-default-export */
import classNames from 'classnames';
import React from 'react';

import { TestId } from '@trello/test-ids';
import styles from './header.less';
import { Button } from '@trello/nachos/button';

interface HeaderButtonProps {
  ariaLabel?: string;
  children?: React.ReactNode;
  className?: string;
  icon?: JSX.Element;
  onClick: React.MouseEventHandler;
  onMouseEnter?: React.MouseEventHandler;
  onMouseLeave?: React.MouseEventHandler;
  testId?: TestId;
  title?: string;
}

const HeaderButton: React.RefForwardingComponent<
  HTMLButtonElement,
  HeaderButtonProps
> = (
  {
    ariaLabel,
    children,
    className,
    icon,
    onClick,
    onMouseEnter,
    onMouseLeave,
    testId,
    title,
  },
  ref,
) => {
  return (
    <Button
      appearance="transparent"
      aria-label={ariaLabel}
      className={classNames(styles.headerButton, className)}
      data-test-id={testId}
      ref={ref}
      title={title}
      onClick={onClick}
      iconBefore={
        icon &&
        React.cloneElement(icon, {
          color: icon.props.color ? icon.props.color : 'light',
          dangerous_className: styles.headerButtonIcon,
        })
      }
    >
      {children}
    </Button>
  );
};

export default React.forwardRef(HeaderButton);
