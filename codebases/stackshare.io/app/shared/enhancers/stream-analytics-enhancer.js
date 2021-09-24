import {isUUID} from '../utils/stream';

const log = require('debug')('analytics');
import React from 'react';

const DEFAULT_PAYLOAD = {feedId: null, location: null, client: null};
export const StreamAnalyticsContext = React.createContext(DEFAULT_PAYLOAD);

export function withStreamAnalytics(client, feedId, location) {
  return function(Component) {
    return function StreamAnalytics(props) {
      return (
        <StreamAnalyticsContext.Provider
          value={{
            feedId: typeof feedId === 'function' ? feedId(props) : feedId,
            location,
            client,
            // eslint-disable-next-line react/prop-types
            userId: props.streamUserId
          }}
        >
          <Component {...props} />
        </StreamAnalyticsContext.Provider>
      );
    };
  };
}

export function withTrackEngagement(Component) {
  return function TrackEngagement(props) {
    return (
      <StreamAnalyticsContext.Consumer>
        {ctx => (
          <Component
            {...props}
            trackEngagement={(label, streamId, score, position) => {
              if (!isUUID(streamId)) {
                log(`WARNING: trackEngagement [${label}] called with non-stream id`, streamId);
                return;
              }
              if (ctx.client && ctx.userId) {
                ctx.client.setUser({id: ctx.userId});
                if (ctx.client && ctx.feedId) {
                  const payload = {
                    label,
                    content: {
                      foreign_id: streamId
                    },
                    score,
                    position,
                    feed_id: ctx.feedId,
                    location: ctx.location
                  };
                  log('trackEngagement', payload);
                  ctx.client.trackEngagement(payload);
                } else {
                  log(
                    `WARNING: trackEngagement [${label}] called with invalid client or feedId`,
                    ctx
                  );
                }
              } else {
                log(`WARNING: trackEngagement [${label}] skipped for anonymous user`);
              }
            }}
          />
        )}
      </StreamAnalyticsContext.Consumer>
    );
  };
}
