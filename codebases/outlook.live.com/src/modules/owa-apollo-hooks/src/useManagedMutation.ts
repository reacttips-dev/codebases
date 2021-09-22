import {
    OperationVariables,
    MutationTuple,
    useMutation,
    MutationHookOptions,
    TypedDocumentNode,
} from '@apollo/client';
import type { DocumentNode } from 'graphql';
import { useQueryTracker } from './useQueryTracker';
import { createManagedMutationOptions } from './util/createManagedOptions';

export function useManagedMutation<TData = any, TVariables = OperationVariables>(
    query: DocumentNode | TypedDocumentNode<TData, TVariables>,
    options?: MutationHookOptions<TData, TVariables>
): MutationTuple<TData, TVariables> {
    const managedOptions = createManagedMutationOptions(options);

    useQueryTracker(query, managedOptions);
    return useMutation(query, managedOptions);
}
