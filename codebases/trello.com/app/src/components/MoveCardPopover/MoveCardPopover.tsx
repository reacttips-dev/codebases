import React, { useCallback, useState, useEffect } from 'react';
import cx from 'classnames';
import { Select } from '@trello/nachos/select';
import { N800 } from '@trello/colors';
import { useMoveCardPopoverQuery } from './MoveCardPopoverQuery.generated';
// eslint-disable-next-line no-restricted-imports
import { Card } from '@trello/graphql/generated';
import { forTemplate } from '@trello/i18n';
import { l } from 'app/scripts/lib/localize';
import { Util } from 'app/scripts/lib/util';
import { SelectTestIds } from '@trello/test-ids';

const { calcPos } = Util;
const popoverMoveCardTemplate = forTemplate('popover_move_card');
const moveCardControlsTemplate = forTemplate('move_card_controls');

interface BoardOption {
  selected: boolean;
  id: string;
  name: string;
}

interface OrganizationOption {
  displayName: string;
  boards: BoardOption[];
}

interface ListSuggestion {
  direction: string;
  id: string;
  position: string;
  name: string;
}

interface MoveCardPopoverProps {
  hasEnterprise?: boolean;
  hideBoardSelect?: boolean;
  isMove?: boolean;
  isCopy?: boolean;
  currentIndex: number;
  defaultBoardId: string;
  defaultBoardName: string;
  defaultListId: string;
  defaultListName: string;
  enterpriseName?: string;
  cardList: Card[];
  organizations: OrganizationOption[];
  restrictToCurrentBoard?: boolean;
  suggestions: ListSuggestion[];
  onSubmit: (
    e: React.SyntheticEvent,
    selectedBoardId: string,
    selectedListId: string,
    selectedPosition: number | string,
    selectedIndex: number,
  ) => void;
}

