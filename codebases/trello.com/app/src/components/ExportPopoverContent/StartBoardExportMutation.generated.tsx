import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"StartBoardExport"}}
export type StartBoardExportMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type StartBoardExportMutation = (
  { __typename: 'Mutation' }
  & { startBoardExport?: Types.Maybe<(
    { __typename: 'Export' }
    & Pick<Types.Export, 'id' | 'size'>
    & { status: (
      { __typename: 'ExportStatus' }
      & Pick<Types.ExportStatus, 'attempts' | 'finished' | 'stage'>
    ) }
  )> }
);


export const StartBoardExportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"StartBoardExport"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startBoardExport"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attempts"}},{"kind":"Field","name":{"kind":"Name","value":"finished"}},{"kind":"Field","name":{"kind":"Name","value":"stage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"size"}}]}}]}}]} as unknown as DocumentNode;
export type StartBoardExportMutationFn = Apollo.MutationFunction<StartBoardExportMutation, StartBoardExportMutationVariables>;

/**
 * __useStartBoardExportMutation__
 *
 * To run a mutation, you first call `useStartBoardExportMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStartBoardExportMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [startBoardExportMutation, { data, loading, error }] = useStartBoardExportMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useStartBoardExportMutation(baseOptions?: Apollo.MutationHookOptions<StartBoardExportMutation, StartBoardExportMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<StartBoardExportMutation, StartBoardExportMutationVariables>(StartBoardExportDocument, options);
      }
export type StartBoardExportMutationHookResult = ReturnType<typeof useStartBoardExportMutation>;
export type StartBoardExportMutationResult = Apollo.MutationResult<StartBoardExportMutation>;
export type StartBoardExportMutationOptions = Apollo.BaseMutationOptions<StartBoardExportMutation, StartBoardExportMutationVariables>;