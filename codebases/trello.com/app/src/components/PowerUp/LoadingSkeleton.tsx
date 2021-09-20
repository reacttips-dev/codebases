/* eslint-disable import/no-default-export */
import React from 'react';

import classNames from 'classnames';

// eslint-disable-next-line @trello/less-matches-component
import styles from './PowerUp.less';

import { PowerUpItemType } from './types';

interface LoadingAtomProps {
  className?: string;
}

interface LoadingSkeletonProps {
  type: PowerUpItemType;
  className?: string;
}

const LoadingAtom: React.FunctionComponent<LoadingAtomProps> = ({
  className,
}) => {
  return (
    <div className={classNames(styles.flexRowSpaceBetween, className)}>
      <div className={styles.flexRow}>
        <div className={styles.relative}>
          <span className={classNames(styles.icon, styles.loadingSkeleton)} />
        </div>
        <div className={styles.nameContainer}>
          <span className={classNames(styles.name, styles.loadingSkeleton)} />
        </div>
      </div>
      <span
        className={classNames(
          styles.loadingSkeletonButton,
          styles.loadingSkeleton,
        )}
      />
    </div>
  );
};

const LoadingDescriptionAtom: React.FunctionComponent<LoadingAtomProps> = ({
  className,
}) => {
  return (
    <div
      className={classNames(
        styles.flexColumn,
        styles.descriptionAtom,
        className,
      )}
    >
      <LoadingAtom />
      <span
        className={classNames(styles.description, styles.loadingSkeleton)}
      />
    </div>
  );
};

const LoadingFeaturedAtom: React.FunctionComponent<LoadingAtomProps> = ({
  className,
}) => {
  return (
    <div className={classNames(styles.featuredAtomContainer, className)}>
      <div className={classNames(styles.heroImage, styles.loadingSkeleton)} />
      <div className={classNames(styles.flexColumn, styles.featuredAtom)}>
        <LoadingAtom />
        <span
          className={classNames(styles.description, styles.loadingSkeleton)}
        />
      </div>
    </div>
  );
};

export const LoadingSkeleton: React.FunctionComponent<LoadingSkeletonProps> = (
  props,
) => {
  if (props.type === PowerUpItemType.Featured) {
    return <LoadingFeaturedAtom {...props} />;
  } else if (props.type === PowerUpItemType.Description) {
    return <LoadingDescriptionAtom {...props} />;
  }

  return <LoadingAtom {...props} />;
};
