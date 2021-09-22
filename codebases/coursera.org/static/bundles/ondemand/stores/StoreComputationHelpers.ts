/**
 * Warning: This module is deprecated.
 *
 * This file exists as the result of a refactoring to remove inter-store dependencies from
 * CourseScheduleStore - which has made things easier to understand as consumers of this
 * data now indicate all of their dependencies rather than a subset.
 *
 * Unfortunately allowing for inter-store dependencies in the past hid a design modeling
 * problem with our models that should be addressed when there is time for a modeling redesign.
 *
 * If you are building a big feature on top of Scheduling / Progress - consider first the option
 * of moving a significant amount of this logic to a backend somewhere.
 */

// Not going to fix these
/* eslint-disable no-use-before-define */

import _ from 'lodash';
import moment from 'moment';

import deadlineFormatter from 'bundles/ondemand/utils/deadlineFormatter';
import keysToConstants from 'js/lib/keysToConstants';

import type S12nStore from 'bundles/ondemand/stores/S12nStore';
import type CourseViewGradeStore from 'bundles/ondemand/stores/CourseViewGradeStore';
import type CourseMembershipStore from 'bundles/ondemand/stores/CourseMembershipStore';
import type CourseStore from 'bundles/ondemand/stores/CourseStore';
import type { CourseScheduleStore, ModuleDeadline } from 'bundles/ondemand/stores/CourseScheduleStore';
import type VerificationStore from 'bundles/ondemand/stores/VerificationStore';
import type ProgressStore from 'bundles/ondemand/stores/ProgressStore';
import { removeNullableValues } from 'js/utils/removeNullableValues';

// TODO: Migrate off of Backbone
// eslint-disable-next-line no-restricted-imports
import type ItemMetadata from 'pages/open-course/common/models/itemMetadata';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import type Module from 'pages/open-course/common/models/module';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import type Lesson from 'pages/open-course/common/models/lesson';

import type { TrackId } from 'pages/open-course/common/models/tracks';
import type { ItemDeadlineProgress } from 'bundles/learner-progress/types/Item';

const deadlinesStatus = keysToConstants([
  'DEADLINES_ENABLED',
  'DEADLINES_DISABLED',
  'INELIGIBLE_FOR_DEADLINES',
  'ITEM_DEADLINES_ENABLED',
]);

const deadlineProgresses = keysToConstants(['COMPLETE', 'UPCOMING', 'OVERDUE']);

/**
 * @returns bool True if the current course is a capstone and the user is not eligible OR has not paid for
 *   the course yet. Used to determine whether to restrict access to capstone materials.
 */
export const isRestrictedCapstone = (
  s12nStore: S12nStore,
  courseMembershipStore: CourseMembershipStore,
  courseId: string
) => {
  const s12n = s12nStore.getS12n();

  if (s12n) {
    return (
      !courseMembershipStore.isEnrolled() &&
      !!(s12n.isCapstone(courseId) && !(s12n.isEligibleForCapstone() && s12n.ownsCapstone()))
    );
  } else {
    return false;
  }
};

// TODO: Improve return type.
export const getModulesForWeek = (
  courseStore: CourseStore,
  courseScheduleStore: CourseScheduleStore,
  week: number
): Array<Module> => {
  return _.compact(courseScheduleStore.getModuleIdsForWeek(week).map((moduleId) => courseStore.getModule(moduleId)));
};

export const isWeekGradable = function (
  courseStore: CourseStore,
  courseScheduleStore: CourseScheduleStore,
  week: number
): boolean {
  return helpers
    .getModulesForWeek(courseStore, courseScheduleStore, week)
    .some((module: Module) => module.getGradables().length);
};

export const getWeeksBehind = function (
  courseStore: CourseStore,
  courseScheduleStore: CourseScheduleStore,
  progressStore: ProgressStore
): number {
  const weeks = Object.keys(courseScheduleStore.getSchedule().weekMap);
  const overdueWeeks = weeks
    .map((weekString) => parseInt(weekString, 10))
    .filter((weekNumber) => helpers.isWeekGradable(courseStore, courseScheduleStore, weekNumber))
    .map((weekNumber) =>
      helpers.getDeadlineProgressForWeek(courseStore, courseScheduleStore, progressStore, weekNumber)
    )
    .filter((deadlineProgress) => deadlineProgress === deadlineProgresses.OVERDUE);

  return overdueWeeks.length;
};

