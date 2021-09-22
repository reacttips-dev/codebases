import * as React from 'react';
import moment from 'moment';

import hoistNonReactStatics from 'js/lib/hoistNonReactStatics';
import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';

// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import isPeerReviewCompletedFromPreviousBranch from 'bundles/ondemand/utils/isPeerReviewCompletedFromPreviousBranch';

import { getDeadlineForItem, isItemGraded } from 'bundles/ondemand/stores/StoreComputationHelpers';

// TODO: Migrate off of Backbone
// eslint-disable-next-line no-restricted-imports
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import type ItemGrade from 'pages/open-course/common/models/itemGrade';
import type ItemMetadata from 'pages/open-course/common/models/itemMetadata';

import type ProgressStoreClass from 'bundles/ondemand/stores/ProgressStore';
import type CourseScheduleStoreClass from 'bundles/ondemand/stores/CourseScheduleStore';
import type CourseViewGradeStoreClass from 'bundles/ondemand/stores/CourseViewGradeStore';
import type { Item } from '../types/Item';
import { DEADLINE_PROGRESS } from '../constants';
import type { Stores } from '../types/Stores';

type WithComputedItemType = {
  computedItem: Item;
};

type PropsToStores = {
  itemMetadata: ItemMetadata;
};

// this wrapper is necessary to mock functions in https://github.com/webedx-spark/web/blob/main/static/bundles/learner-progress/utils/__tests__/withComputedItem.js
// for more context view https://github.com/facebook/jest/issues/936
const helpers = {
  hasNonActionableLock: (itemMetadata: ItemMetadata) => {
    return itemMetadata.isLocked() && (itemMetadata.isPremiumGradingLocked() || itemMetadata.isResitLocked());
  },

  getItemDeadlineProgress: ({
    isCompleted,
    hasOutcomeOverride,
    deadline,
    itemMetadata,
  }: {
    isCompleted: boolean;
    hasOutcomeOverride: boolean;
    deadline?: moment.Moment | null;
    itemMetadata: ItemMetadata;
  }) => {
    // Non-gradable items do not have any deadline progress.
    if (!itemMetadata.isGradable()) {
      return undefined;
    }

    if (isCompleted || hasOutcomeOverride) {
      return DEADLINE_PROGRESS.COMPLETE;
    } else if (deadline && moment().isAfter(deadline)) {
      if (!helpers.hasNonActionableLock(itemMetadata)) {
        return DEADLINE_PROGRESS.OVERDUE;
      }
    } else if (deadline) {
      return DEADLINE_PROGRESS.UPCOMING;
    }
    return undefined;
  },
};

const getOutcomeOverride = (courseViewGradeStore: CourseViewGradeStoreClass, itemMetadata: ItemMetadata) =>
  courseViewGradeStore.getItemOutcomeOverrides()[itemMetadata.getId()];

const getHasOutcomeOverride = (courseViewGradeStore: CourseViewGradeStoreClass, itemMetadata: ItemMetadata) =>
  !!courseViewGradeStore.getItemOutcomeOverrides()[itemMetadata.getId()];

const getStaffGradedProgress = (progressStore: ProgressStoreClass, itemMetadata: ItemMetadata) => {
  if (['teammateReview', 'staffGraded'].includes(itemMetadata.getTypeName())) {
    return progressStore.getItemStaffGradedState(itemMetadata);
  }

  return undefined;
};

const getDiscussionPromptProgress = (progressStore: ProgressStoreClass, itemMetadata: ItemMetadata) => {
  if (itemMetadata.getTypeName() === 'gradedDiscussionPrompt') {
    return progressStore.getItemDiscussionPromptState(itemMetadata);
  }

  return undefined;
};

const getLtiProgress = (progressStore: ProgressStoreClass, itemMetadata: ItemMetadata) => {
  if (itemMetadata.getTypeName() === 'gradedLti') {
    return progressStore.getItemLtiState(itemMetadata);
  }

  return undefined;
};

