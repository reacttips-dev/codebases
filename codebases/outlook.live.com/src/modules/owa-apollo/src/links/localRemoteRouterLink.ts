import { isHxFallbackResult } from 'owa-graph-hx-fallback-result';
import { SelectionNode, GraphQLError, getOperationAST } from 'graphql';
import {
    ApolloLink,
    Observable,
    Operation,
    execute,
    FetchResult,
    GraphQLRequest,
} from '@apollo/client';
import type { Resolvers } from 'owa-graph-schema';
import { merge as objMerge } from 'lodash-es';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';
import { enabledForHx, enabledForWeb, enabledForRemote } from 'owa-application-settings';
import { trace } from 'owa-trace';

/**
 * The local remote router link takes a graphql operation document and examines the data resolvers that are defined on the client.
 * (data resolvers resolve the operation against OWS/HX/etc)
 *
 * If there is a resolver for the operation, the operation is forwarded to that local execution link.  If not, the operation is
 * dispatched to the remote graphql gateway endpoint.
 *
 * If a single operation document has multiple selections, some local and some remote, document is split into a local-only document
 * and a remote-only document, evaluated, and then the results combined into a single result set.
 */
export const localRemoteRouterLink = ({
    localLink,
    remoteLink,
    resolvers,
}: {
    localLink: ApolloLink;
    remoteLink: ApolloLink;
    resolvers: Resolvers;
}) => {
    const link = new ApolloLink(operation => {
        const opNode = getOperationAST(operation.query);
        const remoteSelections: SelectionNode[] = [];
        const localSelections: SelectionNode[] = [];

        if (!opNode) {
            // don't have a valid single operation.  just forward it to the local (default) link and let it deal with it
            return execute(localLink, operation);
        }

        const opTypeName = capitalizeOp(opNode.operation);
        const selections = opNode.selectionSet.selections;
        const localResolverRoot = resolvers[opTypeName] || {};

        // see if any of the toplevel selections are missing a local execution resolver OR configured to be remote only
        // (__typename is a meta field that is always resolvable locally)
        const sendRemote = (resolverName: string): boolean => {
            if (!localResolverRoot[resolverName]) {
                // don't have a local resolver, send remote if configured
                return enabledForRemote(opTypeName, resolverName);
            } else if (isHostAppFeatureEnabled('nativeResolvers')) {
                // MONARCH: see if we're not enabled locally and also enabled remote
                return (
                    !enabledForHx(opTypeName, resolverName) &&
                    !enabledForWeb(opTypeName, resolverName) &&
                    enabledForRemote(opTypeName, resolverName)
                );
            } else {
                // WEB: see if we're not enabled for web and also enabled for remote
                return (
                    !enabledForWeb(opTypeName, resolverName) &&
                    enabledForRemote(opTypeName, resolverName)
                );
            }
        };

        const sendLocal = (resolverName: string): boolean => {
            if (isHostAppFeatureEnabled('nativeResolvers')) {
                // MONARCH: local resolvers
                return (
                    enabledForHx(opTypeName, resolverName) ||
                    enabledForWeb(opTypeName, resolverName)
                );
            } else {
                // WEB: local resolvers
                return enabledForWeb(opTypeName, resolverName);
            }
        };

        selections.forEach(s => {
            if (s.kind === 'Field') {
                var opName = s.name.value;
                if (s.name.value != '__typename' && sendRemote(opName)) {
                    remoteSelections.push(s);
                } else if (sendLocal(opName)) {
                    localSelections.push(s);
                } else {
                    trace.warn(`[localRemoteRouterLinke] ${opTypeName}.${opName} is not enabled`);
                }
            }
        });

        // execute the remote ops
        const remoteObserver =
            remoteSelections.length > 0
                ? execute(remoteLink, buildOperation(operation, remoteSelections))
                : Observable.of<FetchResult>();

        // ...and the local ops (in parallel)
        const localObserver =
            localSelections.length > 0
                ? execute(localLink, buildOperation(operation, localSelections))
                : Observable.of<FetchResult>();

        // ...and combine the results into a single result set
        // ...mapping hx fallbacks to remote operations
        const combinedObserver = localObserver
            .concat(remoteObserver)
            .flatMap(result => mapHxFallbackToRemote(result, operation, remoteLink));

        const activeSelections = remoteSelections.length + localSelections.length;
        if (opTypeName === 'Subscription') {
            // ...if it's a gql subscription, the consumer will pull results as they come in.  If not,
            return combinedObserver;
        } else if (activeSelections > 0) {
            // merge the local the remote results, preferring any remote result that replaced a local fallback
            return combinedObserver.reduce(objMerge);
        } else {
            // there were no active selections in the operation
            return Observable.of<FetchResult>({
                extensions: { message: 'there were no active resolvers in the operation' },
            });
        }
    });

    return link;
};

