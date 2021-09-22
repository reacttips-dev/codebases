import { ApolloLink, Observable } from '@apollo/client';
import type { Resolvers } from 'owa-graph-schema';
import { lazyExecute, lazySubscribe } from 'owa-apollo-execute';
import { asyncIteratorToObservable } from '../util/asyncIteratorToObservable';
import { getOperationType } from '../util/getOperationType';

export default function executeGraphLink(resolvers: Resolvers, globalContext: any) {
    const link = new ApolloLink((operation, forward) => {
        if (getOperationType(operation) === 'subscription') {
            return asyncIteratorToObservable(() =>
                lazySubscribe.importAndExecute(resolvers, operation, globalContext)
            );
        }

        return new Observable(observer => {
            lazyExecute
                .importAndExecute(resolvers, operation, globalContext)
                .then(result => {
                    observer.next(result);
                    observer.complete();
                })
                .catch(e => {
                    observer.error(e);
                });
        });
    });

    return link;
}
