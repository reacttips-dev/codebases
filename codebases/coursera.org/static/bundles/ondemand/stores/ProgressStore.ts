import _ from 'lodash';
import PeerState from 'bundles/assess-common/models/PeerState';
import StaffGradedState from 'bundles/assess-common/models/StaffGradedState';
import WiseFlowState from 'bundles/lms-interop/wise-flow-item/WiseFlowState';
import DiscussionPromptState from 'bundles/graded-discussion-prompt/models/DiscussionPromptState';
import { LtiState } from 'bundles/item-lti/models/LtiState';
import BaseStore from 'vendor/cnpm/fluxible.v0-4/addons/BaseStore';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import CourseProgress from 'pages/open-course/common/models/courseProgress';
import createLinkedModels from 'bundles/catalogP/lib/createLinkedModels';

// TODO: Migrate off of Backbone
/* eslint-disable no-restricted-imports */
import type ItemMetadata from 'pages/open-course/common/models/itemMetadata';

// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import type { Progress } from 'pages/open-course/common/models/progress';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import type Module from 'pages/open-course/common/models/module';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import type Lesson from 'pages/open-course/common/models/lesson';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import type ItemGroup from 'pages/open-course/common/models/itemGroup';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import type ItemGroupChoice from 'pages/open-course/common/models/itemGroupChoice';

type ProgressStore$DehydratedState = {
  hasHomeProgressLoaded: boolean;
  hasCourseProgressLoaded: boolean;
  modulesPassed: Array<string>;
  modulesCompleted: Array<string>;
  courseProgress: CourseProgress;
  rawCourseProgress: any;
};

/**
 * This store is intended to encapsulate any and all questions regarding the completion of items in a course.
 */
class ProgressStore extends BaseStore {
  static storeName = 'ProgressStore';

  static handlers = {
    LOAD_HOME_PROGRESS({
      modulesCompleted,
      modulesPassed,
    }: Pick<ProgressStore$DehydratedState, 'modulesCompleted' | 'modulesPassed'>) {
      // @ts-expect-error
      this.modulesCompleted = modulesCompleted;
      // @ts-expect-error
      this.modulesPassed = modulesPassed;
      // @ts-expect-error
      this.hasHomeProgressLoaded = true;
      // @ts-expect-error
      this.emitChange();
    },
    LOAD_COURSE_PROGRESS({
      courseProgress,
      rawCourseProgress,
    }: Pick<ProgressStore$DehydratedState, 'courseProgress' | 'rawCourseProgress'>) {
      // @ts-expect-error
      this.courseProgress = courseProgress;
      // @ts-expect-error
      this.rawCourseProgress = rawCourseProgress;
      // @ts-expect-error
      this.hasCourseProgressLoaded = true;
      // @ts-expect-error
      this.emitChange();
    },
  };

  static SERIALIZE_PROPS = [
    'modulesCompleted',
    'modulesPassed',
    'hasCourseProgressLoaded',
    'hasHomeProgressLoaded',
    'rawCourseProgress',
  ];

  modulesCompleted: Array<string> = [];

  modulesPassed: Array<string> = [];

  courseProgress: CourseProgress = new CourseProgress();

  rawCourseProgress = null;

  hasCourseProgressLoaded = false;

  hasHomeProgressLoaded = false;

  dehydrate(): ProgressStore$DehydratedState {
    // @ts-expect-error
    return _.pick(this, ProgressStore.SERIALIZE_PROPS);
  }

  rehydrate(state: ProgressStore$DehydratedState) {
    if (state.rawCourseProgress) {
      Object.assign(this, {
        ..._.pick(state, ProgressStore.SERIALIZE_PROPS),
        courseProgress: createLinkedModels(CourseProgress.prototype.resourceName, state.rawCourseProgress).first(),
      });
    }
  }

  hasLoaded(): boolean {
    return this.hasCourseProgressLoaded && this.hasHomeProgressLoaded;
  }

  getOverallProgressPercent(): number | null | undefined {
    if (this.hasCourseProgressLoaded) {
      return this.courseProgress.getOverallProgressPercent();
    }
    return undefined;
  }

