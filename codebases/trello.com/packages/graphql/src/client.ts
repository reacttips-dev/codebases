import { resolvers } from './resolvers';
import {
  ApolloClient,
  NormalizedCacheObject,
  InMemoryCache,
} from '@apollo/client';
import { clientVersion } from '@trello/config';
import typeDefs from './schema';
import { typePolicies } from './typePolicies';

// eslint-disable-next-line @trello/no-module-logic
export const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  // eslint-disable-next-line @trello/no-module-logic
  cache: new InMemoryCache({ typePolicies }),
  name: 'trello-web',
  version: clientVersion,
  resolvers,
  typeDefs,
  ...(process.env.NODE_ENV === 'development' && { connectToDevTools: true }),
});
