/* @jsx jsx */
import React, { useEffect, useState } from 'react';
import { Moment } from 'moment';

import { Box, color, Strong } from '@coursera/coursera-ui';
import { SvgCheck } from '@coursera/coursera-ui/svg';
import { css, jsx } from '@emotion/react';
import { Button, Grid, Typography, useTheme } from '@coursera/cds-core';

import TrackedDiv from 'bundles/page/components/TrackedDiv';
import TrackedButton from 'bundles/page/components/TrackedButton';

import GoalSettingDescription from 'bundles/goal-setting/components/cds/GoalSettingDescription';
import GoalSettingHeader from 'bundles/goal-setting/components/cds/GoalSettingHeader';
import GoalSettingSetScheduleDays from 'bundles/goal-setting/components/cds/GoalSettingSetScheduleDays';
import GoalSettingSetScheduleTimePicker from 'bundles/goal-setting/components/cds/GoalSettingSetScheduleTimePicker';

import _t from 'i18n!nls/video-quiz';

import { DayOfWeek } from 'bundles/goal-setting/utils/constants';
import { getCalendarURL, getInitialStartTime } from 'bundles/goal-setting/utils/goalSettingScheduleUtils';

type Props = {
  courseId: string;
  onDismiss: () => void;
  onEditGoal?: () => void;
  showConfirmation?: boolean;
  currentDay?: Moment; // Represents the current day. Used for snapshot testing.
  selectedDays: DayOfWeek[];
  onSelectedDaysChanged: (selectedDays: DayOfWeek[]) => void;
  showSkipButton?: boolean;
};

const GoalSettingSetSchedule: React.FC<Props> = ({
  courseId,
  onDismiss,
  showConfirmation,
  currentDay,
  selectedDays,
  onSelectedDaysChanged,
  showSkipButton,
}) => {
  const initialStartTime = getInitialStartTime();
  const theme = useTheme();

  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState(initialStartTime.clone().add(30, 'minutes'));

  useEffect(() => {
    setEndTime(startTime.clone().add(30, 'minutes'));
  }, [startTime]);

  const disableSubmission = selectedDays.length === 0;

  return (
    <div>
      <TrackedDiv
        trackingName="set_schedule_message"
        data={{
          selectedDays,
        }}
        trackClicks={false}
        requireFullyVisible={false}
        withVisibilityTracking
      >
        {showSkipButton && (
          <Button
            component={TrackedButton}
            trackingName="set_schedule_skip"
            withVisibilityTracking={false}
            requireFullyVisible={false}
            css={css`
              position: absolute;
              padding: ${theme.spacing(24)};
              top: 0;
              right: 0;
            `}
            onClick={onDismiss}
            variant="ghost"
          >
            {_t('Skip')}
          </Button>
        )}

        <GoalSettingHeader>{_t('Set your schedule')}</GoalSettingHeader>

        {showConfirmation && (
          <div
            css={css`
              display: flex;
              flex-direction: row;
              align-items: center;

              & > * {
                margin: ${theme.spacing(16, 4, 0)};
                line-height: 1em;
              }
            `}
          >
            <SvgCheck color={color.success} />
            <Typography
              css={css`
                font-weight: bold;
              `}
              variant="body1"
            >
              {_t('Your goal is set!')}
            </Typography>{' '}
          </div>
        )}

        <GoalSettingDescription>
          {_t(
            `You're more likely to reach your goal if you dedicate some time in your schedule for learning. Choose the days that work for you:`
          )}
        </GoalSettingDescription>

        <GoalSettingSetScheduleDays onChange={onSelectedDaysChanged} selectedDays={selectedDays} />

        <Grid direction="row" spacing={8} container alignItems="center">
          <Grid item>
            <GoalSettingSetScheduleTimePicker
              minTime={currentDay?.clone().startOf('day')}
              currentTime={startTime}
              onChange={(startTime) => setStartTime(startTime)}
            />
          </Grid>
          <Grid item>
            <span>{_t('to')}</span>
          </Grid>
          <Grid item>
            <GoalSettingSetScheduleTimePicker
              currentTime={endTime}
              minTime={startTime}
              onChange={(endTime) => setEndTime(endTime)}
            />
          </Grid>
        </Grid>

        <Grid
          container
          spacing={16}
          direction="row"
          justify="flex-start"
          css={css`
            margin-top: ${theme.spacing(32)};
          `}
        >
          <Grid item>
            <Button
              component={TrackedButton}
              trackingName="set_schedule_cta_calendar_google"
              variant="primary"
              size="small"
              disabled={disableSubmission}
              withVisibilityTracking={false}
              requireFullyVisible={false}
              onClick={() => {
                onDismiss();
                window.open(
                  getCalendarURL({
                    calendarType: 'gcal',
                    startTime,
                    endTime,
                    courseId,
                    selectedDays,
                  }),
                  '_blank'
                );
              }}
            >
              {_t('Add to Google Calendar')}
            </Button>
          </Grid>

          <Grid item>
            <Button
              component={TrackedButton}
              trackingName="set_schedule_cta_calendar_other"
              withVisibilityTracking={false}
              requireFullyVisible={false}
              size="small"
              variant="ghost"
              onClick={() => {
                onDismiss();
                window.open(
                  getCalendarURL({
                    calendarType: 'ics',
                    startTime,
                    endTime,
                    courseId,
                    selectedDays,
                  }),
                  '_blank'
                );
              }}
            >
              {_t('Other calendar')}
            </Button>
          </Grid>
        </Grid>
      </TrackedDiv>
    </div>
  );
};

GoalSettingSetSchedule.defaultProps = {
  selectedDays: [],
  showConfirmation: false,
  showSkipButton: true,
};

export { GoalSettingSetSchedule };

export default GoalSettingSetSchedule;
