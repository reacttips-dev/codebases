import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"DismissAnnouncement"}}
export type DismissAnnouncementMutationVariables = Types.Exact<{
  announcementId: Types.Scalars['ID'];
}>;


export type DismissAnnouncementMutation = (
  { __typename: 'Mutation' }
  & { dismissAnnouncement?: Types.Maybe<(
    { __typename: 'Announcement_DismissResponse' }
    & Pick<Types.Announcement_DismissResponse, 'success'>
  )> }
);


export const DismissAnnouncementDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DismissAnnouncement"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"announcementId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dismissAnnouncement"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"announcementId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"announcementId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode;
export type DismissAnnouncementMutationFn = Apollo.MutationFunction<DismissAnnouncementMutation, DismissAnnouncementMutationVariables>;

/**
 * __useDismissAnnouncementMutation__
 *
 * To run a mutation, you first call `useDismissAnnouncementMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDismissAnnouncementMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [dismissAnnouncementMutation, { data, loading, error }] = useDismissAnnouncementMutation({
 *   variables: {
 *      announcementId: // value for 'announcementId'
 *   },
 * });
 */
export function useDismissAnnouncementMutation(baseOptions?: Apollo.MutationHookOptions<DismissAnnouncementMutation, DismissAnnouncementMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DismissAnnouncementMutation, DismissAnnouncementMutationVariables>(DismissAnnouncementDocument, options);
      }
export type DismissAnnouncementMutationHookResult = ReturnType<typeof useDismissAnnouncementMutation>;
export type DismissAnnouncementMutationResult = Apollo.MutationResult<DismissAnnouncementMutation>;
export type DismissAnnouncementMutationOptions = Apollo.BaseMutationOptions<DismissAnnouncementMutation, DismissAnnouncementMutationVariables>;