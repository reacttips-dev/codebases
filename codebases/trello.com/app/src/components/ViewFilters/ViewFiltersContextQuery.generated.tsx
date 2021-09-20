import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"ViewFiltersContext"}}
export type ViewFiltersContextQueryVariables = Types.Exact<{
  idOrganizationView: Types.Scalars['ID'];
}>;


export type ViewFiltersContextQuery = (
  { __typename: 'Query' }
  & { organizationView?: Types.Maybe<(
    { __typename: 'OrganizationView' }
    & Pick<Types.OrganizationView, 'id' | 'name' | 'idOrganization'>
    & { views: Array<(
      { __typename: 'OrganizationView_View' }
      & Pick<Types.OrganizationView_View, 'id' | 'defaultViewType'>
      & { cardFilter: (
        { __typename: 'OrganizationView_View_CardFilter' }
        & { criteria: Array<(
          { __typename: 'OrganizationView_View_CardFilter_Criteria' }
          & Pick<Types.OrganizationView_View_CardFilter_Criteria, 'idBoards' | 'idLists' | 'idMembers' | 'dueComplete' | 'labels' | 'sort'>
          & { due?: Types.Maybe<(
            { __typename: 'CardFilter_Criteria_DateRange' }
            & { start?: Types.Maybe<(
              { __typename: 'CardFilter_AdvancedDate' }
              & Pick<Types.CardFilter_AdvancedDate, 'dateType' | 'value'>
            )>, end?: Types.Maybe<(
              { __typename: 'CardFilter_AdvancedDate' }
              & Pick<Types.CardFilter_AdvancedDate, 'dateType' | 'value'>
            )> }
          )> }
        )> }
      ) }
    )> }
  )> }
);


export const ViewFiltersContextDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ViewFiltersContext"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idOrganizationView"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organizationView"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idOrganizationView"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"idOrganization"}},{"kind":"Field","name":{"kind":"Name","value":"views"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cardFilter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"criteria"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"idBoards"}},{"kind":"Field","name":{"kind":"Name","value":"idLists"}},{"kind":"Field","name":{"kind":"Name","value":"idMembers"}},{"kind":"Field","name":{"kind":"Name","value":"due"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dateType"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"end"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dateType"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"dueComplete"}},{"kind":"Field","name":{"kind":"Name","value":"labels"}},{"kind":"Field","name":{"kind":"Name","value":"sort"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"defaultViewType"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useViewFiltersContextQuery__
 *
 * To run a query within a React component, call `useViewFiltersContextQuery` and pass it any options that fit your needs.
 * When your component renders, `useViewFiltersContextQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useViewFiltersContextQuery({
 *   variables: {
 *      idOrganizationView: // value for 'idOrganizationView'
 *   },
 * });
 */
export function useViewFiltersContextQuery(baseOptions: Apollo.QueryHookOptions<ViewFiltersContextQuery, ViewFiltersContextQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ViewFiltersContextQuery, ViewFiltersContextQueryVariables>(ViewFiltersContextDocument, options);
      }
export function useViewFiltersContextLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ViewFiltersContextQuery, ViewFiltersContextQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ViewFiltersContextQuery, ViewFiltersContextQueryVariables>(ViewFiltersContextDocument, options);
        }
export type ViewFiltersContextQueryHookResult = ReturnType<typeof useViewFiltersContextQuery>;
export type ViewFiltersContextLazyQueryHookResult = ReturnType<typeof useViewFiltersContextLazyQuery>;
export type ViewFiltersContextQueryResult = Apollo.QueryResult<ViewFiltersContextQuery, ViewFiltersContextQueryVariables>;