const getIsStarted = (
  courseViewGradeStore: CourseViewGradeStoreClass,
  progressStore: ProgressStoreClass,
  itemMetadata: ItemMetadata
) => {
  const itemGrade = courseViewGradeStore.getItemGrade(itemMetadata.getId());
  const itemProgress = progressStore.courseProgress.getItemProgress(itemMetadata.getId());

  if (
    // note: For session switching scenarios, we check completion status and infer the item must've been started.
    progressStore.isItemComplete(itemMetadata) ||
    // note: For session switching scenarios, we check completion status and infer the item must've been started.
    isPeerReviewCompletedFromPreviousBranch(itemMetadata, itemGrade) ||
    // note: For peer review items, the single peer review item is represented by two items in our item displays.
    // The "real" assignment peer review part, which is the original item recorded in the BE, and a "virtual"
    // peer review review others item. Once a learner has given at least one peer review to another,
    // they can be considered to have started the "virtual" item.
    (itemMetadata.isReviewPartForSplitPeer() && progressStore.getItemPeerState(itemMetadata).reviewCount() > 0) ||
    // note: Items start in the "NotStarted" progress state, therefore any status other than "NotStarted"
    // means that some work has been done.
    itemProgress.attributes.progressState !== 'NotStarted'
  ) {
    return true;
  } else {
    return false;
  }
};

const getIsCompleted = (
  courseViewGradeStore: CourseViewGradeStoreClass,
  progressStore: ProgressStoreClass,
  itemMetadata: ItemMetadata
) => {
  const itemGrade = courseViewGradeStore.getItemGrade(itemMetadata.getId());

  if (itemMetadata.isReviewPartForSplitPeer()) {
    return progressStore.getItemPeerState(itemMetadata).isReviewingComplete();
  }
  if (itemMetadata.isAssignmentPartForSplitPeer()) {
    const peerState = progressStore.getItemPeerState(itemMetadata);
    return peerState.isPassed();
  }
  if (itemMetadata.isWiseFlow()) {
    return progressStore.getWiseFlowState(itemMetadata).isCompleted();
  }

  return progressStore.isItemComplete(itemMetadata) || isPeerReviewCompletedFromPreviousBranch(itemMetadata, itemGrade);
};

const getIsSubmitted = (
  courseViewGradeStore: CourseViewGradeStoreClass,
  progressStore: ProgressStoreClass,
  itemMetadata: ItemMetadata
) => {
  // for each of the cases where we don't have auto-grading, check the specific
  // submission state for the item
  if (itemMetadata.isProject()) {
    return progressStore.getItemStaffGradedState(itemMetadata).isSubmitted();
  }
  if (itemMetadata.isGradedLti()) {
    return progressStore.getItemLtiState(itemMetadata).isSubmitted();
  }
  if (itemMetadata.isGradedDiscussionPrompt()) {
    return progressStore.getItemDiscussionPromptState(itemMetadata).isStarted();
  }
  if (itemMetadata.isAssignmentPartForSplitPeer() || itemMetadata.isMentorGraded()) {
    return progressStore.getItemPeerState(itemMetadata).isSubmitted();
  }
  if (itemMetadata.isWiseFlow()) {
    return progressStore.getWiseFlowState(itemMetadata).isSubmitted();
  }
  // default for auto-graded submissions - check if there's a grade
  return isItemGraded(itemMetadata, courseViewGradeStore, progressStore);
};

const getIsBaseItemCompleted = (
  courseViewGradeStore: CourseViewGradeStoreClass,
  progressStore: ProgressStoreClass,
  itemMetadata: ItemMetadata
) => {
  const itemGrade = courseViewGradeStore.getItemGrade(itemMetadata.getId());

  return progressStore.isItemComplete(itemMetadata) || isPeerReviewCompletedFromPreviousBranch(itemMetadata, itemGrade);
};

const getIsDueThisWeek = (deadline: moment.Moment | null | undefined, itemMetadata: ItemMetadata) => {
  return (
    !helpers.hasNonActionableLock(itemMetadata) &&
    moment().isBefore(deadline || undefined) &&
    moment()
      .add(1, 'week')
      .isAfter(deadline || undefined)
  );
};

