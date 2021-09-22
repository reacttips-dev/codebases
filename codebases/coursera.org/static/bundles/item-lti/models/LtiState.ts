/**
 * Methods for reading the state in LTI's ItemProgress objects.
 *
 * The purpose of this class is interpret the extra progress attributes returned in LTI's item progress content definition.
 * The item progress model only supports three states: "Not Started", "Started", and "Completed"; however,
 * LTIs need to track four states: "Not Started", "Started", "Submitted_Not_Graded", "Submitted_And_Graded".
 *
 * "Completed" means the learner's submission has been graded.
 *   => item progress = completed
 * "Submitted" means the learner has submitted their work for grading.
 *   => item progress = started and extra submitted property is not explicitly false
 * "Started" means the learner has accessed the assignment's contents (ie. instructions, teams, or submissions page)
 *   => item progress = started
 * "Not Started" means an untouched assignment.
 *   => item progress = not started
 *
 */
// TODO: Migrate ItemMetadata off of Backbone
/* eslint-disable no-restricted-imports */
import type ItemMetadata from 'pages/open-course/common/models/itemMetadata';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import type Progress from 'pages/open-course/common/models/progress';

export enum ActivityProgressStatus {
  INITIALIZED = 'Initialized',
  STARTED = 'Started',
  IN_PROGRESS = 'InProgress',
  SUBMITTED = 'Submitted',
  COMPLETED = 'Completed',
}

export enum GradingProgressStatus {
  FULLY_GRADED = 'FullyGraded',
  PENDING = 'Pending',
  PENDING_MANUAL = 'PendingManual',
  FAILED = 'Failed',
  NOT_READY = 'NotReady',
}

export class LtiState {
  activityProgressStatus: ActivityProgressStatus | undefined;

  gradingProgressStatus: GradingProgressStatus | undefined;

  itemMetadata: ItemMetadata;

  itemProgress: Progress;

  constructor(itemMetadata: ItemMetadata, itemProgress: Progress) {
    this.itemMetadata = itemMetadata;
    this.itemProgress = itemProgress;

    this.activityProgressStatus = itemProgress.getDefinition('activityProgressStatus');
    this.gradingProgressStatus = itemProgress.getDefinition('gradingProgressStatus');
  }

  isCompleted(): boolean {
    return this.itemProgress.isComplete();
  }

  isGraded(): boolean {
    return this.gradingProgressStatus === GradingProgressStatus.FULLY_GRADED;
  }

  isSubmitted(): boolean {
    return (
      // Fallback for LTI 1.1: Just check the progress model for completion. (There is no submission)
      this.itemProgress.isComplete() ||
      // LTI 1.3 only
      this.activityProgressStatus === ActivityProgressStatus.SUBMITTED ||
      this.activityProgressStatus === ActivityProgressStatus.COMPLETED
    );
  }

  isSubmittedNotGraded(): boolean {
    return (
      this.activityProgressStatus !== undefined &&
      this.gradingProgressStatus !== undefined &&
      [ActivityProgressStatus.SUBMITTED].includes(this.activityProgressStatus) &&
      [GradingProgressStatus.NOT_READY, GradingProgressStatus.PENDING_MANUAL].includes(this.gradingProgressStatus)
    );
  }

  isStarted(): boolean {
    return this.itemProgress.isAtLeastStarted();
  }
}

export default LtiState;
