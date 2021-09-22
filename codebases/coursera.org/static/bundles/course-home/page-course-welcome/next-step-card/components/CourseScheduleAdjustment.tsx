import React from 'react';

import { Box } from '@coursera/coursera-ui';

import ResetDeadlinesButton from 'bundles/course-sessions/components/ResetDeadlinesButton';
import CourseScheduleSuggestion from 'bundles/course-sessions/models/CourseScheduleSuggestion';

import { CourseScheduleAdjustmentNextStep } from 'bundles/course-home/page-course-welcome/next-step-card/types/NextStep';

import { FormattedMessage } from 'js/lib/coursera.react-intl';
import _t from 'i18n!nls/course-home';

import 'css!./__styles__/CourseScheduleAdjustment';

type Props = {
  nextStep: CourseScheduleAdjustmentNextStep;
  courseId: string;
};

const WithNoProgress: React.SFC = () => (
  <div className="flex-1 description">
    <h3 className="title">{_t('Ready to get started?')}</h3>
    <div className="body-1-text">
      {_t(`It looks you missed some important deadlines. Reset your deadlines and get started today.`)}
    </div>
  </div>
);

const WithProgress: React.SFC = () => (
  <div className="flex-1 description">
    <h3 className="title">{_t('Pick up where you left off')}</h3>
    <div className="body-1-text">
      {_t(`Don't let the great things you learned fade away! Reset your deadlines and complete
      your assignments every week.`)}
    </div>
  </div>
);

const WithSignificantProgress: React.SFC<{ progressPercentage: number }> = ({ progressPercentage }) => (
  <div className="flex-1 description">
    <h3 className="title">{_t('You can finish this time')}</h3>
    <div className="body-1-text">
      <FormattedMessage
        message={_t(`You've already completed {progressPercentage}% of your course! Reset your
        deadlines so you can finish the rest!`)}
        progressPercentage={Math.round(progressPercentage)}
      />
    </div>
  </div>
);

const WithCompleteProgress: React.SFC = () => (
  <div className="flex-1 description">
    <h3 className="title">{_t('You can finish this time')}</h3>
    <div className="body-1-text">
      <FormattedMessage
        message={_t(
          `You completed everything, but some assignments are not graded yet. Reset your deadlines so they can be graded!`
        )}
      />
    </div>
  </div>
);

const CourseScheduleAdjustment: React.SFC<Props> = (props) => {
  const {
    courseId,
    nextStep: {
      definition: { suggestion },
    },
  } = props;

  const courseScheduleSuggestion = new CourseScheduleSuggestion(suggestion);
  const { progressPercentage } = courseScheduleSuggestion;
  const hasZeroProgress = progressPercentage === 0;
  const hasSignificantProgress =
    progressPercentage !== null &&
    progressPercentage !== undefined &&
    progressPercentage > 50 &&
    progressPercentage < 100;
  const hasCompleteProgress =
    progressPercentage !== null && progressPercentage !== undefined && progressPercentage === 100;

  return (
    <div className="rc-CourseScheduleAdjustment">
      <Box
        className="next-step-content horizontal-box wrap"
        flexDirection="row"
        justifyContent="between"
        alignItems="start"
      >
        {hasZeroProgress && <WithNoProgress />}
        {!hasSignificantProgress && !hasZeroProgress && <WithProgress />}
        {progressPercentage !== null && progressPercentage !== undefined && hasSignificantProgress && (
          <WithSignificantProgress progressPercentage={progressPercentage} />
        )}
        {hasCompleteProgress && <WithCompleteProgress />}

        <ResetDeadlinesButton
          size="md"
          type="primary"
          className="reset-deadline-button"
          trackingName="sessions_v2_reset_deadlines_next_step"
          trackingData={{ progressPercentage }}
          courseId={courseId}
          courseScheduleSuggestion={courseScheduleSuggestion}
        />
      </Box>
    </div>
  );
};

export default CourseScheduleAdjustment;
