import React from 'react';
import { Box, color } from '@coursera/coursera-ui';

import toHumanReadableTypeName from 'bundles/ondemand/utils/toHumanReadableTypeName';
import LearnerAppClientNavigationLink from 'bundles/course-v2/components/navigation/LearnerAppClientNavigationLink';
import TimeCommitmentEffortText from 'bundles/learner-progress/components/item/TimeCommitmentEffortText';
import ItemIcon from 'bundles/item/components/ItemIcon';

import _t from 'i18n!nls/post-assessment-help';
import 'css!./__styles__/SuggestedItemDisplay';

import { SuggestedItem } from '../types';

// small private component for helping switch between a link name and non-link
// name display
const ItemName: React.FC<{
  item: SuggestedItem;
  link?: boolean;
}> = ({ item, link = true }) => {
  const className = 'item-title';
  const label = _t('Item Name');

  return link ? (
    <LearnerAppClientNavigationLink
      className={`${className} nostyle`}
      trackingName="suggested_item_link"
      data={{ itemId: item.id }}
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      ariaLabel={label}
      tabIndex={-1} // generally this shouldn't be key in navigation
    >
      {item.title}
    </LearnerAppClientNavigationLink>
  ) : (
    <div className={className} aria-label={label}>
      {item.title}
    </div>
  );
};

/**
 * `SuggestedItemDisplay` renders basic metadata for a suggested item,
 * including name and type. There is some small amount of customization
 * available for the base tag of the component, the padding for the item,
 * as well as whether the name is accessible as a link or not.
 * See unit tests for usage.
 *
 * You have some minimal access to restyling by referring to the class name:
 * .rc-SuggestedItemDisplay and the padding.
 * Do NOT try to adjust styles on internal elements with nested Stylus
 * selectors since that breaks modularity.
 */
const SuggestedItemDisplay: React.FC<{
  item: SuggestedItem;
  tag?: React.ElementType;
  link?: boolean;
  padding?: string | number;
}> = ({ item, tag = 'div', link = true, padding = 0 }) => {
  const readableTypeName = toHumanReadableTypeName(item.typeName);

  return (
    <Box
      tag={tag}
      rootClassName="rc-SuggestedItemDisplay"
      style={{ padding }}
      flexDirection="row"
      justifyContent="start"
      alignItems="start"
      htmlAttributes={{
        'aria-label': _t('Suggested Item'),
      }}
    >
      <ItemIcon
        type={item.typeName}
        size={24}
        style={{ color: color.black }}
        title={_t('#{itemTypeName} Icon', { itemTypeName: readableTypeName })}
      />
      <Box rootClassName="item-info-box" flexDirection="column" justifyContent="center" alignItems="stretch">
        <ItemName item={item} link={link} />
        <div className="item-details" aria-label={_t('Item Details')}>
          <span> {readableTypeName} </span>
          {'• '}
          <TimeCommitmentEffortText timeCommitment={item.timeCommitment} className="time-commitment" />
        </div>
      </Box>
    </Box>
  );
};

export default SuggestedItemDisplay;
