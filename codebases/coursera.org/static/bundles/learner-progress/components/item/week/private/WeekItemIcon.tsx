import React from 'react';

import LearnItemIcon from 'bundles/learner-progress/components/item/LearnItemIcon';

import { Item } from 'bundles/learner-progress/types/Item';

type Props = {
  computedItem: Item;
};

const WeekItemIcon = ({ computedItem }: Props) => <LearnItemIcon computedItem={computedItem} size={22} />;

export default WeekItemIcon;
