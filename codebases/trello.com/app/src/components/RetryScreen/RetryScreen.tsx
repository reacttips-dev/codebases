import React from 'react';
import { Button } from '@trello/nachos/button';
import styles from './RetryScreen.less';

interface RetryScreenProps {
  onRetryClick: () => void;
  children: React.ReactNode;
  buttonText: string;
}

export const RetryScreen = ({
  onRetryClick,
  children,
  buttonText,
}: RetryScreenProps) => (
  <div className={styles.retryContainer}>
    {children}
    {/*
        passing retry directly to onClick will cause the retry function
        to serialize the click event into query variables so we explicitly
        invoke without parameters
      */}
    <Button
      // eslint-disable-next-line react/jsx-no-bind
      onClick={() => onRetryClick()}
    >
      {buttonText}
    </Button>
  </div>
);
