import React from 'react';

import { Item } from 'bundles/learner-progress/types/Item';
import { getReviewPartFromSplitPeer } from 'bundles/learner-progress/utils/Item';

import WeekSingleItemDisplay from 'bundles/learner-progress/components/item/week/private/WeekSingleItemDisplay';

type Props = {
  computedItem: Item;
};

class WeekPeerReviewItemDisplay extends React.Component<Props> {
  render() {
    const { computedItem } = this.props;
    const reviewItem = getReviewPartFromSplitPeer(computedItem);

    return (
      <span className="nostyle">
        <WeekSingleItemDisplay computedItem={computedItem} />
        {reviewItem && <WeekSingleItemDisplay computedItem={reviewItem} />}
      </span>
    );
  }
}

export default WeekPeerReviewItemDisplay;
