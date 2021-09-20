import classNames from 'classnames';
import React from 'react';
import { Spinner } from '@trello/nachos/spinner';

import styles from './LoadingSpinner.less';

export const LoadingSpinner: React.FunctionComponent<{
  className?: string;
  message?: string;
}> = ({ className, message }) => (
  <div className={classNames(className || '', styles.spinnerContainer)}>
    {message ? (
      <>
        <p className={styles.spinnerMessage}>{message}</p>
        <Spinner />
      </>
    ) : (
      <Spinner />
    )}
  </div>
);
