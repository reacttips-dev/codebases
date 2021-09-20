import React from 'react';
import {
  AddStartDateAction,
  AddDueDateAction,
} from '@atlassian/butler-command-parser';
import { formatButlerCommand as format } from 'app/src/components/Butler/formatButlerCommand';
import { CommandText } from '../CommandText';
import { CommandSelect } from '../CommandSelect';
import { parseDueOrStartDate, getDueOrStartDate } from '../parseDueOrStartDate';
import { ActionEditor } from '../types';

interface SelectOption {
  readonly label: string;
  readonly value: 'ADD_DUE_DATE_ACTION' | 'ADD_START_DATE_ACTION';
}

const completionTypeOptions: SelectOption[] = [
  { label: format('due date'), value: 'ADD_DUE_DATE_ACTION' },
  { label: format('start date'), value: 'ADD_START_DATE_ACTION' },
];

const timeframeSelectOptions = [
  { label: format('minutes'), value: 'IN_MINUTES' },
  { label: format('hours'), value: 'IN_HOURS' },
  { label: format('days'), value: 'X_DAYS' },
  { label: format('working days'), value: 'X_WORKING_DAYS' },
  { label: format('weeks'), value: 'X_WEEKS' },
  { label: format('months'), value: 'X_MONTHS' },
];

const getTimeAndTimeframe = (
  action: AddStartDateAction | AddDueDateAction,
): ReturnType<typeof parseDueOrStartDate> =>
  parseDueOrStartDate(
    action.type === 'ADD_START_DATE_ACTION'
      ? action.ADD_START_DATE_ACTION.START_DATE
      : action.ADD_DUE_DATE_ACTION.DUE_DATE,
  );

export const AddDueDateActionEditor: ActionEditor<
  AddDueDateAction | AddStartDateAction
> = ({ update, action }) => {
  const { time, timeframe } = getTimeAndTimeframe(action);

  return (
    <>
      {format('add_date_action', {
        date_type: (
          <CommandSelect
            key="dateValueSelection"
            width="160px"
            // eslint-disable-next-line react/jsx-no-bind
            onChange={({ value }: SelectOption) => {
              update((draft) => {
                draft.type = value;
                const date = getDueOrStartDate({
                  time,
                  timeframe,
                });
                if (value === 'ADD_DUE_DATE_ACTION') {
                  delete (draft as Partial<AddStartDateAction>)
                    .ADD_START_DATE_ACTION;
                  (draft as AddDueDateAction).ADD_DUE_DATE_ACTION = {
                    DUE_DATE: date,
                  };
                } else {
                  delete (draft as Partial<AddDueDateAction>)
                    .ADD_DUE_DATE_ACTION;
                  (draft as AddStartDateAction).ADD_START_DATE_ACTION = {
                    START_DATE: date,
                  };
                }
              });
            }}
            options={completionTypeOptions}
            value={completionTypeOptions.find(
              ({ value }) => value === action.type,
            )}
          />
        ),
        date: (
          <React.Fragment key="add_due_date_date">
            {format('x time frame later', {
              x: (
                <CommandText
                  key="timeSelector"
                  type="number"
                  // eslint-disable-next-line react/jsx-no-bind
                  onChange={(val) => {
                    update((draft) => {
                      const date = getDueOrStartDate({
                        time: Math.max(0, parseInt(val.target.value, 10)) || 0,
                        timeframe,
                      });
                      if (action.type === 'ADD_DUE_DATE_ACTION') {
                        (draft as AddDueDateAction).ADD_DUE_DATE_ACTION = {
                          DUE_DATE: date,
                        };
                      } else {
                        (draft as AddStartDateAction).ADD_START_DATE_ACTION = {
                          START_DATE: date,
                        };
                      }
                    });
                  }}
                  value={time}
                  width="40px"
                />
              ),
              time_frame: (
                <CommandSelect
                  key="timeframeSelector"
                  // eslint-disable-next-line react/jsx-no-bind
                  onChange={(val: SelectOption) => {
                    update((draft) => {
                      const date = getDueOrStartDate({
                        time,
                        timeframe: val.value,
                      });
                      if (action.type === 'ADD_DUE_DATE_ACTION') {
                        (draft as Partial<AddDueDateAction>).ADD_DUE_DATE_ACTION = {
                          DUE_DATE: date,
                        };
                      } else {
                        (draft as Partial<AddStartDateAction>).ADD_START_DATE_ACTION = {
                          START_DATE: date,
                        };
                      }
                    });
                  }}
                  options={timeframeSelectOptions}
                  value={timeframeSelectOptions.find(
                    (t) => t.value === timeframe,
                  )}
                  width="180px"
                />
              ),
            })}
          </React.Fragment>
        ),
        time: undefined,
      })}
    </>
  );
};
