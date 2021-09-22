import React from 'react';
import TimeCommitmentEffortText from 'bundles/learner-progress/components/item/TimeCommitmentEffortText';

import { Item } from 'bundles/learner-progress/types/Item';

import _t from 'i18n!nls/learner-progress';

type Props = {
  item: Item;
  className: string;
};

class DiscussionEffortText extends React.Component<Props> {
  render() {
    const { item, className } = this.props;

    if (item.isDiscussionPromptGrading) {
      return <span className={className}>{_t('Grading in progress')}</span>;
    } else if (item.isDiscussionPromptStarted) {
      return <span className={className}>{_t('Discussion prompt started')}</span>;
    } else if (item.isDiscussionPromptOverdue) {
      return <span className={className}>{_t('Overdue')}</span>;
    } else {
      return <TimeCommitmentEffortText timeCommitment={item.timeCommitment} className={className} />;
    }
  }
}

export default DiscussionEffortText;
