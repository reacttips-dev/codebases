import React, { useEffect } from 'react';
import cn from 'classnames';
import { useInView } from 'react-intersection-observer';

import useMartyContext from 'hooks/useMartyContext';
import { track } from 'apis/amethyst';
import { evRecommendationImpressionWrapper } from 'events/recommendations';
import ProductCard from 'components/common/ProductCard';

import { microsoftAdsCard } from 'styles/components/search/microsoftAds.scss';

const MicrosoftAdsProduct = ({ product, numMicrosoftAds, trackMicrosoftAdImpressions, makeMicrosoftAdClick, msaImageParams, CardBottomSlot }) => {
  const { testId } = useMartyContext();

  const [intersectionRef, inView] = useInView({ threshold: 0.3 /** 30% was the agreed upon spec from MSFT to fire the view event */, triggerOnce: true });
  const { viewUrl, index } = product;
  const linkProps = { 'aria-describedby': `sponsoredBanner-${index}` };

  /**
   * Important: "View" events are fired when a customer has the ad in the viewport, via intersection observer
   */
  useEffect(() => {
    if (inView) {
      const recommendationImpression = [{
        numberOfRecommendations: numMicrosoftAds,
        recommendationType: 'PRODUCT_RECOMMENDATION',
        recommendationSource: 'MICROSOFT',
        widgetType: 'MICROSOFT_TOP_BLOCK'
      }];
      track(() => ([evRecommendationImpressionWrapper, { recommendationImpression }]));
      trackMicrosoftAdImpressions({ url: viewUrl });
    }
  }, [inView, trackMicrosoftAdImpressions, viewUrl, numMicrosoftAds ]);

  return <ProductCard
    intersectionRef={intersectionRef}
    className={cn(microsoftAdsCard)}
    msaImageParams={msaImageParams}
    onClick={makeMicrosoftAdClick(product, index)}
    {...product}
    data-test-id={testId('msftWrappedCard')}
    CardBottomSlot={CardBottomSlot}
    linkProps={linkProps}/>;
};

export default MicrosoftAdsProduct;
