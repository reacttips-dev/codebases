import { LazyAction, LazyModule } from 'owa-bundling-light';
import { OwaCachePolicyMap } from 'owa-lazy-cache-policy';
import {
    Operation,
    NextLink,
    Observable,
    FetchResult,
    ApolloClient,
    NormalizedCacheObject,
} from '@apollo/client';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "OwaApolloPolicyLoader" */ './lazyIndex')
);

const lazyRequest = new LazyAction(lazyModule, m => m.request);

export function request(
    client: ApolloClient<NormalizedCacheObject>,
    policies: OwaCachePolicyMap,
    operation: Operation,
    next: NextLink
): Observable<FetchResult> {
    return new Observable(sub => {
        lazyRequest
            .importAndExecute(client, policies, operation, next)
            .then(o => o.subscribe(sub))
            .catch(e => sub?.error(e));
    });
}
