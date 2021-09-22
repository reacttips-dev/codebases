import * as React from 'react';
import _ from 'underscore';

import hoistNonReactStatics from 'js/lib/hoistNonReactStatics';
import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';

import { createComputedItemFromStores } from 'bundles/learner-progress/utils/withComputedItem';
import { createComputedGradedAssignmentGroupFromStores } from 'bundles/learner-progress/utils/withComputedGradedAssignmentGroup';
import { getIsAssignmentPartForSplitPeer, getReviewPartFromSplitPeer } from 'bundles/learner-progress/utils/Item';

import {
  isLagging as isLaggingComputer,
  hasPassedTrack as hasPassedTrackComputer,
  hasPassedCourse as hasPassedCourseComputer,
  getGradedItemCount as getGradedItemCountComputer,
  getFailedItemCount as getFailedItemCountComputer,
  getFailedRequiredPassItemCount as getFailedRequiredPassItemCountComputer,
  hasPassedAllGradableItems as hasPassedAllGradableItemsComputer,
  isWeekComplete as isWeekCompleteComputer,
} from 'bundles/ondemand/stores/StoreComputationHelpers';

import { HONORS_TRACK } from 'pages/open-course/common/models/tracks';

// TODO: Migrate off of Backbone
// eslint-disable-next-line no-restricted-imports
import type ItemMetadata from 'pages/open-course/common/models/itemMetadata';

// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import type CoursePresentGradeStoreClass from 'bundles/ondemand/stores/CoursePresentGradeStore';
import type VerificationStoreClass from 'bundles/ondemand/stores/VerificationStore';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import type CertificateStoreClass from 'bundles/ondemand/stores/CertificateStore';
import type { Item } from '../types/Item';
import type { CourseProgress } from '../types/Course';
import type { Stores as AssignmentItemsStores } from '../types/Stores';
import type { GradedAssignmentGroup } from '../types/GradedAssignmentGroup';

type OtherStores = {
  CoursePresentGradeStore: CoursePresentGradeStoreClass;
  VerificationStore: VerificationStoreClass;
  CertificateStore: CertificateStoreClass;
};

type Stores = AssignmentItemsStores & OtherStores;

type PropsFromStores = {
  computedCourseProgress: CourseProgress;
};

// NOTE: in all newer code, assignments are called "assignments"
// Previously, we used the term "Gradable" as is present in some parts of the codebase.
// For now, use of "Assignments" is scoped to work in `course-assignments-v2`,
// but it should be adjusted in other places over time.
const getAssignmentItems = ({
  CourseStore,
  ProgressStore,
  CourseScheduleStore,
  SessionStore,
  CourseViewGradeStore,
}: AssignmentItemsStores) => {
  const assignmentItemMetadatas = CourseStore.getGradableItems();
  const assignmentItems: Array<Item> = [];
  assignmentItemMetadatas.forEach((itemMetadata: ItemMetadata) => {
    const computedItem = createComputedItemFromStores({
      itemMetadata,
      CourseStore,
      ProgressStore,
      CourseScheduleStore,
      SessionStore,
      CourseViewGradeStore,
    });
    assignmentItems.push(computedItem);
    if (getIsAssignmentPartForSplitPeer(computedItem)) {
      const reviewPart = getReviewPartFromSplitPeer(computedItem);
      if (reviewPart) {
        assignmentItems.push(reviewPart);
      }
    }
  });
  return assignmentItems;
};

