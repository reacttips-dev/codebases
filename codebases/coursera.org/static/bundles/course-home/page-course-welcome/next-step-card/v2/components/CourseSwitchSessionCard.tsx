import React from 'react';

import { SwitchSessionNextSteps } from 'bundles/course-home/page-course-welcome/next-step-card/v2/types';

import CourseCard, {
  Title,
  Message,
  Content,
} from 'bundles/course-home/page-course-welcome/next-step-card/v2/components/CourseCard';

import SessionSwitchButton from 'bundles/course-sessions/components/cds/SessionSwitchButton';
import getSwitchSessionMessage from 'bundles/course-home/page-course-welcome/next-step-card/v2/utils/getSwitchSessionMessage';
import withSessionLabel, { SessionLabel } from 'bundles/course-sessions/utils/withSessionLabel';

type InputProps = {
  courseId: string;
  courseNextStep: SwitchSessionNextSteps;
};

type Props = InputProps & {
  sessionLabel: SessionLabel;
};

export const CourseSwitchSessionCard: React.SFC<Props> = ({ sessionLabel, courseId, courseNextStep }) => {
  const payload = getSwitchSessionMessage(courseNextStep, sessionLabel);

  const { title, message } = payload;

  return (
    <CourseCard>
      <Content>
        <Title>{title}</Title>
        <Message>{message}</Message>
      </Content>
      <SessionSwitchButton size="sm" courseId={courseId} />
    </CourseCard>
  );
};

export default withSessionLabel(CourseSwitchSessionCard);
