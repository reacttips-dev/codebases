import React from 'react';
import classNames from 'classnames';

import ProjectEffortText from 'bundles/learner-progress/components/item/ProjectEffortText';
import PeerReviewEffortText from 'bundles/learner-progress/components/item/PeerReviewEffortText';
import DiscussionEffortText from 'bundles/learner-progress/components/item/DiscussionEffortText';
import TimeCommitmentEffortText from 'bundles/learner-progress/components/item/TimeCommitmentEffortText';
import WiseFlowEffortText from 'bundles/learner-progress/components/item/WiseFlowEffortText';

import { Item } from 'bundles/learner-progress/types/Item';

import {
  getIsAssignmentPartForSplitPeer,
  getIsReviewPartForSplitPeer,
  getIsMentorGraded,
} from 'bundles/learner-progress/utils/Item';

import _t from 'i18n!nls/learner-progress';
import { FormattedMessage } from 'js/lib/coursera.react-intl';

import 'css!./__styles__/EffortText';

type Props = {
  computedItem: Item;
};

class EffortText extends React.Component<Props> {
  render() {
    const { computedItem: item } = this.props;
    const classes = classNames('rc-EffortText', 'caption-text', 'text-hint');

    if (item.hasOutcomeOverride) {
      return <span className={classes}>{_t('Your grade has been overridden')}</span>;
    } else if (item.contentSummary.typeName === 'quiz' || item.contentSummary.typeName === 'exam') {
      return (
        <span className={classes}>
          <FormattedMessage
            message={_t('{questionCount, plural, =1 {# question} other {# questions}}')}
            questionCount={item.contentSummary.definition.questionCount}
          />
        </span>
      );
    } else if (getIsAssignmentPartForSplitPeer(item) || getIsMentorGraded(item)) {
      return <PeerReviewEffortText item={item} className={classes} />;
    } else if (['staffGraded', 'teammateReview', 'gradedLti'].includes(item.contentSummary.typeName)) {
      return <ProjectEffortText item={item} className={classes} />;
    } else if (['wiseFlow'].includes(item.contentSummary.typeName)) {
      return <WiseFlowEffortText item={item} className={classes} />;
    } else if (item.contentSummary.typeName === 'gradedDiscussionPrompt') {
      return <DiscussionEffortText item={item} className={classes} />;
    } else if (!getIsReviewPartForSplitPeer(item)) {
      return <TimeCommitmentEffortText timeCommitment={item.timeCommitment} className={classes} />;
    }

    return null;
  }
}

export default EffortText;
