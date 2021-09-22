import {
    OperationVariables,
    QueryResult,
    useQuery,
    QueryHookOptions,
    TypedDocumentNode,
} from '@apollo/client';
import type { DocumentNode } from 'graphql';
import { useQueryTracker } from './useQueryTracker';
import { useLiveQuery } from './useLiveQuery';
import { createManagedQueryOptions } from './util/createManagedOptions';

export function useManagedQuery<TData = any, TVariables = OperationVariables>(
    query: DocumentNode | TypedDocumentNode<TData, TVariables>,
    options?: QueryHookOptions<TData, TVariables>
): QueryResult<TData, TVariables> {
    const managedOptions = createManagedQueryOptions(options);

    // useLiveQuery uses a snapshot of the context at this point so any context modifications
    // (e.g., isManagedQuery as set by createManagedOptions) needs to be completed by this point
    useQueryTracker(query, managedOptions);
    useLiveQuery(query, managedOptions);
    return useQuery(query, managedOptions);
}
