import _t from 'i18n!nls/onboarding-2018';
import keysToConstants from 'js/lib/keysToConstants';

export const TIMEOUT_TO_TEST_ONBOARDING_ENROLLMENT_EXPERIMENT_RACE_CONDITION = 2000;
export const CAREER_GOAL_TYPE = 'career-goal';

export const workCheckboxId = 'trackedEmployerCheckbox';
export const educationCheckboxId = 'trackedActiveUniversityCheckbox';

export const ONBOARDING_MODAL_VIEW_EVENT_ID = 'dashboardEventKey~LAST_PROFILE_COMPLETION_MODAL_VIEW';

export const PROFILE_COMPLETER_FOR_EXISTING_USERS_COOKIE = 'profileCompleterForExistingUsers';

type CheckboxDataObject = {
  labelText: string;
  checkboxId: string;
  trackingName: string;
  ariaLabel: string;
  name: string;
};

export const getWorkCheckboxData = (): CheckboxDataObject => ({
  labelText: _t('Is it your current employer?'),
  checkboxId: workCheckboxId,
  trackingName: 'current_employer_checkbox',
  ariaLabel: _t('By checking this box, I am confirming that the employer listed above is my current employer.'),
  name: 'is_current_employer',
});

export const getEducationCheckboxData = (): CheckboxDataObject => ({
  labelText: _t('Are you currently a student?'),
  checkboxId: educationCheckboxId,
  trackingName: 'current_student_checkbox',
  ariaLabel: _t('By checking this box, I am confirming that I am currently enrolled at the institution listed above.'),
  name: 'is_current_student',
});

// constants below are from onboarding 2017

const majorChoices = () => [
  _t('Business'),
  _t('Computer Science'),
  _t('Engineering'),
  _t('Mathematics and Statistics'),
  _t('Physical Sciences'),
  _t('Biological Sciences'),
  _t('Health Professions'),
  _t('Legal Professions'),
  _t('Education'),
  _t('Social Sciences'),
  _t('Arts and Humanities'),
  _t('Other'),
  _t('NA'),
];

const screens = [
  'goals',
  'futureCareer',
  'futureSkills',
  'futureDegrees',
  'currentCareer',
  'currentEducation',
  'demographics',
  'finish',
];

const screenNames = keysToConstants(screens);

const USER_INTENTIONS = keysToConstants(['ADVANCE_CAREER', 'BEGIN_CAREER', 'LIFELONG_LEARNING', 'EARN_DEGREE']);

const CUSTOM_OCCUPATION_ENTRY_TYPES = {
  DEFINED: 'OccupationId',
  USER_GENERATED: 'UserGeneratedOccupation',
};

const CUSTOM_INDUSTRY_ENTRY_TYPES = {
  DEFINED: 'IndustryId',
  USER_GENERATED: 'UserGeneratedIndustry',
};

const CUSTOM_DEGREE_ENTRY_TYPES = {
  DEFINED: 'degreeId',
  USER_GENERATED: 'userInputDegree',
};

const ONBOARDING_TYPES = {
  ADD_ANOTHER_GOAL: 'ADD_ANOTHER_GOAL',
};

// TODO: this function is not used anywhere
const getOnboardingWelcomeText = (onboardingType: string) => {
  switch (onboardingType) {
    case 'ADD_ANOTHER_GOAL':
      return _t("We're here to help you add a new goal. Tell us what you'd like to achieve:");
    default:
      return _t("We're here to help you learn, grow, and succeed. Tell us what you'd like to achieve:");
  }
};

const PLP_ONBOARDING_URL = '/user-onboarding';

const PLP_ONBOARDING_VERSION = 'PLP_V1';
const DEGREE_ONBOARDING_VERSION = 'DEGREES_ONLY';

const exported = {
  TIMEOUT_TO_TEST_ONBOARDING_ENROLLMENT_EXPERIMENT_RACE_CONDITION,
  CAREER_GOAL_TYPE,
  workCheckboxId,
  educationCheckboxId,
  ONBOARDING_MODAL_VIEW_EVENT_ID,
  PROFILE_COMPLETER_FOR_EXISTING_USERS_COOKIE,
  getWorkCheckboxData,
  getEducationCheckboxData,
  USER_INTENTIONS,
  CUSTOM_OCCUPATION_ENTRY_TYPES,
  CUSTOM_INDUSTRY_ENTRY_TYPES,
  CUSTOM_DEGREE_ENTRY_TYPES,
  MAXIMUM_SELECTED_DOMAINS: 3,
  MAXIMUM_SELECTED_SUBDOMAINS: 3,
  screens,
  screenNames,
  getOnboardingWelcomeText,
  ONBOARDING_TYPES,
  PLP_ONBOARDING_URL,
  majorChoices,
  PLP_ONBOARDING_VERSION,
  DEGREE_ONBOARDING_VERSION,
};

export default exported;
export {
  USER_INTENTIONS,
  CUSTOM_OCCUPATION_ENTRY_TYPES,
  CUSTOM_INDUSTRY_ENTRY_TYPES,
  CUSTOM_DEGREE_ENTRY_TYPES,
  screens,
  screenNames,
  getOnboardingWelcomeText,
  ONBOARDING_TYPES,
  PLP_ONBOARDING_URL,
  majorChoices,
  PLP_ONBOARDING_VERSION,
  DEGREE_ONBOARDING_VERSION,
};

export const { MAXIMUM_SELECTED_DOMAINS, MAXIMUM_SELECTED_SUBDOMAINS } = exported;
