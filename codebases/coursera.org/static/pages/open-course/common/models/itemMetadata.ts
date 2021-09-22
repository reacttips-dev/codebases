/* ItemMetadata contains data about a course item and its contents.
 *
 * ItemMetadata's attributes are exactly the attributes returned by the course data
 * API, plus an attribute called `lesson` that refers to the parent lesson for
 * this item.
 */

import ItemTypes from 'bundles/item/constants/ItemTypes';

import Backbone from 'backbone-associations';
import moment from 'moment';
import _ from 'underscore';
import path from 'js/lib/path';
import constants from 'pages/open-course/common/constants';
import toHumanReadableTypeName from 'bundles/ondemand/utils/toHumanReadableTypeName';
import getUrlTypeName from 'bundles/ondemand/utils/getUrlTypeName';
import { CORE_TRACK, HONORS_TRACK } from 'pages/open-course/common/models/tracks';
import GradingLatePenalty from 'bundles/author-common/models/GradingLatePenalty';

const THREE_DAYS_MS = 259200000;

class ItemMetadata extends Backbone.AssociatedModel {
  comparator = 'sequence';

  assignmentPart?: ItemMetadata;

  /**
   * Get the base link to the item, of the form /learn/:courseSlug/:itemType/:itemId-:itemSlug
   * base link != entry link for certain types, like 'splitPeerReviewItem'
   */
  getBaseLink() {
    const link = path.join(this.get('course').getLink(), this.getUrlTypeName(), this.get('id'), this.get('slug'));

    return link;
  }

  /**
   * Get the entry link to the item, of the form /learn/:courseSlug/:itemType/:itemId-:itemSlug/[...]
   */
  getLink() {
    const link = path.join(this.get('course').getLink(), this.getCourseRelativeLink());

    return link;
  }

  /**
   * Get the relative entry link to the item, relative to the course, of the form :itemType/:itemId-:itemSlug.
   */
  getCourseRelativeLink() {
    let url = path.join(this.getUrlTypeName(), this.get('id'), this.get('slug'));
    if (this.isReviewPartForSplitPeer()) {
      url = path.join(url, 'give-feedback');
    }
    return url;
  }

  getChoice() {
    return this.get('choice');
  }

  getModuleId() {
    return this.get('lesson.module').get('id');
  }

  getLesson() {
    return this.get('lesson');
  }

  getLessonId() {
    return this.get('lesson').get('id');
  }

  getTimeCommitment() {
    const timeCommitment = this.get('timeCommitment') || this.getDefinition('duration');

    return moment.duration(timeCommitment);
  }

  getUrlTypeName() {
    return getUrlTypeName(this.getTypeName());
  }

  getTypeName() {
    try {
      if (this.getContent()) {
        return this.getContent().typeName;
      } else {
        return this.get('content').typeName;
      }
    } catch (err) {
      // TODO: This try/catch is here because of FLEX-8443
      return undefined;
    }
  }

  getContent() {
    return this.get('contentSummary');
  }

  getGradingLatePenalty() {
    const latePenalty = this.getDefinition('gradingLatePenalty');
    return latePenalty ? new GradingLatePenalty(latePenalty) : null;
  }

  getDefinition(key: string) {
    return this.getContent().definition[key];
  }

  /**
   * This is only defined for gradable items in the core track that are not in an item group's choice.
   */
  getGradingWeight() {
    return this.get('gradingWeight');
  }

  /**
   * This is only defined for gradable items in the core track that are not in an item group's choice.
   */
  isPassRequiredForCourse() {
    return this.get('isRequiredForPassing');
  }

  getName() {
    if (this.getTypeName() === 'assessOpenSinglePage') {
      return 'Quiz: ' + this.get('name');
    } else {
      return this.get('name');
    }
  }

