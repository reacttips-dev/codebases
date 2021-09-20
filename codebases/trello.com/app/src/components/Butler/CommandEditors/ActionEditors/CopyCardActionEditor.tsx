import React, { useEffect } from 'react';
import { CopyCardAction } from '@atlassian/butler-command-parser';
import { formatButlerCommand as format } from 'app/src/components/Butler/formatButlerCommand';
import { CommandSelect, SelectOption } from '../CommandSelect';
import { useActionDestination, positionOptions } from '../useActionDestination';
import { ActionEditor } from '../types';

export const CopyCardActionEditor: ActionEditor<CopyCardAction> = ({
  action,
  update,
  idBoard: initialIdBoard,
}) => {
  const { idBoard, boards, lists, loading, selectBoard } = useActionDestination(
    {
      initialIdBoard,
      selectedBoardName: action.COPY_CARD_ACTION.DESTINATION.$BOARD,
    },
  );

  useEffect(() => {
    // prepopulate initial board
    if (!action.COPY_CARD_ACTION.DESTINATION.$BOARD && idBoard) {
      const board = boards.find(({ value }) => value === idBoard);
      if (board) {
        update((draft: CopyCardAction) => {
          draft.COPY_CARD_ACTION.DESTINATION.$BOARD = board.label;
        });
      }
    }
  }, [action, update, boards, idBoard]);

  return (
    <>
      {format('copy_card_action', {
        position: (
          <CommandSelect
            width="120px"
            key="copy-card-action-position"
            // eslint-disable-next-line react/jsx-no-bind
            onChange={({ value }: SelectOption) => {
              update((draft: CopyCardAction) => {
                if (value === 'top') {
                  draft.COPY_CARD_ACTION.DESTINATION.POSITION_TOP = value;
                  draft.COPY_CARD_ACTION.DESTINATION.POSITION_BOTTOM = undefined;
                } else {
                  draft.COPY_CARD_ACTION.DESTINATION.POSITION_BOTTOM = value;
                  draft.COPY_CARD_ACTION.DESTINATION.POSITION_TOP = undefined;
                }
              });
            }}
            options={positionOptions}
            value={
              action.COPY_CARD_ACTION.DESTINATION.POSITION_BOTTOM
                ? positionOptions[1]
                : positionOptions[0]
            }
          />
        ),
        list: format('of the list', {
          title: (
            <CommandSelect
              key="copy-card-action-list"
              width="180px"
              isLoading={loading}
              isSearchable={true}
              // eslint-disable-next-line react/jsx-no-bind
              onChange={({ label }: SelectOption) => {
                update((draft: CopyCardAction) => {
                  draft.COPY_CARD_ACTION.DESTINATION.$LIST = label;
                });
              }}
              options={lists}
              placeholder={format('list name')}
              value={action.COPY_CARD_ACTION.DESTINATION.$LIST ?? null}
            />
          ),
        }),
        board: format('on board', {
          title: (
            <CommandSelect
              key="copy-card-action-board"
              width="240px"
              isLoading={loading}
              isSearchable={true}
              // eslint-disable-next-line react/jsx-no-bind
              onChange={({ label, value }: SelectOption) => {
                update((draft: CopyCardAction) => {
                  if (draft.COPY_CARD_ACTION.DESTINATION.$BOARD !== label) {
                    draft.COPY_CARD_ACTION.DESTINATION.$BOARD = label;
                    draft.COPY_CARD_ACTION.DESTINATION.$LIST = undefined;
                  }
                });
                selectBoard(value);
              }}
              options={boards}
              placeholder={format('board name')}
              value={action.COPY_CARD_ACTION.DESTINATION.$BOARD ?? null}
            />
          ),
        }),
        comments: null,
      })}
    </>
  );
};
