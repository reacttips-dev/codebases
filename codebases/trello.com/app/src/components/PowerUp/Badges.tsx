/* eslint-disable import/no-default-export */
import classNames from 'classnames';
import React from 'react';

import { forTemplate } from '@trello/i18n';
const format = forTemplate('directory_power_up_item');

import { BadgeProps } from './types';
import { BoardIcon } from '@trello/nachos/icons/board';

// eslint-disable-next-line @trello/less-matches-component
import styles from './PowerUp.less';

export const Badges: React.FunctionComponent<BadgeProps> = ({
  button,
  usage,
  promotional,
  staffPick,
  integration,
}) => (
  <div className={styles.badges}>
    {button}
    {typeof usage === 'number' && usage > 0 && (
      <div
        className={styles.pupBadge}
        title={format('usage-explanation', { count: usage.toLocaleString() })}
      >
        <BoardIcon dangerous_className={styles.usageBadgeIcon} />
        <span>{usage.toLocaleString()}+</span>
      </div>
    )}
    {integration && (
      <div
        className={classNames(styles.pupBadge, styles.pupIntegrationBadge)}
        title={format('integration-explanation')}
      >
        <span>{format('integration')}</span>
      </div>
    )}
    {promotional && (
      <div
        className={classNames(styles.pupBadge, styles.bonusBadge)}
        title={format('bonus-explanation')}
      >
        <span>{format('bonus')}</span>
      </div>
    )}
    {staffPick && (
      <div
        className={classNames(styles.pupBadge, styles.bonusBadge)}
        title={format('staff-pick-explanation')}
      >
        <span>{format('staff-pick')}</span>
      </div>
    )}
  </div>
);

export default Badges;
