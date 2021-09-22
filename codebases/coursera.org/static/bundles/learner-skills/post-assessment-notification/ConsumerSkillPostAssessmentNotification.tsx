import React from 'react';
import user from 'js/lib/user';
import SkillPostAssesmentDataProvider from './SkillPostAssesmentDataProvider';
import SkillPostAssessmentNotificationCard from './SkillPostAssessmentNotificationCard';
import SkillPostAssessmentNotificationDataState from './SkillPostAssessmentNotificationDataState';

type Props = {
  courseId: string;
  itemId: string;
};

const ConsumerSkillPostAssessmentNotification = ({ courseId, itemId }: Props) => (
  <SkillPostAssesmentDataProvider courseId={courseId} itemId={itemId} userId={user.get().id}>
    {({ loading, error, improvements }) => {
      if (loading) return <SkillPostAssessmentNotificationDataState dataState="loading" />;
      if (error) return <SkillPostAssessmentNotificationDataState dataState="error" />;
      if (improvements.length > 0) return <SkillPostAssessmentNotificationCard improvements={improvements} />;
      return null;
    }}
  </SkillPostAssesmentDataProvider>
);

export default ConsumerSkillPostAssessmentNotification;