const getIsNextItemInCourse = (progressStore: ProgressStoreClass, itemMetadata: ItemMetadata) => {
  const nextItemMetadata = progressStore.getNextItemForModule(itemMetadata.get('module'));
  return !!nextItemMetadata && nextItemMetadata.get('id') === itemMetadata.get('id');
};

const getComputedGrade = (itemGrade: ItemGrade, itemMetadata: ItemMetadata, progressStore: ProgressStoreClass) => {
  if (!itemGrade || !itemGrade.get('overallOutcome')) {
    return undefined;
  }

  const isLti: boolean = itemMetadata.isLti();
  const ltiProgress = isLti ? getLtiProgress(progressStore, itemMetadata) : null;
  if (ltiProgress?.isSubmittedNotGraded()) {
    // Don't show any grade if submitted and not graded
    return undefined;
  }

  return itemGrade.get('overallOutcome').grade;
};

const getIsItemPassed = (
  itemGrade: ItemGrade,
  hasOutcomeOverride: boolean,
  isPeerAssignmentWaitingForEvaluation: boolean
) => {
  const relativePassingState = itemGrade.getRelativePassingState();
  const isGradingComplete = hasOutcomeOverride || !isPeerAssignmentWaitingForEvaluation;
  return isGradingComplete && relativePassingState === 'passed';
};

const getIsItemFailed = (
  itemGrade: ItemGrade,
  itemMetadata: ItemMetadata,
  hasOutcomeOverride: boolean,
  isPeerAssignmentWaitingForEvaluation: boolean,
  progressStore: ProgressStoreClass
): boolean => {
  const relativePassingState = itemGrade.getRelativePassingState();
  const hasGrade = hasOutcomeOverride || (itemGrade && itemGrade.get('overallOutcome').grade !== undefined);

  const isLti: boolean = itemMetadata.isLti();
  const ltiProgress = isLti ? getLtiProgress(progressStore, itemMetadata) : null;

  if (itemMetadata.isAssignmentPartForSplitPeer()) {
    return !isPeerAssignmentWaitingForEvaluation && hasGrade && relativePassingState !== 'passed';
  } else if (itemMetadata.isReviewPartForSplitPeer()) {
    return false;
  } else if (isLti && ltiProgress) {
    if (ltiProgress.isSubmittedNotGraded()) {
      // Don't show failure if submitted and not graded.
      return false;
    }
  }

  return hasGrade && relativePassingState !== 'passed';
};

const getComputedDeadlineForItem = (
  courseScheduleStore: CourseScheduleStoreClass,
  progressStore: ProgressStoreClass,
  itemMetadata: ItemMetadata
) => {
  if (!courseScheduleStore.areDeadlinesEnabled()) {
    return undefined;
  }

  return getDeadlineForItem(courseScheduleStore, progressStore, itemMetadata);
};

