import React from 'react';
import classnames from 'classnames';
import styles from './MemberItem.less';

import { CheckIcon } from '@trello/nachos/icons/check';
import { forTemplate, forNamespace } from '@trello/i18n';

import { ID_NONE } from 'app/common/lib/util/satisfies-filter';

import { MemberFilterCriteriaOption } from 'app/src/components/FilterPopover/FilterCriteriaOptions';
import { Attributes } from '../types';

const format = forTemplate('select_member');
const formatFiltering = forNamespace('filtering');

interface MemberItemProps
  extends Pick<
    MemberFilterCriteriaOption,
    'avatarUrl' | 'fullName' | 'initials' | 'confirmed'
  > {
  id: string;
  activityBlocked: boolean;
  username: string;
  toggleMember: (idMember: string) => void;
  isActive: boolean;
  trackFilterItemClick: (attributes: Attributes) => void;
}

export const MemberItem: React.FunctionComponent<MemberItemProps> = ({
  id,
  activityBlocked,
  avatarUrl,
  confirmed,
  fullName,
  username,
  initials,
  toggleMember,
  isActive,
  trackFilterItemClick,
}) => {
  function toggleActive() {
    trackFilterItemClick({
      type: 'member',
      id,
    });
    toggleMember(id);
  }

  const displayName =
    id === ID_NONE
      ? `${formatFiltering('no members')}`
      : `${fullName} (${username})`;

  return (
    <li
      className={classnames(styles.memberListItem, isActive && styles.isActive)}
    >
      <a
        className={classnames(styles.memberListItemLink)}
        role="button"
        onClick={toggleActive}
        title={displayName}
      >
        <span
          className={classnames(
            styles.memberListItemLinkAvatar,
            activityBlocked && 'member-deactivated',
            'member',
          )}
        >
          {!avatarUrl ? (
            <span className="member-initials">{initials}</span>
          ) : (
            <img
              className="member-avatar"
              src={avatarUrl ? `${avatarUrl}/30.png` : ''}
              srcSet={[
                avatarUrl ? `${avatarUrl}/30.png 1x` : '',
                avatarUrl ? `${avatarUrl}/50.png 2x` : '',
              ].join(', ')}
              alt={displayName}
              title={displayName}
              height="30"
              width="30"
            />
          )}
        </span>
        <span className="full-name">{displayName}</span>
        {isActive && (
          <CheckIcon
            size="small"
            dangerous_className={styles.memberListItemLinkIcon}
          />
        )}
        {!confirmed && (
          <span className="quiet sub-name">{format('unconfirmed-user')}</span>
        )}
      </a>
    </li>
  );
};
