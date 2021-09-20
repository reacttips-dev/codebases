import React from 'react';
import {
  MarkDueDateCompleteAction,
  UnmarkDueDateCompleteAction,
} from '@atlassian/butler-command-parser';
import { formatButlerCommand as format } from 'app/src/components/Butler/formatButlerCommand';
import { CommandSelect } from '../CommandSelect';
import { ActionEditor } from '../types';

interface SelectOption {
  readonly label: string;
  readonly value: 'MARK_DUE_COMPLETE_ACTION' | 'UNMARK_DUE_COMPLETE_ACTION';
}

const completionTypeOptions: SelectOption[] = [
  { label: format('complete'), value: 'MARK_DUE_COMPLETE_ACTION' },
  { label: format('incomplete'), value: 'UNMARK_DUE_COMPLETE_ACTION' },
];

export const MarkDueDateCompleteActionEditor: ActionEditor<
  MarkDueDateCompleteAction | UnmarkDueDateCompleteAction
> = ({ action, update }) => (
  <>
    {format('mark_due_date_complete_action', {
      field: (
        <CommandSelect
          width="150px"
          key="mark-due-date-action-type"
          // eslint-disable-next-line react/jsx-no-bind
          onChange={({ value }: SelectOption) => {
            update((draft) => {
              draft.type = value;
              if (value === 'MARK_DUE_COMPLETE_ACTION') {
                delete (draft as Partial<UnmarkDueDateCompleteAction>)
                  .UNMARK_DUE_COMPLETE_ACTION;
                (draft as MarkDueDateCompleteAction).MARK_DUE_COMPLETE_ACTION = true;
              } else {
                delete (draft as Partial<MarkDueDateCompleteAction>)
                  .MARK_DUE_COMPLETE_ACTION;
                (draft as UnmarkDueDateCompleteAction).UNMARK_DUE_COMPLETE_ACTION = true;
              }
            });
          }}
          options={completionTypeOptions}
          value={completionTypeOptions.find(
            ({ value }) => value === action.type,
          )}
        />
      ),
    })}
  </>
);
