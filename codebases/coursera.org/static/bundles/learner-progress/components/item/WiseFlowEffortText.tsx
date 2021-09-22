import React from 'react';
import TimeCommitmentEffortText from 'bundles/learner-progress/components/item/TimeCommitmentEffortText';

import { Item } from 'bundles/learner-progress/types/Item';

import _t from 'i18n!nls/learner-progress';

type Props = {
  item: Item;
  className: string;
};

class WiseFlowEffortText extends React.Component<Props> {
  render() {
    const { item, className } = this.props;

    if (item.isGraded) {
      return <span className={className}>{_t('Graded')}</span>;
    } else if (item.isCompleted) {
      return <span className={className}>{_t('Completed')}</span>;
    } else if (item.isSubmitted) {
      return <span className={className}>{_t('Submitted')}</span>;
    } else if (item.isStarted) {
      return <span className={className}>{_t('Started')}</span>;
    }

    return <TimeCommitmentEffortText timeCommitment={item.timeCommitment} className={className} />;
  }
}

export default WiseFlowEffortText;
