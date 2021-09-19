import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { ADSENSE_URL } from 'constants/appConstants';
import { injectScriptToHead } from 'helpers/HtmlHelpers';
import { getUserAdPreference } from 'actions/account/ads';
import { MartyContext } from 'utils/context';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';

export class AdsenseSlot extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired
  };

  componentDidMount() {
    const { isShowingThirdPartyAds } = this.props;

    if (isShowingThirdPartyAds) {
      const { ads: { adsenseId } = {} } = this.marketplace;

      // check if adsense is on marketplace, or if script has already been injected
      if (adsenseId && !document.getElementById('adsense')) {
        injectScriptToHead({
          src: ADSENSE_URL,
          id: 'adsense'
        });
      }

      this.fetchAdsenseAds();
    }
  }

  componentDidUpdate(prevProps) {
    const { isShowingThirdPartyAds } = this.props;

    if (isShowingThirdPartyAds) {
      const {
        query,
        page
      } = this.props;

      const {
        query: prevQuery,
        page: prevPage
      } = prevProps;

      if (prevQuery !== query || prevPage !== page) {
        this.fetchAdsenseAds();
      }
    }
  }

  fetchAdsenseAds = () => {
    const { ads : { adsenseId } = {} } = this.marketplace;

    const {
      name,
      page = 0,
      styleId,
      query,
      googleAdsConfig,
      adPreferences = {},
      win = window
    } = this.props;

    // dont attempt to render ads when search term isn't defined or empty
    if (!query) {
      return null;
    }

    const { optOutPreference = true } = adPreferences;

    const adConfig = {
      pubId: `pub-${adsenseId}`,
      styleId,
      query,
      personalizedAds: optOutPreference, // `optOutPreference` is true if customers want personalized ads
      adsafe: 'high',
      adPage: page + 1, // page offset by one
      ...googleAdsConfig
    };

    const adStyleConfig = {
      container: name,
      number: 1
    };

    // make sure we don't 500 the page if google adsense doesnt work
    try {
      win._googCsa('ads', adConfig, adStyleConfig);
    } catch (e) { /* dont do anything */ }
  };

  render() {
    const { name, className, isShowingThirdPartyAds, forceShow, slotName, slotIndex } = this.props;

    return (
      <MartyContext.Consumer>
        { ({ marketplace }) => {
          this.marketplace = marketplace;

          if (!marketplace.ads || (!isShowingThirdPartyAds && !forceShow)) {
            return null;
          }

          return <div
            id={name}
            className={className}
            data-slot-id={slotName}
            data-slotindex={slotIndex}/>;
        }}
      </MartyContext.Consumer>
    );
  }
}

export const mapStateToProps = state => {
  const {
    environmentConfig: { googleAdsConfig },
    killswitch: { isShowingThirdPartyAds }
  } = state;

  const adPreferences = getUserAdPreference(state);

  return {
    googleAdsConfig,
    adPreferences,
    isShowingThirdPartyAds
  };
};

const ConnectedAdsenseSlot = connect(mapStateToProps)(AdsenseSlot);
export default withErrorBoundary('AdsenseSlot', ConnectedAdsenseSlot);