  getNextItemForModule(module: Module): ItemMetadata | undefined {
    const nextLesson = module.getCoreLessons().find((lesson: Lesson) => {
      if (lesson.get('optional')) {
        return false;
      } else {
        return this.getNextItemForLesson(lesson);
      }
    });
    return nextLesson && this.getNextItemForLesson(nextLesson);
  }

  /**
   * If `items` is a sequence of items ordered in the order that a learner should do them, this returns the next
   * item that they should do. Returns `undefined` if there is no next item that they should do. (`undefined` does not
   * necessarily mean that they have completed all the items. For example, some of the items in the list might be
   * locked.)
   */
  _getNextItemFromItems(items: Array<ItemMetadata>) {
    return items.find((item: ItemMetadata) => {
      if (item.getTypeName() === 'supplement' || item.isLockedForSessions()) {
        return false;
        // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'ItemMetadata | undefined' is not... Remove this comment to see the full error message
      } else if (item.isReviewPartForSplitPeer() && !this.isItemSubmitted(item.assignmentPart)) {
        // review part shouldn't be next item if the assignment part is not submitted
        return false;
      } else {
        return !this.isItemSubmitted(item) || this.isPeerAssignmentFailed(item);
      }
    });
  }

  /**
   * Returns the next item that the learner should do in this lesson. Returns `undefined` if there is no next item that
   * they should do. (`undefined` does not necessarily mean that they have completed all the items. For example, see
   * the comment above `_getNextItemFromItems`. For another example, the learner may have completed enough choices
   * in a lesson with choices, without having completed all the items in the lesson.)
   */
  getNextItemForLesson(lesson: Lesson) {
    if (lesson.isItemGroupLesson()) {
      const itemGroup: ItemGroup = lesson.getItemGroups().at(0);
      const choices: Array<ItemGroupChoice> = itemGroup.getChoices();

      if (choices.length === 0) {
        return undefined;
      }

      type ChoiceNextItemsAndTimes = { lastActivityTime: number; nextItem?: ItemMetadata };
      const choiceNextItemsAndTimes = choices.map<ChoiceNextItemsAndTimes>((choice: ItemGroupChoice) => {
        const choiceItemMetadatas = choice.getItemMetadatas().toArray();
        const nextItem = this._getNextItemFromItems(choiceItemMetadatas);
        const progress = _.map(choiceItemMetadatas, (itemMetadata: ItemMetadata) =>
          this.getItemProgress(itemMetadata.getId())
        );
        const started = _.filter(progress, (itemProgress: Progress) => itemProgress.isAtLeastStarted());
        const times = _.map(started, (itemProgress: Progress) => itemProgress.getTimestamp() || 0);
        const lastActivityTime = _.max(times);

        return {
          lastActivityTime,
          nextItem,
        };
      });

      const choicesWithoutNextItemsCount = _.filter(choiceNextItemsAndTimes, ({ nextItem }) => !nextItem).length;
      if (choicesWithoutNextItemsCount >= itemGroup.getRequiredPassedCount()) {
        // The learner has completed enough items in this lesson.
        return undefined;
      }

      const filtered = _.filter<ChoiceNextItemsAndTimes>(choiceNextItemsAndTimes, ({ nextItem }) => !!nextItem);
      const sorted = _.sortBy(filtered, ({ lastActivityTime }) => -lastActivityTime);
      return sorted[0].nextItem;
    } else {
      return this._getNextItemFromItems(lesson.getItemMetadatas());
    }
  }

  getItemProgress(itemId: string): Progress {
    return this.courseProgress.getItemProgress(itemId);
  }

  getLessonProgress(lessonId: string) {
    return this.courseProgress.getProgressForLesson(lessonId);
  }

  getGradedAssignmentGroupProgress(groupId: string) {
    return this.courseProgress.getGradedAssignmentGroupProgress(groupId);
  }

  getItemProgressesForLesson(lesson: Lesson) {
    return this.courseProgress.getItemProgressesForLesson(lesson);
  }

