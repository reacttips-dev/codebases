import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"CreateBoard"}}
export type CreateBoardQueryVariables = Types.Exact<{
  boardId: Types.Scalars['ID'];
}>;


export type CreateBoardQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'desc' | 'id' | 'name' | 'shortLink'>
    & { members: Array<(
      { __typename: 'Member' }
      & Pick<Types.Member, 'fullName'>
      & { nonPublic?: Types.Maybe<(
        { __typename: 'Member_NonPublic' }
        & Pick<Types.Member_NonPublic, 'fullName'>
      )> }
    )>, organization?: Types.Maybe<(
      { __typename: 'Organization' }
      & Pick<Types.Organization, 'displayName'>
    )>, prefs?: Types.Maybe<(
      { __typename: 'Board_Prefs' }
      & Pick<Types.Board_Prefs, 'backgroundColor' | 'backgroundImage'>
    )>, templateGallery?: Types.Maybe<(
      { __typename: 'TemplateGallery' }
      & Pick<Types.TemplateGallery, 'blurb' | 'byline' | 'category'>
    )> }
  )> }
);


export const CreateBoardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CreateBoard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"desc"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"admins"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"nonPublic"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"backgroundColor"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundImage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shortLink"}},{"kind":"Field","name":{"kind":"Name","value":"templateGallery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"blurb"}},{"kind":"Field","name":{"kind":"Name","value":"byline"}},{"kind":"Field","name":{"kind":"Name","value":"category"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useCreateBoardQuery__
 *
 * To run a query within a React component, call `useCreateBoardQuery` and pass it any options that fit your needs.
 * When your component renders, `useCreateBoardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCreateBoardQuery({
 *   variables: {
 *      boardId: // value for 'boardId'
 *   },
 * });
 */
export function useCreateBoardQuery(baseOptions: Apollo.QueryHookOptions<CreateBoardQuery, CreateBoardQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CreateBoardQuery, CreateBoardQueryVariables>(CreateBoardDocument, options);
      }
export function useCreateBoardLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CreateBoardQuery, CreateBoardQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CreateBoardQuery, CreateBoardQueryVariables>(CreateBoardDocument, options);
        }
export type CreateBoardQueryHookResult = ReturnType<typeof useCreateBoardQuery>;
export type CreateBoardLazyQueryHookResult = ReturnType<typeof useCreateBoardLazyQuery>;
export type CreateBoardQueryResult = Apollo.QueryResult<CreateBoardQuery, CreateBoardQueryVariables>;