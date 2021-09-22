import React from 'react';
import classNames from 'classnames';
import TimeCommitmentEffortText from 'bundles/learner-progress/components/item/TimeCommitmentEffortText';

import { Item } from 'bundles/learner-progress/types/Item';
import { getIsAssignmentPartForSplitPeer, getIsMentorGraded } from 'bundles/learner-progress/utils/Item';

import _t from 'i18n!nls/learner-progress';

type Props = {
  item: Item;
  className: string;
};

/**
 * The effort text for peer review is substantially more complex,
 * because there are more actionable states for the user.
 * Split into its own component for ease of use.
 */
class PeerReviewEffortText extends React.Component<Props> {
  render() {
    const { item, className } = this.props;

    if (!getIsAssignmentPartForSplitPeer(item) && !getIsMentorGraded(item)) {
      return null;
    }

    const classes = classNames(className, {
      failed: item.isPeerAssignmentFailed,
    });

    if (item.isPeerAssignmentFailed) {
      return <span className={classes}>{_t('Try Again')}</span>;
    } else if (item.isPeerAssignmentWaitingForEvaluation) {
      return <span className={classes}>{_t('Grading in progress')}</span>;
    } else if (item.isCompleted && !item.isCombinedItemCompleted) {
      return <span className={classes}>{_t('You must review more classmates')}</span>;
    }

    return <TimeCommitmentEffortText timeCommitment={item.timeCommitment} className={classes} />;
  }
}

export default PeerReviewEffortText;
