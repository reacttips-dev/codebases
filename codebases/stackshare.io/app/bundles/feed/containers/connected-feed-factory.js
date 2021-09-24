import {compose} from 'react-apollo';
import {withQuery} from '../../../shared/enhancers/graphql-enhancer';
import {
  withAnalyticsPayload,
  withSendAnalyticsEvent
} from '../../../shared/enhancers/analytics-enhancer';
import {withDynamicQuery} from '../../../data/feed/dynamic-query-enhancer';
import {feedContext, followedTools} from '../../../data/feed/queries';

import {
  mapFollowedToolsToProps,
  mapPropsToContextVariables,
  skipIfNotContextualFeed
} from '../../../data/feed/utils';
import {withRouteContext} from '../../../shared/enhancers/router-enhancer';

export default Component =>
  compose(
    withRouteContext,
    withAnalyticsPayload({'page.name': 'Feed'}),
    withSendAnalyticsEvent,
    withQuery(followedTools, mapFollowedToolsToProps),
    withDynamicQuery,
    withQuery(feedContext, undefined, mapPropsToContextVariables, skipIfNotContextualFeed)
  )(Component);
