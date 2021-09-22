import React from 'react';
import moment from 'moment';

import user from 'js/lib/user';
import LearnerHelpLink from 'bundles/common/components/LearnerHelpLink';
import type {
  Item,
  ItemLockedStatus,
  ItemLockedReasonCode,
  ItemLockSummary,
} from 'bundles/learner-progress/types/Item';

import toHumanReadableTypeName from 'bundles/ondemand/utils/toHumanReadableTypeName';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import FloatToPercent from 'bundles/primitive-formatting/components/FloatToPercent';
import {
  formatDateTimeDisplay,
  LONG_DATETIME_DISPLAY,
  LONG_DATETIME_NO_YEAR_DISPLAY,
  MED_DATETIME_NO_YEAR_DISPLAY,
  SHORT_MONTH_DAY_DISPLAY,
  TIME_ONLY_DISPLAY,
} from 'js/utils/DateTimeUtils';

import type { SessionLabel } from 'bundles/course-sessions/utils/withSessionLabel';

import epicClient from 'bundles/epic/client';

import _t from 'i18n!nls/learner-progress';

const isManualLockEnabled = () => epicClient.get('Authoring', 'manualLockEnabled');

export function getIsHonors(item: Item): boolean {
  return item.trackId === 'honors';
}

export function getIsGradable(item: Item): boolean {
  return [
    'exam',
    'closedPeer',
    'gradedPeer',
    'phasedPeer',
    'splitPeerReviewItem',
    'gradedProgramming',
    'programming',
    'gradedLti',
    'gradedDiscussionPrompt',
    'teammateReview',
    'staffGraded',
    'wiseFlow',
  ].includes(item.contentSummary.typeName);
}

export function getIsPeerReview(item: Item): boolean {
  const types = ['peer', 'phasedPeer', 'gradedPeer', 'closedPeer', 'splitPeerReviewItem'];
  return types.indexOf(item.contentSummary.typeName) !== -1;
}

export function getIsReviewPartForSplitPeer(item: Item): boolean {
  return item.contentSummary.typeName === 'splitPeerReviewItem';
}

export function getIsMentorGraded(item: Item): boolean {
  if (
    item.contentSummary.typeName === 'peer' ||
    item.contentSummary.typeName === 'phasedPeer' ||
    item.contentSummary.typeName === 'gradedPeer' ||
    item.contentSummary.typeName === 'closedPeer'
  ) {
    return item.contentSummary.definition.isMentorGraded;
  }

  return false;
}

export function getIsAssignmentPartForSplitPeer(item: Item): boolean {
  return (
    !getIsMentorGraded(item) && ['phasedPeer', 'gradedPeer', 'closedPeer'].indexOf(item.contentSummary.typeName) !== -1
  );
}

export function getIsLocked(item: Item): boolean {
  return !!item.itemLockedStatus;
}

export function getIsLockedFully(item: Item): boolean {
  return getIsLocked(item) && item.itemLockedStatus === 'LOCKED_FULLY';
}

export function getIsLockedItemPreviewable(item: Item): boolean {
  return user.isSuperuser() || item.itemLockSummary?.isPreviewableByCourseStaff === true;
}

export function getIsLockedForSessions(item: Item): boolean {
  return (
    getIsLocked(item) &&
    (item.itemLockedReasonCode === 'SESSION_ENDED' ||
      item.itemLockedReasonCode === 'SESSION_ENDED_FOR_FLEXIBLE_SCHEDULE' ||
      item.itemLockedReasonCode === 'SESSION_PREVIEW' ||
      item.itemLockedReasonCode === 'TIMED_RELEASE_CONTENT')
  );
}

export function getIsLockedByResit(item: Item): boolean {
  return getIsLocked(item) && item.itemLockedReasonCode === 'RESITTING_ITEM_LOCK_OVERRIDE';
}

export function getIsLockedByTimedRelease(item: Item): boolean {
  return getIsLocked(item) && item.itemLockedReasonCode === 'TIMED_RELEASE_CONTENT';
}

export function getIsLockedForPremiumGrading(item: Item): boolean {
  return getIsLocked(item) && item.itemLockedReasonCode === 'PREMIUM';
}

export function getIsLockedForSubmitting(item: Item): boolean {
  return getIsLocked(item) && item.itemLockedStatus === 'LOCKED_FOR_SUBMITTING';
}

