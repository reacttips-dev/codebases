// TODO: Migrate off of Backbone
// eslint-disable-next-line no-restricted-imports
import type ItemMetadata from 'pages/open-course/common/models/itemMetadata';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import type Progress from 'pages/open-course/common/models/progress';

/**
 * Methods for reading the state in graded discussion prompt's ItemProgress objects.
 *
 * The purpose of this class is to interpret the progress attributes returned in graded discussion prompts' item progress.
 * The item progress model only supports three states: "Not Started", "Started", and "Completed"; however,
 * graded discussion prompts need to track five states: "Not Started", "Overdue", "Started", "Grading", and "Completed".
 */
class DiscussionPromptState {
  itemMetadata: ItemMetadata;

  itemProgress: Progress;

  constructor(itemMetadata: ItemMetadata, itemProgress: Progress) {
    this.itemMetadata = itemMetadata;
    this.itemProgress = itemProgress;
  }

  isCompleted(): boolean {
    return this.itemProgress.isComplete();
  }

  isGrading(): boolean {
    const gradingStartTimestamp = this.itemProgress.getDefinition('gradingStartsAt');
    if (!this.isCompleted() && this.isStarted() && gradingStartTimestamp && Date.now() > +gradingStartTimestamp) {
      return true;
    }
    return false;
  }

  isStarted(): boolean {
    return this.itemProgress.isAtLeastStarted();
  }

  isOverdue(): boolean {
    const gradingStartTimestamp = this.itemProgress.getDefinition('gradingStartsAt');
    if (!this.isStarted() && gradingStartTimestamp && Date.now() > +gradingStartTimestamp) {
      return true;
    }
    return false;
  }
}

export default DiscussionPromptState;
