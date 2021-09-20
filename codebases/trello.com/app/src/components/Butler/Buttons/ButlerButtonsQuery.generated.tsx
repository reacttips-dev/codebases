import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"ButlerButtons"}}
export type ButlerButtonsQueryVariables = Types.Exact<{
  idBoard: Types.Scalars['ID'];
  idOrganization: Types.Scalars['ID'];
  skipOrganization: Types.Scalars['Boolean'];
}>;


export type ButlerButtonsQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id'>
  )>, board?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'butlerButtonLimit'>
    & { privateButlerButtons: Array<(
      { __typename: 'ButlerButton' }
      & Pick<Types.ButlerButton, 'id' | 'cmd' | 'enabled' | 'image' | 'label' | 'type' | 'pos' | 'idMemberOwner' | 'close'>
    )>, sharedButlerButtons: Array<(
      { __typename: 'ButlerButton' }
      & Pick<Types.ButlerButton, 'id' | 'cmd' | 'enabled' | 'image' | 'label' | 'type' | 'pos' | 'idMemberOwner' | 'close'>
    )>, butlerButtonOverrides?: Types.Maybe<Array<(
      { __typename: 'ButlerButtonOverrides' }
      & Pick<Types.ButlerButtonOverrides, 'idButton'>
      & { overrides: (
        { __typename: 'ButlerButtonOverrides_Overrides' }
        & Pick<Types.ButlerButtonOverrides_Overrides, 'enabled'>
      ) }
    )>>, prefs?: Types.Maybe<(
      { __typename: 'Board_Prefs' }
      & Pick<Types.Board_Prefs, 'permissionLevel'>
    )>, members: Array<(
      { __typename: 'Member' }
      & Pick<Types.Member, 'id'>
    )> }
  )>, organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & { privateButlerButtons: Array<(
      { __typename: 'ButlerButton' }
      & Pick<Types.ButlerButton, 'id' | 'cmd' | 'enabled' | 'image' | 'label' | 'type' | 'pos' | 'idMemberOwner' | 'close'>
    )>, sharedButlerButtons: Array<(
      { __typename: 'ButlerButton' }
      & Pick<Types.ButlerButton, 'id' | 'cmd' | 'enabled' | 'image' | 'label' | 'type' | 'pos' | 'idMemberOwner' | 'close'>
    )> }
  )> }
);


export const ButlerButtonsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ButlerButtons"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idOrganization"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skipOrganization"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"me","block":false}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"butlerButtonLimit"}},{"kind":"Field","name":{"kind":"Name","value":"privateButlerButtons"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cmd"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"pos"}},{"kind":"Field","name":{"kind":"Name","value":"idMemberOwner"}},{"kind":"Field","name":{"kind":"Name","value":"close"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sharedButlerButtons"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cmd"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"pos"}},{"kind":"Field","name":{"kind":"Name","value":"idMemberOwner"}},{"kind":"Field","name":{"kind":"Name","value":"close"}}]}},{"kind":"Field","name":{"kind":"Name","value":"butlerButtonOverrides"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"idButton"}},{"kind":"Field","name":{"kind":"Name","value":"overrides"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enabled"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permissionLevel"}}]}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idOrganization"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"skip"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"if"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skipOrganization"}}}]},{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"privateButlerButtons"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cmd"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"pos"}},{"kind":"Field","name":{"kind":"Name","value":"idMemberOwner"}},{"kind":"Field","name":{"kind":"Name","value":"close"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sharedButlerButtons"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cmd"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"pos"}},{"kind":"Field","name":{"kind":"Name","value":"idMemberOwner"}},{"kind":"Field","name":{"kind":"Name","value":"close"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useButlerButtonsQuery__
 *
 * To run a query within a React component, call `useButlerButtonsQuery` and pass it any options that fit your needs.
 * When your component renders, `useButlerButtonsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useButlerButtonsQuery({
 *   variables: {
 *      idBoard: // value for 'idBoard'
 *      idOrganization: // value for 'idOrganization'
 *      skipOrganization: // value for 'skipOrganization'
 *   },
 * });
 */
export function useButlerButtonsQuery(baseOptions: Apollo.QueryHookOptions<ButlerButtonsQuery, ButlerButtonsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ButlerButtonsQuery, ButlerButtonsQueryVariables>(ButlerButtonsDocument, options);
      }
export function useButlerButtonsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ButlerButtonsQuery, ButlerButtonsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ButlerButtonsQuery, ButlerButtonsQueryVariables>(ButlerButtonsDocument, options);
        }
export type ButlerButtonsQueryHookResult = ReturnType<typeof useButlerButtonsQuery>;
export type ButlerButtonsLazyQueryHookResult = ReturnType<typeof useButlerButtonsLazyQuery>;
export type ButlerButtonsQueryResult = Apollo.QueryResult<ButlerButtonsQuery, ButlerButtonsQueryVariables>;