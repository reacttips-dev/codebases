import { LazyModule, LazyImport, Getter } from 'owa-bundling-light';
import type { ResolverFn } from 'owa-graph-schema';
import { PerformanceDatapoint } from 'owa-analytics';
import { GraphQLError } from 'graphql';
import { DatapointStatus } from 'owa-analytics/lib/types/DatapointEnums';

export function createLazyResolver<TModule, TResolver extends ResolverFn<any, any, any, any>>(
    resolverName: string,
    importCallback: () => Promise<TModule>,
    getter: Getter<TResolver, TModule>
): TResolver {
    const lazyModule = new LazyModule(importCallback);
    const lazyImport = new LazyImport(lazyModule, getter);

    const lazyResolver = (parent: any, args: any, context: any, info: any) => {
        return lazyImport.import().then(async resolver => {
            let dataPoint = new PerformanceDatapoint('resolver_perf', { ring: 'Dogfood' });
            dataPoint.addCustomProperty('resolverName', resolverName);

            let result;
            try {
                result = await resolver(parent, args, context, info);
            } catch (error) {
                // Turn exceptions thrown into GraphQL errors with extension property on them
                let graphQLError = new GraphQLError(
                    error.message,
                    null, // nodes
                    null, // source
                    null, // positions
                    error.path, // path
                    error, // originalError
                    {
                        ...error,
                    } // extensions
                );
                graphQLError.stack = error.stack;
                result = graphQLError;
            }

            if (result instanceof GraphQLError) {
                dataPoint.endWithError(DatapointStatus.RequestNotComplete, result);
            } else {
                dataPoint.end();
            }
            return result;
        });
    };

    return lazyResolver as TResolver;
}