export const isLagging = function (
  courseStore: CourseStore,
  courseScheduleStore: CourseScheduleStore,
  progressStore: ProgressStore
): boolean {
  return helpers.getWeeksBehind(courseStore, courseScheduleStore, progressStore) >= 2;
};

export const getLessonsForWeek = function (
  courseStore: CourseStore,
  courseScheduleStore: CourseScheduleStore,
  week: number
): Array<Lesson> {
  const modules = helpers.getModulesForWeek(courseStore, courseScheduleStore, week);

  return modules.reduce((memo, module: Module) => memo.concat(module.getLessons().models), []);
};

export const getGradablesForWeek = function (
  courseStore: CourseStore,
  courseScheduleStore: CourseScheduleStore,
  week: number
) {
  const modules = helpers.getModulesForWeek(courseStore, courseScheduleStore, week);

  return modules.reduce((memo, module: Module) => {
    const moduleAssignments = module.getGradableItemMetadatas();
    return memo.concat(moduleAssignments.toArray());
  }, []);
};

export const getGradablesForWeekWithoutHonors = function (
  courseStore: CourseStore,
  courseScheduleStore: CourseScheduleStore,
  week: number
) {
  const modules = helpers.getModulesForWeek(courseStore, courseScheduleStore, week);

  return modules.reduce((memo, module: Module) => {
    const moduleAssignments = module.getGradableItemMetadatasWithoutHonors();
    return memo.concat(moduleAssignments.toArray());
  }, []);
};

export const getGradableItemsForWeek = function (
  courseStore: CourseStore,
  courseScheduleStore: CourseScheduleStore,
  week: number
): Array<ItemMetadata> {
  return helpers
    .getModulesForWeek(courseStore, courseScheduleStore, week)
    .reduce((memo: Array<ItemMetadata>, module: Module) => {
      return memo.concat(module.getGradables());
    }, []);
};

export const isWeekOverdue = function (
  courseStore: CourseStore,
  courseScheduleStore: CourseScheduleStore,
  progressStore: ProgressStore,
  week: number
): boolean {
  const deadlineForWeek = helpers.getDeadlineForWeek(courseStore, courseScheduleStore, progressStore, week);

  if (
    deadlineForWeek &&
    moment().isAfter(deadlineForWeek) &&
    !helpers.isWeekComplete(courseStore, courseScheduleStore, progressStore, week)
  ) {
    const modules = helpers.getModulesForWeek(courseStore, courseScheduleStore, week);

    if (modules.length) {
      return modules.some((module: Module) =>
        module
          .getGradables()
          .filter((itemMetadata: ItemMetadata) => {
            // We need to capture the assignment part because even if the assignment part is complete, the review part
            // may not be; we only have access to the assignment part here.
            return (
              !progressStore.isItemComplete(itemMetadata) ||
              itemMetadata.isAssignmentPartForSplitPeer() ||
              itemMetadata.isProject()
            );
          })
          .some((itemMetadata: ItemMetadata) => {
            if (itemMetadata.isAssignmentPartForSplitPeer()) {
              const isAssignmentPartOverdue = !progressStore.isItemComplete(itemMetadata);
              const splitPeerReviewItem = itemMetadata.getReviewPartFromSplitPeer();
              const deadlineForItem = helpers.getDeadlineForItem(
                courseScheduleStore,
                progressStore,
                // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'ItemMetadata | undefined' is not... Remove this comment to see the full error message
                splitPeerReviewItem
              );
              const isReviewPartOverdue =
                deadlineForItem &&
                moment().isAfter(deadlineForItem) &&
                // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'ItemMetadata | undefined' is not... Remove this comment to see the full error message
                !progressStore.isItemComplete(splitPeerReviewItem);

              return isAssignmentPartOverdue || isReviewPartOverdue;
            } else if (itemMetadata.isProject()) {
              const result = !progressStore.isItemSubmitted(itemMetadata);
              return result;
            } else if (itemMetadata.isLti()) {
              const result = !progressStore.isItemSubmitted(itemMetadata);
              return result;
            } else {
              // At this point, the week is complete and we're after the deadline for the week
              // so we mark all items that are not yet complete as overdue.
              return true;
            }
          })
      );
    }
  }

  return false;
};

