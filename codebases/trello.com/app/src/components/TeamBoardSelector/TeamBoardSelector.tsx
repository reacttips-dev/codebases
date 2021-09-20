import classNames from 'classnames';
import React, { useState, useMemo, useCallback } from 'react';
import _, { debounce } from 'underscore';
import { Select, SelectComponents } from '@trello/nachos/select';

import { BoardSelectorTile } from 'app/src/components/BoardSelector/BoardSelectorTile';
import styles from './TeamBoardSelector.less';
import { DownIcon } from '@trello/nachos/icons/down';
import { forTemplate } from '@trello/i18n';

import {
  useTeamBoardSelectorQuery,
  TeamBoardSelectorQuery,
} from './TeamBoardSelectorQuery.generated';
import { useTeamBoardSelectorSearchQuery } from './TeamBoardSelectorSearchQuery.generated';
import { Analytics } from '@trello/atlassian-analytics';
import { TableTestIds } from '@trello/test-ids';
import { CloseIcon } from '@trello/nachos/icons/close';
import escapeForRegex from 'app/gamma/src/util/escape-for-regex';
import { buildComparator } from 'app/gamma/src/selectors/boards';

import { SidebarState } from 'app/scripts/view-models/sidebar-state';
import { maxSelectableBoards } from './maxSelectableBoards';
import { BoardIdAndShortLink } from 'app/src/components/ViewFilters/filters';

const format = forTemplate('multi_board_select');

export type Member = NonNullable<TeamBoardSelectorQuery['member']>;
export type Boards = NonNullable<Member['boards']>;
export type BoardOptionValue = Boards[number];

export interface BoardOption {
  readonly label: string;
  readonly value: BoardOptionValue;
}

export interface GroupedBoardOptions {
  readonly options: BoardOption[];
}

export type OnBoardSelectorChangeType = (selectedBoard: BoardOption) => void;

interface TeamBoardSelectorProps {
  readonly className?: string;
  readonly orgId: string;
  readonly selectedBoards: Boards;
  readonly onSelectedBoardsChange: (boardOptions: BoardOption[]) => void;
  readonly setSelectedBoards: (boards: BoardIdAndShortLink[]) => void;
  readonly isBoardOptionsLoading: boolean;
  readonly isDisabled?: boolean;
}

interface ComponentProps {
  readonly data: {
    value: BoardOptionValue;
  };
  readonly isDisabled: boolean;
  readonly isFocused: boolean;
  readonly isSelected: boolean;
  readonly innerProps?: {
    className?: string;
  };
}

//Once designs are finalized, if Control/Input/Option are still similar to
//the ones in BoardSelector.tsx, we can pull them to their own react select helpers file

export const Control: React.FunctionComponent<ComponentProps> = ({
  isFocused,
  ...props
}) => (
  <SelectComponents.Control
    {...props}
    className={classNames(styles.boardSelectorControl, {
      [styles.boardSelectorControlIsFocused]: isFocused,
    })}
  />
);

export const Input: React.FunctionComponent<ComponentProps> = ({
  ...props
}) => (
  <SelectComponents.Input {...props} className={styles.boardSelectorInput} />
);

export const Option: React.FunctionComponent<ComponentProps> = ({
  data,
  isFocused,
  isSelected,
  ...props
}) => (
  <SelectComponents.Option
    {...props}
    className={classNames({
      [styles.boardSelectorOptionIsFocused]: isFocused,
      [styles.boardSelectorOptionIsSelected]: isSelected,
    })}
  >
    <BoardSelectorTile
      backgroundColor={data.value.prefs && data.value.prefs.backgroundColor}
      backgroundImageScaled={
        data.value.prefs && data.value.prefs.backgroundImageScaled
      }
      backgroundImage={data.value.prefs && data.value.prefs.backgroundImage}
      backgroundTile={data.value.prefs && data.value.prefs.backgroundTile}
      name={data.value.name}
      data-test-id={TableTestIds.TeamBoardTile}
    />
  </SelectComponents.Option>
);

export const MultiValueContainer: React.FunctionComponent<ComponentProps> = ({
  innerProps,
  ...props
}) => (
  <SelectComponents.MultiValueContainer
    {...props}
    innerProps={{
      ...innerProps,
      className: classNames(innerProps?.className, styles.multiValueContainer),
    }}
  />
);

