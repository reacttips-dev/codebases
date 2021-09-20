/* eslint-disable import/no-default-export */
import classNames from 'classnames';
import React from 'react';

import Badges from './Badges';
// eslint-disable-next-line @trello/less-matches-component
import styles from './PowerUp.less';
import { ListingAtomProps } from './types';

export const ListingAtom: React.FunctionComponent<ListingAtomProps> = ({
  className,
  icon,
  name,
  subtitle,
  promotional,
  staffPick,
  integration,
  usage,
  ...props
}) => (
  <div className={classNames(styles.listingAtomGrid, className)}>
    <div className={styles.logoNameGrid}>
      <span
        className={styles.icon}
        style={{
          backgroundImage: `url(${icon.url})`,
        }}
      />
      <div className={styles.nameContainer}>
        <span className={styles.listingName} title={name}>
          {name}
        </span>
        {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
      </div>
    </div>
    <Badges
      button={props.button}
      usage={usage}
      promotional={promotional}
      staffPick={staffPick}
      integration={integration}
    />
  </div>
);

export const StyledListingAtom: React.FunctionComponent<ListingAtomProps> = ({
  className,
  ...props
}) => <ListingAtom className={className} {...props} />;

export default StyledListingAtom;
