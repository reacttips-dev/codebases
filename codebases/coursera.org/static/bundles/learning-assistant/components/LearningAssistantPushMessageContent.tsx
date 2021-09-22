import React from 'react';

import type {
  AliceNonInteractiveMessageBody,
  GoalProgressMessageBody,
  LearningAssistanceMessage,
  CreateGoalMessageBody,
  LastItemInWeekCompletedMessageBody,
  CourseCompletedMessageBody,
} from 'bundles/learning-assistant/types/RealtimeMessages';

import CMLUtils from 'bundles/cml/utils/CMLUtils';
import LearningAssistantSetGoalMessage from 'bundles/learning-assistant/components/LearningAssistantSetGoalMessage';
import LearningAssistantAliceMessage from 'bundles/learning-assistant/components/LearningAssistantAliceMessage';
import GoalSettingProgressCard from 'bundles/goal-setting/components/GoalSettingProgressCard';
import LastItemInWeekCompletedMessage from 'bundles/learning-assistant/components/LastItemInWeekCompletedMessage';
import LearningAssistantCourseCompletedMessage from 'bundles/learning-assistant/components/LearningAssistantCourseCompletedMessage';

import type { GoalChoice } from 'bundles/goal-setting/types/GoalChoice';

import * as MessageTypes from 'bundles/learning-assistant/constants/messageTypes';

type Props = {
  courseId: string;
  message: LearningAssistanceMessage;
  onDismiss: () => void;
  toggleSetLearnerGoalModal: (goalChoices: GoalChoice[], branchId: string | null) => void;
};

const LearningAssistantPushMessageContent: React.SFC<Props> = ({
  courseId,
  onDismiss,
  message,
  toggleSetLearnerGoalModal,
  message: {
    messageBody: {
      messageBody,
      messageBody: { typeName },
      id: { courseBranchId },
    },
  },
}) => {
  switch (typeName) {
    case MessageTypes.ALICE_NON_INTERACTIVE_IN_COUCH_MESSAGE_TYPE: {
      const {
        definition: { title: aliceTitle, message: aliceMessage, action: aliceAction },
      } = messageBody as AliceNonInteractiveMessageBody;

      return (
        <LearningAssistantAliceMessage
          sourceMessage={message}
          onDismiss={onDismiss}
          title={aliceTitle}
          message={aliceMessage}
          action={aliceAction}
        />
      );
    }
    case MessageTypes.WEEK_COMPLETION_MESSAGE: {
      const {
        definition: { weekNumber },
      } = messageBody as LastItemInWeekCompletedMessageBody;

      return <LastItemInWeekCompletedMessage weekNumber={weekNumber} />;
    }
    case MessageTypes.CREATE_GOAL_MESSAGE_TYPE: {
      const { definition } = messageBody as CreateGoalMessageBody;

      const goalChoices = definition.goalChoices.map(({ name, description, ...choice }) => ({
        ...(choice as GoalChoice),
        name: CMLUtils.create(name),
        description: CMLUtils.create(description),
      }));

      return (
        <LearningAssistantSetGoalMessage
          goalChoices={goalChoices}
          courseId={courseId}
          onDismiss={onDismiss}
          branchId={courseBranchId}
          toggleSetLearnerGoalModal={() => toggleSetLearnerGoalModal(goalChoices, courseBranchId)}
        />
      );
    }
    case MessageTypes.GOAL_PROGRESS_MESSAGE_TYPE: {
      const {
        definition: { learnerGoal },
      } = messageBody as GoalProgressMessageBody;

      return <GoalSettingProgressCard onDismiss={onDismiss} learnerGoal={learnerGoal} />;
    }
    case MessageTypes.COURSE_COMPLETED_MESSAGE_TYPE: {
      const {
        definition: { userHasEarnedCertificate },
      } = messageBody as CourseCompletedMessageBody;
      return <LearningAssistantCourseCompletedMessage userHasEarnedCertificate={userHasEarnedCertificate} />;
    }
    default:
      return null;
  }
};

export default LearningAssistantPushMessageContent;
