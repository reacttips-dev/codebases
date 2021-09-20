/* eslint-disable import/no-default-export */
import classNames from 'classnames';
import { forTemplate } from '@trello/i18n';
import RouterLink from 'app/src/components/RouterLink/RouterLink';
import { MemberAvatarUnconnected } from 'app/src/components/MemberAvatar';
import React from 'react';
import { MemberModel } from 'app/gamma/src/types/models';
import styles from './MemberListItem.less';
const format = forTemplate('select_member');

interface MemberListItemProps {
  member: MemberModel;
  disableHover?: boolean;
  hideUnconfirmed?: boolean;
  isSearchRoute: boolean;
  onClick?: () => void;
}

export const MemberListItem = ({
  member,
  disableHover,
  hideUnconfirmed,
  isSearchRoute,
  onClick,
}: MemberListItemProps) => (
  <RouterLink
    href={`/${member.username}`}
    title={member.name}
    className={classNames(
      styles.memberItem,
      !disableHover && styles.withHover,
      isSearchRoute && styles.searchRouteMemberItem,
    )}
    onClick={onClick}
  >
    <MemberAvatarUnconnected
      avatarSource={member.avatarSource}
      className={styles.memberAvatar}
      fullName={member.name}
      username={member.username}
      initials={member.initials}
      avatars={member.avatars || undefined}
      gold={false}
      hoverable={!disableHover}
      deactivated={member.activityBlocked}
    />
    <div className={styles.memberText}>
      <div className={styles.memberName}>
        {`${member.name} (${member.username})`}
      </div>
      {!hideUnconfirmed &&
        member.confirmed !== undefined &&
        !member.confirmed && (
          <div className={styles.memberSubText}>
            {format('unconfirmed-user')}
          </div>
        )}
    </div>
  </RouterLink>
);
