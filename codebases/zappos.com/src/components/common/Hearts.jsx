import React, { useRef } from 'react';
import cn from 'classnames';

import Heart from 'components/common/Heart';
import { makeHandleHeartButtonClick } from 'helpers/HeartUtils';

import css from 'styles/components/common/hearts.scss';

const Hearts = ({ heartsData = {}, styleId, productId }) => {
  const heartRef = useRef();

  const { showFavoriteHeart, hearts = [], heartsList, isDisplayCount } = heartsData;
  if (!hearts) {
    return null;
  }

  const handleHeartClick = () => {
    const { onHeartClick, hearts, showFavoriteHeart } = heartsData;
    return makeHandleHeartButtonClick({
      hearts,
      onHeartClick,
      productId,
      showFavoriteHeart,
      heartRef,
      style: { styleId }
    });
  };

  const heartProps = {
    cssHeartContainer: cn(css.heart, css.searchHeart, { [css.noCountHeart]: !isDisplayCount }),
    cssHeartActive: css.heartActive,
    extraRecoStyle: null,
    handleHeartClick,
    hearts,
    heartsList,
    productId,
    showFavoriteHeart,
    compactCount: true,
    style: { styleId },
    isDisplayCount,
    testId: 'heartButton'
  };

  return (
    <div className={cn(css.heartContainer, css.searchHeartContainer, { [css.noCountContainer]: !isDisplayCount }) }>
      <Heart {...heartProps} />
    </div>
  );
};

export default Hearts;
