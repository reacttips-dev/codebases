import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"HasButlerAccess"}}
export type HasButlerAccessQueryVariables = Types.Exact<{
  idBoard: Types.Scalars['ID'];
}>;


export type HasButlerAccessQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id'>
  )>, board?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'idEnterprise'>
    & { organization?: Types.Maybe<(
      { __typename: 'Organization' }
      & { memberships: Array<(
        { __typename: 'Organization_Membership' }
        & Pick<Types.Organization_Membership, 'idMember' | 'memberType'>
      )>, enterprise?: Types.Maybe<(
        { __typename: 'Enterprise' }
        & Pick<Types.Enterprise, 'id' | 'idAdmins'>
      )> }
    )> }
  )> }
);


export const HasButlerAccessDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"HasButlerAccess"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"me","block":false}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"idMember"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"enterprise"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idAdmins"}}]}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useHasButlerAccessQuery__
 *
 * To run a query within a React component, call `useHasButlerAccessQuery` and pass it any options that fit your needs.
 * When your component renders, `useHasButlerAccessQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHasButlerAccessQuery({
 *   variables: {
 *      idBoard: // value for 'idBoard'
 *   },
 * });
 */
export function useHasButlerAccessQuery(baseOptions: Apollo.QueryHookOptions<HasButlerAccessQuery, HasButlerAccessQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HasButlerAccessQuery, HasButlerAccessQueryVariables>(HasButlerAccessDocument, options);
      }
export function useHasButlerAccessLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HasButlerAccessQuery, HasButlerAccessQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HasButlerAccessQuery, HasButlerAccessQueryVariables>(HasButlerAccessDocument, options);
        }
export type HasButlerAccessQueryHookResult = ReturnType<typeof useHasButlerAccessQuery>;
export type HasButlerAccessLazyQueryHookResult = ReturnType<typeof useHasButlerAccessLazyQuery>;
export type HasButlerAccessQueryResult = Apollo.QueryResult<HasButlerAccessQuery, HasButlerAccessQueryVariables>;