export function getIsTeamSubmissionEnabled(item: Item) {
  if (item.contentSummary.typeName === 'staffGraded') {
    return item.contentSummary.definition.isTeamSubmissionEnabled;
  }
  return false;
}

export function getStandardProctorConfigurationId(item: Item) {
  if (item.contentSummary.typeName === 'staffGraded') {
    return item.contentSummary.definition.standardProctorConfigurationId;
  }
  return null;
}

export function isGradeVisible(computedItem: Item | null | undefined) {
  const { grade, contentSummary: { typeName = '' } = {} } = computedItem || {};
  const hasGrade = typeof grade !== 'undefined';
  const enabledGradeVisibilityTypes: Array<string> = epicClient.get('Authoring', 'enabledGradeVisibilityTypes');
  const isGradeVisibilitySettable = enabledGradeVisibilityTypes.includes(typeName);

  return !isGradeVisibilitySettable || (isGradeVisibilitySettable && hasGrade);
}

/* eslint-disable no-warning-comments */
// HACK: Since there is no backend concept of a review part for peer review,
// we mutate the peer review item to generate a review item for display in the UI.
/* eslint-enable no-warning-comments */
export function getReviewPartFromSplitPeer(item: Item): Item | undefined {
  if (!getIsAssignmentPartForSplitPeer(item)) {
    return undefined;
  }

  const reviewPartItem = { ...item };
  let definition;

  if ('reviewDeadlineOffset' in reviewPartItem.contentSummary.definition) {
    definition = reviewPartItem.contentSummary.definition;
  }

  reviewPartItem.contentSummary = {
    definition: definition as { reviewDeadlineOffset: number },
    typeName: 'splitPeerReviewItem',
  };

  if (!reviewPartItem.contentSummary.definition.reviewDeadlineOffset) {
    // Offset deadline by 3 days.
    reviewPartItem.contentSummary.definition.reviewDeadlineOffset = 259200000;
  }

  if (item.deadline) {
    reviewPartItem.deadline = moment(
      item.deadline.unix() * 1000 + reviewPartItem.contentSummary.definition.reviewDeadlineOffset
    );
  }

  reviewPartItem.resourcePath = `${item.resourcePath}/give-feedback`;
  reviewPartItem.gradingLatePenalty = undefined;
  reviewPartItem.gradingWeight = undefined;
  reviewPartItem.grade = undefined;
  reviewPartItem.appliedLatePenalty = undefined;

  reviewPartItem.isFailed = false;
  reviewPartItem.isPassed = reviewPartItem.isPeerAssignmentReviewComplete;
  reviewPartItem.isCompleted = reviewPartItem.isPeerAssignmentReviewComplete;

  return reviewPartItem;
}

// Does not return a formatted title prefix for the following item types:
// lecture, ungradedLti, gradedLti
export function getFormattedTitlePrefix(item: Item, isGuidedProject?: boolean): string {
  return toHumanReadableTypeName(item.contentSummary.typeName, item.trackId, item.contentSummary, isGuidedProject);
}

// Used for screenreaders.
// Returns formatted type name only for item types where we don't
// display the formatted title prefix in the UI, which include the following types:
// lecture, ungradedLti, gradedLti, wiseFlow
export function getFormattedTitlePrefixForA11y(item: Item, isGuidedProject?: boolean): string | '' {
  if (item.contentSummary.typeName === 'lecture') {
    return _t('Lecture');
  } else if (item.contentSummary.typeName === 'ungradedLti') {
    if (isGuidedProject) {
      return _t('Guided Project');
    } else {
      return _t('Ungraded External Tool');
    }
  } else if (item.contentSummary.typeName === 'gradedLti') {
    if (isGuidedProject) {
      return _t('Guided Project');
    } else {
      return _t('Graded External Tool');
    }
  } else if (item.contentSummary.typeName === 'wiseFlow') {
    return _t('External Item from WISEflow');
  }

  return '';
}