export const isWeekComplete = function (
  courseStore: CourseStore,
  courseScheduleStore: CourseScheduleStore,
  progressStore: ProgressStore,
  week: number
): boolean {
  const modules = helpers
    .getModulesForWeek(courseStore, courseScheduleStore, week)
    .filter((module: Module) => !module.get('optional'));
  const gradableModules = modules.filter((module: Module) => module.isGradable());

  if (gradableModules.length > 0) {
    // If any of the modules in this week are gradable, completion of those modules
    // supercedes completion of modules without gradables.
    return progressStore.areModuleIdsComplete(gradableModules.map((module) => module.id));
  } else {
    // If no gradable modules exist, fallback to completion of all modules.
    return progressStore.areModuleIdsComplete(modules.map((module) => module.id));
  }
};

export const isWeekPassed = function (
  courseStore: CourseStore,
  courseScheduleStore: CourseScheduleStore,
  progressStore: ProgressStore,
  week: number
): boolean {
  const modules = helpers
    .getModulesForWeek(courseStore, courseScheduleStore, week)
    .filter((module: Module) => !module.get('optional'));
  const gradableModules = modules.filter((module) => module.isGradable());

  if (gradableModules.length > 0) {
    // If any of the modules in this week are gradable, check whether they are passed.
    return progressStore.areModuleIdsPassed(gradableModules.map((module) => module.id));
  } else {
    // If no gradable modules exist, fallback to completion.
    return helpers.isWeekComplete(courseStore, courseScheduleStore, progressStore, week);
  }
};

export const isCourseComplete = function (
  courseStore: CourseStore,
  courseScheduleStore: CourseScheduleStore,
  progressStore: ProgressStore
): boolean {
  return _.range(0, courseScheduleStore.getNumberOfWeeks()).every((week) => {
    return helpers.isWeekComplete(courseStore, courseScheduleStore, progressStore, week + 1);
  });
};

export const getCurrentWeek = function (
  courseStore: CourseStore,
  courseScheduleStore: CourseScheduleStore,
  progressStore: ProgressStore
): number | undefined {
  const weeks = Object.keys(courseScheduleStore.getSchedule().weekMap);
  let currentWeek: string | undefined;
  if (courseScheduleStore.moduleDeadlines.length) {
    // When the learner has deadlines set, use the current calendar week.
    currentWeek = weeks.find((week) => {
      const deadlineForWeek = helpers.getDeadlineForWeek(
        courseStore,
        courseScheduleStore,
        progressStore,
        parseInt(week, 10)
      );
      return deadlineForWeek ? moment().isBefore(deadlineForWeek) : null;
    });
  }

  if (!currentWeek) {
    // When the learner doesn't have deadlines set, use the first incomplete week.
    currentWeek = weeks.find(
      (week) => !helpers.isWeekComplete(courseStore, courseScheduleStore, progressStore, parseInt(week, 10))
    );
  }

  return currentWeek !== undefined ? parseInt(currentWeek, 10) : undefined;
};

// TODO: Provide better types
export const getDeadlineForWeek = function (
  courseStore: CourseStore,
  courseScheduleStore: CourseScheduleStore,
  progressStore: ProgressStore,
  week: number,
  maybeModuleDeadlines?: Array<ModuleDeadline>
): moment.Moment | null {
  const moduleDeadlines = maybeModuleDeadlines || courseScheduleStore.moduleDeadlines;

  if (courseScheduleStore.deadlinesStatus === deadlinesStatus.ITEM_DEADLINES_ENABLED) {
    // Get the earliest deadline of incomplete items in the week
    const incompleteItems = helpers
      .getGradableItemsForWeek(courseStore, courseScheduleStore, week)
      .filter((item: ItemMetadata) => !progressStore.isItemComplete(item));

    const itemDeadline =
      incompleteItems.length > 0
        ? moment.min(
            incompleteItems
              .map((item: ItemMetadata) => helpers.getDeadlineForItem(courseScheduleStore, progressStore, item))
              .filter(removeNullableValues)
          )
        : null;

    const moduleDeadline = courseScheduleStore.getModuleDeadlineForWeek(week, moduleDeadlines);
    if (moduleDeadline !== null && itemDeadline !== null) {
      return moment.min(moduleDeadline, itemDeadline);
    } else if (moduleDeadline !== null) {
      return moduleDeadline;
    } else {
      return itemDeadline;
    }
  } else {
    return courseScheduleStore.getModuleDeadlineForWeek(week, moduleDeadlines);
  }
};

