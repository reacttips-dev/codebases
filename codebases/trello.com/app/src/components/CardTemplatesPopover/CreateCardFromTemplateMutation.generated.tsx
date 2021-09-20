import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"CreateCardFromTemplate"}}
export type CreateCardFromTemplateMutationVariables = Types.Exact<{
  idCardSource: Types.Scalars['ID'];
  idList: Types.Scalars['ID'];
  name?: Types.Maybe<Types.Scalars['String']>;
  keepFromSource?: Types.Maybe<Array<Types.Scalars['String']> | Types.Scalars['String']>;
  traceId: Types.Scalars['String'];
}>;


export type CreateCardFromTemplateMutation = (
  { __typename: 'Mutation' }
  & { copyCard?: Types.Maybe<(
    { __typename: 'Card' }
    & Pick<Types.Card, 'id' | 'shortLink'>
  )> }
);


export const CreateCardFromTemplateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCardFromTemplate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idCardSource"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idList"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"keepFromSource"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"copyCard"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"idCardSource"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idCardSource"}}},{"kind":"Argument","name":{"kind":"Name","value":"idList"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idList"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"keepFromSource"},"value":{"kind":"Variable","name":{"kind":"Name","value":"keepFromSource"}}},{"kind":"Argument","name":{"kind":"Name","value":"traceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"shortLink"}}]}}]}}]} as unknown as DocumentNode;
export type CreateCardFromTemplateMutationFn = Apollo.MutationFunction<CreateCardFromTemplateMutation, CreateCardFromTemplateMutationVariables>;

/**
 * __useCreateCardFromTemplateMutation__
 *
 * To run a mutation, you first call `useCreateCardFromTemplateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCardFromTemplateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCardFromTemplateMutation, { data, loading, error }] = useCreateCardFromTemplateMutation({
 *   variables: {
 *      idCardSource: // value for 'idCardSource'
 *      idList: // value for 'idList'
 *      name: // value for 'name'
 *      keepFromSource: // value for 'keepFromSource'
 *      traceId: // value for 'traceId'
 *   },
 * });
 */
export function useCreateCardFromTemplateMutation(baseOptions?: Apollo.MutationHookOptions<CreateCardFromTemplateMutation, CreateCardFromTemplateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCardFromTemplateMutation, CreateCardFromTemplateMutationVariables>(CreateCardFromTemplateDocument, options);
      }
export type CreateCardFromTemplateMutationHookResult = ReturnType<typeof useCreateCardFromTemplateMutation>;
export type CreateCardFromTemplateMutationResult = Apollo.MutationResult<CreateCardFromTemplateMutation>;
export type CreateCardFromTemplateMutationOptions = Apollo.BaseMutationOptions<CreateCardFromTemplateMutation, CreateCardFromTemplateMutationVariables>;