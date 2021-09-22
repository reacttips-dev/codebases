import React from 'react';

import LearnItemIcon from 'bundles/learner-progress/components/item/LearnItemIcon';

import { Item } from 'bundles/learner-progress/types/Item';

import 'css!./__styles__/NavItemIcon';

type Props = {
  computedItem: Item;
  size?: number;
};

const NavItemIcon = ({ computedItem, size = 20 }: Props) => (
  <div className="rc-NavItemIcon">
    <LearnItemIcon computedItem={computedItem} size={size} />
  </div>
);

export default NavItemIcon;
