import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"TemplatePickerContainerGallery"}}
export type TemplatePickerContainerGalleryQueryVariables = Types.Exact<{
  boardIds: Array<Types.Scalars['ID']> | Types.Scalars['ID'];
}>;


export type TemplatePickerContainerGalleryQuery = (
  { __typename: 'Query' }
  & { boards: Array<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id' | 'name'>
    & { prefs?: Types.Maybe<(
      { __typename: 'Board_Prefs' }
      & Pick<Types.Board_Prefs, 'backgroundColor' | 'backgroundImage'>
      & { backgroundImageScaled?: Types.Maybe<Array<(
        { __typename: 'Board_Prefs_BackgroundImageScaled' }
        & Pick<Types.Board_Prefs_BackgroundImageScaled, 'width' | 'height' | 'url'>
      )>> }
    )> }
  )> }
);


export const TemplatePickerContainerGalleryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TemplatePickerContainerGallery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardIds"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"backgroundColor"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundImage"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundImageScaled"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useTemplatePickerContainerGalleryQuery__
 *
 * To run a query within a React component, call `useTemplatePickerContainerGalleryQuery` and pass it any options that fit your needs.
 * When your component renders, `useTemplatePickerContainerGalleryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTemplatePickerContainerGalleryQuery({
 *   variables: {
 *      boardIds: // value for 'boardIds'
 *   },
 * });
 */
export function useTemplatePickerContainerGalleryQuery(baseOptions: Apollo.QueryHookOptions<TemplatePickerContainerGalleryQuery, TemplatePickerContainerGalleryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TemplatePickerContainerGalleryQuery, TemplatePickerContainerGalleryQueryVariables>(TemplatePickerContainerGalleryDocument, options);
      }
export function useTemplatePickerContainerGalleryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TemplatePickerContainerGalleryQuery, TemplatePickerContainerGalleryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TemplatePickerContainerGalleryQuery, TemplatePickerContainerGalleryQueryVariables>(TemplatePickerContainerGalleryDocument, options);
        }
export type TemplatePickerContainerGalleryQueryHookResult = ReturnType<typeof useTemplatePickerContainerGalleryQuery>;
export type TemplatePickerContainerGalleryLazyQueryHookResult = ReturnType<typeof useTemplatePickerContainerGalleryLazyQuery>;
export type TemplatePickerContainerGalleryQueryResult = Apollo.QueryResult<TemplatePickerContainerGalleryQuery, TemplatePickerContainerGalleryQueryVariables>;