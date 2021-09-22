import React from 'react';

import {
  Extension,
  NoSuggestion,
  LearnerCourseScheduleSuggestion,
  CourseNextStepCourseScheduleAdjustmentNextStep,
} from 'bundles/naptimejs/resources/__generated__/GuidedCourseNextStepsV1';

import CourseCard, {
  Title,
  Message,
  Content,
} from 'bundles/course-home/page-course-welcome/next-step-card/v2/components/CourseCard';

import ResetDeadlinesButton from 'bundles/course-sessions/components/cds/ResetDeadlinesButton';
import getResetDeadlinesMessage from 'bundles/course-home/page-course-welcome/next-step-card/v2/utils/getResetDeadlinesMessage';
import CourseScheduleSuggestion from 'bundles/course-sessions/models/CourseScheduleSuggestion';

const convertSuggestion = (suggestion: LearnerCourseScheduleSuggestion): CourseScheduleSuggestion => {
  // For some reason, the API inserts this additional field above the extension data
  // The Naptime types generator doesn't seem to pick up on it, so we need to use any here to access it
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ext = (suggestion as any)?.orgCourseraOndemandScheduleSuggestionExtension;

  if (!ext?.sessionSwitch) {
    return new CourseScheduleSuggestion({
      'org.coursera.ondemand.schedule.NoSuggestion': {
        ...suggestion,
        ...(ext as NoSuggestion),
      },
    });
  } else {
    return new CourseScheduleSuggestion({
      'org.coursera.ondemand.schedule.Extension': {
        ...suggestion,
        ...(ext as Extension),
      },
    });
  }
};

type Props = {
  courseId: string;
  courseScheduleAdjustment: CourseNextStepCourseScheduleAdjustmentNextStep;
};

const CourseResetDeadlinesCard: React.SFC<Props> = ({
  courseId,
  courseScheduleAdjustment: {
    definition: { suggestion },
  },
}) => {
  const scheduleSuggestion = convertSuggestion(suggestion);
  const progress = (suggestion as Extension)?.progressPercentage ?? 0;

  const { title, message } = getResetDeadlinesMessage(progress);

  return (
    <CourseCard>
      <Content>
        <Title>{title}</Title>
        <Message>{message}</Message>
      </Content>
      <ResetDeadlinesButton
        size="small"
        variant="primary"
        className="card-cta"
        trackingName="sessions_v2_reset_deadlines_next_step"
        trackingData={{ progressPercentage: progress }}
        courseId={courseId}
        courseScheduleSuggestion={scheduleSuggestion}
      />
    </CourseCard>
  );
};

export default CourseResetDeadlinesCard;
