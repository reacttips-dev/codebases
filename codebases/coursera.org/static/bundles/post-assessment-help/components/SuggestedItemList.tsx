import React from 'react';

import SuggestedItemDisplay from './SuggestedItemDisplay';
import { SuggestedItem } from '../types';

import 'css!./__styles__/SuggestedItemList';

/**
 * `SuggestedItemList` renders a vertical list of suggested item metadatas.
 *
 * You have some minimal access to restyling by referring to the class name:
 * .rc-SuggestedItemList. You can also set some small number of styles on
 * lower-level components  through props like `itemPadding`.
 *
 * Do NOT try to style by referring to low-level element classes with nested
 * Stylus blocks.
 */
const SuggestedItemList: React.FC<{
  items: SuggestedItem[];
  itemPadding?: string | number;
}> = ({ items, itemPadding }) => {
  return (
    <ul className="rc-SuggestedItemList nostyle">
      {items.map((item) => (
        <SuggestedItemDisplay item={item} tag="li" key={item.id} padding={itemPadding} />
      ))}
    </ul>
  );
};

export default SuggestedItemList;