  getItemPeerState(item: ItemMetadata): PeerState {
    return new PeerState(item, this.courseProgress.getItemProgress(item.getId()));
  }

  getWiseFlowState(item: ItemMetadata): StaffGradedState {
    return new WiseFlowState(item, this.courseProgress.getItemProgress(item.getId()));
  }

  getItemStaffGradedState(item: ItemMetadata): StaffGradedState {
    return new StaffGradedState(item, this.courseProgress.getItemProgress(item.getId()));
  }

  getItemLtiState(item: ItemMetadata): LtiState {
    return new LtiState(item, this.courseProgress.getItemProgress(item.getId()));
  }

  getItemDiscussionPromptState(item: ItemMetadata): DiscussionPromptState {
    return new DiscussionPromptState(item, this.courseProgress.getItemProgress(item.getId()));
  }

  /**
   * Is the item complete. For split peer review items, is reviewing done or passed (whichever item part is passed in).
   */
  isItemComplete(item: ItemMetadata): boolean {
    if (item.isProject()) {
      return this.getItemStaffGradedState(item).isCompleted();
    } else if (item.isGradedDiscussionPrompt()) {
      return this.getItemDiscussionPromptState(item).isCompleted();
    } else if (item.isLti()) {
      return this.getItemLtiState(item).isCompleted();
    }

    if (item.isAssignmentPartForSplitPeer() || item.isMentorGraded()) {
      return this.getItemPeerState(item).isPassed();
    } else if (item.isReviewPartForSplitPeer()) {
      return this.getItemPeerState(item).isReviewingComplete();
    }
    return this.courseProgress.getItemProgress(item.getId()).isComplete();
  }

  /**
   * Is the item complete. For split peer reviews, is both reviewing done and passed.
   */
  isCombinedItemComplete(item: ItemMetadata): boolean {
    if (item.isAssignmentPartForSplitPeer() || item.isReviewPartForSplitPeer()) {
      const peerState = this.getItemPeerState(item);
      return peerState.isReviewingComplete() && peerState.isPassed();
    }
    return this.courseProgress.getItemProgress(item.getId()).isComplete();
  }

  /*
   * NOTE: DON'T USE THIS. If you must check for submission,
   * make sure you're using the new item model with located in
   * `bundles/learner-progress/types/Item`. You can use the
   * `withComputedItem` HOC to construct the model if needed.
   *
   * There is a MAJOR BUG with this code!
   * For most cases, it won't check if the assignment was submitted,
   * it will actually check if the assignment was **completed**.
   *
   * For most assignments, there isn't a clean way to check for submission -
   * this function was created to deal with the cases where checking for
   * submission was high priority (team projects, peer items...).
   *
   * Now we do often need to check carefully for submission - however,
   * it is difficult to immediately delete this code due to how it's
   * entangled with other business logic in this store. It requires
   * some careful examination when somebody can refactor this.
   *
   */
  isItemSubmitted(item: ItemMetadata): boolean {
    if (item.isProject()) {
      return this.getItemStaffGradedState(item).isSubmitted();
    }
    if (item.isAssignmentPartForSplitPeer() || item.isMentorGraded()) {
      return this.getItemPeerState(item).isSubmitted();
    }
    if (item.isLti()) {
      return this.getItemLtiState(item).isSubmitted();
    }
    return this.isItemComplete(item);
  }

  isPeerAssignmentFailed(item: ItemMetadata): boolean {
    return (item.isAssignmentPartForSplitPeer() || item.isMentorGraded()) && this.getItemPeerState(item).isFailed();
  }

  areModuleIdsComplete(moduleIds: Array<string> = []): boolean {
    return moduleIds.every((moduleId) => {
      return this.modulesCompleted.indexOf(moduleId) > -1;
    });
  }

  areModuleIdsPassed(moduleIds: Array<string>): boolean {
    return _.intersection(this.modulesPassed, moduleIds).length === moduleIds.length;
  }

  getModuleProgress(moduleId: string) {
    return this.courseProgress.getModuleProgress(moduleId);
  }
}

export default ProgressStore;
