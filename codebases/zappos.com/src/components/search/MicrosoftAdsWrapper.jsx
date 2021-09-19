import { useEffect } from 'react';
import cn from 'classnames';

import useMartyContext from 'hooks/useMartyContext';
import AdsRecosRowPortal from 'components/search/AdsRecosRowPortal';
import MicrosoftAdsProduct from 'components/search/MicrosoftAdsProduct';
import { getLowStockLabelStatus } from 'helpers/cardUtils';

import { microsoftAdsRow } from 'styles/components/search/microsoftAds.scss';

const MicrosoftAdsWrapper = ({ msftResults, msaImageParams, trackMicrosoftAdImpressions, makeMicrosoftAdClick, numMicrosoftAds, hydraMicrosoftSponsoredProducts, msftAdsToShow, CardBottomSlot, productCardsCount }) => {
  const { marketplace: { search: { microsoftAdsRowIndex, hasStyleRoomFlag } } } = useMartyContext();
  const { impressionUrl } = msftResults;
  const adsRecosRowAttr = { 'data-test-id': 'searchResultsAds' };

  /**
   * Here, we fire "impression" events when the component mounts to the screen
   * regardless if it is in-view, it's hidden via CSS (mobile screen), and whether or not the user is in msft
   */

  useEffect(() => {
    if (impressionUrl) {
      trackMicrosoftAdImpressions({ url: impressionUrl });
    }
  }, [impressionUrl, trackMicrosoftAdImpressions]);

  if (!hydraMicrosoftSponsoredProducts || !msftAdsToShow) {
    return null;
  }

  return <AdsRecosRowPortal
    className={cn(microsoftAdsRow)}
    rowIndex={microsoftAdsRowIndex}
    productCardCount={productCardsCount}
    debounceWait={100}
    attributes={adsRecosRowAttr}
  >
    {msftResults.results.map((props, i) => {
      const product = { ...props, index: i, isSponsored: true };
      const { styleId, colorId } = product;
      const isLowStock = getLowStockLabelStatus({ ...product, hasStyleRoomFlag });
      product.isLowStock = isLowStock;
      return styleId && colorId && <MicrosoftAdsProduct
        key={`${styleId}-${colorId}`}
        product={product}
        numMicrosoftAds={numMicrosoftAds}
        trackMicrosoftAdImpressions={trackMicrosoftAdImpressions}
        makeMicrosoftAdClick={makeMicrosoftAdClick}
        msaImageParams={msaImageParams}
        CardBottomSlot={CardBottomSlot}
      />;
    })}
  </AdsRecosRowPortal>;
};

export default MicrosoftAdsWrapper;
