import type { OperationVariables, TypedDocumentNode } from '@apollo/client';
import type { ManagedQueryOptions } from 'owa-managed-query-link';
import { HxActiveSetEvent, HxActiveSetEventType } from '@outlook/hxcore_web';
import { DocumentNode, getOperationAST } from 'graphql';
import { QueryTracker, QueryOperation, createMap, getOperationName } from 'owa-query-tracker';
import { getHxInstance } from 'hx-session/lib/getHxInstance';
import { getApolloClient } from 'owa-apollo';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';
import { PerformanceDatapoint, DatapointStatus } from 'owa-analytics';

type DirtyOperation = QueryOperation & { key: DocumentNode; diag: (DocumentNode) => string };

/**
 * A set of operations that have had 'live' updates against their hx objects since the last debouce interval.
 * The map will keep only a single query operation in it for each { query, variable } tuple, so we avoid issuing multiple
 * re-queries within the same debounce interval for the same query
 */
const dirtyOperations = createMap<DirtyOperation, DocumentNode>();

/**
 * If we have a flurry of live updates, we don't want to issue multiple requests for the same query in a short period of time.
 */
const REQUERY_DEBOUNCE_MS = 500;

/**
 * Hx active set only needs to be subscribed to once
 */
let hxActiveSetSubscribed = false;

/**
 *  useLiveQuery hook.  stamps a function on the graphql operation context, "liveQuery",
 *  that can be used by (hx) resolvers to register for automatic requrying when hx
 *  objects they're intrested in are updated/modified
 *
 * @param query  the query document
 * @param options options associated with the query (context, variables, etc)
 */
export function useLiveQuery<TData = any, TVariables = OperationVariables>(
    query: DocumentNode | TypedDocumentNode<TData, TVariables>,
    options: ManagedQueryOptions<TData, TVariables>
) {
    if (isHostAppFeatureEnabled('nativeResolvers')) {
        if (!hxActiveSetSubscribed) {
            getHxInstance().activeSet.registerHandler(handler);
            hxActiveSetSubscribed = true;
        }
    }
}

/**
 * Test export
 */
export function resetStateForTests() {
    dirtyOperations.clear();
    hxActiveSetSubscribed = false;
}

/**
 * hx active set handler.  receives events from hx when objects change in the active set
 * and, if a resolver subscribed to that event via context.liveQuery, the query operation
 * associated with the resolver is re-executed
 */
const handler = {
    onActiveSetChanged: (hxEvents: ReadonlyArray<HxActiveSetEvent>) => {
        hxEvents.forEach(hxEvent => {
            if (
                hxEvent.type === HxActiveSetEventType.ObjectChanged ||
                hxEvent.type === HxActiveSetEventType.ObjectDeleted ||
                hxEvent.type === HxActiveSetEventType.CollectionChanged
            ) {
                hxEvent.sessionIds.forEach(session => {
                    const query = QueryTracker.getQueryFromSessionId(session);
                    if (query && getOperationAST(query.query)?.operation === 'query') {
                        dirtyOperations.upsert({
                            ...query,
                            key: query.query,
                            diag: getOperationName,
                        });
                    }
                });
            }
        });

        if (dirtyOperations.count() > 0) {
            self.setTimeout(requery, REQUERY_DEBOUNCE_MS);
        }
    },
};

/**
 * The method responsible for re-issuing the { query, variables } associated with a resolver
 * that subscribed for hx events
 */
function requery() {
    const apollo = getApolloClient();

    dirtyOperations.forEach(op => {
        const opName = (getOperationName(op.key) || 'unknown') + '_requery';
        const perfDp = new PerformanceDatapoint('ApolloLiveQuery');
        perfDp.addCustomData({ opName });

        apollo
            .query({
                query: op.key,
                variables: op.variables,
                context: op.context,
                fetchPolicy: 'network-only',
            })
            .then(_ => perfDp.end())
            .catch(e => perfDp.endWithError(DatapointStatus.ClientError, e));
    });

    dirtyOperations.clear();
}