export const MultiValue: React.FunctionComponent<ComponentProps> = ({
  data,
  ...props
}) => (
  <SelectComponents.MultiValue {...props}>
    <BoardSelectorTile
      maxWidth={'160px'}
      backgroundColor={data.value.prefs && data.value.prefs.backgroundColor}
      backgroundImageScaled={
        data.value.prefs && data.value.prefs.backgroundImageScaled
      }
      backgroundImage={data.value.prefs && data.value.prefs.backgroundImage}
      backgroundTile={data.value.prefs && data.value.prefs.backgroundTile}
      name={data.value.name}
    />
  </SelectComponents.MultiValue>
);

export const ValueContainer: React.FunctionComponent<ComponentProps> = ({
  children,
  ...props
}) => {
  const { isDisabled } = props;
  const onClick = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      source: 'multiBoardTableViewScreen',
      buttonName: 'addMoreBoardsButton',
    });
  }, []);

  return (
    SelectComponents.ValueContainer && (
      <SelectComponents.ValueContainer {...props}>
        <div
          role="button"
          className={styles.teamBoardWrapper}
          data-test-id={TableTestIds.TeamBoardSelectInput}
          onClick={onClick}
        >
          {children}
        </div>
        {!isDisabled && <div className={styles.gradientOverlay}></div>}
        {
          <div
            role="button"
            className={styles.add}
            data-test-id={TableTestIds.TeamBoardSelectAddBoardsButton}
            onClick={onClick}
          >
            {format('add-boards')}
            <DownIcon
              size="small"
              color="quiet"
              dangerous_className={styles.DownIcon}
            />
          </div>
        }
      </SelectComponents.ValueContainer>
    )
  );
};

const MultiValueRemove: React.FunctionComponent<ComponentProps> = ({
  ...props
}) => {
  return (
    <SelectComponents.MultiValueRemove {...props}>
      <div
        className={styles.multiValueRemove}
        data-test-id={TableTestIds.RemoveBoardButton}
      >
        <CloseIcon size="small" />
      </div>
    </SelectComponents.MultiValueRemove>
  );
};

function boardsToSelectOptions(boards: Boards): BoardOption[] {
  return boards.map((board) => ({
    label: board.name,
    value: board,
  }));
}

function hasReachedMaxBoards(selectedBoards: Boards) {
  if (selectedBoards.length >= maxSelectableBoards()) {
    return true;
  } else return false;
}

function trackSelectionChange(ids: string[], selectedBoardIds: Boards) {
  if (ids.length >= selectedBoardIds.length) {
    Analytics.sendUIEvent({
      action: 'added',
      actionSubject: 'option',
      actionSubjectId: 'boardSelectorTile',
      source: 'multiBoardTableViewScreen',
      attributes: { numberBoardsSelected: ids.length },
    });
  } else {
    Analytics.sendUIEvent({
      action: 'removed',
      actionSubject: 'option',
      actionSubjectId: 'boardSelectorTile',
      source: 'multiBoardTableViewScreen',
    });
  }
}

