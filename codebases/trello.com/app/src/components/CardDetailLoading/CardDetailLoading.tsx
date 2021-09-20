import React from 'react';
import styles from './CardDetailLoading.less';
import { Spinner } from '@trello/nachos/spinner';

export const CardDetailLoading: React.FC = () => (
  <div className={`${styles.cardDetailLoading}`}>
    <Spinner centered={true} />
  </div>
);
