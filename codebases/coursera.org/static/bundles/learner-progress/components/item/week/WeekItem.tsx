import React from 'react';

import { Item as ItemType } from 'bundles/learner-progress/types/Item';
import { getIsAssignmentPartForSplitPeer } from 'bundles/learner-progress/utils/Item';

import WeekSingleItemDisplay from 'bundles/learner-progress/components/item/week/private/WeekSingleItemDisplay';
import WeekPeerReviewItemDisplay from 'bundles/learner-progress/components/item/week/private/WeekPeerReviewItemDisplay';

import withComputedItem from 'bundles/learner-progress/utils/withComputedItem';

type Props = {
  computedItem: ItemType;
};

class Item extends React.Component<Props> {
  render() {
    const { computedItem } = this.props;
    /* eslint-disable no-warning-comments */
    // HACK: Since the backend data model doesn't consider the
    // review part a separate item, we handle the "multiple item"
    // display of peer review assignments here.
    /* eslint-enable no-warning-comments */
    if (getIsAssignmentPartForSplitPeer(computedItem)) {
      return <WeekPeerReviewItemDisplay computedItem={computedItem} />;
    }

    return <WeekSingleItemDisplay computedItem={computedItem} />;
  }
}

export default withComputedItem(Item);
