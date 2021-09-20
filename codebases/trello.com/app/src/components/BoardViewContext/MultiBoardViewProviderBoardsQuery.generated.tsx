import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"MultiBoardViewProviderBoards"}}
export type MultiBoardViewProviderBoardsQueryVariables = Types.Exact<{
  orgId: Types.Scalars['ID'];
  shortLinksOrIds: Array<Types.Scalars['ID']> | Types.Scalars['ID'];
}>;


export type MultiBoardViewProviderBoardsQuery = (
  { __typename: 'Query' }
  & { organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & { boards: Array<(
      { __typename: 'Board' }
      & Pick<Types.Board, 'id' | 'name' | 'idOrganization' | 'idEnterprise' | 'shortLink' | 'closed' | 'url'>
      & { myPrefs: (
        { __typename: 'MyPrefs' }
        & Pick<Types.MyPrefs, 'calendarKey'>
      ), prefs?: Types.Maybe<(
        { __typename: 'Board_Prefs' }
        & Pick<Types.Board_Prefs, 'background' | 'backgroundColor' | 'backgroundImage' | 'backgroundTile' | 'calendarFeedEnabled' | 'selfJoin' | 'isTemplate'>
        & { backgroundImageScaled?: Types.Maybe<Array<(
          { __typename: 'Board_Prefs_BackgroundImageScaled' }
          & Pick<Types.Board_Prefs_BackgroundImageScaled, 'url' | 'width' | 'height'>
        )>> }
      )>, boardPlugins: Array<(
        { __typename: 'BoardPlugin' }
        & Pick<Types.BoardPlugin, 'idPlugin'>
      )>, customFields: Array<(
        { __typename: 'CustomField' }
        & Pick<Types.CustomField, 'id' | 'type' | 'name'>
        & { options?: Types.Maybe<Array<(
          { __typename: 'CustomField_Option' }
          & Pick<Types.CustomField_Option, 'id'>
          & { value: (
            { __typename: 'CustomField_Option_Value' }
            & Pick<Types.CustomField_Option_Value, 'text'>
          ) }
        )>> }
      )>, lists: Array<(
        { __typename: 'List' }
        & Pick<Types.List, 'id' | 'name' | 'closed' | 'pos'>
      )>, members: Array<(
        { __typename: 'Member' }
        & Pick<Types.Member, 'id' | 'username' | 'activityBlocked' | 'avatarSource' | 'avatarUrl' | 'initials' | 'fullName' | 'products'>
        & { nonPublic?: Types.Maybe<(
          { __typename: 'Member_NonPublic' }
          & Pick<Types.Member_NonPublic, 'initials' | 'fullName' | 'avatarUrl'>
        )> }
      )>, memberships: Array<(
        { __typename: 'Board_Membership' }
        & Pick<Types.Board_Membership, 'idMember' | 'memberType' | 'deactivated' | 'unconfirmed'>
      )>, labels: Array<(
        { __typename: 'Label' }
        & Pick<Types.Label, 'id' | 'name' | 'color'>
      )> }
    )> }
  )> }
);


export const MultiBoardViewProviderBoardsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MultiBoardViewProviderBoards"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"shortLinksOrIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"shortLinksOrIds"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"idOrganization"}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}},{"kind":"Field","name":{"kind":"Name","value":"shortLink"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"myPrefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calendarKey"}}]}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"background"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColor"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundImageScaled"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}},{"kind":"Field","name":{"kind":"Name","value":"backgroundImage"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundTile"}},{"kind":"Field","name":{"kind":"Name","value":"calendarFeedEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"selfJoin"}},{"kind":"Field","name":{"kind":"Name","value":"isTemplate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"boardPlugins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"idPlugin"}}]}},{"kind":"Field","name":{"kind":"Name","value":"customFields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"lists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"pos"}}]}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"activityBlocked"}},{"kind":"Field","name":{"kind":"Name","value":"avatarSource"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"initials"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"products"}},{"kind":"Field","name":{"kind":"Name","value":"nonPublic"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"initials"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"idMember"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}},{"kind":"Field","name":{"kind":"Name","value":"deactivated"}},{"kind":"Field","name":{"kind":"Name","value":"unconfirmed"}}]}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useMultiBoardViewProviderBoardsQuery__
 *
 * To run a query within a React component, call `useMultiBoardViewProviderBoardsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMultiBoardViewProviderBoardsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMultiBoardViewProviderBoardsQuery({
 *   variables: {
 *      orgId: // value for 'orgId'
 *      shortLinksOrIds: // value for 'shortLinksOrIds'
 *   },
 * });
 */
export function useMultiBoardViewProviderBoardsQuery(baseOptions: Apollo.QueryHookOptions<MultiBoardViewProviderBoardsQuery, MultiBoardViewProviderBoardsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MultiBoardViewProviderBoardsQuery, MultiBoardViewProviderBoardsQueryVariables>(MultiBoardViewProviderBoardsDocument, options);
      }
export function useMultiBoardViewProviderBoardsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MultiBoardViewProviderBoardsQuery, MultiBoardViewProviderBoardsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MultiBoardViewProviderBoardsQuery, MultiBoardViewProviderBoardsQueryVariables>(MultiBoardViewProviderBoardsDocument, options);
        }
export type MultiBoardViewProviderBoardsQueryHookResult = ReturnType<typeof useMultiBoardViewProviderBoardsQuery>;
export type MultiBoardViewProviderBoardsLazyQueryHookResult = ReturnType<typeof useMultiBoardViewProviderBoardsLazyQuery>;
export type MultiBoardViewProviderBoardsQueryResult = Apollo.QueryResult<MultiBoardViewProviderBoardsQuery, MultiBoardViewProviderBoardsQueryVariables>;