import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"TemplatePickerContainerMyTemplates"}}
export type TemplatePickerContainerMyTemplatesQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type TemplatePickerContainerMyTemplatesQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & { boards: Array<(
      { __typename: 'Board' }
      & Pick<Types.Board, 'closed' | 'id' | 'name'>
      & { prefs?: Types.Maybe<(
        { __typename: 'Board_Prefs' }
        & Pick<Types.Board_Prefs, 'backgroundColor' | 'backgroundImage'>
        & { backgroundImageScaled?: Types.Maybe<Array<(
          { __typename: 'Board_Prefs_BackgroundImageScaled' }
          & Pick<Types.Board_Prefs_BackgroundImageScaled, 'width' | 'height' | 'url'>
        )>> }
      )>, templateGallery?: Types.Maybe<(
        { __typename: 'TemplateGallery' }
        & Pick<Types.TemplateGallery, 'precedence' | 'blurb' | 'featured'>
      )> }
    )> }
  )> }
);


export const TemplatePickerContainerMyTemplatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TemplatePickerContainerMyTemplates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"me","block":false}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"template"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"backgroundColor"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundImage"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundImageScaled"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"templateGallery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"precedence"}},{"kind":"Field","name":{"kind":"Name","value":"blurb"}},{"kind":"Field","name":{"kind":"Name","value":"featured"}}]}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useTemplatePickerContainerMyTemplatesQuery__
 *
 * To run a query within a React component, call `useTemplatePickerContainerMyTemplatesQuery` and pass it any options that fit your needs.
 * When your component renders, `useTemplatePickerContainerMyTemplatesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTemplatePickerContainerMyTemplatesQuery({
 *   variables: {
 *   },
 * });
 */
export function useTemplatePickerContainerMyTemplatesQuery(baseOptions?: Apollo.QueryHookOptions<TemplatePickerContainerMyTemplatesQuery, TemplatePickerContainerMyTemplatesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TemplatePickerContainerMyTemplatesQuery, TemplatePickerContainerMyTemplatesQueryVariables>(TemplatePickerContainerMyTemplatesDocument, options);
      }
export function useTemplatePickerContainerMyTemplatesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TemplatePickerContainerMyTemplatesQuery, TemplatePickerContainerMyTemplatesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TemplatePickerContainerMyTemplatesQuery, TemplatePickerContainerMyTemplatesQueryVariables>(TemplatePickerContainerMyTemplatesDocument, options);
        }
export type TemplatePickerContainerMyTemplatesQueryHookResult = ReturnType<typeof useTemplatePickerContainerMyTemplatesQuery>;
export type TemplatePickerContainerMyTemplatesLazyQueryHookResult = ReturnType<typeof useTemplatePickerContainerMyTemplatesLazyQuery>;
export type TemplatePickerContainerMyTemplatesQueryResult = Apollo.QueryResult<TemplatePickerContainerMyTemplatesQuery, TemplatePickerContainerMyTemplatesQueryVariables>;