export const getDeadlineForModuleId = function (
  courseStore: CourseStore,
  courseScheduleStore: CourseScheduleStore,
  progressStore: ProgressStore,
  moduleId: string
): moment.Moment | null {
  const week = courseScheduleStore.getSchedule().getWeekForModuleId(moduleId);
  return helpers.getDeadlineForWeek(courseStore, courseScheduleStore, progressStore, week);
};

export const getModuleDeadlineForItem = function (
  courseStore: CourseStore,
  courseScheduleStore: CourseScheduleStore,
  progressStore: ProgressStore,
  item: ItemMetadata
): moment.Moment | null {
  const moduleId = item.get('lesson.module.id');
  return helpers.getDeadlineForModuleId(courseStore, courseScheduleStore, progressStore, moduleId);
};

export const getDeadlineForItem = function (
  courseScheduleStore: CourseScheduleStore,
  progressStore: ProgressStore,
  item: ItemMetadata
): moment.Moment | null {
  let deadline: moment.Moment | null = null;
  if (
    courseScheduleStore.deadlinesStatus === deadlinesStatus.ITEM_DEADLINES_ENABLED &&
    _.has(courseScheduleStore.itemDeadlines, item.id)
  ) {
    const timestamp = courseScheduleStore.itemDeadlines[item.id]?.deadline;

    if (timestamp) {
      deadline = deadlineFormatter.toTimezone(moment(timestamp));
    }
  } else {
    // If this item's itemDeadline is not defined or ITEM_DEADLINES_ENABLED is disabled,
    // we use its moduleDeadline instead.
    const week = courseScheduleStore.getSchedule().getWeekForModuleId(item.get('lesson.module.id'));
    deadline = courseScheduleStore.getModuleDeadlineForWeek(week);
  }

  if (deadline && item.isReviewPartForSplitPeer && item.isReviewPartForSplitPeer()) {
    deadline.add(item.getDefinition('reviewDeadlineOffset'), 'ms');
  }

  return deadline && moment(deadline);
};

export const isItemDeferred = function (
  courseStore: CourseStore,
  courseScheduleStore: CourseScheduleStore,
  progressStore: ProgressStore,
  item: ItemMetadata
): boolean {
  if (courseScheduleStore.deadlinesStatus !== deadlinesStatus.ITEM_DEADLINES_ENABLED) {
    return false;
  }

  const deadline = helpers.getDeadlineForItem(courseScheduleStore, progressStore, item);
  const moduleDeadline = helpers.getModuleDeadlineForItem(courseStore, courseScheduleStore, progressStore, item);

  return moduleDeadline && deadline ? moment(deadline).isAfter(moduleDeadline) : false;
};

export const getReminderItemsForWeek = function (
  courseStore: CourseStore,
  courseScheduleStore: CourseScheduleStore,
  progressStore: ProgressStore,
  week: number,
  shouldDueInCurrentWeek: boolean
) {
  if (courseScheduleStore.deadlinesStatus !== deadlinesStatus.ITEM_DEADLINES_ENABLED) {
    return [];
  }
  const weekDeadline = courseScheduleStore.getModuleDeadlineForWeek(week);
  const lastWeekDeadline = week === 1 ? null : courseScheduleStore.getModuleDeadlineForWeek(week - 1);

  return _.flattenDeep(
    _.map(_.range(1, week), (w) => {
      return helpers
        .getGradableItemsForWeek(courseStore, courseScheduleStore, w)
        .filter((item: ItemMetadata) => !progressStore.isItemSubmitted(item))
        .filter((item: ItemMetadata) => {
          const itemDeadline = helpers.getDeadlineForItem(courseScheduleStore, progressStore, item);
          if (itemDeadline) {
            if (shouldDueInCurrentWeek) {
              const dueAfterWeekStart = lastWeekDeadline ? itemDeadline.isAfter(lastWeekDeadline) : true;

              const dueBeforeWeekEnd = weekDeadline ? itemDeadline.isBefore(weekDeadline) : false;
              return (
                helpers.isItemDeferred(courseStore, courseScheduleStore, progressStore, item) &&
                dueAfterWeekStart &&
                dueBeforeWeekEnd
              );
            } else {
              const dueAfterWeekStart = weekDeadline ? itemDeadline.isAfter(weekDeadline) : false;
              return helpers.isItemDeferred(courseStore, courseScheduleStore, progressStore, item) && dueAfterWeekStart;
            }
          }
          return undefined;
        });
    })
  );
};

