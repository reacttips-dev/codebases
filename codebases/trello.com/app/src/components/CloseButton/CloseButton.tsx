/* eslint-disable import/no-default-export */
import React, { ButtonHTMLAttributes } from 'react';

import classNames from 'classnames';
import { TestId } from '@trello/test-ids';
import { IconColor } from '@trello/nachos/icon';
import { forwardRefComponent } from 'app/src/forwardRefComponent';
import { forNamespace } from '@trello/i18n';
import styles from './CloseButton.less';

const format = forNamespace('');

interface CloseButtonProps {
  className?: string;
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  color?: IconColor;
  quiet?: boolean;
  large?: boolean;
  medium?: boolean;
  closeIcon: JSX.Element;
  onClick: React.EventHandler<React.MouseEvent<HTMLElement>>;
  style?: React.CSSProperties;
  testId?: TestId;
}

export const CloseButton = forwardRefComponent<
  HTMLButtonElement,
  CloseButtonProps
>(
  'CloseButton',
  (
    {
      className,
      type,
      color,
      large = false,
      medium = false,
      onClick,
      quiet = false,
      style,
      testId,
      closeIcon,
    },
    ref,
  ) => (
    <button
      className={classNames(styles.closeButton, className)}
      onClick={onClick}
      style={style}
      ref={ref}
      data-test-id={testId}
      type={type}
      aria-label={format('close')}
    >
      {React.cloneElement(closeIcon, {
        color: closeIcon.props.color
          ? closeIcon.props.color
          : quiet
          ? 'quiet'
          : color,
        size: closeIcon.props.size
          ? closeIcon.props.size
          : large
          ? 'large'
          : medium
          ? 'medium'
          : 'small',
      })}
    </button>
  ),
);
