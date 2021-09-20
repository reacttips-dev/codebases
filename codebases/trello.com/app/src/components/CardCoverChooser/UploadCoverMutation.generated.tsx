import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"UploadCover"}}
export type UploadCoverMutationVariables = Types.Exact<{
  cardId: Types.Scalars['ID'];
  file: Types.Scalars['FileUpload'];
  traceId: Types.Scalars['String'];
}>;


export type UploadCoverMutation = (
  { __typename: 'Mutation' }
  & { uploadCardCover?: Types.Maybe<(
    { __typename: 'Attachment' }
    & Pick<Types.Attachment, 'id'>
    & { previews?: Types.Maybe<Array<(
      { __typename: 'Attachment_Preview' }
      & Pick<Types.Attachment_Preview, 'url'>
    )>> }
  )> }
);


export const UploadCoverDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UploadCover"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"file"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FileUpload"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uploadCardCover"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cardId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cardId"}}},{"kind":"Argument","name":{"kind":"Name","value":"file"},"value":{"kind":"Variable","name":{"kind":"Name","value":"file"}}},{"kind":"Argument","name":{"kind":"Name","value":"traceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"previews"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]} as unknown as DocumentNode;
export type UploadCoverMutationFn = Apollo.MutationFunction<UploadCoverMutation, UploadCoverMutationVariables>;

/**
 * __useUploadCoverMutation__
 *
 * To run a mutation, you first call `useUploadCoverMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadCoverMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadCoverMutation, { data, loading, error }] = useUploadCoverMutation({
 *   variables: {
 *      cardId: // value for 'cardId'
 *      file: // value for 'file'
 *      traceId: // value for 'traceId'
 *   },
 * });
 */
export function useUploadCoverMutation(baseOptions?: Apollo.MutationHookOptions<UploadCoverMutation, UploadCoverMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UploadCoverMutation, UploadCoverMutationVariables>(UploadCoverDocument, options);
      }
export type UploadCoverMutationHookResult = ReturnType<typeof useUploadCoverMutation>;
export type UploadCoverMutationResult = Apollo.MutationResult<UploadCoverMutation>;
export type UploadCoverMutationOptions = Apollo.BaseMutationOptions<UploadCoverMutation, UploadCoverMutationVariables>;