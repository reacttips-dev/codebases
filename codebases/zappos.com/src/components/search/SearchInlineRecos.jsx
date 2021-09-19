import { useCallback, useEffect } from 'react';

import ProductCard from 'components/common/ProductCard';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { evRecommendationClick, evRecommendationImpressionWrapper } from 'events/recommendations';
import { trackEvent } from 'helpers/analytics';
import { track } from 'apis/amethyst';
import useMartyContext from 'hooks/useMartyContext';
import AdsRecosRowPortal from 'components/search/AdsRecosRowPortal';

import css from 'styles/components/search/inlineRecos.scss';

export const SearchInlineRecos = ({ inlineRecos = {}, heartsInfo, msaImageParams, searchTerm, CardBottomSlot, productCardsCount }) => {
  const { recos, title } = inlineRecos;
  const recoSource = 'EP13N';
  const adsRecosRowAttr = { 'data-reco-count': recos?.length, 'data-test-id': 'searchResultsRecos' };
  const { testId, marketplace: { search: { searchInlineRecosRowIndex } } } = useMartyContext();

  const handleInlineRecoClick = useCallback(({ index, styleId, productId }) => {
    trackEvent('TE_SEARCH_INLINE_RECO_CLICK', `styleId:${styleId}productIndex:${index}:searchTerm:${searchTerm}`);
    track(() => ([
      evRecommendationClick, {
        index: index + 1,
        recommendationType: 'PRODUCT_RECOMMENDATION',
        recommendationValue: productId,
        recommendationSource: recoSource,
        widgetType: 'SIMILAR_PRODUCT_WIDGET'
      }
    ]));
  }, [searchTerm]);

  useEffect(() => {
    const styleIds = recos.map(reco => reco.styleId);
    trackEvent('TE_SEARCH_INLINE_RECOS_VIEW', `styles:${styleIds}:searchTerm:${searchTerm}`);
    const recommendationImpression = [{
      numberOfRecommendations: styleIds.length,
      recommendationType: 'PRODUCT_RECOMMENDATION',
      recommendationSource: recoSource,
      widgetType: 'SIMILAR_PRODUCT_WIDGET'
    }];
    track(() => ([ evRecommendationImpressionWrapper, { recommendationImpression } ]));
  }, [recos, searchTerm]);

  return recos?.length && (
    <AdsRecosRowPortal
      wrapperEl="aside"
      className={css.container}
      rowIndex={searchInlineRecosRowIndex}
      productCardCount={productCardsCount}
      debounceWait={100}
      attributes={adsRecosRowAttr}
    >
      {title && <h2>{title}</h2>}
      <div className={css.recos} data-source={recoSource} data-test-id={'inlineRecos'}>
        {recos.map((reco, index) => {
          if (index < 4) {
            const { styleId, productId, link, productUrl } = reco;
            const url = link || productUrl; // if cabt wins won't need to explicitly send this; handled by ProductCard.jsx
            return (
              <ProductCard
                {...reco}
                hearts={heartsInfo}
                msaImageParams={msaImageParams}
                key={styleId + productId}
                className={css.productCardOverride}
                imageNoBackground={true}
                productUrl={url}
                onClick={() => handleInlineRecoClick({ index, styleId, productId })}
                data-test-id={testId('searchReco')}
                CardBottomSlot={CardBottomSlot}
              />
            );
          }
          return null;
        })}
      </div>
    </AdsRecosRowPortal>
  );
};

export default withErrorBoundary('SearchInlineRecos', SearchInlineRecos);
