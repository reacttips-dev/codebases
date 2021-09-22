import {
  isLabSandboxEnabledForCourse,
  isLabSandboxEnabledForItemInCourse,
  isLabSandboxEnabledForPaidLearner,
  isLabSandboxEnabledForFreeTrialLearner,
} from 'bundles/item-workspace/utils/FeatureUtils';
import _t from 'i18n!nls/labs-common';

export const LAB_SANDBOX_PATH_PART_NAME = 'lab-sandbox';

export const getLabSandboxUrl = (courseSlug: string): string => {
  return `/learn/${courseSlug}/${LAB_SANDBOX_PATH_PART_NAME}`;
};

export const canUserAccessLabSandboxForCourseOrItem = (
  courseId: string,
  courseBranchId: string | undefined,
  itemId: string | undefined,
  ownsCourse: boolean,
  isFreeTrial: boolean | undefined
): boolean => {
  // First check to make sure this course is part of the experiment.
  if (!isLabSandboxEnabledForCourse(courseId, courseBranchId)) {
    // Lab Sandbox is not enabled for this course.
    return false;
  } else if (itemId && !isLabSandboxEnabledForItemInCourse(courseId, itemId)) {
    // This is being displayed on an item page, but Lab Sandbox is not enabled for this item.
    return false;
  }

  // Next, make sure this learner is part of the experiment based on their status in the course.
  if (isFreeTrial) {
    return isLabSandboxEnabledForFreeTrialLearner(courseId);
  } else if (ownsCourse) {
    return isLabSandboxEnabledForPaidLearner(courseId);
    // TODO(wbowers): Consult Jaya about this. Should this be "paid learners" or "not free trial learners"?
  } else {
    // Audit learners do not see the lab sandbox.
    return false;
  }

  return true;
};

// TODO(wbowers): This will be swapped out as soon as a standard way of formatting
// lists is discovered.
//
// I couldn't use https://formatjs.io/docs/react-intl/api/#formatlist because our version of
// react-intl doesn't have it.
//
// I couldn't use Intl.ListFormat because Intl doesn't export 'ListFormat'. Perhaps our types
// are outdated?
//
// @deprecated
export const formatLanguages = (languages: Array<string>): string => {
  if (languages.length === 0) {
    return '';
  } else if (languages.length === 1) {
    // e.g. "JavaScript"
    return languages[0];
  } else if (languages.length === 2) {
    // e.g. "HTML and JavaScript"
    return _t('#{firstItem} and #{secondItem}', {
      firstItem: languages[0],
      secondItem: languages[1],
    });
  } else {
    const initialItems = languages.slice(0, languages.length - 1);
    const lastItem = languages[languages.length - 1];

    // e.g. HTML, CSS, and JavaScript
    return _t('#{initialItems}, and #{lastItem}', {
      initialItems: initialItems.join(', '),
      lastItem,
    });
  }
};

export const getLanguagesSpec = (
  languages: Array<string> | undefined,
  languagesAreProgrammingLanguages: boolean | undefined
): string => {
  // When there's nothing to show, just say "programming", e.g.:
  // "Easily launch Coursera's preconfigured environment for programming"
  const defaultValue = _t('programming');

  if (!languages?.length) {
    return defaultValue;
  }

  // TODO(wbowers): Figure out a better way to do this and add a recipe for it.
  // React-Intl's formatList has limited browser support:
  // https://formatjs.io/docs/react-intl/api/#formatlist
  const languagesListString = formatLanguages(languages);

  if (!languagesAreProgrammingLanguages) {
    // These aren't considered "programming" languages, so list the languages without the word "programming", e.g.:
    // "Easily launch Coursera's preconfigured environment for HTML and CSS"
    return languagesListString;
  }

  // These are considered "programming" languages. For example:
  // "Easily launch Coursera's preconfigured environment for HTML and CSS programming"
  return _t('#{languages} programming', { languages: languagesListString });
};
