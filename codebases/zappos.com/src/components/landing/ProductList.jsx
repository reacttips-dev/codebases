import { useCallback, useEffect } from 'react';

import marketplace from 'cfg/marketplace.json';
import MelodyCardProduct from 'components/common/melodyCard/MelodyCardProduct';
import LandingPageLink from 'components/landing/LandingPageLink';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { evHeroWithProductStreamClick, evHeroWithProductStreamImpression } from 'events/symphony';
import { track } from 'apis/amethyst';

import css from 'styles/components/landing/productList.scss';

const { defaultComponentStyle, search: { msaMelodyImageParams, showRatingStars } } = marketplace;

export const ProductList = ({ slotName, slotIndex, slotDetails, slotHeartsData, onHeartClick, hearts, heartsList, onComponentClick, eventLabel }) => {
  const { title, products, monetateId, ctacopy, ctalink, isCrossSiteSearch, siteName } = slotDetails;

  useEffect(() => {
    track(() => ([evHeroWithProductStreamImpression, { slotDetails, slotIndex, slotName }]));
  }, [slotDetails, slotIndex, slotName]);

  const onHeroClick = useCallback(evt => {
    onComponentClick && onComponentClick(evt);
    track(() => ([evHeroWithProductStreamClick, { slotDetails, slotIndex, slotName }]));
  }, [onComponentClick, slotDetails, slotIndex, slotName]);

  const onProductClick = useCallback((evt, product) => {
    onComponentClick && onComponentClick(evt);
    track(() => ([evHeroWithProductStreamClick, { slotDetails, slotIndex, slotName, product }]));
  }, [onComponentClick, slotDetails, slotIndex, slotName]);

  const linkProps = {
    'onClick': onHeroClick,
    'data-eventlabel': eventLabel,
    'data-eventvalue': title,
    'data-slotindex': slotIndex
  };

  return (
    <div data-slot-id={slotName} className={css.container} data-monetate-id={monetateId}>
      {title && <h2>{title} <span><LandingPageLink url={ctalink} {...linkProps}>{ctacopy}</LandingPageLink></span></h2>}
      <div className={css.list}>
        {products.slice(0, 4).map((product, i) => <MelodyCardProduct
          cardData={product}
          componentStyle={defaultComponentStyle}
          eventLabel={eventLabel}
          msaImageParams={msaMelodyImageParams}
          onComponentClick={onProductClick}
          key={product.styleId}
          shouldLazyLoad={true}
          noBackground={false}
          showRatingStars={showRatingStars}
          heartsData={slotHeartsData}
          onHeartClick={onHeartClick}
          hearts={hearts}
          heartsList={heartsList}
          index={i}
          isCrossSiteSearch={isCrossSiteSearch}
          siteName={siteName}
        />
        )}
      </div>
    </div>
  );
};

export default withErrorBoundary('ProductList', ProductList);
