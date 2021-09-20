import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"TemplatePickerStarred"}}
export type TemplatePickerStarredQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type TemplatePickerStarredQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & { boardStars: Array<(
      { __typename: 'BoardStar' }
      & Pick<Types.BoardStar, 'idBoard' | 'pos'>
    )>, boards: Array<(
      { __typename: 'Board' }
      & Pick<Types.Board, 'closed' | 'id' | 'name' | 'premiumFeatures'>
      & { prefs?: Types.Maybe<(
        { __typename: 'Board_Prefs' }
        & Pick<Types.Board_Prefs, 'backgroundColor' | 'backgroundImage' | 'isTemplate' | 'permissionLevel'>
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


export const TemplatePickerStarredDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TemplatePickerStarred"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"me","block":false}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boardStars"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"idBoard"}},{"kind":"Field","name":{"kind":"Name","value":"pos"}}]}},{"kind":"Field","name":{"kind":"Name","value":"boards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"starred"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"backgroundColor"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundImage"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundImageScaled"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isTemplate"}},{"kind":"Field","name":{"kind":"Name","value":"permissionLevel"}}]}},{"kind":"Field","name":{"kind":"Name","value":"premiumFeatures"}},{"kind":"Field","name":{"kind":"Name","value":"templateGallery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"precedence"}},{"kind":"Field","name":{"kind":"Name","value":"blurb"}},{"kind":"Field","name":{"kind":"Name","value":"featured"}}]}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useTemplatePickerStarredQuery__
 *
 * To run a query within a React component, call `useTemplatePickerStarredQuery` and pass it any options that fit your needs.
 * When your component renders, `useTemplatePickerStarredQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTemplatePickerStarredQuery({
 *   variables: {
 *   },
 * });
 */
export function useTemplatePickerStarredQuery(baseOptions?: Apollo.QueryHookOptions<TemplatePickerStarredQuery, TemplatePickerStarredQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TemplatePickerStarredQuery, TemplatePickerStarredQueryVariables>(TemplatePickerStarredDocument, options);
      }
export function useTemplatePickerStarredLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TemplatePickerStarredQuery, TemplatePickerStarredQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TemplatePickerStarredQuery, TemplatePickerStarredQueryVariables>(TemplatePickerStarredDocument, options);
        }
export type TemplatePickerStarredQueryHookResult = ReturnType<typeof useTemplatePickerStarredQuery>;
export type TemplatePickerStarredLazyQueryHookResult = ReturnType<typeof useTemplatePickerStarredLazyQuery>;
export type TemplatePickerStarredQueryResult = Apollo.QueryResult<TemplatePickerStarredQuery, TemplatePickerStarredQueryVariables>;