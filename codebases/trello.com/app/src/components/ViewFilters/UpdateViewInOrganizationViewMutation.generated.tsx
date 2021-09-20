import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"UpdateViewInOrganizationView"}}
export type UpdateViewInOrganizationViewMutationVariables = Types.Exact<{
  idOrganizationView: Types.Scalars['ID'];
  idView: Types.Scalars['ID'];
  view: Types.InputOrganizationView_View;
}>;


export type UpdateViewInOrganizationViewMutation = (
  { __typename: 'Mutation' }
  & { updateViewInOrganizationView?: Types.Maybe<(
    { __typename: 'OrganizationView' }
    & Pick<Types.OrganizationView, 'id' | 'name' | 'idOrganization'>
    & { views: Array<(
      { __typename: 'OrganizationView_View' }
      & Pick<Types.OrganizationView_View, 'id' | 'defaultViewType'>
      & { cardFilter: (
        { __typename: 'OrganizationView_View_CardFilter' }
        & { criteria: Array<(
          { __typename: 'OrganizationView_View_CardFilter_Criteria' }
          & Pick<Types.OrganizationView_View_CardFilter_Criteria, 'idBoards' | 'idLists' | 'idMembers' | 'dueComplete' | 'labels' | 'sort'>
          & { due?: Types.Maybe<(
            { __typename: 'CardFilter_Criteria_DateRange' }
            & { start?: Types.Maybe<(
              { __typename: 'CardFilter_AdvancedDate' }
              & Pick<Types.CardFilter_AdvancedDate, 'dateType' | 'value'>
            )>, end?: Types.Maybe<(
              { __typename: 'CardFilter_AdvancedDate' }
              & Pick<Types.CardFilter_AdvancedDate, 'dateType' | 'value'>
            )> }
          )> }
        )> }
      ) }
    )> }
  )> }
);


export const UpdateViewInOrganizationViewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateViewInOrganizationView"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idOrganizationView"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idView"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"view"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InputOrganizationView_View"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateViewInOrganizationView"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"idOrganizationView"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idOrganizationView"}}},{"kind":"Argument","name":{"kind":"Name","value":"idView"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idView"}}},{"kind":"Argument","name":{"kind":"Name","value":"view"},"value":{"kind":"Variable","name":{"kind":"Name","value":"view"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"idOrganization"}},{"kind":"Field","name":{"kind":"Name","value":"views"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cardFilter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"criteria"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"idBoards"}},{"kind":"Field","name":{"kind":"Name","value":"idLists"}},{"kind":"Field","name":{"kind":"Name","value":"idMembers"}},{"kind":"Field","name":{"kind":"Name","value":"due"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dateType"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"end"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dateType"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"dueComplete"}},{"kind":"Field","name":{"kind":"Name","value":"labels"}},{"kind":"Field","name":{"kind":"Name","value":"sort"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"defaultViewType"}}]}}]}}]}}]} as unknown as DocumentNode;
export type UpdateViewInOrganizationViewMutationFn = Apollo.MutationFunction<UpdateViewInOrganizationViewMutation, UpdateViewInOrganizationViewMutationVariables>;

/**
 * __useUpdateViewInOrganizationViewMutation__
 *
 * To run a mutation, you first call `useUpdateViewInOrganizationViewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateViewInOrganizationViewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateViewInOrganizationViewMutation, { data, loading, error }] = useUpdateViewInOrganizationViewMutation({
 *   variables: {
 *      idOrganizationView: // value for 'idOrganizationView'
 *      idView: // value for 'idView'
 *      view: // value for 'view'
 *   },
 * });
 */
export function useUpdateViewInOrganizationViewMutation(baseOptions?: Apollo.MutationHookOptions<UpdateViewInOrganizationViewMutation, UpdateViewInOrganizationViewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateViewInOrganizationViewMutation, UpdateViewInOrganizationViewMutationVariables>(UpdateViewInOrganizationViewDocument, options);
      }
export type UpdateViewInOrganizationViewMutationHookResult = ReturnType<typeof useUpdateViewInOrganizationViewMutation>;
export type UpdateViewInOrganizationViewMutationResult = Apollo.MutationResult<UpdateViewInOrganizationViewMutation>;
export type UpdateViewInOrganizationViewMutationOptions = Apollo.BaseMutationOptions<UpdateViewInOrganizationViewMutation, UpdateViewInOrganizationViewMutationVariables>;