import { ApolloLink, Observable, Observer, FetchResult, Operation, NextLink } from '@apollo/client';
import type {
    Resolvers,
    LocalStateResolverCallbacks,
    LocalStateEventContext,
} from 'owa-graph-schema';
import { lazyExecute } from 'owa-apollo-execute';
import { getOperationType } from '../util/getOperationType';

export function localStateResolversLink(localResolvers: Resolvers, globalContext: any) {
    const link = new ApolloLink((operation, forward) => {
        // We don't support local state resolvers for subscriptions
        if (getOperationType(operation) === 'subscription') {
            return forward(operation);
        }

        return new Observable(observer => {
            const eventPromise = lazyExecute.importAndExecute(
                localResolvers,
                operation,
                globalContext
            );

            return forwardWithEvents(eventPromise, observer, operation, forward);
        });
    });

    return link;
}

function forwardWithEvents(
    eventPromise: Promise<any>,
    observer: Observer<FetchResult>,
    operation: Operation,
    forward: NextLink
) {
    let result: FetchResult;

    const sub = forward(operation).subscribe({
        next: value => {
            result = value;
            observer.next(value);
        },
        complete: () => {
            safeInvoke(eventPromise, operation, 'complete', result);
            observer.complete();
        },
        error: e => {
            safeInvoke(eventPromise, operation, 'error');
            observer.error(e);
        },
    });

    // It might seem odd to invoke starting AFTER initiating the forward, but this
    // is to not block the 'real' operation behind optimistic updates
    safeInvoke(eventPromise, operation, 'starting');

    return sub;
}

function safeInvoke(
    eventPromise: Promise<void>,
    operation: Operation,
    eventName: keyof LocalStateResolverCallbacks,
    result?: FetchResult
) {
    eventPromise.then(() => {
        const eventHandlerContext: LocalStateEventContext = operation.getContext();
        const callbacks = eventHandlerContext.localStateCallbacks;
        const cb = callbacks?.[eventName];
        cb?.(result);
    });
}
