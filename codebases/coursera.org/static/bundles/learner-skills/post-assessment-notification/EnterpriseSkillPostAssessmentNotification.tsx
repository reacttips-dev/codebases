import React from 'react';
import user from 'js/lib/user';
import { EnterpriseSkillsPostAssessmentData } from './EnterpriseSkillPostAssesmentDataProvider';
import SkillPostAssesmentDataProvider from './SkillPostAssesmentDataProvider';
import SkillPostAssessmentNotificationCard from './SkillPostAssessmentNotificationCard';
import EnterpriseSkillPostAssessmentNotificationCard from './EnterpriseSkillPostAssessmentNotificationCard';
import SkillPostAssessmentNotificationDataState from './SkillPostAssessmentNotificationDataState';

type Props = {
  courseId: string;
  itemId: string;
} & EnterpriseSkillsPostAssessmentData;

const EnterpriseSkillPostAssessmentNotification = ({
  courseId,
  itemId,
  savedSkillSet,
  savedSkillSetProgramUrl,
}: Props) => (
  <SkillPostAssesmentDataProvider courseId={courseId} itemId={itemId} userId={user.get().id}>
    {({ loading, error, improvements }) => {
      if (loading) return <SkillPostAssessmentNotificationDataState dataState="loading" />;
      if (error) return <SkillPostAssessmentNotificationDataState dataState="error" />;
      if (improvements.length > 0 && savedSkillSet && savedSkillSetProgramUrl)
        return (
          <EnterpriseSkillPostAssessmentNotificationCard
            savedSkillSet={savedSkillSet}
            savedSkillSetProgramUrl={savedSkillSetProgramUrl}
            improvements={improvements}
          />
        );
      if (improvements.length > 0)
        return <SkillPostAssessmentNotificationCard improvements={improvements} withSkillsLink={false} />;
      return null;
    }}
  </SkillPostAssesmentDataProvider>
);

export default EnterpriseSkillPostAssessmentNotification;
