/* eslint-disable @typescript-eslint/no-use-before-define */
import { useWorkspacesPreambleBoardMemberListQuery } from './WorkspacesPreambleBoardMemberListQuery.generated';
// eslint-disable-next-line no-restricted-imports
import { Member } from '@trello/graphql/generated';
import { Checkbox } from '@trello/nachos/checkbox';
import { memberId } from '@trello/session-cookie';
import { MemberAvatar } from 'app/src/components/MemberAvatar';
import { forNamespace } from '@trello/i18n';
import React, {
  useEffect,
  useReducer,
  useState,
  useMemo,
  Dispatch,
} from 'react';
import AnimateHeight from 'react-animate-height';
import styles from './WorkspacesPreambleBoardMemberList.less';
import classNames from 'classnames';

const format = forNamespace('workspaces preamble');

// Avatar Height (20px) + Margin (16px) + Border Bottom Height (1px)
const memberHeight = 20 + 16 + 1;
const numberOfVisibleMembers = 5;

type SelectedMembersAction =
  | {
      type: 'add' | 'remove';
      idMember: string;
    }
  | {
      type: 'clear';
    }
  | {
      type: 'all';
      idMembers: string[];
    };

const selectedMembersReducer = (
  selectedMembers: string[],
  action: SelectedMembersAction,
) => {
  switch (action.type) {
    case 'add':
      return [...selectedMembers, action.idMember];
    case 'remove':
      return selectedMembers.filter((idMember) => idMember !== action.idMember);
    case 'clear':
      return [];
    case 'all':
      return action.idMembers;
    default:
      return selectedMembers;
  }
};

interface WorkspacesPreambleBoardMemberListProps {
  boardId: string;
  onSelectMember: (selectedMembers: string[]) => void;
}

export const WorkspacesPreambleBoardMemberList: React.FC<WorkspacesPreambleBoardMemberListProps> = ({
  boardId,
  onSelectMember,
}) => {
  const [isShowingMembers, setShowingMembers] = useState(false);
  const toggleShowingMembers = () => setShowingMembers(!isShowingMembers);
  const [selectedMembers, updateMembers] = useReducer(
    selectedMembersReducer,
    [],
  );

  // If the selected members change fire the prop event
  useEffect(() => onSelectMember(selectedMembers), [
    onSelectMember,
    selectedMembers,
  ]);

  // Fetch the members
  const { data } = useWorkspacesPreambleBoardMemberListQuery({
    variables: { boardId },
  });

  const hasCollaborators = (data?.board?.members?.length || 0) > 1;

  // Filter out current logged in member and any unconfirmed members
  // Memoize the results so that react can do a proper equality check on the variable
  const members = useMemo(
    () =>
      data?.board?.members?.filter(
        (member) => memberId !== member.id && member.confirmed,
      ) || [],
    [data],
  );
  // Set the selected members to all when the list of members changes
  // (Generally only going to happen on the first load of data)
  useEffect(() => {
    updateMembers({
      type: 'all',
      idMembers: members.map((member) => member.id),
    });
  }, [members]);

  return hasCollaborators ? (
    <div className={styles.inviteMembers}>
      <Checkbox
        className={styles.checkbox}
        label={
          <>
            {format(['add-members-to-workspace'], {
              membersCount: selectedMembers.length,
            })}
          </>
        }
        // eslint-disable-next-line react/jsx-no-bind
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          if (event.target.checked) {
            updateMembers({
              type: 'all',
              idMembers: members.map((member) => member.id),
            });
          } else {
            updateMembers({ type: 'clear' });
          }
        }}
        isChecked={selectedMembers.length > 0}
        isIndeterminate={
          selectedMembers.length !== members.length &&
          selectedMembers.length > 0
        }
      />
      <AnimateHeight
        className={styles.members}
        contentClassName={styles.membersScroller}
        height={
          isShowingMembers
            ? Math.min(numberOfVisibleMembers, members.length) * memberHeight
            : 0
        }
        animateOpacity
      >
        {members.map((member) => {
          const selected = selectedMembers.includes(member.id);
          return (
            <MemberListEntry
              key={`member${member.id}`}
              member={member}
              selected={selected}
              updateMembers={updateMembers}
            />
          );
        })}
      </AnimateHeight>
      <button
        // eslint-disable-next-line react/jsx-no-bind
        onClick={toggleShowingMembers}
      >
        {isShowingMembers
          ? format(['hide-members-button'])
          : format(['show-members-button'])}
      </button>
    </div>
  ) : null;
};

interface MemberListEntryProps {
  member: Pick<Member, 'id'> & Partial<Member>;
  selected: boolean;
  updateMembers: Dispatch<SelectedMembersAction>;
}

const MemberListEntry: React.FunctionComponent<MemberListEntryProps> = ({
  member,
  selected,
  updateMembers,
}) => {
  const [isHovered, setHoverState] = useState(false);

  return (
    <React.Fragment>
      <div
        // eslint-disable-next-line react/jsx-no-bind
        onMouseEnter={() => setHoverState(true)}
        // eslint-disable-next-line react/jsx-no-bind
        onMouseLeave={() => setHoverState(false)}
        className={classNames(styles.member, {
          [styles.memberHover]: isHovered,
        })}
        // eslint-disable-next-line react/jsx-no-bind
        onClick={(event) => {
          updateMembers({
            type: selected ? 'remove' : 'add',
            idMember: member.id,
          });

          // Prevent the event bubbling, we rely on the click on the div to
          // toggle the member, this click is also triggered when clicking the
          // checkbox, but there are two elements within the checkbox so we
          // don't want to keep bubbling up and the first click is acceptable
          // enough to trigger the selection of the member.
          event.preventDefault();
        }}
        role="checkbox"
        aria-checked={selected}
      >
        <div className={styles.nameAndAvatar}>
          <MemberAvatar
            idMember={member.id}
            size={20}
            className={styles.avatar}
          />{' '}
          <div className={styles.name}>
            {member.nonPublic && member.nonPublic.fullName
              ? member.nonPublic.fullName
              : member.fullName}
          </div>
        </div>
        <Checkbox isChecked={selected} className={styles.memberCheckbox} />
      </div>
    </React.Fragment>
  );
};
