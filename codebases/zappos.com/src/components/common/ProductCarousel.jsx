import { useCallback, useEffect } from 'react';

import { makeComponentHeading } from 'helpers/LandingPageUtils';
import MelodyCarousel from 'components/common/MelodyCarousel.jsx';
import SmallProductCard from 'zen/components/common/SmallProductCard';
import { evSearchProductStreamClick, evSearchProductStreamImpression } from 'events/symphony';
import { track } from 'apis/amethyst';
import useMartyContext from 'hooks/useMartyContext';

import css from 'styles/components/common/productCarousel.scss';

const imgDimensions = 211;
const type = 'flexv';

const ProductCarousel = ({
  slotName,
  slotDetails,
  onProductClick,
  slotIndex
}) => {
  const { testId } = useMartyContext();
  const { products, title } = slotDetails;
  const classes = { itemsContainer: css.itemsContainer };

  useEffect(() => {
    track(() => ([evSearchProductStreamImpression, { slotDetails, slotIndex, slotName }]));
  }, [slotDetails, slotIndex, slotName]);

  const onProductCardClick = useCallback((evt, product) => {
    onProductClick && onProductClick(evt, product);
    track(() => ([evSearchProductStreamClick, { slotDetails, slotIndex, slotName, product }]));
  }, [onProductClick, slotDetails, slotIndex, slotName]);

  return (
    <div data-test-id={testId('productCarousel')} className={css.productCarousel} data-slot-id={slotName}>
      {makeComponentHeading({ heading: title })}
      <MelodyCarousel classes={classes}>
        {products.map((product, i) => <SmallProductCard
          index={i}
          key={`${product.styleId}-${i}`}
          cardData={product}
          onClick={onProductCardClick}
          type={type}
          msaImageDimensions={imgDimensions}
          threeSixtyDimensions={imgDimensions}/>)}
      </MelodyCarousel>
    </div>
  );
};

export default ProductCarousel;
