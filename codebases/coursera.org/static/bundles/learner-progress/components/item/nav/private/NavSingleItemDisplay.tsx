import React from 'react';
import classNames from 'classnames';
import LearnerAppClientNavigationLink from 'bundles/course-v2/components/navigation/LearnerAppClientNavigationLink';
import { Box } from '@coursera/coursera-ui';
import { SvgHonorsAssignment } from '@coursera/coursera-ui/svg';
import EffortText from 'bundles/learner-progress/components/item/EffortText';
import LockedTooltip from 'bundles/learner-progress/components/item/locking/LockedTooltip';
import NavItemIcon from 'bundles/learner-progress/components/item/nav/private/NavItemIcon';
import NavItemName from 'bundles/learner-progress/components/item/nav/private/NavItemName';
import _t from 'i18n!nls/learner-progress';
import { humanizeLearningTime } from 'js/utils/DateTimeUtils';
import { Item } from 'bundles/learner-progress/types/Item';

import {
  getIsAssignmentPartForSplitPeer,
  getIsReviewPartForSplitPeer,
  getIsMentorGraded,
  getIsLocked,
  isGradeVisible,
} from 'bundles/learner-progress/utils/Item';

import 'css!./__styles__/NavSingleItemDisplay';

type Props = {
  computedItem: Item;
  highlighted?: boolean;
  trackingName?: string;
  openInNewWindow?: boolean;
  iconSize?: number;
};

const NavSingleItemDisplay = ({
  computedItem,
  highlighted,
  trackingName = 'item_link',
  openInNewWindow = false,
  iconSize,
}: Props) => {
  let linkDescription = '';

  if (computedItem.contentSummary.typeName === 'quiz' || computedItem.contentSummary.typeName === 'exam') {
    const { questionCount } = computedItem.contentSummary.definition;
    if (questionCount === 1) {
      linkDescription = _t('#{questionCount} question', { questionCount });
    } else {
      linkDescription = _t('#{questionCount} questions', { questionCount });
    }
  } else if (getIsAssignmentPartForSplitPeer(computedItem) || getIsMentorGraded(computedItem)) {
    if (computedItem.isPeerAssignmentFailed) {
      linkDescription = _t('Try Again');
    } else if (computedItem.isPeerAssignmentWaitingForEvaluation) {
      linkDescription = _t('Grading in progress');
    } else if (computedItem.isCompleted && !computedItem.isCombinedItemCompleted) {
      linkDescription = _t('You must review more classmates');
    }
  } else if (
    computedItem.contentSummary.typeName === 'staffGraded' ||
    computedItem.contentSummary.typeName === 'teammateReview'
  ) {
    if (computedItem.isStaffGradedSubmitted) {
      linkDescription = _t('Submitted');
    } else if (computedItem.isStaffGradedStarted) {
      linkDescription = _t('Started');
    }
  } else if (computedItem.contentSummary.typeName === 'gradedDiscussionPrompt') {
    if (computedItem.isDiscussionPromptGrading) {
      linkDescription = _t('Grading in progress');
    } else if (computedItem.isDiscussionPromptStarted) {
      linkDescription = _t('Discussion prompt started');
    } else if (computedItem.isDiscussionPromptOverdue) {
      linkDescription = _t('Overdue');
    }
  } else if (!getIsReviewPartForSplitPeer(computedItem)) {
    linkDescription =
      humanizeLearningTime(computedItem.timeCommitment) &&
      `${humanizeLearningTime(computedItem.timeCommitment)} estimated time to complete.`;
  }

  const getComputedItemStatus = () => {
    let status = '';

    if (computedItem.isFailed && !isGradeVisible(computedItem)) {
      status = _t('Failed');
    } else if (computedItem.isPassed && !isGradeVisible(computedItem)) {
      status = _t('Passed');
    } else if (computedItem.isCompleted) {
      status = _t('Completed');
    } else if (getIsLocked(computedItem)) {
      status = _t('Locked');
    } else if (computedItem.deadlineProgress === 'OVERDUE') {
      status = _t('Overdue');
    }
    return status;
  };

  const ariaLabel = `${highlighted ? _t('selected link, ') : ''} ${computedItem.contentSummary.typeName}  ${
    computedItem.name
  } ${computedItem.isHonors ? _t(' - optional Honors Item, ') : ''}, ${linkDescription}, ${getComputedItemStatus()}`;

  return (
    <LearnerAppClientNavigationLink
      className="nostyle"
      trackingName={trackingName}
      href={computedItem.resourcePath}
      data={{ itemId: computedItem.id }}
      ariaLabel={ariaLabel}
      {...(openInNewWindow
        ? {
            target: '_blank',
            rel: 'noopener noreferrer',
          }
        : {})}
    >
      <Box justifyContent="start" rootClassName={classNames('rc-NavSingleItemDisplay', { highlighted })}>
        {getIsLocked(computedItem) && <LockedTooltip placement="top" computedItem={computedItem} />}
        <NavItemIcon computedItem={computedItem} size={iconSize} />

        <div>
          <NavItemName computedItem={computedItem} />
          <EffortText computedItem={computedItem} />
        </div>
        {computedItem.isHonors && (
          <div className="rc-HonorsContentLabel">
            <SvgHonorsAssignment size={22} />
          </div>
        )}
      </Box>
    </LearnerAppClientNavigationLink>
  );
};

export default NavSingleItemDisplay;
