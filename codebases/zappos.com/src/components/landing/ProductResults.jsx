import { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import MelodyCardProduct from 'components/common/melodyCard/MelodyCardProduct';
import { evSearchProductStreamClick, evSearchProductStreamImpression } from 'events/symphony';
import { track } from 'apis/amethyst';

import css from 'styles/components/landing/productResults.scss';

const ProductResults = ({ slotName, slotIndex, slotDetails, onComponentClick, slotHeartsData, shouldLazyLoad, eventLabel }) => {
  const { title, products, gae, ctacopy, ctalink, monetateId, isCrossSiteSearch, siteName } = slotDetails;

  useEffect(() => {
    track(() => ([evSearchProductStreamImpression, { slotDetails, slotIndex, slotName }]));
  }, [slotDetails, slotIndex, slotName]);

  const onProductClick = useCallback((evt, product) => {
    onComponentClick?.(evt);
    track(() => ([evSearchProductStreamClick, { slotDetails, slotIndex, slotName, product }]));
  }, [onComponentClick, slotDetails, slotIndex, slotName]);

  return (
    <section
      className={css.container}
      data-slot-id={slotName}
      data-slotindex={slotIndex}
      data-monetate-id={monetateId}>
      {title && <h2>{title}</h2>}
      <div className={css.products}>
        {products.map((product, index) =>
          <MelodyCardProduct
            key={product.styleId}
            cardData={product}
            componentStyle="searchProduct"
            eventLabel={eventLabel}
            onComponentClick={onProductClick}
            melodyCardTestId={eventLabel}
            heartsData={slotHeartsData}
            shouldLazyLoad={shouldLazyLoad}
            index={index}
            isCrossSiteSearch={isCrossSiteSearch}
            siteName={siteName}/>
        )}
      </div>
      {(ctacopy && ctalink) && <Link
        data-eventlabel={eventLabel}
        data-eventvalue={gae || ctacopy}
        className={css.cta}
        onClick={onComponentClick}
        to={ctalink}>
        {ctacopy}
      </Link>}
    </section>
  );
};

ProductResults.propTypes = {
  slotName: PropTypes.string,
  slotIndex: PropTypes.number,
  slotDetails: PropTypes.object.isRequired,
  onComponentClick: PropTypes.func,
  slotHeartsData: PropTypes.object,
  shouldLazyLoad: PropTypes.bool
};

ProductResults.displayName = 'ProductResults';

export default withErrorBoundary(ProductResults.displayName, ProductResults);
