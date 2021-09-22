// This is a simple implementation of a Promise for use by LazyImport.
// It has the following qualities:
// - It is treated as immediately fulfilled at the time of construction.
// - Any `onFulfilled` callbacks are called synchronously.
// - `QuickPromise.then` returns a real Promise based on the result of `onFulfilled`.
// - It cannot fail and `onRejected` will never be called.
class QuickPromise<TResult> {
    constructor(private result: TResult) {}
    then(onFulfilled: Function, onRejected?: Function) {
        try {
            let nextResult = onFulfilled(this.result);
            return isPromiseLike(nextResult) ? nextResult : Promise.resolve(nextResult);
        } catch (e) {
            return Promise.reject(e);
        }
    }
    catch(onRejected: Function) {
        return this;
    }
    toString() {
        return 'QP';
    }
}

function isPromiseLike(value: any) {
    return value?.then && typeof value.then === 'function';
}

// Create a QuickPromise but, for convenience, return it as a real Promise
export default function createQuickPromise<TResult>(result: TResult): Promise<TResult> {
    return (new QuickPromise(result) as any) as Promise<TResult>;
}