/**
 * If hx returns a graphql error with a fallback code, it means the selection needs to fallback to the web implementation
 * If the web implementation has a locally defined resolver, it will consume the fallback error code and execute the operation.
 * But, if the web implementation is a remote operation (i.e, there is no local web resolver for it), then the operation needs to
 * fallback to the remote operation, here
 * @param result the result of the local results, which may include hx fallbacks
 * @param operation the original operation
 * @param remoteLink the remote link
 */
function mapHxFallbackToRemote(result: FetchResult, operation: Operation, remoteLink: ApolloLink) {
    const opNode = getOperationAST(operation.query);
    const selections = opNode.selectionSet.selections;
    let nonfallbackErrors: Array<GraphQLError> = [];
    let fallbacks: Array<SelectionNode> = [];

    result.errors?.reduce(
        (accumulator, err) => {
            if (!isHxFallbackResult(err)) {
                accumulator.nonfallbackErrors.push(err);
            } else {
                const node = findSelectionNode(selections, err);
                if (node) {
                    accumulator.fallbacks.push(node);
                }
            }

            return accumulator;
        },
        { nonfallbackErrors, fallbacks }
    );

    const originalResult = { ...result, errors: nonfallbackErrors };
    if (nonfallbackErrors.length == 0) {
        delete originalResult.errors;
    }

    const originalObserver = Observable.of(originalResult);

    if (fallbacks.length > 0) {
        return originalObserver.concat(execute(remoteLink, buildOperation(operation, fallbacks)));
    } else {
        return originalObserver;
    }
}

function findSelectionNode(selections: readonly SelectionNode[], err: GraphQLError) {
    // find selection nodes that resulted in hx fallback errors
    let rv = null;
    const path = err.path?.[0];
    if (path) {
        selections.some(s => {
            if (s.kind === 'Field') {
                if (s.alias) {
                    if (s.alias.value === path) {
                        rv = s;
                        return true;
                    }
                } else if (s.name?.value === path) {
                    rv = s;
                    return true;
                }
            }

            return false;
        });
    }

    return rv;
}

function buildOperation(operation: Operation, selections: SelectionNode[]): GraphQLRequest {
    // we need to make a copy of the gql request specific to the subset of selections for the
    // local or remote endpoint.  the variables/context are assumed to be safe to share between
    // the two operations.
    const copy = {
        ...operation,
        query: { ...operation.query },
        context: operation.getContext(),
    };

    copy.query.definitions = operation.query.definitions.map(d => {
        if (d.kind !== 'OperationDefinition') {
            return d;
        } else {
            return {
                ...d,
                selectionSet: { ...d.selectionSet, selections },
            };
        }
    });

    return copy;
}

const capitalizeOp = (str: string) => {
    switch (str) {
        case 'query':
            return 'Query';
        case 'mutation':
            return 'Mutation';
        case 'subscription':
            return 'Subscription';
        default:
            return str;
    }
};
