/* eslint-disable import/no-default-export */
import classNames from 'classnames';
import React from 'react';

// eslint-disable-next-line @trello/less-matches-component
import styles from './PowerUp.less';
import Badges from './Badges';
import { DescriptionAtomProps } from './types';

export const DescriptionAtom: React.FunctionComponent<DescriptionAtomProps> = ({
  className,
  overview,
  icon,
  name,
  promotional,
  staffPick,
  integration,
  usage,
  ...props
}) => (
  <div className={classNames(styles.descriptionAtomGrid, className)}>
    <div className={styles.logoNameGrid}>
      <span
        className={styles.icon}
        style={{
          backgroundImage: `url(${icon.url})`,
        }}
      />
      <span className={styles.name} title={name}>
        {name}
      </span>
    </div>
    {props.button}
    <span className={styles.description}>{overview}</span>
    <Badges
      promotional={promotional}
      usage={usage}
      staffPick={staffPick}
      integration={integration}
    />
  </div>
);

export const StyledDescriptionAtom: React.FunctionComponent<DescriptionAtomProps> = ({
  className,
  ...props
}) => (
  <DescriptionAtom
    className={classNames(styles.descriptionAtom, className)}
    {...props}
  />
);

export default StyledDescriptionAtom;