type PeerAssessInfo = {
  submitted: boolean;
};

export const getPeerReviewsInfoForWeek = function (
  courseStore: CourseStore,
  courseScheduleStore: CourseScheduleStore,
  progressStore: ProgressStore,
  week: number
): Array<PeerAssessInfo> {
  const modules = helpers.getModulesForWeek(courseStore, courseScheduleStore, week);
  const peerAssessInfo: Array<PeerAssessInfo> = [];
  if (modules.length) {
    modules.forEach((module: Module) => {
      module.getGradables().forEach((itemMetadata: ItemMetadata) => {
        if (itemMetadata.isAssignmentPartForSplitPeer()) {
          peerAssessInfo.push({
            submitted: progressStore.isItemSubmitted(itemMetadata),
          });
        }
      });
    });
  }
  return peerAssessInfo;
};

export const getDeadlineProgressForWeek = function (
  courseStore: CourseStore,
  courseScheduleStore: CourseScheduleStore,
  progressStore: ProgressStore,
  week: number
): ItemDeadlineProgress {
  if (helpers.isWeekComplete(courseStore, courseScheduleStore, progressStore, week)) {
    return deadlineProgresses.COMPLETE;
  } else if (helpers.isWeekOverdue(courseStore, courseScheduleStore, progressStore, week)) {
    return deadlineProgresses.OVERDUE;
  } else {
    return deadlineProgresses.UPCOMING;
  }
};

/**
 * @returns If the learner has passed the course. If the learner has purchased a cert
 * for the course, requires the learner to have passed with verification.
 */
export const hasPassedCourse = function (
  courseViewGradeStore: CourseViewGradeStore,
  verificationStore: VerificationStore
) {
  if (verificationStore.hasPurchasedCertificate()) {
    return courseViewGradeStore.hasPassedCourseWithVerification();
  } else {
    return courseViewGradeStore.hasPassedCourseUnverified();
  }
};

/**
 * @returns If the learner has passed the given track of the course.
 */
export const hasPassedTrack = function (
  courseViewGradeStore: CourseViewGradeStore,
  verificationStore: VerificationStore,
  trackId: TrackId
) {
  if (verificationStore.hasPurchasedCertificate()) {
    return courseViewGradeStore.hasPassedTrackWithVerification(trackId);
  } else {
    return courseViewGradeStore.hasPassedTrackUnverified(trackId);
  }
};

/**
 * @returns Number of passed items. If learner has purchased a course certificate, returns only items that
 * have been passed and verified.
 */
export const getCorePassedCount = function (courseViewGradeStore: CourseViewGradeStore) {
  const courseViewGrade = courseViewGradeStore.getCourseViewGrade();

  if (!courseViewGrade) {
    return false;
  }

  return courseViewGrade.getCorePassedCount();
};

export const hasPassedAllGradableItems = function (
  courseStore: CourseStore,
  courseViewGradeStore: CourseViewGradeStore
) {
  const passedCount = helpers.getCorePassedCount(courseViewGradeStore);
  const gradableCount = courseStore.getGradableItemCount();
  return passedCount === gradableCount;
};

/**
 * @returns Item metadatas for items that have been graded. This is useful for cases where information
 * about gradable items the user has finished is needed, such as the Grades page (/home/assignments).
 * Grades are not returned, just item information.
 */
export const getGradedItems = function (
  courseStore: CourseStore,
  courseViewGradeStore: CourseViewGradeStore,
  progressStore: ProgressStore
) {
  const gradableItems = courseStore.getGradableItems();
  const gradedItems = gradableItems
    ? gradableItems.filter((itemMetadata: ItemMetadata) =>
        helpers.isItemGraded(itemMetadata, courseViewGradeStore, progressStore)
      )
    : [];
  return gradedItems;
};

export const getGradedItemCount = function (
  courseStore: CourseStore,
  courseViewGradeStore: CourseViewGradeStore,
  progressStore: ProgressStore
) {
  const gradedItems = helpers.getGradedItems(courseStore, courseViewGradeStore, progressStore);
  return gradedItems.length;
};