const createComputedItemFromStores = ({
  itemMetadata,
  CourseStore,
  ProgressStore,
  CourseScheduleStore,
  SessionStore,
  CourseViewGradeStore,
}: Stores & {
  itemMetadata: ItemMetadata;
}): Item => {
  const staffGradedProgress = getStaffGradedProgress(ProgressStore, itemMetadata);
  const discussionPromptProgress = getDiscussionPromptProgress(ProgressStore, itemMetadata);
  const ltiProgress = getLtiProgress(ProgressStore, itemMetadata);

  const isStarted = getIsStarted(CourseViewGradeStore, ProgressStore, itemMetadata);
  const isSubmitted = getIsSubmitted(CourseViewGradeStore, ProgressStore, itemMetadata);
  const isCompleted = getIsCompleted(CourseViewGradeStore, ProgressStore, itemMetadata);

  const isCombinedItemCompleted = ProgressStore.isCombinedItemComplete(itemMetadata);
  const isBaseItemCompleted = getIsBaseItemCompleted(CourseViewGradeStore, ProgressStore, itemMetadata);

  const outcomeOverride = getOutcomeOverride(CourseViewGradeStore, itemMetadata);
  const hasOutcomeOverride = getHasOutcomeOverride(CourseViewGradeStore, itemMetadata);
  const weekNumber = CourseScheduleStore.getWeekForModuleId(itemMetadata.get('lesson.module.id'));

  const isLockedBeforeSessionStart = itemMetadata.isLockedBeforeSessionStart();
  const lockedByPreviousItemMetadata = CourseStore.getMaterials().getItemMetadata(itemMetadata.get('lockableByItem'));

  const isLockedByPreviousItem = !!lockedByPreviousItemMetadata;

  const lockedByPreviousItem = isLockedByPreviousItem
    ? {
        id: lockedByPreviousItemMetadata.getId(),
        resourcePath: lockedByPreviousItemMetadata.getLink(),
      }
    : undefined;

  const deadline = getComputedDeadlineForItem(CourseScheduleStore, ProgressStore, itemMetadata);
  const deadlineProgress = helpers.getItemDeadlineProgress({ isCompleted, hasOutcomeOverride, deadline, itemMetadata });
  const isNextItemInCourse = getIsNextItemInCourse(ProgressStore, itemMetadata);

  const itemGrade = CourseViewGradeStore.getItemGrade(itemMetadata.get('id'));
  const grade = getComputedGrade(itemGrade, itemMetadata, ProgressStore);
  const gradingLatePenalty = itemMetadata.getDefinition('gradingLatePenalty');
  const gradingWeight = itemMetadata.getGradingWeight();
  const appliedLatePenalty = itemGrade.getLatePenaltyRatio();

  const isPassRequiredForCourse = itemMetadata.isPassRequiredForCourse();

  const isPeerAssignmentWaitingForEvaluation =
    itemMetadata.isAssignmentPartForSplitPeer() &&
    isSubmitted &&
    !ProgressStore.getItemPeerState(itemMetadata).isEvaluated();

  const isPassed = getIsItemPassed(itemGrade, hasOutcomeOverride, isPeerAssignmentWaitingForEvaluation);

  const isFailed = getIsItemFailed(
    itemGrade,
    itemMetadata,
    hasOutcomeOverride,
    isPeerAssignmentWaitingForEvaluation,
    ProgressStore
  );
  const isGraded = isPassed || isFailed;

  const itemProgress = ProgressStore.courseProgress.getItemProgress(itemMetadata.getId());

  const reviewCount =
    ProgressStore.getItemPeerState(itemMetadata) && ProgressStore.getItemPeerState(itemMetadata).reviewCount();
  const requiredReviewCount =
    itemProgress.getDefinition('requiredReviewCount') || itemMetadata.getDefinition('requiredReviewCount') || 0;

  const isDueThisWeek = getIsDueThisWeek(deadline, itemMetadata);

  const gradedAssignmentGroups = CourseStore.getGradedAssignmentGroups();

  // capturing all item ids that are part of a graded assignment group
  const gradedAssignmentGroupItemIds: string[] = gradedAssignmentGroups.reduce((acc, gradedAssignmentGroup) => {
    return acc.concat(gradedAssignmentGroup.itemIds);
  }, [] as string[]);

  const isIncludedInGradedAssignmentGroup = gradedAssignmentGroupItemIds.includes(itemMetadata.get('id'));

  const computedItem: Item = {
    id: itemMetadata.get('id'),
    courseId: itemMetadata.get('course.id'),
    courseSlug: itemMetadata.get('course.slug'),
    name: itemMetadata.get('name'),
    trackId: itemMetadata.get('trackId'),
    resourcePath: itemMetadata.getLink(),

    isIncludedInGradedAssignmentGroup,

    contentSummary: itemMetadata.getContent(),
    timeCommitment: itemMetadata.get('timeCommitment'),

    itemLockSummary: itemMetadata.get('itemLockSummary'),
    itemLockedStatus: itemMetadata.get('lockedStatus'),
    itemLockedReasonCode: itemMetadata.get('itemLockedReasonCode'),
    isLockedBeforeSessionStart,
    isLockedByPreviousItem,
    lockedByPreviousItem,

    isStarted,
    isSubmitted,
    isCompleted,
    isGraded,
    isPassed,
    isFailed,

    isBaseItemCompleted,
    isCombinedItemCompleted,

    outcomeOverride,
    hasOutcomeOverride,

    isPeerAssignmentFailed: isFailed,
    isPeerAssignmentWaitingForEvaluation,
    isPeerAssignmentReviewComplete: ProgressStore.getItemPeerState(itemMetadata).isReviewingComplete(),

    isStaffGradedStarted: !!staffGradedProgress && staffGradedProgress.isStarted(),
    isStaffGradedSubmitted: !!staffGradedProgress && staffGradedProgress.isSubmitted(),

    isDiscussionPromptStarted: !!discussionPromptProgress && discussionPromptProgress.isStarted(),
    isDiscussionPromptGrading: !!discussionPromptProgress && discussionPromptProgress.isGrading(),
    isDiscussionPromptOverdue: !!discussionPromptProgress && discussionPromptProgress.isOverdue(),

    isLtiStarted: !!ltiProgress && ltiProgress.isStarted(),
    isLtiSubmitted: !!ltiProgress && ltiProgress.isSubmitted(),

    deadline,
    deadlineProgress,
    weekNumber,
    isDueThisWeek,

    gradingLatePenalty,
    gradingWeight,
    grade,
    appliedLatePenalty,
    // TODO: remove this from computedItem and only keep on computedCourse
    // this should be a property of a course, not an item
    isCumulativeGraded: CourseStore.isCumulativeGradePolicy(),

    isNextItemInCourse,
    isPassRequiredForCourse,
    reviewCount,
    requiredReviewCount,

    isHonors: itemMetadata.isHonors(),
    isCore: itemMetadata.isCore(),

    isDegreeSession: SessionStore.isDegreeSession() && SessionStore.isSessionPrivate(),
    degreeId: SessionStore.isDegreeSession()
      ? SessionStore.getSession().sessionTypeMetadata?.definition.degreeId
      : undefined,

    // backbone models
    // TODO: Remove dependency on these models
    itemGrade,
  };

  return computedItem;
};

