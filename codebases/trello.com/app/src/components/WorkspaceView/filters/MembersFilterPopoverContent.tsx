import React, { useCallback, useEffect, useMemo, useContext } from 'react';

import { MemberAvatar } from 'app/src/components/MemberAvatar';
import { PopoverList } from 'app/src/components/PopoverList';
import { memberId as myId } from '@trello/session-cookie';
import { Button } from '@trello/nachos/button';
import { Spinner } from '@trello/nachos/spinner';
import {
  ActionSubjectIdType,
  ActionSubjectType,
  ActionType,
  Analytics,
} from '@trello/atlassian-analytics';
import { forTemplate } from '@trello/i18n';

const format = forTemplate('multi_board_table_view');

import styles from './MembersFilterPopoverContent.less';
import { MembersFilter } from 'app/src/components/ViewFilters/filters';
import { buildComparator } from 'app/gamma/src/selectors/boards';
import { ViewFiltersContext } from 'app/src/components/ViewFilters';
import { getIsDeactivated } from '../getIsDeactivated';

type PopoverTarget = 'quickFilters' | 'headerCell';
interface MembersFilterPopoverContentProps {
  showResetButton: boolean;

  popoverTarget: PopoverTarget;
  idOrg: string;

  membersFilter: MembersFilter;
  setMembersFilter: (membersFilter: MembersFilter) => void;
  loading: boolean;
  error: boolean;
  boards: Board[] | undefined;
  onClearMembersFilter?: () => void;
  onToggleFilterValue?: (memberId: string, numEnabled: number) => void;
}

const sendAnalyticsUIEvent = ({
  action,
  actionSubject,
  actionSubjectId,
  attributes,
  idOrg,
}: {
  action: ActionType;
  actionSubject: ActionSubjectType;
  actionSubjectId: ActionSubjectIdType;
  attributes?: {
    popoverTarget?: PopoverTarget;
    totalMemberFiltersEnabled?: number;
  };

  idOrg: string;
}) => {
  Analytics.sendUIEvent({
    action,
    actionSubject,
    actionSubjectId,
    source: 'filterTableByMemberInlineDialog',
    attributes,
    containers: {
      organization: {
        id: idOrg,
      },
    },
  });
};

interface Member {
  id: string;
  fullName?: string | null;
  username: string;
}

interface Board {
  members: Member[];
  memberships?: {
    idMember: string;
    deactivated: boolean;
  }[];
}

export const getUniqueMembers = (boards: Board[]) => {
  const members: Member[] = [];
  const seen: Set<string> = new Set();

  boards.map((board) => {
    board.members?.forEach((member) => {
      if (!seen.has(member.id)) {
        seen.add(member.id);
        members.push(member);
      }
    });
  });

  return members;
};

export const MembersFilterPopoverContent: React.FC<MembersFilterPopoverContentProps> = ({
  showResetButton,

  popoverTarget,
  idOrg,

  membersFilter,
  setMembersFilter,
  loading,
  error,
  boards,
  onClearMembersFilter,
  onToggleFilterValue,
}: MembersFilterPopoverContentProps) => {
  const clearMemberFilter = useCallback(() => {
    setMembersFilter(new MembersFilter());

    onClearMembersFilter && onClearMembersFilter();
    sendAnalyticsUIEvent({
      action: 'reset',
      actionSubject: 'filter',
      actionSubjectId: 'resetTableMemberFilter',
      attributes: { popoverTarget },
      idOrg,
    });
  }, [setMembersFilter, onClearMembersFilter, popoverTarget, idOrg]);

  const toggleFilterValue = useCallback(
    (memberId) => {
      setMembersFilter(membersFilter.toggle(memberId));

      onToggleFilterValue && onToggleFilterValue(memberId, membersFilter.size);
      sendAnalyticsUIEvent({
        action: 'toggled',
        actionSubject: 'filter',
        actionSubjectId: 'filterTableByMember',
        attributes: {
          popoverTarget,
          totalMemberFiltersEnabled: membersFilter.size,
        },
        idOrg,
      });
    },
    [
      membersFilter,
      setMembersFilter,
      onToggleFilterValue,
      popoverTarget,
      idOrg,
    ],
  );

  const isChecked = useCallback(
    (memberId) => membersFilter.isEnabled(memberId),
    [membersFilter],
  );

  const memberItems = useMemo(() => {
    const comparator = buildComparator<Member>(
      (member: Member) => member.id === myId,
      (member: Member) => member.fullName !== undefined,
      (a: Member, b: Member) =>
        a.fullName && b.fullName
          ? a.fullName.localeCompare(b.fullName, undefined, {
              sensitivity: 'base',
            })
          : 0,
      (a: Member, b: Member) => a.username.localeCompare(b.username),
    );

    const members = getUniqueMembers(boards || []).sort(comparator);

    const isDeactivated = getIsDeactivated(boards);

    return members.map((member) => ({
      name: member.fullName ?? member.username,
      value: member.id,
      icon: (
        <MemberAvatar
          idMember={member.id}
          deactivated={isDeactivated(member.id)}
        />
      ),
      checked: isChecked,
      onClick: toggleFilterValue,
    }));
  }, [boards, isChecked, toggleFilterValue]);

  return (
    <>
      <PopoverList
        items={memberItems}
        searchable
        searchPlaceholder={format('search-members')}
      />
      {loading && <Spinner centered />}
      {error && format('something-went-wrong')}
      {showResetButton && (
        <Button
          className={styles.clearButton}
          appearance="default"
          shouldFitContainer
          onClick={clearMemberFilter}
        >
          {format('reset-member-filters')}
        </Button>
      )}
    </>
  );
};

export const useClearMembersFiltersWhenRemovingBoards = (boards?: Board[]) => {
  const { viewFilters } = useContext(ViewFiltersContext);
  // Remove selected members from filter if their boards were removed.
  useEffect(() => {
    if (boards && viewFilters.editable) {
      const validIdMembers = new Set();

      for (const board of boards) {
        for (const member of board.members) {
          validIdMembers.add(member.id);
        }
      }

      const newMembersFilter = new MembersFilter(
        [...viewFilters.filters.members].filter((idMember) =>
          validIdMembers.has(idMember),
        ),
      );

      if (
        newMembersFilter.filterLength() !==
        viewFilters.filters.members.filterLength()
      ) {
        viewFilters.setFilter(newMembersFilter);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boards]); // We only want this to fire when the selected boards have changed.
};
