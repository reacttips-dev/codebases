import { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

import LandingPageLink from 'components/landing/LandingPageLink';
import SmallProductCard from 'zen/components/common/SmallProductCard';
import { makeComponentHeading } from 'helpers/LandingPageUtils';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { evHeroWithProductStreamClick, evHeroWithProductStreamImpression } from 'events/symphony';
import { track } from 'apis/amethyst';

import css from 'styles/components/common/productGrid.scss';

export const ProductGrid = ({ slotName, slotIndex, slotDetails, onComponentClick, onProductClick, eventLabel }, { testId }) => {
  const { products, title, ctacopy, ctalink, gae } = slotDetails;

  useEffect(() => {
    track(() => ([evHeroWithProductStreamImpression, { slotDetails, slotIndex, slotName }]));
  }, [slotDetails, slotIndex, slotName]);

  const onHeroClick = useCallback(evt => {
    onComponentClick && onComponentClick(evt);
    track(() => ([evHeroWithProductStreamClick, { slotDetails, slotIndex, slotName }]));
  }, [onComponentClick, slotDetails, slotIndex, slotName]);

  const onProductCardClick = useCallback((evt, product) => {
    onProductClick && onProductClick(evt, product);
    track(() => ([evHeroWithProductStreamClick, { slotDetails, slotIndex, slotName, product }]));
  }, [onProductClick, slotDetails, slotIndex, slotName]);

  const linkProps = {
    'onClick': onHeroClick,
    'data-eventlabel': eventLabel,
    'data-eventvalue': gae,
    'data-slotindex': slotIndex
  };

  return (
    <div className={css.productGrid} data-slot-id={slotName}>
      {makeComponentHeading({ heading: title })}
      <div className={css.productSection}>
        {products.slice(0, 8).map((product, i) => <SmallProductCard
          index={i}
          key={`${product.styleId}-${i}`}
          cardData={product}
          onClick={onProductCardClick}
          productClass={css.item} />)}
      </div>
      {ctalink &&
        <LandingPageLink url={ctalink} {...linkProps}>
          <div className={css.centerLink} data-test-id={testId('zenRecoCtaPill')}>
            <p className={css.ctaButton}>{ctacopy}</p>
          </div>
        </LandingPageLink>
      }
    </div>
  );
};

ProductGrid.contextTypes = {
  testId: PropTypes.func
};

const ProductGridWithErrorBoundary = withErrorBoundary('ProductGrid', ProductGrid);

export default ProductGridWithErrorBoundary;
