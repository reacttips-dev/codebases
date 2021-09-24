import registerComponents from '../../../../maharo';
import {compose} from 'react-apollo';
import {withMobile} from '../../../shared/enhancers/mobile-enhancer';
import {withRouter} from '../../../shared/enhancers/router-enhancer';
import {routes} from './routes';
import {withCurrentUser} from '../../../shared/enhancers/current-user-enhancer';
import {user, privateMode} from '../../../data/shared/queries';
import withToolAlternatives from '../enhancers/tool-alternatives';
import {hot} from 'react-hot-loader/root';
import ToolAlternatives from '../containers/tool-alternatives';
import resolvers from '../../../data/tool-profile/resolvers';
import {withApolloContext} from '../../../shared/enhancers/graphql-enhancer';
import {withPrivateMode} from '../../../shared/enhancers/private-mode-enchancer';
import withErrorBoundary from '../../../shared/enhancers/error-boundary';

const client = algoliasearch(process.env.ALGOLIA_ID, process.env.ALGOLIA_CLIENT_SEARCH_API_KEY);
client.clearCache();
const searchIndex = client.initIndex(process.env.ALGOLIA_SEARCH_INDEX);

registerComponents(
  {
    ToolAlternatives: compose(
      withApolloContext,
      withMobile(false),
      withRouter(routes, ({route}) => route),
      withCurrentUser(user),
      withPrivateMode(privateMode),
      withToolAlternatives,
      withErrorBoundary()
    )(hot(ToolAlternatives))
  },
  resolvers(searchIndex)
);
