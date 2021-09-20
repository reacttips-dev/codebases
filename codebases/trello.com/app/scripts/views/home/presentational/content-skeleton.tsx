import React from 'react';

import { ContentCardSkeleton } from './content-card-skeleton';
import { ContentTitleSkeleton } from './content-title-skeleton';

import styles from './content-skeleton.less';

export const ContentSkeleton: React.FunctionComponent = () => (
  <div className={styles.contentSkeletonContainer}>
    <div className={styles.titleSkeleton}>
      <ContentTitleSkeleton />
    </div>
    <div className={styles.cardSkeleton}>
      <ContentCardSkeleton />
      <ContentCardSkeleton />
      <ContentCardSkeleton />
      <ContentCardSkeleton />
    </div>
  </div>
);
