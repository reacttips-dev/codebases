import React, { useCallback } from 'react';
import moment from 'moment';
import { CertainDaysTrigger, Time } from '@atlassian/butler-command-parser';
import { useFeatureFlag } from '@trello/feature-flag-client';
import { formatButlerCommand as format } from 'app/src/components/Butler/formatButlerCommand';
import { CommandSelect, SelectOption } from '../CommandSelect';
import { CommandTime } from '../CommandTime';
import { TriggerEditor } from '../types';

let weekdayOptions: SelectOption[];
const getWeekdayOptions = (): SelectOption[] => {
  if (!weekdayOptions) {
    weekdayOptions = moment.weekdays().map((day, index) => ({
      label: day,
      value: String(index),
    }));
  }
  return weekdayOptions;
};

export const CertainDaysTriggerEditor: TriggerEditor<CertainDaysTrigger> = ({
  trigger,
  update,
}) => {
  const showAutomaticReports = useFeatureFlag(
    'workflowers.show-automatic-reports',
    false,
  );

  const weekdays = getWeekdayOptions();

  const onChangeTime = useCallback(
    (time: Time) => {
      update((draft) => {
        (draft.EVERY as CertainDaysTrigger).CERTAIN_DAYS.TIME = time;
      });
    },
    [update],
  );

  return (
    <>
      {format('certain_days_trigger', {
        day: (
          <CommandSelect
            width="150px"
            key="certain-days-trigger-day"
            // eslint-disable-next-line react/jsx-no-bind
            onChange={({ value }: SelectOption) => {
              update((draft) => {
                (draft.EVERY as CertainDaysTrigger).CERTAIN_DAYS.DAY = Number(
                  value,
                );
              });
            }}
            options={weekdays}
            defaultValue={weekdays[1]}
            value={
              weekdays[
                Array.isArray(trigger.CERTAIN_DAYS.DAY)
                  ? trigger.CERTAIN_DAYS.DAY[0]
                  : trigger.CERTAIN_DAYS.DAY ?? 0
              ]
            }
          />
        ),
        time: showAutomaticReports
          ? format('at time', {
              time: (
                <CommandTime
                  key="certain-days-trigger-time"
                  time={trigger.CERTAIN_DAYS.TIME}
                  onChangeTime={onChangeTime}
                />
              ),
            })
          : undefined,
      })}
    </>
  );
};
