import React from 'react';
import { RequestAccessPageSkeleton } from './RequestAccessPageSkeleton';
import { messages } from './messages';
import styles from './RequestAccessErrorHandler.less';

export const RequestAccessErrorHandler = () => {
  return (
    <RequestAccessPageSkeleton>
      <h1 className={styles.textCenter}>
        {messages['request-access-page-error-title']}
      </h1>
      <p className={styles.textCenter}>
        {messages['request-access-page-error-description']}
      </p>
    </RequestAccessPageSkeleton>
  );
};
