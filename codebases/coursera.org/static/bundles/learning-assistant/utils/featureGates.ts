/* eslint-disable camelcase */
import epic from 'bundles/epic/client';

/* eslint-disable @typescript-eslint/no-unused-vars */
export const isLearningAssistantEnabled = (courseId: string) => {
  return (
    epic.get('learnerRedPandas', 'learningAssistantFullRolloutEnabled', { course_id: courseId }) ||
    epic.get('learnerRedPandas', 'learningAssistantEnterpriseABTestEnabled', { course_id: courseId }) ||
    epic.get('Flex', 'learningAssistantEnabled', { course_id: courseId })
  );
};

export const isGoalSettingDisabled = (courseId: string) => {
  return epic.get('Flex', 'is_excluded_from_goal_setting', { course_id: courseId });
};

export const isFullGoalSettingCardEnabled = (courseId: string) => {
  return epic.get('learnerRedPandas', 'assistantGoalCardEnabled', { course_id: courseId });
};
