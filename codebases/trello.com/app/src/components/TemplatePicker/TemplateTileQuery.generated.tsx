import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"TemplateTile"}}
export type TemplateTileQueryVariables = Types.Exact<{
  boardId: Types.Scalars['ID'];
}>;


export type TemplateTileQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id' | 'desc' | 'idOrganization' | 'name' | 'url'>
    & { prefs?: Types.Maybe<(
      { __typename: 'Board_Prefs' }
      & Pick<Types.Board_Prefs, 'background' | 'backgroundColor' | 'backgroundImage'>
      & { backgroundImageScaled?: Types.Maybe<Array<(
        { __typename: 'Board_Prefs_BackgroundImageScaled' }
        & Pick<Types.Board_Prefs_BackgroundImageScaled, 'width' | 'height' | 'url'>
      )>> }
    )>, templateGallery?: Types.Maybe<(
      { __typename: 'TemplateGallery' }
      & Pick<Types.TemplateGallery, 'avatarUrl' | 'avatarShape' | 'byline' | 'category' | 'precedence' | 'blurb' | 'featured'>
    )> }
  )> }
);


export const TemplateTileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TemplateTile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"desc"}},{"kind":"Field","name":{"kind":"Name","value":"idOrganization"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"background"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColor"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundImage"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundImageScaled"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"templateGallery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"avatarShape"}},{"kind":"Field","name":{"kind":"Name","value":"byline"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"precedence"}},{"kind":"Field","name":{"kind":"Name","value":"blurb"}},{"kind":"Field","name":{"kind":"Name","value":"featured"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useTemplateTileQuery__
 *
 * To run a query within a React component, call `useTemplateTileQuery` and pass it any options that fit your needs.
 * When your component renders, `useTemplateTileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTemplateTileQuery({
 *   variables: {
 *      boardId: // value for 'boardId'
 *   },
 * });
 */
export function useTemplateTileQuery(baseOptions: Apollo.QueryHookOptions<TemplateTileQuery, TemplateTileQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TemplateTileQuery, TemplateTileQueryVariables>(TemplateTileDocument, options);
      }
export function useTemplateTileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TemplateTileQuery, TemplateTileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TemplateTileQuery, TemplateTileQueryVariables>(TemplateTileDocument, options);
        }
export type TemplateTileQueryHookResult = ReturnType<typeof useTemplateTileQuery>;
export type TemplateTileLazyQueryHookResult = ReturnType<typeof useTemplateTileLazyQuery>;
export type TemplateTileQueryResult = Apollo.QueryResult<TemplateTileQuery, TemplateTileQueryVariables>;