import { LazyModule, LazyImport, Getter } from 'owa-bundling-light';
import type {
    SubscriptionResolverObject,
    SubscriptionResolveFn,
    GraphQLResolveInfo,
} from 'owa-graph-schema';
import type { GraphQLError } from 'graphql';
import type { HxFallbackResult } from 'owa-graph-hx-fallback-result';

type CustomSubscriptionResult<TResult> = AsyncIterator<TResult> | GraphQLError | HxFallbackResult;

/** Graphql-codegen does allow us to customize the subscription resolver type to include errors
 * so we add them manually here
 */
type SubscriptionSubscribeFnWithHxFallbackResult<TResult, TParent, TContext, TArgs> = (
    parent: TParent,
    args: TArgs,
    context: TContext,
    info: GraphQLResolveInfo
) => CustomSubscriptionResult<TResult> | Promise<CustomSubscriptionResult<TResult>>;

interface SubscriptionResolverObjectWithHxFallbackResult<TResult, TParent, TContext, TArgs> {
    subscribe: SubscriptionSubscribeFnWithHxFallbackResult<any, TParent, TContext, TArgs>;
    resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export function createLazySubscriptionResolver<TModule, TResult, TParent, TContext, TArgs>(
    importCallback: () => Promise<TModule>,
    getter: Getter<
        SubscriptionResolverObjectWithHxFallbackResult<TResult, TParent, TContext, TArgs>,
        TModule
    >
): SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
    const lazyModule = new LazyModule(importCallback);
    const lazyImport = new LazyImport(lazyModule, getter);

    const lazyResolver = {
        subscribe: (parent: any, args: any, context: any, info: any) => {
            return lazyImport
                .import()
                .then(resolver => resolver.subscribe(parent, args, context, info));
        },
        resolve: (payload: any, args: any, context: any, info: any) => {
            return lazyImport
                .import()
                .then(resolver => resolver.resolve(payload, args, context, info));
        },
    };

    return lazyResolver as SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;
}
