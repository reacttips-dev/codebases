import React from 'react';
import { RemoveFromCardAction } from '@atlassian/butler-command-parser';
import { formatButlerCommand as format } from 'app/src/components/Butler/formatButlerCommand';
import { CommandSelect } from '../CommandSelect';
import { LabelSelector } from '../LabelSelector';
import { ActionEditor } from '../types';

interface SelectOption {
  label: string;
  value: keyof RemoveFromCardAction['REMOVE_FROM_CARD_ACTION'];
}

const selectOptions: SelectOption[] = [
  { label: format('the label'), value: 'LABEL' },
  {
    label: format('all labels'),
    value: 'REMOVE_ALL_LABELS',
  },
  {
    label: format('the due date'),
    value: 'REMOVE_DUE_DATE',
  },
  {
    label: format('the start date'),
    value: 'REMOVE_START_DATE',
  },
  {
    label: format('all checklists'),
    value: 'REMOVE_ALL_CHECKLISTS',
  },
  {
    label: format('all members'),
    value: 'REMOVE_ALL_MEMBERS',
  },
  {
    label: format('all stickers'),
    value: 'REMOVE_ALL_STICKERS',
  },
  { label: format('the cover'), value: 'REMOVE_COVER' },
];

export const RemoveFromCardActionEditor: ActionEditor<RemoveFromCardAction> = ({
  action,
  update,
  idBoard,
}) => {
  const selectField = ({ value }: SelectOption) => {
    update((draft: RemoveFromCardAction) => {
      if (value === 'LABEL') {
        draft.REMOVE_FROM_CARD_ACTION = { LABEL: {} };
        return;
      }
      draft.REMOVE_FROM_CARD_ACTION = {
        [value]: true,
      };
    });
  };

  return (
    <>
      {format('remove_from_card_action', {
        fields: (
          <React.Fragment key="remove-fields">
            <CommandSelect
              key="selector"
              // eslint-disable-next-line react/jsx-no-bind
              onChange={selectField}
              options={selectOptions}
              value={selectOptions.find(
                (o) =>
                  o.value === Object.keys(action.REMOVE_FROM_CARD_ACTION)[0],
              )}
              width="140px"
            />
            {action.REMOVE_FROM_CARD_ACTION.LABEL && (
              <LabelSelector
                key="labelSelector"
                idBoard={idBoard}
                value={
                  Array.isArray(action.REMOVE_FROM_CARD_ACTION.LABEL)
                    ? action.REMOVE_FROM_CARD_ACTION.LABEL[0]
                    : action.REMOVE_FROM_CARD_ACTION.LABEL
                }
                // eslint-disable-next-line react/jsx-no-bind
                onChange={(label) => {
                  update((draft: RemoveFromCardAction) => {
                    draft.REMOVE_FROM_CARD_ACTION.LABEL = label;
                  });
                }}
              />
            )}
          </React.Fragment>
        ),
        location: format('the card'),
      })}
    </>
  );
};
