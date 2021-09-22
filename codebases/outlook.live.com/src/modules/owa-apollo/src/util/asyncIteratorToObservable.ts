import { Observable } from '@apollo/client';

/**
 * Copies from Teams with minor changes (noted with todos)
 * https://domoreexp.visualstudio.com/Teamspace/_git/teams-modular-packages?path=%2Fpackages%2Fdata%2Fresolvers%2Fdata-resolvers-common%2Fsrc%2Fasync-iterator-to-observable.ts&_a=contents&version=GBmaster
 */

/**
 * Type-guard function to check if the given object is an async iterator.
 */
function isAsyncIterator<T>(a: unknown): a is AsyncIterator<T> {
    return (a as AsyncIterator<T>).next instanceof Function;
}

/**
 * Converts the async iterator returned by the given generator
 * to an Observable.
 */
export function asyncIteratorToObservable<T>(
    generator: () => Promise<AsyncIterableIterator<T> | T>
): Observable<T> {
    let asyncIterator: AsyncIterableIterator<unknown> | undefined;

    // Clean up the async iterator when unsubscribed
    // todo: why do we need this cast when teams doesn't?
    const cleanup = () => (asyncIterator as any)?.return?.();

    return new Observable(observer => {
        try {
            generator().then(result => {
                if (isAsyncIterator(result)) {
                    // Save the result so that it can be cleaned up along with the subscription
                    asyncIterator = result;

                    // Safe-guard against the observer unsubscribing before the generator returns
                    if (observer.closed) {
                        cleanup();
                        return;
                    }

                    void asyncIteratorToObserver(result, observer);
                } else {
                    // todo: why do we need this cast when teams doesn't?
                    observer.next(result as T);
                    observer.complete();
                }
            }, observer.error.bind(observer));
        } catch (error) {
            observer.error(error);
        }

        return cleanup;
    });
}

/**
 * Binds the given observer to the given async iterator.
 *
 * Note: This function is tightly coupled to the above function for proper usage
 * and should not be used/exported outside of this context.
 */
async function asyncIteratorToObserver<T>(
    asyncIterator: AsyncIterator<T>,
    observer: ZenObservable.SubscriptionObserver<T>
) {
    try {
        let iteratorResult = await asyncIterator.next();
        while (!iteratorResult.done) {
            /**
             * Note: No need to check if the observer is closed. The outer observable
             * completes the underlying async iterable when unsubscribing.
             */
            observer.next(iteratorResult.value);
            iteratorResult = await asyncIterator.next();
        }
        observer.complete();
    } catch (error) {
        observer.error(error);
    }
}
