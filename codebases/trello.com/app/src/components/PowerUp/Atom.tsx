/* eslint-disable import/no-default-export */
import classNames from 'classnames';
import React from 'react';

import { AtomProps } from './types';

// eslint-disable-next-line @trello/less-matches-component
import styles from './PowerUp.less';

const Details: React.FunctionComponent<AtomProps> = ({
  name,
  subtitle,
  icon,
}) => (
  <div className={styles.flexRow}>
    <div className={styles.relative}>
      <span
        className={styles.icon}
        style={{
          backgroundImage: `url(${icon.url})`,
        }}
      />
    </div>
    <div className={styles.nameContainer}>
      <span className={styles.name}>{name}</span>
      {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
    </div>
  </div>
);

export const Atom: React.FunctionComponent<AtomProps> = (props) => (
  <div className={classNames(styles.twoColumnGrid, props.className)}>
    <Details {...props} />
    {props.button}
  </div>
);

export default Atom;