export function getFormattedTRCAvailabilityWindowMessage(
  itemLockedStatus?: ItemLockedStatus,
  itemLockedReasonCode?: ItemLockedReasonCode,
  itemLockSummary?: ItemLockSummary
): string {
  let endDate = '';
  let startDate = '';

  if (
    itemLockedStatus != null &&
    itemLockedReasonCode === 'TIMED_RELEASE_CONTENT' &&
    itemLockSummary != null &&
    itemLockSummary.lockInfo != null &&
    itemLockSummary.lockInfo.typeName === 'timedReleaseContentLockInfo'
  ) {
    const { lockInfo } = itemLockSummary;

    const endTime = moment(lockInfo.definition.unlockedTimeEnd);
    const startTime = moment(lockInfo.definition.unlockedTimeStart);

    if (startTime.year() !== endTime.year()) {
      startDate = formatDateTimeDisplay(startTime, LONG_DATETIME_DISPLAY);
      endDate = formatDateTimeDisplay(endTime, LONG_DATETIME_DISPLAY);
    } else {
      startDate = formatDateTimeDisplay(startTime, LONG_DATETIME_NO_YEAR_DISPLAY);
      endDate = formatDateTimeDisplay(endTime, LONG_DATETIME_NO_YEAR_DISPLAY);
    }

    return `${startDate} - ${endDate}`;
  }

  return '';
}

type FormattedLockMessageOptions = {
  sessionsV2Enabled?: boolean;
  sessionLabel: SessionLabel;
  itemLockedStatus?: ItemLockedStatus;
  itemLockedReasonCode?: ItemLockedReasonCode;
  itemLockSummary?: ItemLockSummary;
  scheduleSuggestionsAvailable?: boolean;
};

export function getFormattedLockMessage({
  sessionsV2Enabled,
  itemLockedStatus,
  itemLockedReasonCode,
  itemLockSummary,
  sessionLabel,
  scheduleSuggestionsAvailable = true,
}: FormattedLockMessageOptions): string | JSX.Element {
  if (!itemLockedStatus) {
    return '';
  }

  switch (itemLockedReasonCode) {
    case 'SESSION_ENDED':
      if (!scheduleSuggestionsAvailable) {
        return sessionLabel === 'session'
          ? _t('This item is locked because the session has ended.')
          : _t('This item is locked because your schedule has ended.');
      }

      if (sessionsV2Enabled) {
        return _t('Reset your deadline to unlock the assignments.');
      }

      return sessionLabel === 'session'
        ? _t('The due date for this assignment has passed. Join another session to unlock the assignment.')
        : _t('The due date for this assignment has passed. Join another schedule to unlock the assignment.');
    case 'SESSION_ENDED_FOR_FLEXIBLE_SCHEDULE':
      return _t('All deadlines have passed.');
    case 'PREMIUM':
      return _t('Purchase a subscription to unlock this item.');
    case 'PASSABLE_ITEM_COMPLETION':
      return _t('Complete the previous item to unlock this.');
    case 'ENROLLMENT_PREVIEW':
      return sessionLabel === 'session'
        ? _t('This item will be unlocked when you enroll in a session.')
        : _t('This item will be unlocked when you enroll in a schedule.');
    case 'SESSION_PREVIEW':
      return sessionLabel === 'session'
        ? _t('This item will be unlocked when the session begins.')
        : _t('This item will be unlocked when the schedule begins.');
    case 'PREMIUM_ITEM':
      return _t('Purchase a subscription to unlock this item.');
    case 'TIMED_RELEASE_CONTENT': {
      const timedItemLockCustomMessage = itemLockSummary?.lockInfo?.definition?.timedItemLockCustomMessage;
      if (isManualLockEnabled() && !!timedItemLockCustomMessage) {
        return timedItemLockCustomMessage;
      } else {
        return (
          <FormattedMessage
            message={_t(
              'This item will be available {availabilityWindow}. Please contact your admin with any questions.'
            )}
            availabilityWindow={getFormattedTRCAvailabilityWindowMessage(
              itemLockedStatus,
              itemLockedReasonCode,
              itemLockSummary
            )}
          />
        );
      }
    }
    case 'RESITTING_ITEM_LOCK_OVERRIDE':
      return _t('This assignment is not part of your course resit, so you cannot access it.');

    default:
      return _t('This item is locked.');
  }
}

// TODO: Modify to accept deadline as a number
export function getFormattedDeadline(deadline: moment.Moment): string {
  return formatDateTimeDisplay(deadline, MED_DATETIME_NO_YEAR_DISPLAY);
}

// TODO: Modify to accept deadline as a number
export function getShortFormattedDeadline(deadline: moment.Moment): string {
  return formatDateTimeDisplay(deadline, SHORT_MONTH_DAY_DISPLAY);
}

// TODO: Modify to accept deadline as a number
export function getShortFormattedDeadlineTime(deadline: moment.Moment): string {
  return formatDateTimeDisplay(deadline, TIME_ONLY_DISPLAY);
}

export function getFormattedGrade(grade: number) {
  return <FloatToPercent value={grade} />;
}

