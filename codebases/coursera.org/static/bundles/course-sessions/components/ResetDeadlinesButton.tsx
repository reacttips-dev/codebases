import React from 'react';

import user from 'js/lib/user';
import withSingleTracked from 'bundles/common/components/withSingleTracked';
import CourseScheduleSuggestion from 'bundles/course-sessions/models/CourseScheduleSuggestion';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import LearnerCourseSchedulesAPIUtils from 'bundles/course-sessions/utils/LearnerCourseSchedulesAPIUtils';

import ConfirmVersionChangesModal from 'bundles/course-sessions/components/ConfirmVersionChangesModal';
import AdjustingDeadlinesModal from 'bundles/course-sessions/components/AdjustingDeadlinesModal';

import { Button, ButtonSize, ButtonType } from '@coursera/coursera-ui';

import _t from 'i18n!nls/course-sessions';

import 'css!./__styles__/ResetDeadlinesButton';

import 'css!./__styles__/BranchSwitchInfo';

const TrackedButton = withSingleTracked({ type: 'BUTTON' })(Button);

type Props = {
  isThemeDark?: boolean;
  trackingName: string;
  className?: string;
  style?: { [styleAttr: string]: string | number };
  type: ButtonType;
  size: ButtonSize;
  trackingData: any;
  courseId: string;
  courseScheduleSuggestion: CourseScheduleSuggestion;
};

type State = {
  showConfirmVersionChangesModal: boolean;
  isAdjustingSchedule: boolean;
  adjustScheduleError: boolean;
};

export default class ResetDeadlinesButton extends React.Component<Props, State> {
  state = {
    showConfirmVersionChangesModal: false,
    isAdjustingSchedule: false,
    adjustScheduleError: false,
  };

  handleClose = () => {
    this.setState({ showConfirmVersionChangesModal: false, adjustScheduleError: false, isAdjustingSchedule: false });
  };

  handleConfirm = () => {
    this.setState({ showConfirmVersionChangesModal: false });
    this.adjustSchedule();
  };

  onResetDeadlinesClick = () => {
    const { courseScheduleSuggestion } = this.props;
    if (!courseScheduleSuggestion.hasVersionChangeForShiftDeadlinesSuggestion()) {
      this.adjustSchedule();
    } else {
      this.setState({ showConfirmVersionChangesModal: true });
    }
  };

  adjustSchedule = () => {
    const { courseId, courseScheduleSuggestion } = this.props;
    const { days } = courseScheduleSuggestion;

    this.setState({ isAdjustingSchedule: true });

    LearnerCourseSchedulesAPIUtils.adjustSchedule(user.get().id, courseId, days)
      .then(() => {
        window.location.reload();
      })
      .catch(() => {
        this.setState({ isAdjustingSchedule: false, adjustScheduleError: true, showConfirmVersionChangesModal: false });
      });
  };

  render() {
    const {
      isThemeDark,
      trackingName,
      className,
      style,
      type,
      size,
      trackingData,
      courseScheduleSuggestion,
      courseId,
    } = this.props;
    const { showConfirmVersionChangesModal, isAdjustingSchedule, adjustScheduleError } = this.state;

    const showAdjustingDeadlinesModal = isAdjustingSchedule || adjustScheduleError;

    const changesDescription = courseScheduleSuggestion.changesDescriptionForShiftDeadlinesSuggestion;

    return (
      <div className="rc-ResetDeadlinesButton">
        {showConfirmVersionChangesModal && (
          <ConfirmVersionChangesModal
            handleConfirm={this.handleConfirm}
            handleClose={this.handleClose}
            changesDescription={changesDescription}
            courseId={courseId}
          />
        )}

        {showAdjustingDeadlinesModal && (
          <AdjustingDeadlinesModal
            isAdjustingSchedule={isAdjustingSchedule}
            adjustScheduleError={adjustScheduleError}
            handleClose={this.handleClose}
          />
        )}

        <TrackedButton
          isThemeDark={isThemeDark}
          type={type}
          size={size}
          onClick={this.onResetDeadlinesClick}
          trackingName={trackingName}
          trackingData={trackingData}
          // @ts-expect-error TODO: property `className` does not exist on 'Button'. It should be `rootClassName`
          className={className}
          style={style}
          rootClassName={className}
          label={_t('Reset my deadlines')}
        />
      </div>
    );
  }
}
