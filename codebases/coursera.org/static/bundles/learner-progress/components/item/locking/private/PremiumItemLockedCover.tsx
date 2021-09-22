import React from 'react';
import { Box } from '@coursera/coursera-ui';

import LockIcon from 'bundles/learner-progress/components/item/locking/private/LockIcon';
import LockReason from 'bundles/learner-progress/components/item/locking/private/LockReason';
import LockMessage from 'bundles/learner-progress/components/item/locking/private/LockMessage';

import PurchaseCoursePromptButton from 'bundles/learner-progress/components/item/PurchaseCoursePromptButton';

import { Item } from 'bundles/learner-progress/types/Item';

import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';
import CourseStoreType from 'bundles/ondemand/stores/CourseStore';

type PropsFromCaller = {
  computedItem: Item;
};

type PropsFromStores = {
  courseId: string;
};

type Stores = {
  CourseStore: CourseStoreType;
};

type PropsToComponent = PropsFromCaller & PropsFromStores;

const PremiumItemLockedCover = ({ courseId, computedItem }: PropsToComponent) => (
  <Box rootClassName="rc-PremiumItemLockedCover">
    <LockIcon />

    <div>
      <LockMessage computedItem={computedItem} />
      <LockReason computedItem={computedItem} />
      <PurchaseCoursePromptButton courseId={courseId} />
    </div>
  </Box>
);

export default connectToStores<PropsToComponent, PropsFromCaller, Stores>(['CourseStore'], ({ CourseStore }) => ({
  courseId: CourseStore.getCourseId(),
}))(PremiumItemLockedCover);
