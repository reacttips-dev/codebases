import React from 'react';

import { Item } from 'bundles/learner-progress/types/Item';
import { getReviewPartFromSplitPeer } from 'bundles/learner-progress/utils/Item';

import NavSingleItemDisplay from 'bundles/learner-progress/components/item/nav/private/NavSingleItemDisplay';

import connectToRouter from 'js/lib/connectToRouter';

type Props = {
  computedItem: Item;
  highlighted?: boolean;
  pathname: string;
  trackingName?: string;
  openInNewWindow?: boolean;
  iconSize?: number;
};

const NavPeerReviewItemDisplay = ({
  computedItem,
  highlighted,
  pathname,
  trackingName,
  openInNewWindow,
  iconSize,
}: Props) => {
  const reviewItem = getReviewPartFromSplitPeer(computedItem);

  /* eslint-disable no-warning-comments */
  // HACK: To handle cases where we want to change display
  // for assignment and review parts for peer review depending on which page is
  // being accessed, we directly check the current path name.
  // This is to highlight the review part in nav on the review part page.
  /* eslint-enable no-warning-comments */
  const shouldHighlightReviewItem = reviewItem && reviewItem.resourcePath === pathname;

  return (
    <span className="nostyle">
      <NavSingleItemDisplay
        computedItem={computedItem}
        highlighted={highlighted && !shouldHighlightReviewItem}
        trackingName={trackingName}
        openInNewWindow={openInNewWindow}
        iconSize={iconSize}
      />
      {reviewItem && (
        <NavSingleItemDisplay
          computedItem={reviewItem}
          highlighted={highlighted && shouldHighlightReviewItem}
          trackingName={trackingName}
          openInNewWindow={openInNewWindow}
          iconSize={iconSize}
        />
      )}
    </span>
  );
};

export default connectToRouter<Props, Omit<Props, 'pathname'>>((router) => ({
  pathname: router.location.pathname,
}))(NavPeerReviewItemDisplay);
