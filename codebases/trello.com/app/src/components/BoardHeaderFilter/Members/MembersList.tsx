import React, { useState, useEffect } from 'react';
import { forTemplate } from '@trello/i18n';
import { ModelCache } from 'app/scripts/db/model-cache';

import classnames from 'classnames';

// eslint-disable-next-line @trello/less-matches-component
import styles from './MemberItem.less';

import { Attributes } from '../types';
import { MemberItem } from './MemberItem';

import { MemberFilterCriteriaOption } from 'app/src/components/FilterPopover/FilterCriteriaOptions';
import { MembersFilter } from 'app/src/components/ViewFilters/filters';
import { ID_NONE } from 'app/common/lib/util/satisfies-filter';

const format = forTemplate('filter_cards_search_results');

interface MembersListProps {
  idBoard: string;
  members: Omit<
    MemberFilterCriteriaOption,
    'filterableWords' | 'label' | 'value'
  >[];
  membersFilter: MembersFilter;
  trackFilterItemClick: (attributes: Attributes) => void;
}

export const MembersList: React.FunctionComponent<MembersListProps> = ({
  idBoard,
  members,
  membersFilter,
  trackFilterItemClick,
}) => {
  const [showAllMembers, setShowAllMembers] = useState(false);
  const MEMBERS_TO_DISPLAY = 5;

  function toggleMember(idMember: string) {
    const board = ModelCache.get('Board', idBoard);
    const filter = board?.filter;
    filter?.toggleMember(idMember);
  }

  function expandMembers() {
    setShowAllMembers(true);
  }

  const firstMembersToDisplay = members.slice(0, MEMBERS_TO_DISPLAY);

  useEffect(() => {
    // First check if we have any enabled members that aren't shown
    const minimizedMembers = members.slice(MEMBERS_TO_DISPLAY);

    const enabledMembersUnderFold = minimizedMembers.some(({ id }) =>
      membersFilter.isEnabled(id),
    );

    if (enabledMembersUnderFold) {
      expandMembers();
    }
  }, [members, membersFilter]);

  const membersToShow = showAllMembers ? members : firstMembersToDisplay;

  const DEFAULT_MEMBER = (
    <MemberItem
      key={ID_NONE}
      id={ID_NONE}
      activityBlocked={false}
      avatarUrl=""
      confirmed={true}
      initials="?"
      fullName=""
      username=""
      toggleMember={toggleMember}
      isActive={membersFilter.isEnabled(ID_NONE)}
      trackFilterItemClick={trackFilterItemClick}
    />
  );

  const memberItemsList = [
    DEFAULT_MEMBER,
    ...membersToShow.map(({ id, ...properties }) => (
      <MemberItem
        key={id}
        id={id}
        toggleMember={toggleMember}
        isActive={membersFilter.isEnabled(id)}
        trackFilterItemClick={trackFilterItemClick}
        {...properties}
      />
    )),
  ];

  const numMembersRemaining = Math.max(members.length - MEMBERS_TO_DISPLAY, 0);

  return (
    <ul>
      {memberItemsList}
      {!showAllMembers && members.length > MEMBERS_TO_DISPLAY && (
        <li className={classnames(styles.memberListItem, 'showAllMembers')}>
          <a
            className={styles.memberListItemLink}
            onClick={expandMembers}
            role="button"
          >
            <span
              className={classnames(
                styles.memberListItemLinkName,
                styles.modQuiet,
              )}
            >
              {format('show-all-members-remainingmembers-hidden', {
                remainingMembers: numMembersRemaining,
              })}
            </span>
          </a>
        </li>
      )}
    </ul>
  );
};
