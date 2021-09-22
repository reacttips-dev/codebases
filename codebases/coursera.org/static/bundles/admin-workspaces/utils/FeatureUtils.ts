import epicClient from 'bundles/epic/client';

// https://tools.coursera.org/epic/experiment/Xz10ALZgEeqo7pexdBh-Ig
// TODO: Remove courseId requirement
export const isUnlimitedImagesEnabledForUser = (courseId: string): boolean => {
  return epicClient.get('Workspaces', 'isUnlimitedImagesEnabled', {
    // eslint-disable-next-line camelcase
    course_id: courseId,
  });
};

// https://tools.coursera.org/epic/experiment/vufFMGTpEeuvi58p7aN9yA
export const isUnlimitedImagesEnabledForCourse = (courseId: string): boolean => {
  const courseIds: Array<string> = epicClient.get('Workspaces', 'unlimitedImagesEnabledCourseIds') || [];
  return courseIds.includes(courseId);
};

// Utility function for the above 2
export const isUnlimitedImagesEnabled = (courseId: string): boolean => {
  return isUnlimitedImagesEnabledForUser(courseId) || isUnlimitedImagesEnabledForCourse(courseId);
};

// https://tools.coursera.org/epic/experiment/1dB74OTCEeqJxFV33vBakA
export const isAdvancedLabEnabled = (courseId: string): boolean => {
  const courseIds: Array<string> = epicClient.get('Workspaces', 'highResourceLimitCourseIds') || [];
  return courseIds.includes(courseId);
};

type ResourceLimits = {
  memoryInGb: number;
  cpus: number;
};

// https://tools.coursera.org/epic/experiment/LpthQKoHEeuwB-uQmqh3AA
export const getResourceLimitsOverrides = (courseId = '*'): ResourceLimits => {
  // This value is provided as an emergency fall-back option if the EPIC lookup fails somehow,
  // and should be kept up to date with the default set in the EPIC.
  const defaultHighMemLimits: ResourceLimits = { memoryInGb: 16, cpus: 4 };

  const resourceLimitsMap: Record<string, Partial<ResourceLimits> | undefined> =
    epicClient.get('Workspaces', 'resourceLimitsOverrides') || {};

  const resourceLimits = resourceLimitsMap[courseId];

  return {
    cpus: resourceLimits?.cpus || defaultHighMemLimits.cpus,
    memoryInGb: resourceLimits?.memoryInGb || defaultHighMemLimits.memoryInGb,
  };
};

// https://tools.coursera.org/epic/experiment/9mjC8OQNEeqjrneEMZOEQw
export const isGpuLabEnabled = (courseId: string): boolean => {
  const courseIds: Array<string> = epicClient.get('Workspaces', 'gpuCourseIds') || [];
  return courseIds.includes(courseId);
};

// https://tools.coursera.org/epic/experiment/NY5JMIExEeuVrxMze-F57g
export const isLabVersioningExperimentEnabled = (courseId: string): boolean => {
  const courseIds: Record<string, boolean> = epicClient.get('Workspaces', 'isLabVersioningByCourseIds') || {};
  const isCourseDisabled = courseIds[courseId] === false;
  const isCourseEnabled = courseIds[courseId] === true;
  const isRolledOut = courseIds['*'] === true;

  return !isCourseDisabled && (isCourseEnabled || isRolledOut);
};

// https://tools.coursera.org/epic/experiment/47j_YHfaEeuVrxMze-F57g
export const isVscodeGraderAuthoringEnabledForUser = (): boolean => {
  return epicClient.get('Workspaces', 'isVscodeGraderAuthoringEnabledForUser');
};

// https://tools.coursera.org/epic/experiment/65vjUHfaEeu84W0bwg1OqA
export const isVscodeGraderAuthoringEnabledForCourse = (courseId: string): boolean => {
  const courseIds: Array<string> = epicClient.get('Workspaces', 'vscodeGraderAuthoringEnabledCourseIds') || [];
  return courseIds.includes(courseId);
};

// Utility function for the above 2
export const isVscodeGraderAuthoringEnabled = (courseId: string): boolean => {
  return isVscodeGraderAuthoringEnabledForUser() || isVscodeGraderAuthoringEnabledForCourse(courseId);
};

// https://tools.coursera.org/epic/experiment/tMBgkKa1EeuI9pNRDpopOQ
export const isDockerfileCommandsEnabledForCourse = (courseId: string): boolean => {
  const map: Record<string, boolean> = epicClient.get('Workspaces', 'isDockerfileCommandsEnabledForCourse') || {};
  const isCourseDisabled = map[courseId] === false;
  const isCourseEnabled = map[courseId] === true;
  const isRolledOut = map['*'] === true;

  return !isCourseDisabled && (isCourseEnabled || isRolledOut);
};
