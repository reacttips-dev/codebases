import type { DocumentNode } from 'graphql';
import type { SessionId } from '@outlook/hxcore_web';
import { getHxInstance } from 'hx-session';
import { debugErrorThatWillShowErrorPopupOnly } from 'owa-trace';
import { createMap, KeyVariables } from './keyVariablesMap';
import { getApolloClient } from 'owa-apollo';
import isEqual from 'lodash-es/isEqual';
import type { Cache } from '@apollo/client';
import { getOperationName } from './getOperationName';

/**
 * Represents a query operation that can be tracked
 */
export type QueryOperation = {
    query: DocumentNode;
    variables: any;
    context: any;
};

// When tracked queries reach a 0 reference count, the hx session id associated with them is released
// Components addref when mounted and releaseref when unmounted
interface TrackedQuery extends KeyVariables<DocumentNode> {
    key: DocumentNode;
    variables: any;
    context: any;
    diag: (DocumentNode) => string;
    sessionId?: SessionId;
    count: number;
    disposed?: boolean;
}

// When tracked selections reach a 0 reference count, their result is evicted from the apollo cache
//
// A query document like this:
//
// query GetFilm {
// 	Film(id: "cj0nxmy3fga5s01148gf8iy3c") {
//     ...
//   }
//
// will result in a cache entry like this
//
// ▾ROOT_QUERY
//      Film({"id":"cj0nxmy3fga5s01148gf8iy3c"}): {"__ref":"Film:cj0nxmy3fga5s01148gf8iy3c"}
//
// Note:  selections needs to tracked independently of query documents because unrelated query documents can
// have the same selection -- we don't want to kick a cached result out from under an active component!
interface TrackedSelection {
    key: string;
    variables: any;
    diag: (string) => string;
    count: number;
    disposed?: boolean;
}

const trackedQueries = createMap<TrackedQuery, DocumentNode>();
const trackedSelections = createMap<TrackedSelection, string>();
const sessionIdToQuery: Map<SessionId, QueryOperation> = new Map();

// When a ref count drops to zero, do not immediately clean up the object so as not to 'thrash' the apollo cache
// and/or the session managment in cases where a component is mounted/unmounted/mounted
const CLEANUP_DELAY_MS = 1000 * 30;

function addRef(op: QueryOperation) {
    const query: TrackedQuery = trackedQueries.upsert({
        key: op.query,
        variables: op.variables,
        context: op.context,
        diag: getOperationName,
        count: 0,
    });
    const selections: Array<TrackedSelection> = extractSelections(query).map(
        trackedSelections.upsert
    );

    increment(query);
    selections.forEach(increment);
}

function releaseRef(op: QueryOperation) {
    const query: TrackedQuery = trackedQueries.get({
        key: op.query,
        variables: op.variables,
    });

    const selections: Array<TrackedSelection> = extractSelections(query).map(trackedSelections.get);

    decrement(query);
    selections.forEach(decrement);

    if (query.count === 0) {
        // don't immediately cleanup because we don't want to thrash in cases where react mounts/unmount/mounts
        self.setTimeout(() => maybeCleanup(query, selections), CLEANUP_DELAY_MS);
    }
}

function maybeCleanup(trackedQuery: TrackedQuery, querySelections: Array<TrackedSelection>) {
    if (!trackedQuery.disposed && trackedQuery.count === 0) {
        if (trackedQuery.sessionId) {
            const hxInstance = getHxInstance();
            hxInstance.activeSet.releaseSession(trackedQuery.sessionId);
            sessionIdToQuery.delete(trackedQuery.sessionId);
        }

        trackedQuery.disposed = true;
        trackedQueries.remove(trackedQuery);

        let evicted = false;
        querySelections.forEach(selection => {
            if (!selection.disposed && selection.count === 0) {
                const options: Cache.EvictOptions = {
                    id: 'ROOT_QUERY',
                    fieldName: selection.key,
                    broadcast: false,
                };

                if (selection.variables && !isEqual({}, selection.variables)) {
                    options.args = selection.variables;
                }

                getApolloClient().cache.evict(options);
                trackedSelections.remove(selection);

                evicted = true;
                selection.disposed = true;
            }
        });

        if (evicted) {
            getApolloClient().cache.gc();
        }
    }
}

function increment(obj: { count?: number }) {
    obj.count = obj.count ? obj.count + 1 : 1;
}

function decrement(obj: { count?: number }) {
    obj.count = obj.count ? obj.count - 1 : 0;
}

function extractSelections<TVariables>(query: TrackedQuery): Array<TrackedSelection> {
    const selections: Array<TrackedSelection> = new Array();

    for (const d of query.key.definitions) {
        if (d.kind === 'OperationDefinition') {
            if (!(d.operation == 'query' || d.operation == 'mutation')) {
                debugErrorThatWillShowErrorPopupOnly(
                    `cannot track operation of type ${d.operation}`
                );
                break;
            }

            d.selectionSet.selections.forEach(s => {
                if (s.kind === 'Field') {
                    const field = s.name.value;
                    const variables: Record<string, any> = {};
                    (s.arguments || []).forEach(a => {
                        if (a.value.kind === 'Variable') {
                            const varName = a.value.name.value;
                            variables[varName] = (<Record<string, any>>query.variables)?.[varName];
                        }
                    });

                    selections.push({ key: field, variables, diag: getFieldName, count: 0 });
                }
            });
        }
    }

    return selections;
}

const getFieldName = (f: string) => f;

function getSessionId(op: QueryOperation): SessionId {
    // It's possible for a resolver to call getSessionId before react's useEffect happens.
    // in such a case, we add this to the tracked queries with a 0 value for the counter
    // when it's eventually mounted/unmounted, it will be managed from that point forward.
    // TODO:  when there's concurrent rendering, it's possible useEffect will never be called
    //        in which case we can leave queries hanging around that are never in use.  we
    //        could consider an idle thread garbage collection type thing to clean up zero
    //        reference queries that haven't been in use for awhile?
    const trackedQuery: TrackedQuery = trackedQueries.upsert({
        key: op.query,
        variables: op.variables,
        context: op.context,
        diag: getOperationName,
        count: 0,
    });
    extractSelections(trackedQuery).forEach(trackedSelections.upsert);

    if (!trackedQuery.sessionId) {
        const hxInstance = getHxInstance();
        const sessionId = hxInstance.activeSet.createSession();

        trackedQuery.sessionId = sessionId;
        sessionIdToQuery.set(sessionId, {
            query: trackedQuery.key,
            variables: trackedQuery.variables,
            context: trackedQuery.context,
        });
    }

    return trackedQuery.sessionId;
}

function getQueryFromSessionId(id: SessionId): QueryOperation | undefined {
    return sessionIdToQuery.get(id);
}

function resetStateForTests() {
    trackedQueries.clear();
    trackedSelections.clear();
    sessionIdToQuery.clear();
}

export const QueryTracker = {
    addRef,
    releaseRef,
    getSessionId,
    getQueryFromSessionId,
    resetStateForTests,
};
