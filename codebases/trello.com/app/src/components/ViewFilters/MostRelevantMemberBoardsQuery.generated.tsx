import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"MostRelevantMemberBoards"}}
export type MostRelevantMemberBoardsQueryVariables = Types.Exact<{
  idOrg: Types.Scalars['ID'];
  boardIds: Array<Types.Scalars['ID']> | Types.Scalars['ID'];
}>;


export type MostRelevantMemberBoardsQuery = (
  { __typename: 'Query' }
  & { organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & { boards: Array<(
      { __typename: 'Board' }
      & Pick<Types.Board, 'id' | 'name' | 'idOrganization' | 'shortLink' | 'closed' | 'dateLastActivity'>
      & { prefs?: Types.Maybe<(
        { __typename: 'Board_Prefs' }
        & Pick<Types.Board_Prefs, 'background' | 'backgroundColor' | 'backgroundImage' | 'backgroundTile'>
        & { backgroundImageScaled?: Types.Maybe<Array<(
          { __typename: 'Board_Prefs_BackgroundImageScaled' }
          & Pick<Types.Board_Prefs_BackgroundImageScaled, 'url' | 'width' | 'height'>
        )>> }
      )>, memberships: Array<(
        { __typename: 'Board_Membership' }
        & Pick<Types.Board_Membership, 'idMember' | 'deactivated'>
      )>, members: Array<(
        { __typename: 'Member' }
        & Pick<Types.Member, 'id' | 'fullName' | 'username'>
      )>, labels: Array<(
        { __typename: 'Label' }
        & Pick<Types.Label, 'id' | 'name' | 'color'>
      )>, lists: Array<(
        { __typename: 'List' }
        & Pick<Types.List, 'id' | 'name'>
      )> }
    )> }
  )> }
);


export const MostRelevantMemberBoardsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MostRelevantMemberBoards"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idOrg"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idOrg"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardIds"}}},{"kind":"Argument","name":{"kind":"Name","value":"boardLabelsLimit"},"value":{"kind":"IntValue","value":"100"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"idOrganization"}},{"kind":"Field","name":{"kind":"Name","value":"shortLink"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"dateLastActivity"}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"background"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColor"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundImageScaled"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}},{"kind":"Field","name":{"kind":"Name","value":"backgroundImage"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundTile"}}]}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"idMember"}},{"kind":"Field","name":{"kind":"Name","value":"deactivated"}}]}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lists"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"open"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useMostRelevantMemberBoardsQuery__
 *
 * To run a query within a React component, call `useMostRelevantMemberBoardsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMostRelevantMemberBoardsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMostRelevantMemberBoardsQuery({
 *   variables: {
 *      idOrg: // value for 'idOrg'
 *      boardIds: // value for 'boardIds'
 *   },
 * });
 */
export function useMostRelevantMemberBoardsQuery(baseOptions: Apollo.QueryHookOptions<MostRelevantMemberBoardsQuery, MostRelevantMemberBoardsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MostRelevantMemberBoardsQuery, MostRelevantMemberBoardsQueryVariables>(MostRelevantMemberBoardsDocument, options);
      }
export function useMostRelevantMemberBoardsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MostRelevantMemberBoardsQuery, MostRelevantMemberBoardsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MostRelevantMemberBoardsQuery, MostRelevantMemberBoardsQueryVariables>(MostRelevantMemberBoardsDocument, options);
        }
export type MostRelevantMemberBoardsQueryHookResult = ReturnType<typeof useMostRelevantMemberBoardsQuery>;
export type MostRelevantMemberBoardsLazyQueryHookResult = ReturnType<typeof useMostRelevantMemberBoardsLazyQuery>;
export type MostRelevantMemberBoardsQueryResult = Apollo.QueryResult<MostRelevantMemberBoardsQuery, MostRelevantMemberBoardsQueryVariables>;