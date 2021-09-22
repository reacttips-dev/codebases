/**
 * Methods for reading the state in staff graded assignment's ItemProgress objects.
 *
 * The purpose of this class is interpret the extra progress attributes returned in staff-graded assignments' item progress.
 * The item progress model only supports three states: "Not Started", "Started", and "Completed"; however,
 * staff-graded assignments need to track four states: "Not Started", "Started", "Submitted", and "Completed".
 * For backward compatibility, the extra submitted property is assumed to be true.
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

// TODO: Migrate off of Backbone
/* eslint-disable no-restricted-imports */
import type ItemMetadata from 'pages/open-course/common/models/itemMetadata';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import type Progress from 'pages/open-course/common/models/progress';

class StaffGradedState {
  itemMetadata: ItemMetadata;

  itemProgress: Progress;

  constructor(itemMetadata: ItemMetadata, itemProgress: Progress) {
    this.itemMetadata = itemMetadata;
    this.itemProgress = itemProgress;
  }

  isCompleted(): boolean {
    return this.itemProgress.isComplete();
  }

  isSubmitted(): boolean {
    // initialize explicit submitted status from extra properties returned for staff-graded assignment item progress
    // note: an assignment's submitted status is defaulted to true for backward compatibility (ie. undefined = true)
    const isSubmittedNotFalse = this.itemProgress.getDefinition('submitted') !== false;

    // an assignment is considered submitted if the submitted property is not explicitly false and progress is started
    return isSubmittedNotFalse && this.isStarted();
  }

  isStarted(): boolean {
    return this.itemProgress.isAtLeastStarted();
  }
}

export default StaffGradedState;