const createComputedCourseFromStores = ({
  CourseStore,
  SessionStore,
  CourseScheduleStore,
  CourseViewGradeStore,
  CoursePresentGradeStore,
  ProgressStore,
  VerificationStore,
  CertificateStore,
}: Stores): CourseProgress => {
  const courseId = CourseStore.getCourseId();
  const courseSlug = CourseStore.getCourseSlug();
  const courseName = CourseStore.getCourseName();
  const currentWeek = SessionStore.getCurrentWeek();
  const sessionEnded = SessionStore.hasEnded();
  const isDegreeSession = SessionStore.isDegreeSession() && SessionStore.isSessionPrivate();
  const isMixedGradePolicy = CourseStore.isMixedGradePolicy();
  const isCumulativeGradePolicy = CourseStore.isCumulativeGradePolicy();
  const isMasteryGradePolicy = CourseStore.isMasteryGradePolicy();
  const gradedAssignmentGroupGrades = CourseViewGradeStore.getGradedAssignmentGroupGrades();

  const gradedAssignmentGroups = Object.keys(gradedAssignmentGroupGrades || {}).reduce(
    (groups, gradedAssignmentGroupId) => {
      const computedGradedAssignmentGroup = createComputedGradedAssignmentGroupFromStores({
        gradedAssignmentGroupGrade: gradedAssignmentGroupGrades?.[gradedAssignmentGroupId],
        CourseStore,
        ProgressStore,
        CourseScheduleStore,
        SessionStore,
        CourseViewGradeStore,
      });
      if (computedGradedAssignmentGroup) {
        groups.push(computedGradedAssignmentGroup);
      }
      return groups;
    },
    [] as GradedAssignmentGroup[]
  );

  // capturing all item ids that are part of a graded assignment group
  const gradedAssignmentGroupItemIds: Array<string> = CourseStore.getGradedAssignmentGroups().reduce(
    (acc, gradedAssignmentGroup) => {
      return acc.concat(gradedAssignmentGroup.itemIds);
    },
    [] as string[]
  );

  const assignmentItems = getAssignmentItems({
    CourseStore,
    ProgressStore,
    CourseScheduleStore,
    SessionStore,
    CourseViewGradeStore,
  });

  // using the term "core" to describe non-honors assignments
  const coreAssignmentItems = assignmentItems.filter((item) => item.isCore);
  const ungroupedAssignmentItems = coreAssignmentItems
    .filter((item) => !gradedAssignmentGroupItemIds.includes(item.id))
    .sort((itemA, itemB) => {
      if (itemA.deadline && itemB.deadline) {
        return +itemA.deadline - +itemB.deadline;
      } else {
        return 0;
      }
    });
  const honorsAssignmentItems = assignmentItems.filter((item) => item.isHonors);

  const overdueCoreAssignmentItems = coreAssignmentItems.filter((item) => item.deadlineProgress === 'OVERDUE');
  const currentWeekDueCoreAssignmentItems = coreAssignmentItems.filter((item) => item.weekNumber === currentWeek);
  const failedCoreAssignmentItems = coreAssignmentItems.filter((item) => item.isFailed);
  const passedCoreAssignmentItems = coreAssignmentItems.filter((item) => item.isPassed);
  const dueThisWeekOrOverdueCoreAssignmentItems = coreAssignmentItems.filter(
    (item) => item.deadlineProgress === 'OVERDUE' || (item.isDueThisWeek && item.deadlineProgress !== 'COMPLETE')
  );

  const hasPassedCoreAssignmentsUpToCurrentWeek = coreAssignmentItems
    .filter((item) => item.weekNumber <= currentWeek)
    .every((item) => item.isPassed);

  const computedCourseProgress: CourseProgress = {
    courseId,
    courseSlug,
    courseName,
    course: CourseStore.getMetadata(),
    isGuidedProject: CourseStore.isGuidedProject(),
    courseProgress: ProgressStore.courseProgress,
    honorsTrackEnabled: CourseViewGradeStore.honorsTrackEnabled(),
    coursePresentGrade: CoursePresentGradeStore.getPresentGrade(),
    courseViewGrade: CourseViewGradeStore.getCourseViewGrade(),

    currentWeek,
    sessionEnded,

    isDegreeSession,
    isMixedGradePolicy,
    isCumulativeGradePolicy,
    isMasteryGradePolicy,

    isLagging: isLaggingComputer(CourseStore, CourseScheduleStore, ProgressStore),
    hasPassed: hasPassedCourseComputer(CourseViewGradeStore, VerificationStore),
    hasPassedHonorsTrack: hasPassedTrackComputer(CourseViewGradeStore, VerificationStore, HONORS_TRACK),
    hasPurchasedCertificate: VerificationStore.hasPurchasedCertificate(),
    isWeekOneComplete: isWeekCompleteComputer(CourseStore, CourseScheduleStore, ProgressStore, 1),
    isWeekTwoComplete: isWeekCompleteComputer(CourseStore, CourseScheduleStore, ProgressStore, 2),
    hasPassedCoreAssignmentsUpToCurrentWeek,

    completionTime: CertificateStore.getCourseCompletionTime({
      courseId,
    }),

    assignmentItems,
    coreAssignmentItems,
    ungroupedAssignmentItems,
    honorsAssignmentItems,

    overdueCoreAssignmentItems,
    currentWeekDueCoreAssignmentItems,
    failedCoreAssignmentItems,
    passedCoreAssignmentItems,
    dueThisWeekOrOverdueCoreAssignmentItems,

    gradedAssignmentGroups,

    // TODO (@sgogia): consolidate these with the above item computations using ComputedItem
    gradableItemCount: CourseStore.getGradableItemCount(),
    gradedItemCount: getGradedItemCountComputer(CourseStore, CourseViewGradeStore, ProgressStore),
    passedAllGradableItems: hasPassedAllGradableItemsComputer(CourseStore, CourseViewGradeStore),
    failedItemCount: getFailedItemCountComputer(CourseStore, CourseViewGradeStore, ProgressStore),
    failedRequiredPassItemCount: getFailedRequiredPassItemCountComputer(
      CourseStore,
      CourseViewGradeStore,
      ProgressStore
    ),
    finalPercentCourseGrade: CourseViewGradeStore.getFinalPercentCourseGrade(),
  };

  return computedCourseProgress;
};

const withComputedCourseProgressImpl = <T extends {}>(
  WrappedComponent: React.ComponentType<T>
): React.ComponentClass<T & PropsFromStores> => {
  const componentName = WrappedComponent.displayName || WrappedComponent.name;

  class HOC extends React.Component<T & PropsFromStores> {
    static displayName = `withComputedCourseProgress(${componentName})`;

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  hoistNonReactStatics(HOC, WrappedComponent);

  return _.compose(
    connectToStores<PropsFromStores, {}, Stores>(
      [
        'CourseStore',
        'SessionStore',
        'CourseScheduleStore',
        'CourseViewGradeStore',
        'CoursePresentGradeStore',
        'ProgressStore',
        'VerificationStore',
        'CertificateStore',
      ],
      ({
        CourseStore,
        SessionStore,
        CourseScheduleStore,
        CourseViewGradeStore,
        CoursePresentGradeStore,
        ProgressStore,
        VerificationStore,
        CertificateStore,
      }) => ({
        computedCourseProgress: createComputedCourseFromStores({
          CourseStore,
          SessionStore,
          CourseScheduleStore,
          CourseViewGradeStore,
          CoursePresentGradeStore,
          ProgressStore,
          VerificationStore,
          CertificateStore,
        }),
      })
    )
  )(HOC);
};

export default function withComputedCourseProgress(component?: React.ComponentType) {
  // If this is called with no arguments (usually inside _.compose),
  // we will return a closure to be called later.
  if (!component) {
    return function (Component: React.ComponentType) {
      return withComputedCourseProgressImpl(Component);
    };
  } else {
    return withComputedCourseProgressImpl(component);
  }
}

export { createComputedCourseFromStores };
