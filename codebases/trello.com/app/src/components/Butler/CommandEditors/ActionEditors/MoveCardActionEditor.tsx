import React, { useEffect } from 'react';
import { MoveCardAction } from '@atlassian/butler-command-parser';
import { formatButlerCommand as format } from 'app/src/components/Butler/formatButlerCommand';
import { CommandSelect, SelectOption } from '../CommandSelect';
import { useActionDestination, positionOptions } from '../useActionDestination';
import { ActionEditor } from '../types';

export const MoveCardActionEditor: ActionEditor<MoveCardAction> = ({
  action,
  update,
  idBoard: initialIdBoard,
}) => {
  const { idBoard, boards, lists, loading, selectBoard } = useActionDestination(
    {
      initialIdBoard,
      selectedBoardName: action.MOVE_CARD_ACTION.DESTINATION.$BOARD,
    },
  );

  useEffect(() => {
    // prepopulate initial board
    if (!action.MOVE_CARD_ACTION.DESTINATION.$BOARD && idBoard) {
      const board = boards.find(({ value }) => value === idBoard);
      if (board) {
        update((draft: MoveCardAction) => {
          draft.MOVE_CARD_ACTION.DESTINATION.$BOARD = board.label;
        });
      }
    }
  }, [action, update, boards, idBoard]);

  return (
    <>
      {format('move_card_action', {
        position: (
          <CommandSelect
            key="move-card-action-position"
            width="120px"
            // eslint-disable-next-line react/jsx-no-bind
            onChange={({ value }: SelectOption) => {
              update((draft: MoveCardAction) => {
                if (value === 'top') {
                  draft.MOVE_CARD_ACTION.DESTINATION.POSITION_TOP = value;
                  draft.MOVE_CARD_ACTION.DESTINATION.POSITION_BOTTOM = undefined;
                } else {
                  draft.MOVE_CARD_ACTION.DESTINATION.POSITION_BOTTOM = value;
                  draft.MOVE_CARD_ACTION.DESTINATION.POSITION_TOP = undefined;
                }
              });
            }}
            options={positionOptions}
            value={
              action.MOVE_CARD_ACTION.DESTINATION.POSITION_BOTTOM
                ? positionOptions[1]
                : positionOptions[0]
            }
          />
        ),
        list: format('of the list', {
          title: (
            <CommandSelect
              key="move-card-action-list"
              width="180px"
              isLoading={loading}
              isSearchable={true}
              // eslint-disable-next-line react/jsx-no-bind
              onChange={({ label }: SelectOption) => {
                update((draft: MoveCardAction) => {
                  draft.MOVE_CARD_ACTION.DESTINATION.$LIST = label;
                });
              }}
              options={lists}
              placeholder={format('list name')}
              value={action.MOVE_CARD_ACTION.DESTINATION.$LIST ?? null}
            />
          ),
        }),
        board: format('on board', {
          title: (
            <CommandSelect
              key="move-card-action-board"
              width="240px"
              isLoading={loading}
              isSearchable={true}
              // eslint-disable-next-line react/jsx-no-bind
              onChange={({ label, value }: SelectOption) => {
                update((draft: MoveCardAction) => {
                  if (draft.MOVE_CARD_ACTION.DESTINATION.$BOARD !== label) {
                    draft.MOVE_CARD_ACTION.DESTINATION.$BOARD = label;
                    draft.MOVE_CARD_ACTION.DESTINATION.$LIST = undefined;
                  }
                });
                selectBoard(value);
              }}
              options={boards}
              placeholder={format('board name')}
              value={action.MOVE_CARD_ACTION.DESTINATION.$BOARD ?? null}
            />
          ),
        }),
      })}
    </>
  );
};
