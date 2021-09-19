import React, { useMemo } from 'react';
import cn from 'classnames';

import { isProductHearted } from 'helpers/HeartUtils';
import { guid } from 'helpers/guid';

interface Style {
  styleId: string;
}

interface Props {
  cssHeartActive: string;
  style: Style;
  cssHeartContainer?: string;
  extraRecoStyle?: string | null;
  forceShowHearted?: boolean;
  handleHeartClick?: (...args: any[]) => any;
  isUninteractive?: boolean;
  hearts?: any; // TODO ts type this when `hearts` are typed
  heartsList?: any; // TODO ts type this when `hearts` are typed
  showFavoriteHeart?: boolean;
  productId?: string;
  compactCount?: boolean;
  isDisplayCount?: boolean;
  testId?: string | null;
}
const Heart = ({
  cssHeartActive,
  cssHeartContainer,
  extraRecoStyle = null,
  forceShowHearted,
  handleHeartClick = f => f,
  isUninteractive = false,
  hearts,
  heartsList,
  showFavoriteHeart,
  style,
  productId,
  compactCount = false,
  isDisplayCount = true,
  testId = null
}: Props) => {
  const uid = useMemo(() => guid(), []);
  const { styleId } = style;

  if (!(heartsList && showFavoriteHeart)) {
    return null;
  }

  const isHearted = typeof forceShowHearted === 'boolean' ? forceShowHearted : isProductHearted(showFavoriteHeart, hearts, styleId);
  let count = (heartsList[styleId] > 0 || !isHearted) ? heartsList[styleId] : 1;

  // this delays the new product card from rendering the icon until count is present.
  if (typeof count !== 'number' && compactCount) {
    return null;
  }

  if (compactCount) {
    count = count > 1000 ? `${Math.floor(count / 1000)}k` : count;
  }

  count = count || 0;
  const ariaLabel = count === 1 ? `${count} person has favorited this.` : `${count} people have favorited this.`;

  if (isUninteractive) {
    return (
      <span
        data-test-id={testId}
        className={cn(cssHeartContainer, { [cssHeartActive]: isHearted }, extraRecoStyle)}
        aria-label={ariaLabel}>
        {count}
      </span>
    );
  }

  const ariaDescriptionId = `favorites-count-${uid}`; // unique identifier for `aria-describedby`, so we don't have ID collisions

  return (
    <button
      type="button"
      className={cn(cssHeartContainer, { [cssHeartActive]: isHearted }, extraRecoStyle)}
      aria-pressed={isHearted}
      aria-label="Favorite this item."
      aria-describedby={ariaDescriptionId}
      onClick={handleHeartClick(style, productId)}
      data-test-id={testId}>
      { isDisplayCount &&
          <span aria-label={ariaLabel} id={ariaDescriptionId}>{count}</span>
      }
    </button>
  );
};

export default Heart;
