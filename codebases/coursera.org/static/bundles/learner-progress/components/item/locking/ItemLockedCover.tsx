import React from 'react';
import { withCourseFullStory } from 'bundles/common/components/CourseFullStory';
import PremiumItemLockedCover from 'bundles/learner-progress/components/item/locking/private/PremiumItemLockedCover';
import DefaultItemLockedCover from 'bundles/learner-progress/components/item/locking/private/DefaultItemLockedCover';
import LockedByPreviousItemLockedCover from 'bundles/learner-progress/components/item/locking/private/LockedByPreviousItemLockedCover';

import { Item } from 'bundles/learner-progress/types/Item';

import 'css!./__styles__/ItemLockedCover';

type Props = {
  computedItem: Item;
};

const ItemLockedCover = ({ computedItem }: Props) => {
  let Content: typeof DefaultItemLockedCover | typeof PremiumItemLockedCover = DefaultItemLockedCover;

  if (computedItem.itemLockedReasonCode === 'PREMIUM' || computedItem.itemLockedReasonCode === 'PREMIUM_ITEM') {
    Content = PremiumItemLockedCover;
  }

  if (computedItem.isLockedByPreviousItem) {
    Content = LockedByPreviousItemLockedCover;
  }

  return (
    <div className="rc-ItemLockedCover" role="region">
      <Content computedItem={computedItem} />
    </div>
  );
};

export default withCourseFullStory(ItemLockedCover);