function withComputedItemImpl<ComponentProperties>(
  WrappedComponent: React.ComponentType<WithComputedItemType & ComponentProperties>
): React.ComponentClass<PropsToStores & ComponentProperties> {
  const componentName = WrappedComponent.displayName || WrappedComponent.name;

  class HOC extends React.Component<WithComputedItemType & ComponentProperties> {
    static displayName = `withComputedItem(${componentName})`;

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  hoistNonReactStatics(HOC, WrappedComponent);

  return connectToStores<
    WithComputedItemType & ComponentProperties,
    PropsToStores & ComponentProperties,
    Stores,
    WithComputedItemType
  >(
    ['CourseStore', 'ProgressStore', 'CourseScheduleStore', 'SessionStore', 'CourseViewGradeStore'],
    ({ CourseStore, ProgressStore, CourseScheduleStore, SessionStore, CourseViewGradeStore }, { itemMetadata }) => ({
      computedItem:
        itemMetadata &&
        createComputedItemFromStores({
          itemMetadata,
          CourseStore,
          ProgressStore,
          CourseScheduleStore,
          SessionStore,
          CourseViewGradeStore,
        }),
    })
  )(HOC);
}

function withComputedItem<ComponentProperties = {}>(): (
  Component: React.ComponentType<WithComputedItemType & ComponentProperties>
) => React.ComponentClass;
function withComputedItem<ComponentProperties = {}>(
  Component: React.ComponentType<WithComputedItemType & ComponentProperties>
): React.ComponentClass<ComponentProperties>;
function withComputedItem<ComponentProperties = {}>(
  component?: React.ComponentType<WithComputedItemType & ComponentProperties>
) {
  // If this is called with no arguments (usually inside _.compose),
  // we will return a closure to be called later.
  if (!component) {
    return function (Component: React.ComponentType<WithComputedItemType & ComponentProperties>) {
      return withComputedItemImpl(Component);
    };
  } else {
    return withComputedItemImpl(component);
  }
}

// To export the different overloads, we need to declare them first, and then have the default export
// see https://github.com/benmosher/eslint-plugin-import/issues/1590
export default withComputedItem;

export { createComputedItemFromStores, helpers };
