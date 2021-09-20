import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"BoardExport"}}
export type BoardExportQueryVariables = Types.Exact<{
  idBoard: Types.Scalars['ID'];
  idExport: Types.Scalars['ID'];
}>;


export type BoardExportQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'idOrganization'>
    & { export?: Types.Maybe<(
      { __typename: 'Export' }
      & Pick<Types.Export, 'id' | 'size'>
      & { status: (
        { __typename: 'ExportStatus' }
        & Pick<Types.ExportStatus, 'attempts' | 'finished' | 'stage'>
      ) }
    )> }
  )> }
);


export const BoardExportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BoardExport"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idExport"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"idOrganization"}},{"kind":"Field","name":{"kind":"Name","value":"export"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idExport"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attempts"}},{"kind":"Field","name":{"kind":"Name","value":"finished"}},{"kind":"Field","name":{"kind":"Name","value":"stage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"size"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useBoardExportQuery__
 *
 * To run a query within a React component, call `useBoardExportQuery` and pass it any options that fit your needs.
 * When your component renders, `useBoardExportQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBoardExportQuery({
 *   variables: {
 *      idBoard: // value for 'idBoard'
 *      idExport: // value for 'idExport'
 *   },
 * });
 */
export function useBoardExportQuery(baseOptions: Apollo.QueryHookOptions<BoardExportQuery, BoardExportQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BoardExportQuery, BoardExportQueryVariables>(BoardExportDocument, options);
      }
export function useBoardExportLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BoardExportQuery, BoardExportQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BoardExportQuery, BoardExportQueryVariables>(BoardExportDocument, options);
        }
export type BoardExportQueryHookResult = ReturnType<typeof useBoardExportQuery>;
export type BoardExportLazyQueryHookResult = ReturnType<typeof useBoardExportLazyQuery>;
export type BoardExportQueryResult = Apollo.QueryResult<BoardExportQuery, BoardExportQueryVariables>;