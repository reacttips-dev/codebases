import epicClient from 'bundles/epic/client';
import type { LabSandboxConfiguration } from 'bundles/item-workspace/types/LabSandbox';

// https://tools.coursera.org/epic/experiment/lgF3QLYfEei9CS-VH6MyBw
export const areWorkspaceItemsEnabled = (): boolean => {
  return epicClient.get('Workspaces', 'areWorkspaceItemsEnabled');
};

// https://tools.coursera.org/epic/experiment/kzM9UKfaEeuInmG6gV2Kwg
export const getLabSandboxConfigurationForCourse = (courseId: string): LabSandboxConfiguration | undefined => {
  const configMap: Record<string, LabSandboxConfiguration> = epicClient.get(
    'Workspaces',
    'labSandboxCourseConfiguration'
  );

  if (!configMap) {
    return undefined;
  }

  return {
    // Apply defaults.
    computerLanguagesAreProgrammingLanguages: true,
    ...configMap[courseId],
  };
};

// https://tools.coursera.org/epic/experiment/kzM9UKfaEeuInmG6gV2Kwg
export const isLabSandboxEnabledForCourse = (courseId: string, branchId?: string): boolean => {
  const config = getLabSandboxConfigurationForCourse(courseId);
  const configExists = !!config;
  const branchIsExcluded = !!(branchId && config?.excludeBranchIds?.includes(branchId));
  return configExists && !branchIsExcluded;
};

// https://tools.coursera.org/epic/experiment/kzM9UKfaEeuInmG6gV2Kwg
export const isLabSandboxEnabledForItemInCourse = (courseId: string, itemId: string): boolean => {
  const config = getLabSandboxConfigurationForCourse(courseId);
  return !!config?.itemIds?.includes(itemId);
};

// https://tools.coursera.org/epic/experiment/J3g9gKfbEeu08e8jYy9rrw
export const isLabSandboxEnabledForPaidLearner = (courseId: string): boolean => {
  return epicClient.get('Workspaces', 'isLabSandboxEnabledForPaidLearner', {
    // eslint-disable-next-line camelcase
    course_id: courseId,
  });
};

// https://tools.coursera.org/epic/experiment/g7kvAKfbEeu08e8jYy9rrw
export const isLabSandboxEnabledForFreeTrialLearner = (courseId: string): boolean => {
  return epicClient.get('Workspaces', 'isLabSandboxEnabledForFreeTrialLearner', {
    // eslint-disable-next-line camelcase
    course_id: courseId,
  });
};
