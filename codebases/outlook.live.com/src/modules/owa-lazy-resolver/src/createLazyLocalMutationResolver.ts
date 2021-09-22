import type { Getter } from 'owa-bundling-light';
import type {
    ResolverFn,
    LocalStateMutationFn,
    LocalStateResolverCallbacks,
    LocalStateEventContext,
} from 'owa-graph-schema';
import { createLazyResolver } from './createLazyResolver';

type ResolverFromMutationFn<T> = T extends LocalStateMutationFn<infer U, infer V, infer X, infer Y>
    ? ResolverFn<U, V, X, Y>
    : never;

type InternalLocalStateEventContext = LocalStateEventContext & {
    allLocalStateCallbacks: LocalStateResolverCallbacks[];
};

// Create a local state resolver for a mutation
export function createLazyLocalMutationResolver<
    TModule,
    TResolver extends LocalStateMutationFn<any, any, any, any>
>(
    resolverName: string,
    importCallback: () => Promise<TModule>,
    getter: Getter<TResolver, TModule>
): ResolverFromMutationFn<TResolver> {
    const localResolver = createLazyResolver(resolverName, importCallback, getter);

    const mutation = async (parent, args, context, info) => {
        // Call the given resolver to get the event handlers for this local state mutation
        const localStateCallbacks: LocalStateResolverCallbacks = await localResolver(
            parent,
            args,
            context,
            info
        );

        // One query may hit multiple resolvers, so we need to call the callbacks for each of them.
        // That's what the following code does.

        // Accumulate all the local state callbacks on the context
        const eventContext = context as InternalLocalStateEventContext;
        eventContext.allLocalStateCallbacks = eventContext.allLocalStateCallbacks || [];
        eventContext.allLocalStateCallbacks.push(localStateCallbacks);

        // Add a set of wrapper callbacks that invoke all the registered callbacks
        if (!eventContext.localStateCallbacks) {
            eventContext.localStateCallbacks = {
                starting: () => eventContext.allLocalStateCallbacks.forEach(e => e.starting?.()),
                complete: result =>
                    eventContext.allLocalStateCallbacks.forEach(e => e.complete?.(result)),
                error: () => eventContext.allLocalStateCallbacks.forEach(e => e.error?.()),
            };
        }

        return Promise.resolve({} as any);
    };

    return mutation as ResolverFromMutationFn<TResolver>;
}
