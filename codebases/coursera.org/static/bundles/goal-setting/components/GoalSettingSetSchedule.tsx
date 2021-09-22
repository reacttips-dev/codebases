import React from 'react';
import moment, { Moment } from 'moment';
import classNames from 'classnames';

import { Button, Box, color, Strong } from '@coursera/coursera-ui';
import { SvgCheck } from '@coursera/coursera-ui/svg';

import user from 'js/lib/user';

import { formatDateTimeDisplay, TIME_ONLY_CONDENSED } from 'js/utils/DateTimeUtils';

import withSingleTracked from 'bundles/common/components/withSingleTracked';
import TrackedDiv from 'bundles/page/components/TrackedDiv';

import GoalSettingDescription from 'bundles/goal-setting/components/GoalSettingDescription';
import GoalSettingHeader from 'bundles/goal-setting/components/GoalSettingHeader';
import GoalSettingSetScheduleDays from 'bundles/goal-setting/components/GoalSettingSetScheduleDays';
import GoalSettingSetScheduleTimePicker from 'bundles/goal-setting/components/GoalSettingSetScheduleTimePicker';

import _t from 'i18n!nls/video-quiz';

import { DayOfWeek } from 'bundles/goal-setting/utils/constants';

import 'css!bundles/goal-setting/components/__styles__/GoalSettingSetSchedule';

type CalendarType = 'gcal' | 'ics';

type Props = {
  courseId: string;
  onDismiss: () => void;
  onEditGoal?: () => void;
  showEditButton: boolean;
  currentDay?: Moment; // Represents the current day. Used for snapshot testing.
  selectedDays: DayOfWeek[];
  onSelectedDaysChanged: (selectedDays: DayOfWeek[]) => void;
  showSkipButton: boolean;
};

type State = {
  startTime: Moment;
  endTime: Moment;
};

const TrackedButton = withSingleTracked({ type: 'BUTTON' })(Button);

export class GoalSettingSetSchedule extends React.Component<Props, State> {
  static defaultProps = {
    selectedDays: [],
    showEditButton: true,
    showSkipButton: true,
  };

  state: State = {
    startTime: this.getStartTime(),
    endTime: this.getStartTime().clone().add(30, 'minutes'),
  };

  handleStartTimeChange = (startTime: Moment) => {
    this.setState({
      startTime,
      endTime: startTime.clone().add(30, 'minutes'),
    });
  };

  handleEndTimeChange = (endTime: Moment) => {
    this.setState({
      endTime,
    });
  };

  getStartTime() {
    const start = moment();
    const remainder = 30 - (start.minute() % 30);
    return moment(start).add(remainder, 'minutes');
  }

  getCalendarURL = (calendarType: CalendarType) => {
    const { courseId, selectedDays } = this.props;
    const { startTime, endTime } = this.state;
    const { id: userId } = user.get();

    if (!startTime || !endTime || selectedDays.length === 0) {
      return undefined;
    }

    const daysOfWeek = selectedDays.map((day) => day.toLowerCase());
    const formattedStartTime = formatDateTimeDisplay(startTime, TIME_ONLY_CONDENSED, null, 'en');
    const formattedEndTime = formatDateTimeDisplay(endTime, TIME_ONLY_CONDENSED, null, 'en');
    const endpoint =
      calendarType === 'gcal'
        ? `studyPlans.v1?q=gCal&courseId=${courseId}`
        : `studyPlans.v1/calendar/studyplans.ics?courseId=${courseId}`;

    return [
      `https://api.coursera.org/api/${endpoint}`,
      `startTime=${formattedStartTime}`,
      `endTime=${formattedEndTime}`,
      `daysOfWeek=${daysOfWeek}`,
      `userId=${userId}`,
    ].join('&');
  };

  render() {
    const {
      showSkipButton,
      showEditButton,
      currentDay,
      onDismiss,
      onEditGoal,
      onSelectedDaysChanged,
      selectedDays,
    } = this.props;

    const { startTime, endTime } = this.state;

    const disableSubmission = selectedDays.length === 0;

    return (
      <div className="rc-GoalSettingSetSchedule">
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
            <TrackedButton
              trackingName="set_schedule_skip"
              size="zero"
              rootClassName="skip-button"
              type="link"
              onClick={onDismiss}
            >
              {_t('Skip')}
            </TrackedButton>
          )}

          <GoalSettingHeader>{_t('Set your schedule')}</GoalSettingHeader>

          {showEditButton && (
            <Box rootClassName="edit-goal" flexDirection="row" alignItems="center">
              <SvgCheck color={color.success} />
              <Strong>{_t('Your goal is set!')}</Strong>{' '}
              <TrackedButton
                trackingName="set_schedule_edit"
                size="zero"
                rootClassName="edit-button"
                type="link"
                onClick={onEditGoal}
              >
                {_t('Edit')}
              </TrackedButton>
            </Box>
          )}

          <GoalSettingDescription>
            {_t(
              `You're more likely to reach your goal if you dedicate some time in your schedule for learning. Choose the days that work for you:`
            )}
          </GoalSettingDescription>

          <GoalSettingSetScheduleDays onChange={onSelectedDaysChanged} selectedDays={selectedDays} />

          <Box flexDirection="row" alignItems="center">
            <GoalSettingSetScheduleTimePicker
              minTime={currentDay?.clone().startOf('day')}
              currentTime={startTime}
              onChange={this.handleStartTimeChange}
            />
            <span>{_t('to')}</span>
            <GoalSettingSetScheduleTimePicker
              currentTime={endTime}
              minTime={startTime}
              onChange={this.handleEndTimeChange}
            />
          </Box>

          <Box flexDirection="row" justifyContent="end" rootClassName="buttons">
            <TrackedButton
              trackingName="set_schedule_cta_calendar_other"
              type="link"
              tag="a"
              rootClassName={classNames('secondary-button', { disabled: disableSubmission })}
              onClick={onDismiss}
              htmlAttributes={{
                href: this.getCalendarURL('ics'),
                target: '_blank',
              }}
            >
              {_t('Other calendar')}
            </TrackedButton>

            <TrackedButton
              trackingName="set_schedule_cta_calendar_google"
              type="primary"
              tag="a"
              disabled={disableSubmission}
              rootClassName={classNames('primary-button', { disabled: disableSubmission })}
              onClick={onDismiss}
              htmlAttributes={{
                href: this.getCalendarURL('gcal'),
                target: '_blank',
              }}
            >
              {_t('Add to Google Calendar')}
            </TrackedButton>
          </Box>
        </TrackedDiv>
      </div>
    );
  }
}

export default GoalSettingSetSchedule;
