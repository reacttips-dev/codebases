import { memberId as myId } from '@trello/session-cookie';
import { useNonPublicIfAvailable } from 'app/common/lib/util/non-public-fields-filter';
import {
  buildComparator,
  PreferredComparator,
  StandardComparator,
} from 'app/gamma/src/selectors/boards';
import { getIsDeactivated } from 'app/src/components/WorkspaceView/getIsDeactivated';
import { getFilterableCriteriaOption } from './getFilterableCriteriaOption';
import type {
  FilterCriteriaSourceBoard,
  MemberFilterCriteriaOption,
} from './types';

const sortMembers = (
  members: MemberFilterCriteriaOption[],
): MemberFilterCriteriaOption[] => {
  const preferMyId: PreferredComparator<MemberFilterCriteriaOption> = (
    member,
  ) => member.id === myId;
  const preferDefinedFullName: PreferredComparator<MemberFilterCriteriaOption> = (
    member,
  ) => member.fullName !== undefined;
  const compareName: StandardComparator<MemberFilterCriteriaOption> = (a, b) =>
    a.fullName && b.fullName
      ? a.fullName.localeCompare(b.fullName, undefined, { sensitivity: 'base' })
      : 0;
  const comparator = buildComparator<MemberFilterCriteriaOption>(
    preferMyId,
    preferDefinedFullName,
    compareName,
  );
  return members.sort(comparator);
};

export const getUniqueMembers = (
  boards: FilterCriteriaSourceBoard[],
): MemberFilterCriteriaOption[] => {
  const isDeactivated = getIsDeactivated(boards);
  const members: MemberFilterCriteriaOption[] = [];
  const seen: Set<string> = new Set();

  boards.forEach((board) => {
    board.members?.forEach((member) => {
      if (!seen.has(member.id)) {
        seen.add(member.id);
        const fullName =
          useNonPublicIfAvailable(member, 'fullName') ?? undefined;
        members.push({
          ...member,
          ...getFilterableCriteriaOption(
            [fullName ?? '', member.username],
            member.id,
          ),
          fullName,
          initials: useNonPublicIfAvailable(member, 'initials'),
          avatarUrl: useNonPublicIfAvailable(member, 'avatarUrl'),
          deactivated: member.activityBlocked || isDeactivated(member.id),
        });
      }
    });
  });

  return sortMembers(members);
};
