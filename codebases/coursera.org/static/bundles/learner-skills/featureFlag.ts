import epic from 'bundles/epic/client';

/*
 * This file includes utilities for checking whether specific features under
 * the Skills umbrella are available based on simple conditions.
 *
 * Generally, Epic works well, but when we want to mix-and-match features
 * between different experiments we need some small boolean logic on top of the
 * experiment parameters for feature flagging.
 *
 * Consider:
 *  Skills Profile BETA (Account Profile) -> 1 Experiment Parameter
 *  Skills Profile A/B Test (Logged-in Home) -> 1 Experiment Parameter
 *
 *  How do we share a post assessment notification between both experiments?
 *  We need to check with boolean logic if they're in either experiment.
 */

export const isLoggedInHomeSkillsProfileEnabled = () => {
  return (
    epic.get('Skills', 'lidbSkillsProfileEnabled') ||
    epic.get('Skills', 'lidbSkillsIncrementalUser') ||
    epic.get('Skills', 'roleCentricSkillsProfileEnabled')
  );
};

export const isRoleCentricSkillsProfileEnabled = () => {
  return epic.get('Skills', 'roleCentricSkillsProfileEnabled');
};

export const isConsumerPostAssessmentSkillChangeNotificationEnabled = () => {
  return (
    epic.get('Skills', 'lidbSkillsProfileEnabled') ||
    epic.get('Skills', 'lidbSkillsIncrementalUser') ||
    epic.get('Skills', 'roleCentricSkillsProfileEnabled')
  );
};

export const isEnterprisePostAssessmentSkillChangeNotificationEnabled = () => {
  return epic.get('Enterprise', 'enablePostAssesmentSkills');
};

export const isPostAssessmentSkillChangeNotificationEnabled = () => {
  return (
    isConsumerPostAssessmentSkillChangeNotificationEnabled() ||
    isEnterprisePostAssessmentSkillChangeNotificationEnabled()
  );
};
