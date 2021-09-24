import registerComponents from '../../../../maharo';
import withConnectedFeed from '../containers/connected-feed-factory';
import Feed from '../containers/feed.jsx';
import resolvers from '../../../data/feed/resolvers';
import {hot} from 'react-hot-loader/root';
import {compose} from 'react-apollo';
import {getStreamAnalyticsClient} from '../../../shared/utils/stream';
import {withFeedTracking} from '../../../data/feed/enhancers';
import {withRouter} from '../../../shared/enhancers/router-enhancer';
import {routes} from './routes';
import {privateMode, user} from '../../../data/shared/queries';
import {withMobile} from '../../../shared/enhancers/mobile-enhancer';
import {onboardingChecklist} from '../../../data/feed/queries';
import {withChecklist} from '../../../shared/enhancers/checklist-enhancer';
import {withApolloContext} from '../../../shared/enhancers/graphql-enhancer';
import {withPrivateMode} from '../../../shared/enhancers/private-mode-enchancer';
import withErrorBoundary from '../../../shared/enhancers/error-boundary';
import {withCurrentUser} from '../../../shared/enhancers/current-user-enhancer';

const client = algoliasearch(process.env.ALGOLIA_ID, process.env.ALGOLIA_CLIENT_SEARCH_API_KEY);
client.clearCache();
const searchIndex = client.initIndex(process.env.ALGOLIA_SEARCH_INDEX);
const topicIndex = client.initIndex(process.env.ALGOLIA_TOPIC_INDEX);

const streamAnalyticsClient = getStreamAnalyticsClient();

registerComponents(
  {
    Feed: compose(
      withRouter(routes, ({route}) => route),
      withMobile(false),
      withApolloContext,
      withPrivateMode(privateMode),
      withCurrentUser(user),
      withConnectedFeed,
      withChecklist(onboardingChecklist),
      withFeedTracking(streamAnalyticsClient),
      withErrorBoundary()
    )(hot(Feed))
  },
  resolvers(searchIndex, topicIndex)
);
