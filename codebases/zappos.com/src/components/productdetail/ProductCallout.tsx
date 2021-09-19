import cn from 'classnames';
import React, { useState } from 'react';

import { evProductBadgesEvent } from 'events/symphony';
import useMartyContext from 'hooks/useMartyContext';
import { track } from 'apis/amethyst';
import { evProductCalloutImpression } from 'events/product';
import Tooltip from 'components/common/Tooltip';
import { TaxonomyAttribute } from 'types/cloudCatalog';
import ProductUtils, { BONUS_POINTS_ATTR, productCalloutIconMap } from 'helpers/ProductUtils';

import css from 'styles/components/productdetail/productCallout.scss';
interface ListElementProps {
  Icon?: React.ComponentType;
  label: string;
  svgSrc?: string;
  tooltipText: string;
  useTabbableTooltips?: boolean;
  useTooltipOverlay?: boolean;
  badgeEventData?: any;
}

export const ProductListElement = ({ Icon, label, tooltipText, svgSrc, useTabbableTooltips, useTooltipOverlay, badgeEventData }: ListElementProps) => (
  <li>
    <Tooltip
      content={tooltipText}
      isTabbable={useTabbableTooltips}
      useOverlay={useTooltipOverlay}
      eventData={badgeEventData}>
      {Icon &&
        <Icon aria-hidden={true} />
      }
      {svgSrc &&
        <img
          width={45}
          height={42}
          src={svgSrc}
          aria-hidden={true}
          alt="" />
      }
    </Tooltip>
    <span>{label}</span>
  </li>
);

interface ProductCalloutProps {
  brandId: string;
  hydraBlueSkyPdp: boolean;
  rewardsBrandPromos: any; // TODO ts fix this once brandpromos ZCS is typed
  attributes: TaxonomyAttribute[];
  forKidsProductCallout: any; // TODO ts, not sure what the satus of this is, but could capture it in ZCS types
  useTabbableTooltips?: boolean;
  useTooltipOverlay?: boolean;
}

export const ProductCallout = (props: ProductCalloutProps) => {
  const { marketplace: { hasRewardsTransparency } } = useMartyContext();
  const [ calloutEvents, setCalloutEvent ] = useState<string[]>([]);
  const {
    attributes: baseAttributes,
    brandId,
    forKidsProductCallout,
    hydraBlueSkyPdp,
    rewardsBrandPromos = {},
    useTabbableTooltips,
    useTooltipOverlay
  } = props;
  const attributes: { value: string }[] = [...baseAttributes ];

  /*
    checking for `rewardsBrandPromos`, and added an extra taxonomy attribute based on
    whether we're running a promo.
  */

  if (ProductUtils.hasRewards(hasRewardsTransparency, rewardsBrandPromos, brandId)) {
    attributes.push({ value: BONUS_POINTS_ATTR });
  }
  const labelMap = attributes.filter(attribute => productCalloutIconMap.get(attribute.value));

  const iconsWithLabels = labelMap.map(attribute => {
    const details = productCalloutIconMap.get(attribute.value);
    if (!details) {
      return null;
    }
    const { Icon, label, tooltipText } = details;
    const badgeEventData = useTabbableTooltips ? { event : evProductBadgesEvent, data : { badgeName : label } } : null;

    if (calloutEvents.indexOf(attribute.value) === -1) {
      setCalloutEvent([...calloutEvents, attribute.value]);
      track(() => ([
        evProductCalloutImpression, attribute.value
      ]));
    }

    return <ProductListElement
      key={label}
      Icon={Icon}
      label={label}
      tooltipText={tooltipText}
      useTabbableTooltips={useTabbableTooltips}
      useTooltipOverlay={useTooltipOverlay}
      badgeEventData={badgeEventData}
    />;
  });

  const {
    show: fkShow,
    brandId: fkBrandId,
    label: fkLabel,
    tooltipText: fkTooltipText,
    imgUrl: fkImgUrl
  } = forKidsProductCallout || {};
  if (fkShow === 'true' && brandId === fkBrandId) {
    iconsWithLabels.push(<ProductListElement
      key={fkLabel}
      svgSrc={fkImgUrl}
      label={fkLabel}
      tooltipText={fkTooltipText}
    />);
  }

  // Renders the labels/callout only if there any to render (avoiding empty <ul></ul>)
  return iconsWithLabels?.length > 0 ? <ul aria-label="Product Features" className={cn(css.productCallout, { [css.blueSky]: hydraBlueSkyPdp })}> { iconsWithLabels } </ul> : null;
};

export default ProductCallout;
