import { useEffect } from 'react';
import type { QueryHookOptions, TypedDocumentNode } from '@apollo/client';
import type { DocumentNode } from 'graphql';
import { QueryTracker } from 'owa-query-tracker';

export function useQueryTracker<TData, TVariables>(
    query: DocumentNode | TypedDocumentNode<TData, TVariables>,
    options?: QueryHookOptions<TData, TVariables>
) {
    const op = {
        query,
        variables: options?.variables,
        context: options?.context,
    };

    useEffect(() => {
        QueryTracker.addRef(op);
        return () => QueryTracker.releaseRef(op);
    });
}
