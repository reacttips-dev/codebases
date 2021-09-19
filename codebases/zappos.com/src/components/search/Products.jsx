import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import { HYDRA_MICROSOFT_SPONSORED_PRODUCTS } from 'constants/hydraTests';
import { evSearchPageClickthrough } from 'events/search';
import { evRecommendationClick } from 'events/recommendations';
import { Loader } from 'components/Loader';
import SearchInlineRecos from 'components/search/SearchInlineRecos';
import { track } from 'apis/amethyst';
import { trackEvent } from 'helpers/analytics';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import MicrosoftAdsWrapper from 'components/search/MicrosoftAdsWrapper';
import useMartyContext from 'hooks/useMartyContext';
import ProductCard from 'components/common/ProductCard';
import InlineProductCardAd from 'components/common/InlineProductCardAd';
import { getHeartProps } from 'helpers/HeartUtils';
import ProductCardQuickShopLink from 'components/common/ProductCardQuickShopLink';
import { getLowStockLabelStatus } from 'helpers/cardUtils';

import css from 'styles/components/search/products.scss';

const MAX_ANIMATION_FRAMES = 9;

export const Products = ({
  products,
  onProductClicked,
  filters: { page, term },
  heartsData = {},
  productClass,
  products: {
    list,
    allProductsCount,
    inlineRecos,
    msftResults,
    trustedRetailers,
    isLoading,
    oosMessaging
  },
  msaImageParams,
  inlineBannerData,
  triggerAssignment,
  trackMicrosoftAdImpressions,
  hydraMicrosoftSponsoredProducts,
  isCustomer,
  heartProduct,
  unHeartProduct,
  toggleHeartingLoginModal,
  makeScrollButton,
  pixelServerHost,
  hydraColorSwatches
}) => {
  const { testId, marketplace: { search: { hasMicrosoftAds, hasCrossSiteSearches, hasStyleRoomFlag } } } = useMartyContext();
  const microsoftAdFrame = useRef();
  const [animationTimerIndex, setAnimationTimerIndex] = useState(0);
  const numMicrosoftAds = msftResults?.results.length;

  useEffect(() => {
    if (numMicrosoftAds > 0) {
      triggerAssignment(HYDRA_MICROSOFT_SPONSORED_PRODUCTS);
    }
  }, [numMicrosoftAds, triggerAssignment]);

  useEffect(() => {
    const { list } = products;
    // Start a global animation timer for any products that have detail zoom.  Having a top level timer keeps them in sync regardless
    // of re-renders or lazyloading, which will tick every 800ms
    let intervalId;
    const startAnimationTimer = () => {
      intervalId = setInterval(() => {
        setAnimationTimerIndex(index => {
          let newIndex = index + 1;
          // Reset the cycle
          if (newIndex > MAX_ANIMATION_FRAMES) {
            newIndex = 0;
          }
          return newIndex;
        });
      }, 800);
    };
    list.some(item => item.animationImages?.length) && startAnimationTimer(); // if we find a product that has animation images, start timer
    return () => clearInterval(intervalId);
  }, [products]);

  const makeCardClick = (product, index) => {
    const { heartsList = {} } = heartsData;
    const { productId, styleId, isLowStock } = product;
    return e => {
      const position = index + 1;
      const eventPayload = {
        pageNumber: page + 1,
        pageResultNumber: position,
        product,
        numberOfHearts: heartsList[styleId],
        isLowStock
      };

      onProductClicked(position, productId, styleId, e);
      track(() => ([
        evSearchPageClickthrough, eventPayload
      ]));
    };
  };

  const makeMicrosoftAdClick = (product, index) => {
    const onCardClick = makeCardClick(product, index);
    const { productId, styleId, colorId } = product;
    return e => {
      track(() => ([
        evRecommendationClick, {
          index,
          recommendationType: 'PRODUCT_RECOMMENDATION',
          productIdentifiers: {
            productId,
            styleId,
            colorId
          },
          recommendationSource: 'MICROSOFT',
          widgetType: 'MICROSOFT_TOP_BLOCK'
        }
      ]));

      onCardClick(e);
    };
  };

  const makeProducts = () => {
    const {
      hearts
    } = heartsData;

    if (allProductsCount > 0) {
      const combinedProducts = hasCrossSiteSearches ? [ ...trustedRetailers, ...list] : [ ...list];
      const hasRecos = inlineRecos?.recos?.length >= 2;
      const msftAdsToShow = !!numMicrosoftAds && hasMicrosoftAds && !!hydraMicrosoftSponsoredProducts;

      const heartsProps = getHeartProps({
        trackEvent,
        hearts,
        isCustomer,
        products,
        heartProduct,
        toggleHeartingLoginModal,
        unHeartProduct,
        isDisplayCount: true,
        hasHearting: true
      }, {
        heartEventName: 'TE_SEARCH_PRODUCT_HEART',
        unHeartEventName: 'TE_SEARCH_PRODUCT_UNHEART'
      });
      const heartsInfo = {
        heartsData: heartsProps,
        isCustomer,
        products,
        heartProduct,
        unHeartProduct,
        toggleHeartingLoginModal
      };

      const allProductCards = combinedProducts.map((v, i) => {
        const isLowStock = getLowStockLabelStatus({ ...v, hasStyleRoomFlag });
        v.isLowStock = isLowStock;
        const product = { ...v, animationTimerIndex, index: i };
        product.msaImageParams = msaImageParams;
        product.hearts = heartsInfo;
        product.onClick = makeCardClick(v, i);
        product.link = product.productSeoUrl || product.productUrl || null;
        product.adsRecosCard = hasRecos || msftAdsToShow;
        const dataTestId = trustedRetailers[i]?.isTrustedRetailer ? 'searchResultsCrossSiteProduct' : 'searchResult';
        return <ProductCard
          key={`${product.styleId}-${product.colorId}`}
          {...product}
          data-test-id={testId(dataTestId)}
          CardDetailsTopSlot={() => !!hydraColorSwatches && <span className={css.colorSwatchWrapper}>Color Swatches: {hydraColorSwatches}</span>}
          CardBottomSlot={ProductCardQuickShopLink}/>;
      });

      if (inlineBannerData?.placement) {
        const placement = parseInt(inlineBannerData.placement, 10);
        const adIndex = placement - 1;
        const canRenderAd = !isNaN(placement) && placement > 0 && allProductCards.length + 1 >= placement && inlineBannerData?.heading && inlineBannerData?.src && inlineBannerData?.mobilesrc;

        canRenderAd && allProductCards.splice(adIndex, 0, <InlineProductCardAd key="searchInlineHero" term={term} {...inlineBannerData} />);
      }

      let productCardsCount = 0;

      if (allProductsCount) {
        productCardsCount = hasCrossSiteSearches ? trustedRetailers.length + list.length : list.length;
      }

      return (
        <div data-test-id={testId('productCardContainer')} className={cn(css.products, productClass)}>
          {allProductCards}
          <MicrosoftAdsWrapper
            numMicrosoftAds={numMicrosoftAds}
            trackMicrosoftAdImpressions={trackMicrosoftAdImpressions}
            hydraMicrosoftSponsoredProducts={hydraMicrosoftSponsoredProducts}
            msftResults={msftResults}
            msaImageParams={msaImageParams}
            makeMicrosoftAdClick={makeMicrosoftAdClick}
            msftAdsToShow={msftAdsToShow}
            CardBottomSlot={ProductCardQuickShopLink}
            productCardsCount={productCardsCount}
          />
          {!msftAdsToShow && hasRecos && (
            <SearchInlineRecos
              heartsInfo={heartsInfo}
              inlineRecos={inlineRecos}
              msaImageParams={msaImageParams}
              searchTerm={term}
              CardBottomSlot={ProductCardQuickShopLink}
              productCardsCount={productCardsCount}
            />
          )}
        </div>
      );
    }
    return null;// no results view handled by NoSearchResults.js
  };

  // render
  return (
    <div id="searchPage" className={'searchPage'}>
      <h2>Search Results</h2>
      {oosMessaging && <p className={css.oosMessaging} data-test-id={testId('oosMessage')}>{oosMessaging}</p>}
      {hasMicrosoftAds && pixelServerHost && <iframe
        className={css.misad}
        frameBorder="0"
        title="misad"
        ref={microsoftAdFrame}
        src={`https://${pixelServerHost}/ads/microsoft-ads.html`} />}
      {isLoading ? <Loader /> : makeProducts()}
      {makeScrollButton && makeScrollButton()}
    </div>
  );
};

Products.displayName = 'Products';

Products.propTypes = {
  filters: PropTypes.object.isRequired,
  layout: PropTypes.string,
  onProductClicked: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  pageCount: PropTypes.number,
  products: PropTypes.object.isRequired,
  showRatings: PropTypes.bool.isRequired,
  msaImageParams: PropTypes.object.isRequired
};

Products.contextTypes = {
  testId: PropTypes.func,
  marketplace: PropTypes.object
};

export default withErrorBoundary('Products', Products);
