import { useEffect, useMemo } from 'react';
import { connect } from 'react-redux';

import { addAdToQueue } from 'actions/ads';
import GamSlot from 'components/common/GamSlot';
import AdsenseSlot from 'components/common/AdsenseSlot';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';

import css from 'styles/components/landing/ad.scss';

const TYPE_DISPLAY = 'display';
const TYPE_TEXT = 'text';

// Component for interfacing a Symphony component with AdsenseSlot & GamSlot
export const Ad = ({
  slotName, slotIndex, slotDetails, ads, pageType, containerClassOverride, brandName,
  honeTag, page, isShowingThirdPartyAds, addAdToQueue
}) => {
  ads = ads || slotDetails?.ad || [];

  useEffect(() => {
    if (isShowingThirdPartyAds) {
      /*
        This is an array that is shaped like:
        [ {name: 'HOME-NARROW-MID', device: 'mobile', height: '50', width: '320' } ]
        Could potentially be just [ { name: 'HOME-NARROW-MID' } ]
        if we have preset sizing and devices in helpers/apsAdvertisement.js
      */
      const gamSlotsList = ads.filter(({ type, page }) =>
        type === TYPE_DISPLAY && (page ? page === pageType : true)
      );
      if (gamSlotsList.length) {
        addAdToQueue(gamSlotsList);
      }
    }
  }, [addAdToQueue, ads, isShowingThirdPartyAds, pageType]);

  // Some ads require page specific data
  const pageSpecificTextAdProps = useMemo(() => {
    switch (pageType) {
      case 'search':
        return { name: 'adSearchFooter', styleId: '2019220181', page, query: honeTag };
      case 'product':
        return { name: 'adPdpFooter', styleId: '6178734663', query: brandName };
      default:
        return {};
    }
  }, [brandName, honeTag, page, pageType]);

  if (!isShowingThirdPartyAds || !ads?.length) {
    return null;
  }

  const className = containerClassOverride || css.container;

  return ads.map(({ type, query, styleId, device, name, page }) => {
    if (page && page !== pageType) {
      return null;
    } else if (type === TYPE_TEXT) {
      return (
        <AdsenseSlot
          {...pageSpecificTextAdProps}
          key={type + query + styleId}
          className={className}
          name={name || pageSpecificTextAdProps.name}
          styleId={styleId || pageSpecificTextAdProps.styleId}
          query={query || pageSpecificTextAdProps.query}
          forceShow={true}
          slotName={slotName}
          slotIndex={slotIndex}
        />
      );
    } else if (type === TYPE_DISPLAY) {
      return (
        <GamSlot
          key={type + name}
          slot={name}
          deviceOverride={device}
          className={className}
          forceShow={true}
          slotName={slotName}
          slotIndex={slotIndex}
        />
      );
    } else {
      return null;
    }
  });

};

const mapStateToProps = state => ({
  isShowingThirdPartyAds: state.killswitch?.isShowingThirdPartyAds,
  pageType: state.pageView?.pageType,
  brandName: state.product.detail?.brandName,
  honeTag: state.filters?.honeTag,
  page: state.filters?.page
});

const ConnectedAd = connect(mapStateToProps, { addAdToQueue })(Ad);
export default withErrorBoundary('Ad', ConnectedAd);