export const MoveCardPopover: React.FunctionComponent<MoveCardPopoverProps> = ({
  hasEnterprise = false,
  hideBoardSelect = false,
  isMove = true,
  isCopy = false,
  currentIndex,
  defaultBoardId,
  defaultBoardName,
  defaultListId,
  defaultListName,
  enterpriseName = '',
  cardList,
  organizations,
  onSubmit,
  restrictToCurrentBoard = false,
  suggestions = [],
}) => {
  const [selectedBoardId, setSelectedBoardId] = useState(defaultBoardId);
  const [selectedListId, setSelectedListId] = useState(defaultListId);
  const [selectedPosition, setSelectedPosition] = useState<number | string>(
    'bottom',
  );
  const [selectedIndex, setSelectedIndex] = useState<number>(currentIndex);
  const { data, loading } = useMoveCardPopoverQuery({
    // TODO: FEPLAT-721 - We want to remove this "network-only" policy once Apollo cache syncing is in place
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    variables: {
      boardId: selectedBoardId,
    },
  });
  const movingWithinSameList = selectedListId === defaultListId;

  const boardOptions = organizations.map((org) => ({
    label: org.displayName,
    options: org.boards.map((board) => ({
      label: board.name,
      value: board.id,
    })),
  }));

  // if we don't have data yet, fallback to the list the card is currently on
  const listOptions =
    data && data.board
      ? data.board.lists.map((list) => ({
          label: list.name,
          value: list.id,
        }))
      : [{ label: defaultListName, value: defaultListId }];

  // if the user has selected a value, use that list value
  // if there's no selected value, use the default as the first list in the
  // board
  let selectedListOption =
    (listOptions &&
      listOptions.find(({ value }) => {
        return value === selectedListId;
      })) ||
    listOptions[0];

  const numCardsInTargetList =
    data && data.board && data.board.cards
      ? data.board.cards.filter(({ idList }) => idList === selectedListId)
          .length
      : 0;

  let maxIndex = numCardsInTargetList ? numCardsInTargetList : cardList.length;

  // if we have just moved the card, we need to shift the index for both origin
  // and destination list to account for the card we're moving
  if (cardList.length > numCardsInTargetList && movingWithinSameList) {
    maxIndex = cardList.length;
  }
  if (selectedListOption && !movingWithinSameList) {
    maxIndex = numCardsInTargetList + 1;
  }

  const indexOptions =
    data && data.board
      ? [...Array(maxIndex).keys()].map((x) => {
          return { label: x + 1, value: x };
        })
      : [{ label: currentIndex + 1, value: currentIndex }];

  let selectedIndexOption =
    indexOptions[selectedIndex] || indexOptions[indexOptions.length - 1];

  // if there are no lists in the board, render a string for "no lists" and
  // position as "n/a"
  if (!listOptions.length) {
    selectedListOption = { label: l('no lists'), value: '' };
    selectedIndexOption = { label: l('n/a'), value: -1 };
  }

  useEffect(() => {
    !loading && setSelectedListId(selectedListOption.value);
    !loading && !movingWithinSameList && setSelectedIndex(maxIndex);
  }, [selectedListOption.value, loading, maxIndex, movingWithinSameList]);

  useEffect(() => {
    !loading && setSelectedIndex(selectedIndexOption.value);
  }, [selectedIndexOption.value, loading]);

  useEffect(() => {
    setSelectedPosition(() => {
      if (selectedIndex === 0) {
        return 'top';
      } else if (selectedIndex === numCardsInTargetList) {
        return 'bottom';
      } else {
        return calcPos(selectedIndex, cardList);
      }
    });
  }, [selectedIndex, cardList, numCardsInTargetList]);

  const onSubmitMove = useCallback(
    (e) => {
      onSubmit(
        e,
        selectedBoardId,
        selectedListId,
        selectedPosition,
        selectedIndex,
      );
    },
    [
      onSubmit,
      selectedBoardId,
      selectedIndex,
      selectedListId,
      selectedPosition,
    ],
  );

  return (
    <>
      {suggestions.length > 0 && (
        <div className="pop-over-section">
          <h4>
            <span className="icon-sm icon-sparkle" />
            {popoverMoveCardTemplate('suggested')}
          </h4>
          {suggestions.map((list: ListSuggestion) => {
            return (
              <a
                className={cx({
                  'button-link': true,
                  'js-suggested-move': true,
                  'flip-icon': list.direction === 'left',
                })}
                key={list.id}
                href="#"
                data-id={list.id}
                data-position={list.position}
              >
                <span className="icon-sm icon-move" />
                {list.name}
              </a>
            );
          })}
        </div>
      )}
      <div className="pop-over-section">
        <h4>{popoverMoveCardTemplate('select-destination')}</h4>
        <div className="form-grid">
          {!hideBoardSelect && (
            <div className="form-grid-child form-grid-child-full">
              {restrictToCurrentBoard ? (
                <>
                  <label
                    style={{
                      color: N800,
                      fontSize: '14px',
                      marginBottom: '2px',
                      lineHeight: '20px',
                    }}
                  >
                    {moveCardControlsTemplate('board')}
                  </label>
                  <p>{organizations[0].boards[0].name}</p>
                </>
              ) : (
                <Select
                  label={moveCardControlsTemplate('board')}
                  options={boardOptions}
                  defaultValue={{
                    label: defaultBoardName,
                    value: defaultBoardId,
                  }}
                  // eslint-disable-next-line react/jsx-no-bind
                  onChange={({ value }: { value: string }) =>
                    setSelectedBoardId(value)
                  }
                  isSearchable
                  testId={SelectTestIds.MoveBoardSelect}
                />
              )}
              {hasEnterprise && enterpriseName && isMove && (
                <p className="quiet" style={{ marginTop: '8px' }}>
                  {moveCardControlsTemplate(
                    'card-can-only-be-moved-to-teams-within-org',
                    {
                      enterpriseName,
                    },
                  )}
                </p>
              )}
              {hasEnterprise && enterpriseName && isCopy && (
                <p className="quiet" style={{ marginTop: '8px' }}>
                  {moveCardControlsTemplate(
                    'card-can-only-be-copied-to-teams-within-org',
                    {
                      enterpriseName,
                    },
                  )}
                </p>
              )}
            </div>
          )}
          <div
            className="form-grid-child form-grid-child-threequarters"
            style={{ maxWidth: '100%' }}
          >
            <Select
              label={moveCardControlsTemplate('list')}
              options={listOptions}
              value={selectedListOption}
              // eslint-disable-next-line react/jsx-no-bind
              onChange={({ value }: { value: string }) =>
                setSelectedListId(value)
              }
              isSearchable
              isDisabled={!listOptions.length}
            />
          </div>
          <div className="form-grid-child">
            <Select
              label={moveCardControlsTemplate('position')}
              options={indexOptions}
              value={selectedIndexOption}
              // eslint-disable-next-line react/jsx-no-bind
              onChange={({ value }: { value: number }) =>
                setSelectedIndex(value)
              }
              isSearchable
              isDisabled={!listOptions.length}
            />
          </div>
        </div>
      </div>
      <input
        className="nch-button nch-button--primary wide"
        type="submit"
        disabled={!listOptions.length}
        // eslint-disable-next-line react/jsx-no-bind
        onClick={(e) => onSubmitMove(e)}
        value={popoverMoveCardTemplate('move')}
      />
    </>
  );
};