  /**
   * Get a prefix for displaying in front of the item's title. This prefix contains information about the type of
   * item and the track that the item is in.
   */
  getTitlePrefix() {
    return toHumanReadableTypeName(this.getTypeName(), this.getTrackId(), this.getContent());
  }

  getId() {
    return this.get('id');
  }

  /**
   * @return {Int}
   */
  getLectureIndexInModule() {
    if (!this.isLecture()) {
      return -1;
    }

    return this.get('lesson.module').getLectureItemMetadatas().indexOf(this);
  }

  getLectureIndexInCourse() {
    if (!this.isLecture()) {
      return -1;
    }

    return this.get('courseMaterials').getLectureItemMetadatas().indexOf(this);
  }

  isLecture() {
    return this.getTypeName() === 'lecture';
  }

  isGradedLti() {
    return this.getTypeName() === 'gradedLti';
  }

  isUngradedLti() {
    return this.getTypeName() === 'ungradedLti';
  }

  isLti() {
    return this.isGradedLti() || this.isUngradedLti();
  }

  isSignatureTrack() {
    return this.get('course').get('signatureTrack');
  }

  /**
   * Item is any type of peer review, including ungraded peer review items.
   */
  isPeerReview() {
    const peerReviewTypes = ['peer', 'phasedPeer', 'gradedPeer', 'closedPeer', 'splitPeerReviewItem'];
    return peerReviewTypes.indexOf(this.getTypeName()) !== -1;
  }

  isProgrammingAssignment() {
    return ['programming', 'gradedProgramming', 'ungradedProgramming'].indexOf(this.getTypeName()) !== -1;
  }

  isWidget() {
    return ['ungradedWidget', 'gradedWidget'].indexOf(this.getTypeName()) !== -1;
  }

  isProject() {
    return this.getTypeName() === 'staffGraded';
  }

  isGradedDiscussionPrompt() {
    return this.getTypeName() === ItemTypes.GradedDiscussionPrompt;
  }

  isTeammateReview() {
    return this.getTypeName() === ItemTypes.TeammateReview;
  }

  isWiseFlow() {
    return this.getTypeName() === ItemTypes.WiseFlow;
  }

  isTeamAssignment() {
    try {
      if (this.getContent()) {
        return this.getContent().definition.isTeamSubmissionEnabled;
      } else {
        return this.get('content').definition.isTeamSubmissionEnabled;
      }
    } catch (err) {
      // TODO: This try/catch is here because of FLEX-8443
      return false;
    }
  }

  /**
   * Whether this item is is a peer review item that should be displayed as a separate "assignment part" and
   * "review part". Components that render lists of item (e.g. the week view, the assignments page, and the item
   * side nav) call this function to decide whether to display a single peer review item as two separate "assignment
   * part" and "review part" items.

   * Returns false for ungraded peer assignments because we display those as single items.
   * Returns false for mentor graded peer assignments because learners are not supposed
   * to do a review step for them. Returns true for all other peer assignments.
   */
  isAssignmentPartForSplitPeer() {
    return !this.isMentorGraded() && ['phasedPeer', 'gradedPeer', 'closedPeer'].indexOf(this.getTypeName()) !== -1;
  }

  /**
   * See ItemMetadata.isAssignmentPartForSplitPeer. This is a "fake" (client-side only) item metadata type that refers
   * to the review portion of split graded peer reviews.
   *
   * Also see ItemMetadata.GetReviewPartFromSplitPeer
   */
  isReviewPartForSplitPeer() {
    return this.getTypeName() === 'splitPeerReviewItem';
  }

  /**
   * Item has the isMentorGraded flag.
   */
  isMentorGraded() {
    return this.getDefinition('isMentorGraded');
  }

  /**
   * TODO(ASSESS-1436): Make a single source of truth for which items are gradable.
   */
  isGradable() {
    return _(constants.items.gradableTypes).contains(this.getTypeName());
  }

  isAssessment() {
    return _(constants.items.assessmentTypes).contains(this.getTypeName());
  }

