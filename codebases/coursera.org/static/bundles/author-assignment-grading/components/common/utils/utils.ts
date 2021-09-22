/* eslint camelcase: ['error', { allow: ['course_id'] }] */

import epicClient from 'bundles/epic/client';
import type { ItemType } from 'bundles/item/types/ItemType';

export const NON_EXTRA_CREDIT_MAX_SCORE = 100;

export const EXTRA_CREDIT_MAX_SCORE = 999;

export const EXTRA_CREDIT_RUBRIC_POINTS_MULTIPLIER = 10;

/**
 * The main goal is that Partners who are currently using IRT, should not see this feature enabled, and continue to see what they currently see.
 * The partner who are not using IRT and do not have the authoringEnabled epic set for them, we don't need to worry about them since they won't be able to create one in the first place, but at the same time, anyone with the IRI_Enabled epic should be able to to see all the new features.
 * If anyone who does not have authoringEnabled epic setup, will not be able to create an IRI or IRT in the first place based on the condition on line static/bundles/author-team/components/ProjectOptionEditor.tsx:526
 * {epicClient.get('IRT', 'authoringEnabled', { course_id: courseId }) && !epicClient.get('IRT', 'IRI_Enabled') This condition is used in a few places to allow anyone with IRI_Enabled OR none of the epics (IRI_Enabled and authoringEnabled) to return false.
 * If you have authoringEnabled epic enabled and if you have IRI_Enabled this should again return false.
 * If you have just authoringEnabled epic enabled and not the IRI_Enabled this should return true (Case of partners using IRT today)
 * Happy to talk in person to explain this further if this is confusing, or you find any concerns with it.
 * Reach out to skohli
 */
export const shouldUseIRTEpic = (courseId: string) =>
  epicClient.get('IRT', 'authoringEnabled', { course_id: courseId }) && !epicClient.get('IRT', 'IRI_Enabled');

export const isResetLearnerProgressEnabled = (courseId: string, itemType: ItemType) => {
  const supportedItemTypesForResetLearnerProgress: ItemType[] = epicClient.get(
    'Flex',
    'supportedItemTypesForResetLearnerProgress',
    {
      course_id: courseId,
    }
  );
  return supportedItemTypesForResetLearnerProgress.includes(itemType);
};

/**
 * Enable extra credit in quiz questions and grade override.
 */
export const enableExtraCredit = (courseId: string) => {
  return epicClient.get('Authoring', 'enableQuizExtraCredit', { course_id: courseId });
};

/**
 * Max assignment grade depending on extra credit enabled or not.
 */
export const maxScore = (courseId: string) => {
  return enableExtraCredit(courseId) ? EXTRA_CREDIT_MAX_SCORE : NON_EXTRA_CREDIT_MAX_SCORE;
};
