import React from 'react';
import user from 'js/lib/user';
import ErrorBoundaryWithTagging from 'bundles/common/components/ErrorBoundaryWithTagging';
import ConsumerSkillPostAssessmentNotification from './ConsumerSkillPostAssessmentNotification';
import EnterpriseSkillPostAssessmentNotification from './EnterpriseSkillPostAssessmentNotification';
import SkillPostAssessmentNotificationDataState from './SkillPostAssessmentNotificationDataState';
import EnterpriseSkillPostAssesmentDataProvider from './EnterpriseSkillPostAssesmentDataProvider';
import {
  isConsumerPostAssessmentSkillChangeNotificationEnabled,
  isEnterprisePostAssessmentSkillChangeNotificationEnabled,
} from '../featureFlag';

type Props = {
  courseId: string;
  itemId: string;
};

const SkillPostAssessmentNotification = ({ courseId, itemId }: Props) => (
  <ErrorBoundaryWithTagging
    componentName="skill_post_assessment_notification"
    errorComponent={<SkillPostAssessmentNotificationDataState dataState="error" />}
  >
    <EnterpriseSkillPostAssesmentDataProvider userId={user.get().id} courseId={courseId}>
      {({ savedSkillSet, savedSkillSetProgramUrl, isEnterpriseUser, isEnterpriseUserWithSkillsEnabled, loading }) => {
        if (loading) return <SkillPostAssessmentNotificationDataState dataState="loading" />;
        if (
          isEnterpriseUser &&
          isEnterpriseUserWithSkillsEnabled &&
          isEnterprisePostAssessmentSkillChangeNotificationEnabled()
        )
          return (
            <EnterpriseSkillPostAssessmentNotification
              courseId={courseId}
              itemId={itemId}
              savedSkillSet={savedSkillSet}
              savedSkillSetProgramUrl={savedSkillSetProgramUrl}
            />
          );
        if (!isEnterpriseUser && isConsumerPostAssessmentSkillChangeNotificationEnabled())
          return <ConsumerSkillPostAssessmentNotification courseId={courseId} itemId={itemId} />;
        return null;
      }}
    </EnterpriseSkillPostAssesmentDataProvider>
  </ErrorBoundaryWithTagging>
);

export default SkillPostAssessmentNotification;
