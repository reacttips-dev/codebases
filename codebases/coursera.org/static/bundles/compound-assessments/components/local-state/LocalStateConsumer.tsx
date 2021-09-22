// Tool to add React Apollo local resolvers required for Compound Assessments.
// You need wrap components that use added resolvers with this component:
// <LocalStateConsumer>
//   <Query query={query}>
//     ...
//   </Query>
// </LocalStateConsumer>
// You can add it once on common parent for those components. It is also safe to add it right
// in the component that uses these resolvers even if it might be used multiple times. It will
// not update client if it is already updated.
// Connected resolvers:
// * ChangedResponse. Designed to store updated responses for form parts. Allows to run
// following queries:
//   query ChangedResponseQuery($id: String!) {
//     ChangedResponse @client {
//       get(id: $id) @client {
//         id
//         response
//       }
//     }
//   }
//   query ChangedResponseQuery($ids: [String]!) {
//     ChangedResponse @client {
//       multiGet(ids: $ids) @client {
//         id
//         response
//       }
//     }
//   }
// If you want to add your resolvers please use
// static/bundles/compound-assessments/components/local-state/changed-response/
// as a draft.

import React from 'react';

import { ApolloConsumer } from 'react-apollo';

import addChangedResponse from './changed-response/resolvers';
import addStepState from './step-state/resolvers';

const LocalStateConsumer = ({ children }: { children: JSX.Element }) => (
  <ApolloConsumer>
    {(client) => {
      addChangedResponse(client);
      addStepState(client);
      return children;
    }}
  </ApolloConsumer>
);

export default LocalStateConsumer;
