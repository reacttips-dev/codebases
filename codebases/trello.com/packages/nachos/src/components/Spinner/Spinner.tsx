/* eslint-disable import/no-default-export */
import React from 'react';

import classNames from 'classnames';
import styles from './Spinner.less';
import { TestId } from '@trello/test-ids';

interface SpinnerProps {
  inline?: boolean;
  centered?: boolean;
  small?: boolean;
  modLeft?: boolean;
  text?: string;
  wrapperClassName?: string;
  testId?: TestId;
}

export const Spinner: React.FunctionComponent<SpinnerProps> = ({
  inline,
  centered,
  small,
  modLeft,
  text,
  wrapperClassName,
  testId,
}) => {
  const wrapperClasses = {
    [styles.inline]: !!inline,
    [styles.centered]: !!centered,
  };
  const iconClasses = {
    [styles.small]: !!small,
    [styles.modLeft]: !!modLeft,
  };

  return (
    <div
      className={classNames(styles.wrapper, wrapperClasses, wrapperClassName)}
      data-test-id={testId}
    >
      <span className={classNames(styles.spinner, iconClasses)} />
      {text}
    </div>
  );
};
