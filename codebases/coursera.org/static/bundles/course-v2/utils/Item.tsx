import React from 'react';
import moment from 'moment-timezone';

import { Item } from 'bundles/course-v2/types/Item';
import Progress from 'pages/open-course/common/models/progress';

import toHumanReadableTypeName from 'bundles/ondemand/utils/toHumanReadableTypeName';
import {
  humanizeLearningTime,
  formatDateTimeDisplay,
  SHORT_MONTH_DAY_DISPLAY,
  TIME_ONLY_DISPLAY,
} from 'js/utils/DateTimeUtils';

import _t from 'i18n!nls/course-home';
import { FormattedMessage } from 'js/lib/coursera.react-intl';

export function getFormattedTitlePrefix(item: Item): string {
  return toHumanReadableTypeName(item.contentSummary.typeName, item.trackId, item.contentSummary);
}

export function getFormattedTimeCommitment(item: Item): string {
  return humanizeLearningTime(item.timeCommitment);
}

export function getFormattedNameWithPrefix(item: Item): string {
  const { typeName } = item.contentSummary;

  const humanReadableTypeName = toHumanReadableTypeName(typeName);

  if (typeName === 'lecture') {
    return _t('Video: {name}', { name: item.name });
  } else if (typeName === 'supplement') {
    return _t('Reading: {name}', { name: item.name });
  } else if (humanReadableTypeName) {
    return `${humanReadableTypeName}: ${item.name}`;
  }

  return item.name;
}

export function getFormattedDeadline(item: Item): string | null {
  if (!item.deadline || !moment(item.deadline).isValid()) {
    return null;
  }

  return formatDateTimeDisplay(item.deadline, SHORT_MONTH_DAY_DISPLAY);
}

export function getFormattedDeadlineTime(item: Item): string | null {
  if (!item.deadline || !moment(item.deadline).isValid()) {
    return null;
  }

  return formatDateTimeDisplay(item.deadline, TIME_ONLY_DISPLAY);
}

export function getIsGradable(item: Item): boolean {
  return [
    'exam',
    'closedPeer',
    'gradedPeer',
    'phasedPeer',
    'gradedProgramming',
    'programming',
    'gradedLti',
    'gradedDiscussionPrompt',
    'teammateReview',
    'staffGraded',
    'wiseFlow',
  ].includes(item.contentSummary.typeName);
}

export function getIsHonors(item: Item): boolean {
  return item.trackId === 'honors';
}

export function getIsOptional(item: Item): boolean {
  return item.isOptional;
}

export function getIsReviewPartForSplitPeer(item: Item): boolean {
  return item.contentSummary.typeName === 'splitPeerReviewItem';
}

export function getIsAssignmentPartForSplitPeer(item: Item): boolean {
  return (
    // @ts-expect-error TSMIGRATION
    !item.contentSummary.isMentorGraded &&
    ['phasedPeer', 'gradedPeer', 'closedPeer'].indexOf(item.contentSummary.typeName) !== -1
  );
}

export function getReviewPartFromSplitPeer(item: Item): Item | undefined {
  if (!getIsAssignmentPartForSplitPeer(item)) {
    return undefined;
  }

  const reviewPartItem = { ...item };
  const contentSummary = { ...reviewPartItem.contentSummary, typeName: 'splitPeerReviewItem' };

  // @ts-expect-error TSMIGRATION
  if (!contentSummary.definition.reviewDeadlineOffset) {
    // For graded and closed peer reviews,
    // set a default of 3 days for the review deadline offset.
    // @ts-expect-error TSMIGRATION
    contentSummary.definition.reviewDeadlineOffset = 259200000;
  }

  // For splitPeerReviewItem items, add the review deadline offset to the original peer item deadline.
  // The review portion of the peer review assignment deadline should always be after the
  // peer deadline.
  if (item.deadline) {
    // @ts-expect-error TSMIGRATION
    reviewPartItem.deadline = item.deadline + contentSummary.definition.reviewDeadlineOffset;
  }

  // @ts-expect-error TSMIGRATION
  reviewPartItem.contentSummary = contentSummary;
  return reviewPartItem;
}

export function getIsComplete(item: Item, itemProgress: Progress): boolean {
  const { itemDeadlineStatus, contentSummary } = item;

  if (getIsReviewPartForSplitPeer(item)) {
    if (contentSummary && contentSummary.definition) {
      const reviewCount = itemProgress.getDefinition('reviewCount') || 0;
      // @ts-expect-error TSMIGRATION
      const { requiredReviewCount } = contentSummary.definition;
      return reviewCount >= requiredReviewCount;
    }
  }

  return itemDeadlineStatus === 'COMPLETED';
}
