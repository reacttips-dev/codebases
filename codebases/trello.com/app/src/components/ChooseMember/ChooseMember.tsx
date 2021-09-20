import React, { useState, useMemo, useCallback } from 'react';
import { MemberAvatar } from 'app/src/components/MemberAvatar';
import styles from './ChooseMember.less';
import { CheckIcon } from '@trello/nachos/icons/check';
import { forTemplate, localizeCount } from '@trello/i18n';
import { buildFuzzyMatcher } from 'app/gamma/src/selectors/boards';
import { ComponentWrapper } from 'app/src/components/ComponentWrapper';
import { Button } from '@trello/nachos/button';
import { Key, getKey } from '@trello/keybindings';
import cx from 'classnames';
import { ChecklistTestIds } from '@trello/test-ids';

const format = forTemplate('choose_member');

interface Member {
  id: string;
  fullName: string;
}

type MemberGetter<M extends Member> = () => M[];

interface ChooseMemberProps<M extends Member> {
  idMemberInitial?: string | null;
  getCardMembers: MemberGetter<M>;
  getBoardMembers: MemberGetter<M>;
  onSelect: (member: M | null) => void;
  testId?: ChecklistTestIds;
}

interface MemberRowProps<M extends Member> {
  member: M;
  selected: boolean;
  highlight: boolean;
  searching: boolean;
  toggleMember: (member: M) => void;
  setManualMember: (member: M | undefined) => void;
}

const MAX_MEMBERS_IN_SECTION = 12;

const MemberRow = <M extends Member>({
  highlight,
  member,
  selected,
  searching,
  toggleMember,
  setManualMember,
}: MemberRowProps<M>) => {
  const onClick = useCallback(() => toggleMember(member), [
    member,
    toggleMember,
  ]);
  const onFocus = useCallback(() => setManualMember(undefined), [
    setManualMember,
  ]);
  const onMouseOver = useCallback(() => {
    if (searching) {
      setManualMember(member);
    }
  }, [member, searching, setManualMember]);

  return (
    <li>
      <button
        className={cx(styles.memberButton, { [styles.highlight]: highlight })}
        onMouseOver={onMouseOver}
        onFocus={onFocus}
        onClick={onClick}
        data-test-id={ChecklistTestIds.ChecklistItemAddMemberButton}
      >
        <MemberAvatar className={styles.memberAvatar} idMember={member.id} />
        <div className={styles.memberName}>{member.fullName}</div>
        {selected && <CheckIcon />}
      </button>
    </li>
  );
};

function useFilterMembers<M extends Member>(
  search: string,
  getCardMembers: MemberGetter<M>,
  getBoardMembers: MemberGetter<M>,
) {
  return useMemo(() => {
    const matcher = buildFuzzyMatcher(search);
    const isMatch = (member: Member) => matcher(member.fullName);

    const cardMembers = getCardMembers().filter(isMatch);

    const cardMemberIdSet = new Set(cardMembers.map((member) => member.id));

    const boardMembers = getBoardMembers().filter(
      (member) => isMatch(member) && !cardMemberIdSet.has(member.id),
    );

    return { cardMembers, boardMembers };
  }, [search, getCardMembers, getBoardMembers]);
}

function adjacentMember<M extends Member>(
  members: M[],
  current: M | undefined,
  direction: 'up' | 'down',
): M | undefined {
  if (members.length === 0 || !current) {
    return undefined;
  }

  const indexCurrent = members.indexOf(current);
  const indexNext = indexCurrent + (direction === 'up' ? -1 : 1);

  // Wrap around if we reach the top/bottom
  return members[(members.length + indexNext) % members.length];
}

export function ChooseMember<M extends Member>(props: ChooseMemberProps<M>) {
  const { idMemberInitial, onSelect } = props;

  const [searching, setSearching] = useState(true);
  const [search, setSearch] = useState('');

  const { cardMembers, boardMembers } = useFilterMembers(
    search,
    props.getCardMembers,
    props.getBoardMembers,
  );

  const allMatchingMembers = useMemo(() => [...cardMembers, ...boardMembers], [
    boardMembers,
    cardMembers,
  ]);

  const defaultMember =
    allMatchingMembers.length > 0 ? allMatchingMembers[0] : undefined;

  const [manualMember, setManualMember] = useState(defaultMember);

  const effectiveMember = searching
    ? manualMember && allMatchingMembers.includes(manualMember)
      ? manualMember
      : defaultMember
    : undefined;

  const toggleMember = useCallback(
    (member: M | undefined) =>
      member && onSelect(member.id === idMemberInitial ? null : member),
    [idMemberInitial, onSelect],
  );

  const onKeyboardNavigation = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      switch (getKey(event)) {
        case Key.ArrowDown:
          setManualMember(
            adjacentMember(allMatchingMembers, effectiveMember, 'down'),
          );
          break;

        case Key.ArrowUp:
          setManualMember(
            adjacentMember(allMatchingMembers, effectiveMember, 'up'),
          );
          break;

        case Key.Enter:
          toggleMember(effectiveMember);
          break;

        default:
          return;
      }

      event.preventDefault();
    },
    [allMatchingMembers, effectiveMember, toggleMember],
  );

  const renderMembers = (members: M[]) => (
    <>
      <ul className={styles.memberList}>
        {members.slice(0, MAX_MEMBERS_IN_SECTION).map((member) => {
          const selected = member.id === idMemberInitial;

          return (
            <MemberRow<M>
              key={member.id}
              member={member}
              selected={selected}
              highlight={member === effectiveMember}
              searching={searching}
              toggleMember={toggleMember}
              setManualMember={setManualMember}
            />
          );
        })}
      </ul>
      {members.length > MAX_MEMBERS_IN_SECTION && (
        <div className={styles.memberOverflow}>
          <div>
            {localizeCount(
              'hiding-additional-members',
              members.length - MAX_MEMBERS_IN_SECTION,
            )}
          </div>
          <div>{format('search-to-find-more')}</div>
        </div>
      )}
    </>
  );

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setManualMember(undefined);
  }, []);

  const onBlur = useCallback(() => setSearching(false), []);
  const onFocus = useCallback(() => setSearching(true), []);
  const onClick = useCallback(() => onSelect(null), [onSelect]);

  return (
    <ComponentWrapper>
      <input
        autoFocus
        className="js-autofocus"
        type="text"
        placeholder={format('search-members')}
        onChange={onChange}
        onKeyDown={onKeyboardNavigation}
        onBlur={onBlur}
        onFocus={onFocus}
      />
      {cardMembers.length > 0 && (
        <>
          <h4 className={styles.heading}>{format('card-members')}</h4>
          {renderMembers(cardMembers)}
        </>
      )}

      {boardMembers.length > 0 && (
        <>
          <h4 className={styles.heading}>{format('other-board-members')}</h4>
          {renderMembers(boardMembers)}
        </>
      )}
      {}
      <Button
        className={styles.removeButton}
        onClick={onClick}
        shouldFitContainer={true}
        isDisabled={!idMemberInitial}
        data-test-id={ChecklistTestIds.ChecklistItemRemoveMemberButton}
      >
        {format('remove-member')}
      </Button>
    </ComponentWrapper>
  );
}
