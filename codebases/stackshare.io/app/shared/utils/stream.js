const log = require('debug')('analytics');
import StreamAnalytics from 'stream-analytics';

export const isUUID = uuid => uuid && typeof uuid === 'string' && uuid.indexOf('-') !== -1;

export function getFeedId({routeContext: {feedType}, feedContext, userId}) {
  let feedId = null;

  if (feedType === 'all') {
    // Trending
    feedId = 'all:1';
  } else if (feedType === 'user') {
    // My Feed
    feedId = `user:${userId}`;
  } else if (feedContext) {
    feedId = `${feedType}:${feedContext.id}`;
  }

  return feedId;
}

export function getStreamAnalyticsClient() {
  if (
    process.env.STREAM_API_KEY &&
    process.env.STREAM_ANALYTICS_TOKEN &&
    typeof window !== 'undefined'
  ) {
    log('Stream Analytics client created', [
      process.env.STREAM_API_KEY,
      process.env.STREAM_ANALYTICS_TOKEN
    ]);
    return new StreamAnalytics({
      apiKey: process.env.STREAM_API_KEY,
      token: process.env.STREAM_ANALYTICS_TOKEN
    });
  }

  return null;
}
