import React from 'react';

import { View, Box } from '@coursera/coursera-ui';
import { SvgHelp } from '@coursera/coursera-ui/svg';

import TrackedButton from 'bundles/page/components/TrackedButton';
import ResetDeadlineHowItWorksModal from 'bundles/course-notifications-v2/components/global/ResetDeadlineHowItWorksModal';
import ResetDeadlinesButton from 'bundles/course-sessions/components/ResetDeadlinesButton';
import CourseScheduleSuggestion from 'bundles/course-sessions/models/CourseScheduleSuggestion';

import { CourseScheduleAdjustmentNotification as CourseScheduleAdjustmentNotificationType } from 'bundles/course-notifications-v2/types/CourseNotification';

import _t from 'i18n!nls/course-notifications-v2';

import 'css!./__styles__/CourseScheduleAdjustmentNotification';

type Props = {
  notification: CourseScheduleAdjustmentNotificationType;
};

type State = {
  showHowItWorksModal: boolean;
};

class CourseScheduleAdjustmentNotification extends React.Component<Props, State> {
  state: State = {
    showHowItWorksModal: false,
  };

  toggleHowItWorksModal = () => {
    this.setState(({ showHowItWorksModal }) => ({ showHowItWorksModal: !showHowItWorksModal }));
  };

  render() {
    const {
      notification: {
        definition: { courseId, suggestion, isCoursePassed },
      },
    } = this.props;
    const { showHowItWorksModal } = this.state;
    const courseScheduleSuggestion = new CourseScheduleSuggestion(suggestion);
    const { progressPercentage } = courseScheduleSuggestion;

    if (courseScheduleSuggestion.isNoSuggestion) {
      return null;
    }

    // check for progressPercentage nullity and break out
    if (progressPercentage === null || progressPercentage === undefined) {
      return null;
    }

    let notificationString: string;

    if (isCoursePassed) {
      notificationString = _t(
        `You’ve successfully completed the course! To access up-to-date course material, please reset your deadlines.`
      );
    } else if (progressPercentage === 0) {
      notificationString = _t(
        `It looks you missed some important deadlines. Reset your deadlines and get started today.`
      );
    } else if (progressPercentage > 0 && progressPercentage < 100) {
      notificationString = _t(`You can reset your deadline to submit overdue assignments`);
    } else {
      notificationString = _t(
        `You completed everything, but some assignments are not graded yet. Reset your deadlines so they can be graded!`
      );
    }

    return (
      <div className="rc-CourseScheduleAdjustmentNotification">
        <Box rootClassName="reset-deadline-top-banner">
          <div className="banner-text">
            <Box rootClassName="banner-text-header">
              <h2 className="header-text">{_t('Reset deadlines')}</h2>
              <Box rootClassName="how-it-works-container">
                <SvgHelp size={18} color="#2B71CE" />
                <TrackedButton
                  trackingName="reset_deadline_how_it_works"
                  className="how-it-works"
                  onClick={this.toggleHowItWorksModal}
                >
                  {_t('How it works')}
                </TrackedButton>
                {showHowItWorksModal && <ResetDeadlineHowItWorksModal closeModalHandler={this.toggleHowItWorksModal} />}
              </Box>
            </Box>
            <div className="banner-text-body">
              <View>{notificationString}</View>
            </div>
          </div>

          <ResetDeadlinesButton
            size="sm"
            type="primary"
            className="banner-reset-deadline-button"
            trackingName="sessions_v2_reset_deadlines"
            trackingData={{ progressPercentage }}
            courseId={courseId}
            courseScheduleSuggestion={courseScheduleSuggestion}
          />
        </Box>
      </div>
    );
  }
}

export default CourseScheduleAdjustmentNotification;
