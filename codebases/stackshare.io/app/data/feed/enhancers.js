import {withMutation} from '../../shared/enhancers/graphql-enhancer';
import {trackViews} from './mutations';
import {callTrackViews} from '../../../app/shared/utils/trackViews.js';
import {
  defaultGenerateKey,
  withBatchTracking
} from '../../shared/enhancers/analytics-batch-enhancer';
import {FEED_TRACK_VIEWS} from '../../bundles/feed/constants/analytics';
import {withStreamAnalytics} from '../../shared/enhancers/stream-analytics-enhancer';
import {getFeedId, isUUID} from '../../shared/utils/stream';
import {compose} from 'react-apollo';
const analyticsLog = require('debug')('analytics');

export const withFeedTracking = streamAnalyticsClient => {
  return compose(
    withMutation(trackViews, mutate => ({
      trackViews: (decisionIds, clientContext) => mutate({variables: {decisionIds, clientContext}})
    })),
    withBatchTracking(
      props => {
        return props.items
          ? props.items
              .filter(i =>
                i && i.object
                  ? i.object.__typename === 'StackDecision'
                  : i.__typename === 'StackDecision'
              )
              .map(i => {
                const answers = [];

                if (
                  (i.object && i.object.decisionType === 'getAdvice') ||
                  i.decisionType === 'getAdvice'
                ) {
                  (i.object ? i.object : i).answers.edges.map(ans => answers.push(ans.node.id));
                }

                return {
                  type: i.object ? i.object.__typename : i.__typename,
                  id: i.object ? i.object.id : i.id,
                  answers: answers
                };
              })
          : [];
      },
      (batch, {trackViews, sendAnalyticsEvent}) => {
        const decisionIds = [];
        batch.map(c => decisionIds.push(...c.answers, c.id));
        sendAnalyticsEvent(FEED_TRACK_VIEWS, {decisionIds});
        callTrackViews({
          trackViews,
          decisionIds,
          clientContext: `Feed-${window.location.pathname}`
        });
      }
    ),
    withStreamAnalytics(streamAnalyticsClient, getFeedId, 'feed'),
    withBatchTracking(
      props => (props.items ? props.items.filter(i => i).map(i => i.id) : []),
      (batch, props) => {
        if (props.userId) {
          streamAnalyticsClient.setUser({id: props.streamUserId});

          const feedId = getFeedId(props);

          if (feedId) {
            const impression = {
              content_list: batch.filter(id => isUUID(id)),
              feed_id: feedId,
              location: 'feed'
            };

            if (impression.content_list.length > 0) {
              analyticsLog('trackImpression', impression);
              streamAnalyticsClient.trackImpression(impression);
            }
          } else {
            analyticsLog(`WARNING: trackImpression called with invalid feedId`, feedId);
          }
        } else {
          analyticsLog(`WARNING: trackImpression skipped for anonymous user`);
        }
      },
      (c, props) => getFeedId(props) + '|' + defaultGenerateKey(c)
    )
  );
};
