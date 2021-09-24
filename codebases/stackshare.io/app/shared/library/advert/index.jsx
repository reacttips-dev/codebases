import React, {useEffect, useContext, useState} from 'react';
import PropTypes from 'prop-types';
import SponsoredCard from './sponsored-card';
import {withSendAnalyticsEvent} from '../../enhancers/analytics-enhancer';
import {AD_SHOWN} from '../../constants/analytics';
import {ROW, COLUMN, SLIM, SHORT} from './themes';
import {AD_CLICK} from '../../constants/analytics';
import {advert as advertQuery} from '../../../data/shared/queries';
import glamorous from 'glamorous';
import {ApolloContext} from '../../enhancers/graphql-enhancer';
import withErrorBoundary from '../../enhancers/error-boundary';
import {compose} from 'react-apollo';
import useTrackAdClick, {BE_AD_CLICK} from '../../utils/hooks/track-ad-click';

const AdPlaceholder = glamorous.div({
  display: 'flex',
  justifyContent: 'center',
  margin: '50px 0'
});

const Advert = ({
  requestPath,
  contentGroupPage,
  theme = COLUMN,
  sendAnalyticsEvent,
  triggerAdShownOnMount = true,
  layer,
  category,
  primaryFunction,
  truncateLength = 60,
  maxWidth = 728,
  height = 'auto',
  placement,
  objectType,
  objectId
}) => {
  const client = useContext(ApolloContext);
  const [advertData, setAdvertData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const trackAdClick = useTrackAdClick();

  useEffect(() => {
    client
      .query({
        query: advertQuery,
        variables: {placement, objectType, objectId},
        ssr: false
      })
      .then(({data: {advert}}) => {
        if (advert) {
          setAdvertData(advert);

          const analyticsData = {
            sponsor: {
              name: advert.title,
              featured: advert.sponsorFeatured,
              text: advert.text,
              url: advert.targetUrl
            },
            path: requestPath,
            contentGroupPage,
            theme,
            layer,
            category,
            primaryFunction,
            placement
          };

          if (triggerAdShownOnMount) {
            sendAnalyticsEvent(AD_SHOWN, analyticsData);
          }
          setAnalyticsData(analyticsData);
        }
      });
  }, []);

  if (!advertData) {
    return <AdPlaceholder />;
  } else {
    return (
      <SponsoredCard
        sponsor={advertData}
        theme={theme}
        truncateLength={truncateLength}
        maxWidth={maxWidth}
        height={height}
        sendAnalyticsEvent={() => {
          sendAnalyticsEvent(AD_CLICK, analyticsData);
          trackAdClick(BE_AD_CLICK, analyticsData);
        }}
      />
    );
  }
};

Advert.propTypes = {
  requestPath: PropTypes.string,
  contentGroupPage: PropTypes.string,
  theme: PropTypes.oneOf([ROW, COLUMN, SLIM, SHORT]),
  truncateLength: PropTypes.number,
  maxWidth: PropTypes.any,
  height: PropTypes.any,
  sendAnalyticsEvent: PropTypes.func,
  triggerAdShownOnMount: PropTypes.bool,
  layer: PropTypes.string,
  category: PropTypes.string,
  primaryFunction: PropTypes.string,
  placement: PropTypes.string,
  objectType: PropTypes.string,
  objectId: PropTypes.string
};

export default compose(
  withSendAnalyticsEvent,
  withErrorBoundary(true)
)(Advert);
