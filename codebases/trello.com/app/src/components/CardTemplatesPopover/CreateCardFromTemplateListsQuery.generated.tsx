import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"CreateCardFromTemplateLists"}}
export type CreateCardFromTemplateListsQueryVariables = Types.Exact<{
  boardId: Types.Scalars['ID'];
}>;


export type CreateCardFromTemplateListsQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & { lists: Array<(
      { __typename: 'List' }
      & Pick<Types.List, 'id' | 'name' | 'closed'>
    )> }
  )> }
);


export const CreateCardFromTemplateListsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CreateCardFromTemplateLists"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lists"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"open"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useCreateCardFromTemplateListsQuery__
 *
 * To run a query within a React component, call `useCreateCardFromTemplateListsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCreateCardFromTemplateListsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCreateCardFromTemplateListsQuery({
 *   variables: {
 *      boardId: // value for 'boardId'
 *   },
 * });
 */
export function useCreateCardFromTemplateListsQuery(baseOptions: Apollo.QueryHookOptions<CreateCardFromTemplateListsQuery, CreateCardFromTemplateListsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CreateCardFromTemplateListsQuery, CreateCardFromTemplateListsQueryVariables>(CreateCardFromTemplateListsDocument, options);
      }
export function useCreateCardFromTemplateListsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CreateCardFromTemplateListsQuery, CreateCardFromTemplateListsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CreateCardFromTemplateListsQuery, CreateCardFromTemplateListsQueryVariables>(CreateCardFromTemplateListsDocument, options);
        }
export type CreateCardFromTemplateListsQueryHookResult = ReturnType<typeof useCreateCardFromTemplateListsQuery>;
export type CreateCardFromTemplateListsLazyQueryHookResult = ReturnType<typeof useCreateCardFromTemplateListsLazyQuery>;
export type CreateCardFromTemplateListsQueryResult = Apollo.QueryResult<CreateCardFromTemplateListsQuery, CreateCardFromTemplateListsQueryVariables>;