  isLockedBeforeSessionStart() {
    return this.getItemLockedReason() === constants.itemLockedReasonCodes.SESSION_PREVIEW;
  }

  isSessionEndedLocked() {
    return (
      this.getItemLockedReason() === constants.itemLockedReasonCodes.SESSION_ENDED ||
      this.getItemLockedReason() === constants.itemLockedReasonCodes.SESSION_ENDED_FOR_FLEXIBLE_SCHEDULE
    );
  }

  isLockedForPassableItem() {
    return this.isLocked() && this.getItemLockedReason() === constants.itemLockedReasonCodes.PASSABLE_ITEM_COMPLETION;
  }

  isLockedByTimedRelease() {
    return this.isLocked() && this.getItemLockedReason() === constants.itemLockedReasonCodes.TIMED_RELEASE_CONTENT;
  }

  isLocked() {
    return !!this.getItemLockStatus();
  }

  isLockedForSessions() {
    return (
      this.isLocked() &&
      (this.isSessionEndedLocked() || this.isLockedBeforeSessionStart() || this.isLockedByTimedRelease())
    );
  }

  isLockedFully() {
    return this.getItemLockStatus() === constants.itemLockedStatus.LOCKED_FULLY;
  }

  isLockedForSubmitting() {
    return this.getItemLockStatus() === constants.itemLockedStatus.LOCKED_FOR_SUBMITTING;
  }

  getItemLockStatus() {
    return this.get('lockedStatus');
  }

  getItemLockedReason() {
    return this.get('itemLockedReasonCode');
  }

  // ItemLockSummary

  getItemLockSummary() {
    return this.get('itemLockSummary');
  }

  getItemLockInfo() {
    return this.getItemLockSummary() && this.getItemLockSummary().lockInfo;
  }

  getItemLockInfoType() {
    return this.getItemLockInfo() && this.getItemLockInfo().typeName;
  }

  getTimedItemUnlockTimeStart() {
    return (
      this.getItemLockInfoType() &&
      this.getItemLockInfoType() === constants.itemLockInfoTypeNames.timedReleaseContentLockInfo &&
      moment(this.getItemLockInfo().definition.unlockedTimeStart)
    );
  }

  getTimedItemUnlockTimeEnd() {
    return (
      this.getItemLockInfoType() &&
      this.getItemLockInfoType() === constants.itemLockInfoTypeNames.timedReleaseContentLockInfo &&
      moment(this.getItemLockInfo().definition.unlockedTimeEnd)
    );
  }

  // END: ItemLockSummary

  getTrackId() {
    return this.get('trackId');
  }

  isCore() {
    return this.getTrackId() === CORE_TRACK;
  }

  isHonors() {
    return this.getTrackId() === HONORS_TRACK;
  }

  isPremiumGradingLocked() {
    return this.getItemLockedReason() === constants.itemLockedReasonCodes.PREMIUM;
  }

  isResitLocked() {
    return this.getItemLockedReason() === constants.itemLockedReasonCodes.RESIT;
  }

  /** if this is a split peer assignment it returns a clone of this item with the
   * content type set to 'splitPeerReviewItem'. Returns a new item every time, since we can't depend
   * on the old item being updated.
   */
  getReviewPartFromSplitPeer() {
    if (!this.isAssignmentPartForSplitPeer()) {
      return undefined;
    }
    const reviewItem = this.clone() as ItemMetadata;

    // we must get a new, unlinked content object
    const content = { ...reviewItem.get('contentSummary') };
    content.typeName = 'splitPeerReviewItem';

    if (!content.definition.reviewDeadlineOffset) {
      // For graded and closed peer reviews, set a default of 3 days for the review deadline offset.
      content.definition.reviewDeadlineOffset = THREE_DAYS_MS;
    }

    reviewItem.set('contentSummary', content);
    reviewItem.assignmentPart = this;

    return reviewItem;
  }
}

export default ItemMetadata;