export const isItemGraded = function (
  itemMetadata: ItemMetadata,
  courseViewGradeStore: CourseViewGradeStore,
  progressStore: ProgressStore
): boolean {
  if (itemMetadata.isProject()) {
    const staffGradedState = progressStore.getItemStaffGradedState(itemMetadata);
    return staffGradedState.isCompleted();
  }
  if (itemMetadata.isGradedDiscussionPrompt()) {
    const gdpState = progressStore.getItemDiscussionPromptState(itemMetadata);
    return gdpState.isCompleted();
  }
  if (itemMetadata.isLti()) {
    return progressStore.getItemLtiState(itemMetadata).isCompleted();
  }
  if (itemMetadata.isAssignmentPartForSplitPeer() || itemMetadata.isMentorGraded()) {
    const peerState = progressStore.getItemPeerState(itemMetadata);
    return peerState.isEvaluated() && peerState.isReviewingComplete();
  }
  const itemGrade = courseViewGradeStore.getItemGrade(itemMetadata.getId());
  return itemGrade && itemGrade.get('overallOutcome').grade !== undefined;
};

/**
 * @returns Item metadatas for gradable items that have been failed. This is useful for cases where
 * general information about gradable items needs to be displayed, such as the Grades pages
 * (/home/assignments).
 */
export const getFailedItems = function (
  courseStore: CourseStore,
  courseViewGradeStore: CourseViewGradeStore,
  progressStore: ProgressStore
) {
  const gradedItems = helpers.getGradedItems(courseStore, courseViewGradeStore, progressStore);
  const failedItems = gradedItems.filter(
    (itemMetadata: ItemMetadata) => !courseViewGradeStore.isItemPassed(itemMetadata.getId())
  );
  return failedItems;
};

export const getFailedItemCount = function (
  courseStore: CourseStore,
  courseViewGradeStore: CourseViewGradeStore,
  progressStore: ProgressStore
) {
  const failedItems = helpers.getFailedItems(courseStore, courseViewGradeStore, progressStore);
  return failedItems.length;
};

/**
 * @returns Item metadatas for gradable items that have been failed, and are required to pass in courses
 * with a mixed mastery, cumulative grading policy. This is useful for cases where general information
 * about gradable items need to be displayed, such as the Grades pages (/home/assignments).
 */
export const getFailedRequiredPassItems = function (
  courseStore: CourseStore,
  courseViewGradeStore: CourseViewGradeStore,
  progressStore: ProgressStore
) {
  const failedItems = helpers.getFailedItems(courseStore, courseViewGradeStore, progressStore);
  const failedRequiredPassItems = failedItems.filter((itemMetadata: ItemMetadata) =>
    itemMetadata.isPassRequiredForCourse()
  );
  return failedRequiredPassItems;
};

export const getFailedRequiredPassItemCount = function (
  courseStore: CourseStore,
  courseViewGradeStore: CourseViewGradeStore,
  progressStore: ProgressStore
) {
  const failedRequiredPassItems = helpers.getFailedRequiredPassItems(courseStore, courseViewGradeStore, progressStore);
  return failedRequiredPassItems.length;
};

// this wrapper is necessary to mock functions in https://github.com/webedx-spark/web/blob/main/static/bundles/ondemand/stores/__tests__/StoreComputationHelpers.js
// for more context view https://github.com/facebook/jest/issues/936
export const helpers = {
  isRestrictedCapstone,
  getModulesForWeek,
  isWeekGradable,
  isWeekComplete,
  getGradableItemsForWeek,
  getDeadlineForItem,
  getDeadlineForWeek,
  isWeekOverdue,
  getDeadlineProgressForWeek,
  getWeeksBehind,
  isLagging,
  getLessonsForWeek,
  getGradablesForWeek,
  getGradablesForWeekWithoutHonors,
  isWeekPassed,
  isCourseComplete,
  getCurrentWeek,
  getDeadlineForModuleId,
  getModuleDeadlineForItem,
  isItemDeferred,
  getReminderItemsForWeek,
  getPeerReviewsInfoForWeek,
  hasPassedCourse,
  hasPassedTrack,
  getCorePassedCount,
  hasPassedAllGradableItems,
  isItemGraded,
  getGradedItems,
  getGradedItemCount,
  getFailedItems,
  getFailedItemCount,
  getFailedRequiredPassItems,
  getFailedRequiredPassItemCount,
};

export default helpers;
