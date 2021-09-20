import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"TemplateBackgroundImageScale"}}
export type TemplateBackgroundImageScaleQueryVariables = Types.Exact<{
  idBoard: Types.Scalars['ID'];
}>;


export type TemplateBackgroundImageScaleQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & { prefs?: Types.Maybe<(
      { __typename: 'Board_Prefs' }
      & { backgroundImageScaled?: Types.Maybe<Array<(
        { __typename: 'Board_Prefs_BackgroundImageScaled' }
        & Pick<Types.Board_Prefs_BackgroundImageScaled, 'width' | 'height' | 'url'>
      )>> }
    )> }
  )> }
);


export const TemplateBackgroundImageScaleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TemplateBackgroundImageScale"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"backgroundImageScaled"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useTemplateBackgroundImageScaleQuery__
 *
 * To run a query within a React component, call `useTemplateBackgroundImageScaleQuery` and pass it any options that fit your needs.
 * When your component renders, `useTemplateBackgroundImageScaleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTemplateBackgroundImageScaleQuery({
 *   variables: {
 *      idBoard: // value for 'idBoard'
 *   },
 * });
 */
export function useTemplateBackgroundImageScaleQuery(baseOptions: Apollo.QueryHookOptions<TemplateBackgroundImageScaleQuery, TemplateBackgroundImageScaleQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TemplateBackgroundImageScaleQuery, TemplateBackgroundImageScaleQueryVariables>(TemplateBackgroundImageScaleDocument, options);
      }
export function useTemplateBackgroundImageScaleLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TemplateBackgroundImageScaleQuery, TemplateBackgroundImageScaleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TemplateBackgroundImageScaleQuery, TemplateBackgroundImageScaleQueryVariables>(TemplateBackgroundImageScaleDocument, options);
        }
export type TemplateBackgroundImageScaleQueryHookResult = ReturnType<typeof useTemplateBackgroundImageScaleQuery>;
export type TemplateBackgroundImageScaleLazyQueryHookResult = ReturnType<typeof useTemplateBackgroundImageScaleLazyQuery>;
export type TemplateBackgroundImageScaleQueryResult = Apollo.QueryResult<TemplateBackgroundImageScaleQuery, TemplateBackgroundImageScaleQueryVariables>;