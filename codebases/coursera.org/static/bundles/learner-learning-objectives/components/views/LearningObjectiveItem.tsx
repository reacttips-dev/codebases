import React from 'react';
import initBem from 'js/lib/bem';

import type { Item } from 'bundles/learner-progress/types/Item';

import { NavItem } from 'bundles/learner-progress/components/item/nav/NavItem';

import 'css!./__styles__/LearningObjectiveItem';

const bem = initBem('LearningObjectiveItem');

type Props = {
  computedItem: Item;
};

/**
 * Wrapper component to allow styling overrides of NavItem
 */
const LearningObjectiveItem: React.FC<Props> = ({ computedItem }) => (
  <div className={bem()}>
    <NavItem
      computedItem={computedItem}
      trackingName="learning_objective_review_link"
      openInNewWindow={true}
      iconSize={40}
    />
  </div>
);

export default LearningObjectiveItem;
