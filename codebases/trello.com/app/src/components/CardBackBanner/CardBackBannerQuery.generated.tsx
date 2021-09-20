import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"CardBackBanner"}}
export type CardBackBannerQueryVariables = Types.Exact<{
  idCard: Types.Scalars['ID'];
}>;


export type CardBackBannerQuery = (
  { __typename: 'Query' }
  & { card?: Types.Maybe<(
    { __typename: 'Card' }
    & Pick<Types.Card, 'id' | 'closed' | 'isTemplate' | 'idBoard'>
    & { list: (
      { __typename: 'List' }
      & Pick<Types.List, 'closed'>
    ), cover?: Types.Maybe<(
      { __typename: 'Card_Cover' }
      & Pick<Types.Card_Cover, 'idAttachment' | 'color' | 'idUploadedBackground'>
    )>, stickers: Array<(
      { __typename: 'Sticker' }
      & Pick<Types.Sticker, 'id'>
    )> }
  )> }
);


export const CardBackBannerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CardBackBanner"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idCard"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idCard"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"isTemplate"}},{"kind":"Field","name":{"kind":"Name","value":"idBoard"}},{"kind":"Field","name":{"kind":"Name","value":"list"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"closed"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cover"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"idAttachment"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"idUploadedBackground"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stickers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useCardBackBannerQuery__
 *
 * To run a query within a React component, call `useCardBackBannerQuery` and pass it any options that fit your needs.
 * When your component renders, `useCardBackBannerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCardBackBannerQuery({
 *   variables: {
 *      idCard: // value for 'idCard'
 *   },
 * });
 */
export function useCardBackBannerQuery(baseOptions: Apollo.QueryHookOptions<CardBackBannerQuery, CardBackBannerQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CardBackBannerQuery, CardBackBannerQueryVariables>(CardBackBannerDocument, options);
      }
export function useCardBackBannerLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CardBackBannerQuery, CardBackBannerQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CardBackBannerQuery, CardBackBannerQueryVariables>(CardBackBannerDocument, options);
        }
export type CardBackBannerQueryHookResult = ReturnType<typeof useCardBackBannerQuery>;
export type CardBackBannerLazyQueryHookResult = ReturnType<typeof useCardBackBannerLazyQuery>;
export type CardBackBannerQueryResult = Apollo.QueryResult<CardBackBannerQuery, CardBackBannerQueryVariables>;