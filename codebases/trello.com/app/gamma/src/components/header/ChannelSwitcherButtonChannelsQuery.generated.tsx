import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"ChannelSwitcherButtonChannels"}}
export type ChannelSwitcherButtonChannelsQueryVariables = Types.Exact<{
  memberId: Types.Scalars['ID'];
}>;


export type ChannelSwitcherButtonChannelsQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & { channels?: Types.Maybe<(
      { __typename: 'Channels' }
      & Pick<Types.Channels, 'allowed' | 'active'>
    )> }
  )> }
);


export const ChannelSwitcherButtonChannelsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ChannelSwitcherButtonChannels"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"channels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allowed"}},{"kind":"Field","name":{"kind":"Name","value":"active"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useChannelSwitcherButtonChannelsQuery__
 *
 * To run a query within a React component, call `useChannelSwitcherButtonChannelsQuery` and pass it any options that fit your needs.
 * When your component renders, `useChannelSwitcherButtonChannelsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChannelSwitcherButtonChannelsQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useChannelSwitcherButtonChannelsQuery(baseOptions: Apollo.QueryHookOptions<ChannelSwitcherButtonChannelsQuery, ChannelSwitcherButtonChannelsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ChannelSwitcherButtonChannelsQuery, ChannelSwitcherButtonChannelsQueryVariables>(ChannelSwitcherButtonChannelsDocument, options);
      }
export function useChannelSwitcherButtonChannelsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ChannelSwitcherButtonChannelsQuery, ChannelSwitcherButtonChannelsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ChannelSwitcherButtonChannelsQuery, ChannelSwitcherButtonChannelsQueryVariables>(ChannelSwitcherButtonChannelsDocument, options);
        }
export type ChannelSwitcherButtonChannelsQueryHookResult = ReturnType<typeof useChannelSwitcherButtonChannelsQuery>;
export type ChannelSwitcherButtonChannelsLazyQueryHookResult = ReturnType<typeof useChannelSwitcherButtonChannelsLazyQuery>;
export type ChannelSwitcherButtonChannelsQueryResult = Apollo.QueryResult<ChannelSwitcherButtonChannelsQuery, ChannelSwitcherButtonChannelsQueryVariables>;