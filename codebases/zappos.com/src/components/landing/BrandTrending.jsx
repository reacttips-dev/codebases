import { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

import MelodyCarousel from 'components/common/MelodyCarousel';
import MelodyCardProduct from 'components/common/melodyCard/MelodyCardProduct';
import marketplace from 'cfg/marketplace.json';
import { evSearchProductStreamClick, evSearchProductStreamImpression } from 'events/symphony';
import { track } from 'apis/amethyst';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';

import css from 'styles/components/landing/brandTrending.scss';

const { search: { msaImageParams } } = marketplace;
const carouselArrowOverride = { top: 'calc(50% - 60px)' };

export const BrandTrending = ({
  slotDetails = {},
  slotName,
  slotIndex,
  onTaxonomyComponentClick,
  slotHeartsData
}) => {
  const { trending, monetateId } = slotDetails;
  const { results, filters: { brandNameFacet } = {} } = trending || {};

  useEffect(() => {
    if (results) {
      track(() => ([evSearchProductStreamImpression, {
        slotDetails, slotIndex, slotName, displayedItemsDirty: results
      } ]));
    }
  }, [slotDetails, results, slotIndex, slotName]);

  const onClick = useCallback((evt, product = {}) => {
    onTaxonomyComponentClick && onTaxonomyComponentClick(evt);
    track(() => ([evSearchProductStreamClick, {
      slotDetails, slotIndex, slotName, product
    } ]));
  }, [onTaxonomyComponentClick, slotDetails, slotIndex, slotName]);

  if (results) {
    return (
      <div className={css.brandTrendingWrap} data-content-name={monetateId}>
        <MelodyCarousel arrowStyleOverrides={carouselArrowOverride} title={`${brandNameFacet[0]}: Selected For You`}>
          {results.map((product, index) =>
            <MelodyCardProduct
              key={product.styleId}
              index={index}
              cardData={product}
              msaImageParams={msaImageParams}
              shouldLazyLoad={true}
              eventLabel="Trending Product"
              onComponentClick={onClick}
              componentStyle="brandTrendingStyle"
              melodyCardTestId="trendingProduct"
              heartsData={slotHeartsData}
            />
          )}
        </MelodyCarousel>
      </div>
    );
  }
  return null;
};

BrandTrending.contextTypes = {
  testId: PropTypes.func
};

export default withErrorBoundary('BrandTrending', BrandTrending);