export function getFormattedGradingWeight(gradingWeight: number) {
  return <FloatToPercent value={gradingWeight} />;
}

export function getFormattedLatePenalty(latePenalty: number) {
  return <FloatToPercent value={latePenalty} maxFractionDigits={0} />;
}

export function getStatusExplanation(
  item: Item,
  sessionLabel: SessionLabel,
  sessionsV2Enabled?: boolean,
  scheduleSuggestionsAvailable = true
): string | JSX.Element | null {
  if (getIsLocked(item)) {
    return getFormattedLockMessage({
      sessionsV2Enabled,
      sessionLabel,
      scheduleSuggestionsAvailable,
      itemLockedStatus: item.itemLockedStatus,
      itemLockedReasonCode: item.itemLockedReasonCode,
      itemLockSummary: item.itemLockSummary,
    });
  }

  // "adjusted" status explanation - unfortunately not translatable since authored
  if (item.hasOutcomeOverride) {
    const newGrade = getFormattedGrade(item.outcomeOverride.grade);
    if (item.outcomeOverride.explanation) {
      return (
        <FormattedMessage
          message={_t('Your grade was changed to {newGrade}. {explanation}')}
          newGrade={newGrade}
          explanation={item.outcomeOverride.explanation}
        />
      );
    } else {
      return <FormattedMessage message={_t('Your grade was changed to {newGrade}.')} newGrade={newGrade} />;
    }
  }

  // peer review status explanations
  if (getIsAssignmentPartForSplitPeer(item) && item.isPeerAssignmentWaitingForEvaluation && item.isSubmitted) {
    return (
      <FormattedMessage
        message={_t(
          'Your assignment is submitted. If you submitted on time, you only need 1 review to get your grade. If you submitted after the deadline, you might need more. {helpLink}'
        )}
        helpLink={<LearnerHelpLink articleId="208279966" />}
      />
    );
  }
  // note: this isSubmitted actually checks the assignment part
  if (getIsReviewPartForSplitPeer(item) && !item.isPeerAssignmentReviewComplete && item.isSubmitted) {
    return (
      <FormattedMessage
        message={_t(
          "You must review {requiredReviewCount, plural, =1 {# peer's} other {# peers'}} assignment to receive your grade."
        )}
        requiredReviewCount={item.requiredReviewCount}
      />
    );
  }

  return null;
}

export function getShortFormattedStatus(
  item: Item,
  isDegreeSession?: boolean,
  isDropped?: boolean
): string | JSX.Element {
  if (item.hasOutcomeOverride) {
    return _t('Adjusted');
  }
  if (getIsLocked(item)) {
    return _t('Locked');
  }
  if (isDropped) {
    return _t('Dropped');
  }
  if (!item.isSubmitted && item.deadlineProgress === 'OVERDUE') {
    return _t('Overdue');
  }
  // note: this isSubmitted actually checks the assignment part
  if (getIsReviewPartForSplitPeer(item) && item.isSubmitted) {
    return (
      <FormattedMessage
        message="{reviewCount, number}/{requiredReviewCount} reviewed"
        reviewCount={item.reviewCount}
        requiredReviewCount={item.requiredReviewCount}
      />
    );
  }
  if (getIsReviewPartForSplitPeer(item) && !item.isSubmitted) {
    return '--';
  }

  // in degree sessions, we want to only communicate pass / fail on explicit
  // flags from the instructor
  if (isDegreeSession) {
    // when degree session is "mastery graded" make sure we use passed and
    // didn't pass language for all items (they're all required)
    // when degree session is "cumulative graded" only use passed and didn't
    // pass for items marked required for passing
    const isMasteryGraded = !item.isCumulativeGraded;
    const itemIsRequired = item.isPassRequiredForCourse || isMasteryGraded;
    if (item.isPassed && itemIsRequired) {
      return _t('Passed');
    }
    if (item.isFailed && itemIsRequired) {
      return _t("Didn't Pass");
    }
    if (item.isGraded && !itemIsRequired) {
      return _t('Graded');
    }
  }

  if (item.isPassed) {
    return _t('Passed');
  }
  if (item.isFailed) {
    return _t("Didn't Pass");
  }
  if (item.isSubmitted && !item.isGraded) {
    return _t('Submitted');
  }

  return '--';
}

export function getIsRequiredForPassingText(item: Item): string {
  return item.isPassRequiredForCourse ? _t('Yes') : '';
}
