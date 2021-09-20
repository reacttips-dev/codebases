import React, { FunctionComponent, useCallback } from 'react';
import classNames from 'classnames';
import styles from './CheckItemMemberBadge.less';
import { AddMemberIcon } from '@trello/nachos/icons/add-member';
import { AvatarSources } from 'app/gamma/src/types/models';
import { ChecklistTestIds, TestId } from '@trello/test-ids';
import { MemberAvatarUnconnected } from 'app/src/components/MemberAvatar';
import { Analytics } from '@trello/atlassian-analytics';

interface CheckItemMemberBadgeProps {
  assigned: boolean;
  avatarSource?: AvatarSources;
  initials?: string;
  avatarUrl?: string;
  onClick?: React.MouseEventHandler;
  deactivated?: boolean;
  testId?: TestId;
}

export const CheckItemMemberBadge: FunctionComponent<CheckItemMemberBadgeProps> = function ({
  assigned,
  avatarSource,
  initials,
  avatarUrl,
  deactivated,
  onClick,
  testId,
}: CheckItemMemberBadgeProps) {
  const memberBadge = (
    <MemberAvatarUnconnected
      avatarSource={avatarSource}
      initials={initials}
      avatars={
        avatarUrl
          ? {
              '30': `${avatarUrl}/30.png`,
              '50': `${avatarUrl}/50.png`,
              '170': `${avatarUrl}/170.png`,
            }
          : undefined
      }
      gold={false}
      deactivated={deactivated}
      size={24}
      hoverable={onClick ? true : false}
    />
  );

  const clickMemberBadge = useCallback(
    (e) => {
      if (onClick) {
        Analytics.sendClickedButtonEvent({
          buttonName: 'checkItemMemberBadge',
          source: 'cardDetailScreen',
        });

        onClick(e);
      }
    },
    [onClick],
  );

  return onClick ? (
    <button
      onClick={clickMemberBadge}
      className={classNames(styles.assigneeBadge, 'assigneeBadge')}
      data-test-id={testId}
    >
      {assigned ? (
        <div data-test-id={ChecklistTestIds.ChecklistItemAssignedBadge}>
          {memberBadge}
        </div>
      ) : (
        <AddMemberIcon size="small" />
      )}
    </button>
  ) : assigned ? (
    <div className={'readOnly'}>{memberBadge}</div>
  ) : null;
};