export const TeamBoardSelector: React.FunctionComponent<TeamBoardSelectorProps> = ({
  className,
  orgId,
  selectedBoards,
  onSelectedBoardsChange,
  setSelectedBoards,
  isBoardOptionsLoading,
  isDisabled,
}) => {
  const [queryText, setQueryText] = useState('');

  const onInputChange = debounce((text: string) => {
    setQueryText(text);
  }, 250);

  const useSearch = queryText.trim().length > 0;
  const {
    data: searchData,
    loading: searchLoading,
  } = useTeamBoardSelectorSearchQuery({
    variables: {
      query: queryText,
      idOrganizations: [orgId],
    },
    skip: !useSearch,
  });

  const { data, refetch } = useTeamBoardSelectorQuery({
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  });

  const member = data && data.member;
  const boards = (member && member.boards) || [];

  const searchExpressions: RegExp[] = queryText
    .split(/\s+/)
    .map((word) => new RegExp(escapeForRegex(word), 'i'));

  // Borrowed from app/gamma/src/selectors/boards.ts
  const isMatch = (input: string) =>
    searchExpressions.every((searchExpression) => searchExpression.test(input));

  const orgBoards = orgId
    ? boards.filter((board) => board.idOrganization === orgId)
    : [];
  const searchBoards = searchData?.search.boards || [];
  const filteredBoards = _.uniq(
    orgBoards.concat(searchBoards).filter(({ name }) => isMatch(name)),
    (item) => item.id,
  );

  const idBoardsStarred = useMemo(
    () => (member && member.boardStars.map(({ idBoard }) => idBoard)) || [],
    [member],
  );
  const idBoardsRecent = SidebarState.getRecentBoards();
  const idBoardsMember = boards.map(({ id }) => id);

  const resultBoards = useMemo(() => {
    const startsWithSearch = (board: BoardOptionValue): boolean => {
      return board.name.toLowerCase().startsWith(queryText.toLowerCase());
    };

    let comparePrefixedBoards:
      | ((a: BoardOptionValue, b: BoardOptionValue) => number)
      | undefined;

    if (queryText.trim().length === 0) {
      return [];
    }

    const result = filteredBoards.sort(
      buildComparator(
        // Exact title matches
        (board: BoardOptionValue) =>
          board.name.trim().toLowerCase() === queryText.trim().toLowerCase(),
        // Starred boards
        (board: BoardOptionValue) => idBoardsStarred.includes(board.id),
        // Recent boards
        (board: BoardOptionValue) => idBoardsRecent.includes(board.id),
        // Boards we're a member of
        (board: BoardOptionValue) => idBoardsMember.includes(board.id),
        // Preferred if the name of the board starts our search term, and if
        // both do, by the shorter of the two names
        (a: BoardOptionValue, b: BoardOptionValue) => {
          if ([a, b].some(startsWithSearch)) {
            if (comparePrefixedBoards === undefined) {
              comparePrefixedBoards = buildComparator(
                // Prefer if it starts with the search term
                (board: BoardOptionValue) => startsWithSearch(board),
                // Prefer the shorter name
                (
                  aWithPrefix: BoardOptionValue,
                  bWithPrefix: BoardOptionValue,
                ) => aWithPrefix.name.length - bWithPrefix.name.length,
              );
            }

            return comparePrefixedBoards(a, b);
          } else {
            return 0;
          }
        },
        // Alphabetically
        (a: BoardOptionValue, b: BoardOptionValue) =>
          a.name.localeCompare(b.name),
      ),
    );
    return result;
  }, [
    queryText,
    idBoardsStarred,
    idBoardsRecent,
    idBoardsMember,
    filteredBoards,
  ]);

  const options = useSearch
    ? boardsToSelectOptions(resultBoards)
    : boardsToSelectOptions(orgBoards);

  const getOptionValue = useCallback((option: BoardOption) => {
    return option.value.id;
  }, []);

  const noOptionsMessage = useCallback(
    () =>
      hasReachedMaxBoards(selectedBoards)
        ? format('you-reached-the-max')
        : format('you-are-not-a-member'),
    [selectedBoards],
  );

  const onChange = useCallback(
    (boardOptions: BoardOption[]) => {
      const boards = boardOptions.map(
        (boardOption: BoardOption) => boardOption.value,
      );
      // TODO RMK-1442: Rename to `shortLinks` (or refactor so ids is unused)
      const ids = boardOptions.map(
        (boardOption: BoardOption) => boardOption.value.shortLink,
      );
      trackSelectionChange(ids, selectedBoards);
      onSelectedBoardsChange(boardOptions);
      setSelectedBoards(boards);
    },
    [onSelectedBoardsChange, selectedBoards, setSelectedBoards],
  );

  const selectedBoardsAsOptions = boardsToSelectOptions(selectedBoards);

  return (
    <>
      <Select
        isDisabled={isDisabled}
        isSearchable
        onInputChange={onInputChange}
        isClearable={false}
        blurInputOnSelect={true}
        containerClassName={className}
        className={styles.teamBoardSelector}
        components={{
          Control,
          Input,
          Option,
          DropdownIndicator: () => null,
          IndicatorSeparator: () => null,
          MultiValue,
          ValueContainer,
          MultiValueContainer,
          MultiValueRemove,
        }}
        styles={{
          multiValueLabel: (base: React.CSSProperties) => ({
            ...base,
            backgroundColor: 'white',
            color: 'black',
          }),
          multiValueRemove: (base: React.CSSProperties) => ({
            ...base,
            background: 'transparent',
            height: '24px',
            padding: '0',
            marginRight: '4px',
            '&:hover': {
              backgroundColor: 'transparent',
            },
          }),
          placeholder: (base: React.CSSProperties) => ({
            ...base,
            paddingLeft: 32,
          }),
        }}
        isLoading={useSearch ? searchLoading : isBoardOptionsLoading}
        isMulti={true}
        placeholder={''}
        onMenuOpen={refetch}
        onChange={onChange}
        value={selectedBoardsAsOptions}
        options={hasReachedMaxBoards(selectedBoards) ? [] : options}
        getOptionValue={getOptionValue}
        noOptionsMessage={noOptionsMessage}
      />
    </>
  );
};
