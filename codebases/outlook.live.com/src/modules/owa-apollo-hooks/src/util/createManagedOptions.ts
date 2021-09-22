import type { QueryHookOptions, MutationHookOptions } from '@apollo/client';
import type { ManagedQueryOptions, ManagedMutationOptions } from 'owa-managed-query-link';

export const createManagedQueryOptions = <TData, TVariables>(
    options?: QueryHookOptions<TData, TVariables>
): ManagedQueryOptions<TData, TVariables> => {
    const tmpOptions = options || {};
    const tmpContext = tmpOptions.context || {};

    tmpOptions.fetchPolicy = tmpOptions.fetchPolicy || 'cache-first';
    return { ...tmpOptions, context: { ...tmpContext, isManagedQuery: true } };
};

export const createManagedMutationOptions = <TData, TVariables>(
    options?: MutationHookOptions<TData, TVariables>
): ManagedMutationOptions<TData, TVariables> => {
    const tmpOptions = options || {};
    const tmpContext = tmpOptions.context || {};

    return { ...tmpOptions, context: { ...tmpContext, isManagedQuery: true } };
};
