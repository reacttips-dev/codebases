import React from 'react';

import type { Item as ItemType } from 'bundles/learner-progress/types/Item';
import { getIsAssignmentPartForSplitPeer } from 'bundles/learner-progress/utils/Item';

import NavSingleItemDisplay from 'bundles/learner-progress/components/item/nav/private/NavSingleItemDisplay';
import NavPeerReviewItemDisplay from 'bundles/learner-progress/components/item/nav/private/NavPeerReviewItemDisplay';

import withComputedItem from 'bundles/learner-progress/utils/withComputedItem';

import type ItemMetadata from 'pages/open-course/common/models/itemMetadata';

type PropsFromCaller = {
  itemMetadata?: ItemMetadata;
  highlighted?: boolean;
  trackingName?: string;
  openInNewWindow?: boolean;
  iconSize?: number;
};

type Props = PropsFromCaller & {
  computedItem: ItemType;
};

// Indiviudual item shown in the navigation on item pages
export class NavItem extends React.Component<Props> {
  render() {
    const { computedItem, highlighted, trackingName, openInNewWindow, iconSize } = this.props;

    /* eslint-disable no-warning-comments */
    // HACK: Since the backend data model doesn't consider the
    // review part a separate item, we handle the "multiple item"
    // display of peer review assignments here.
    /* eslint-enable no-warning-comments */
    if (getIsAssignmentPartForSplitPeer(computedItem)) {
      return (
        <NavPeerReviewItemDisplay
          computedItem={computedItem}
          highlighted={highlighted}
          trackingName={trackingName}
          openInNewWindow={openInNewWindow}
          iconSize={iconSize}
        />
      );
    }

    return (
      <NavSingleItemDisplay
        computedItem={computedItem}
        highlighted={highlighted}
        trackingName={trackingName}
        openInNewWindow={openInNewWindow}
        iconSize={iconSize}
      />
    );
  }
}

export default withComputedItem(NavItem);
