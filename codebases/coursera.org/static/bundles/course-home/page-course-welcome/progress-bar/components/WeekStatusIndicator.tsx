/* eslint-disable react/no-string-refs */
import React from 'react';
import DateTimeUtils from 'js/utils/DateTimeUtils';
import classNames from 'classnames';

import { Week } from 'bundles/course-v2/types/Week';
import { getGradableItemsWithoutHonors } from 'bundles/course-v2/utils/Week';

import ItemStatus from 'bundles/course-home/page-course-welcome/progress-bar/components/ItemStatus';
import CalendarIcon from 'bundles/course-home/page-course-welcome/progress-bar/components/CalendarIcon';

import { compose } from 'recompose';
import _t from 'i18n!nls/course-home';
import { FormattedMessage } from 'js/lib/coursera.react-intl';

import withCustomLabelsByUserAndCourse from 'bundles/custom-labels/hoc/withCustomLabelsByUserAndCourse';
import { ReplaceCustomContent as ReplaceCustomContentType } from 'bundles/custom-labels/types/CustomLabels';

import 'css!./__styles__/WeekStatusIndicator';

type InputProps = {
  courseId: string;
  weekNumber: number;

  week?: Week;
  weekDeadline?: number | string;

  sessionsV2Enabled?: boolean;
};

type Props = InputProps & {
  replaceCustomContent: ReplaceCustomContentType;
};

class WeekStatusIndicator extends React.Component<Props> {
  getWeekStatusId() {
    const { courseId, weekNumber } = this.props;
    return `course_${courseId}_${weekNumber}`;
  }

  showTooltip = (evt) => {
    // Get the target's position to place the tooltip appropriately.
    const targetDims = evt.target.getBoundingClientRect();
    const top = targetDims.top + (document.documentElement.scrollTop || document.body.scrollTop);
    const tooltipContents = this.refs.tooltipContents as HTMLElement;
    tooltipContents.style.display = 'block';

    // Hide it until we can determine its height to position it correctly.
    tooltipContents.style.visibility = 'hidden';
    tooltipContents.style.position = 'absolute';
    tooltipContents.setAttribute('id', this.getWeekStatusId());

    document.body.appendChild(tooltipContents);
    const topLeeway = 8;
    const leftLeeway = 6;

    // Get the height and width of tooltip to position it correctly.
    const tooltipDims = tooltipContents.getBoundingClientRect();
    tooltipContents.style.top = `${top - tooltipDims.height - topLeeway}px`;
    tooltipContents.style.left = `${targetDims.left - tooltipDims.width / 2 + leftLeeway}px`;

    // Styles are computed, set it to visible.
    tooltipContents.style.visibility = 'visible';
  };

  hideTooltip = () => {
    const tooltip = document.body.querySelector(`#${this.getWeekStatusId()}`);

    if (tooltip) {
      document.body.removeChild(tooltip);
    }
  };

  render() {
    const { courseId, weekNumber, weekDeadline, week, sessionsV2Enabled, replaceCustomContent } = this.props;

    const previousWeekCompleted = week?.previousWeekStatus === 'COMPLETED' || !week?.previousWeekStatus;
    const weekCompleted = week?.weekStatus === 'COMPLETED' || !week?.weekStatus;
    const classes = classNames([
      'rc-WeekStatusIndicator',
      'vertical-box',
      { 'prev-week-completed': previousWeekCompleted },
      { 'week-completed': weekCompleted },
    ]);

    if (weekNumber === 0) {
      return (
        <div className={classes}>
          <div className="completed" />
          <div className="label">
            {!sessionsV2Enabled && (
              <FormattedMessage
                message={_t('Start {weekDate}')}
                // @ts-expect-error TODO: weekDeadline can't be undefined
                weekDate={DateTimeUtils.formatDateTimeDisplay(weekDeadline, DateTimeUtils.DAY_AND_MONTH)}
              />
            )}

            {sessionsV2Enabled && _t('Start')}
          </div>
        </div>
      );
    }

    if (weekNumber === -1) {
      // If we show progress bar for completed course this needs to be changed to completed
      return (
        <div className={classes}>
          <div className="ontrack" />
          <div className="label">
            <FormattedMessage
              message={_t('End {weekDate}')}
              // @ts-expect-error TODO: weekDeadline can't be undefined
              weekDate={DateTimeUtils.formatDateTimeDisplay(weekDeadline, DateTimeUtils.DAY_AND_MONTH)}
            />
          </div>
        </div>
      );
    }

    if (!week) {
      return null;
    }

    const gradableItemsWithoutHonors = getGradableItemsWithoutHonors(week);

    return (
      <div className={classes} onMouseOut={this.hideTooltip} onBlur={this.hideTooltip}>
        <div className={week.weekStatus.toLowerCase()} onMouseOver={this.showTooltip} onFocus={this.showTooltip} />

        <div className="label">
          {replaceCustomContent(_t('{capitalizedWeekWithNumber}'), { weekNumber })}
          {week.isCurrentWeekBySchedule && <CalendarIcon />}
        </div>

        <div ref="tooltipContents" className="gle-tooltip-contents" style={{ display: 'none' }}>
          <div className="item-status-tooltip">
            <div className="caption-text">
              <FormattedMessage
                message={gradableItemsWithoutHonors.length > 0 ? _t('Due {deadline}') : _t('No assignments due')}
                deadline={DateTimeUtils.momentWithUserTimezone(week.deadline).format('MMM DD')}
              />
            </div>

            <ul className="nostyle">
              {gradableItemsWithoutHonors.map((item) => (
                <ItemStatus key={item.id} item={item} courseId={courseId} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default compose<Props, InputProps>(withCustomLabelsByUserAndCourse)(WeekStatusIndicator);
