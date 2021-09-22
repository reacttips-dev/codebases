import React from 'react';
import { EstimateTimeProgress } from 'bundles/course-v2/types/Item';

import UngradedItem from 'bundles/course-home/page-course-welcome/components/week-cards/cds/UngradedItem';

type Props = {
  title: string;
  progress: EstimateTimeProgress;
};

class UngradedItemContainer extends React.Component<Props> {
  render() {
    const {
      title,
      progress: { remainingDuration, totalDuration, nextItem },
    } = this.props;

    if (!totalDuration) {
      return null;
    }

    return (
      <UngradedItem
        title={title}
        totalDuration={totalDuration}
        nextItemLink={nextItem.resourcePath}
        remainingDuration={remainingDuration}
      />
    );
  }
}

export default UngradedItemContainer;
