import registerComponents from '../../../../maharo';
import {compose} from 'react-apollo';
import {withMobile} from '../../../shared/enhancers/mobile-enhancer';
import {withRouter} from '../../../shared/enhancers/router-enhancer';
import {routes} from './routes';
import {withCurrentUser} from '../../../shared/enhancers/current-user-enhancer';
import {user} from '../../../data/shared/queries';
import withToolProfile from '../enhancers/jobs';
import {hot} from 'react-hot-loader/root';
import Jobs from '../containers/jobs';
import resolvers from '../../../data/jobs/resolvers';
import {withApolloContext} from '../../../shared/enhancers/graphql-enhancer';
import {withAlgoliaPlaces} from '../../../shared/enhancers/algolia-places-enhancer';
import {withAlgoliaJobs} from '../../../shared/enhancers/algolia-jobs-enhancer';
import withErrorBoundary from '../../../shared/enhancers/error-boundary';

const client = algoliasearch(process.env.ALGOLIA_ID, process.env.ALGOLIA_CLIENT_SEARCH_API_KEY);
const places = algoliasearch.initPlaces(
  process.env.ALGOLIA_PLACES_ID,
  process.env.ALGOLIA_PLACES_API_KEY
);
client.clearCache();
const searchIndex = client.initIndex(process.env.ALGOLIA_SEARCH_INDEX);
const jobsIndex = client.initIndex(process.env.ALGOLIA_NEW_JOB_INDEX);

registerComponents(
  {
    Jobs: compose(
      withApolloContext,
      withMobile(false),
      withRouter(routes, ({route}) => route),
      withCurrentUser(user),
      withToolProfile,
      withAlgoliaPlaces(places),
      withAlgoliaJobs(jobsIndex),
      withErrorBoundary()
    )(hot(Jobs))
  },
  resolvers(searchIndex)
);
