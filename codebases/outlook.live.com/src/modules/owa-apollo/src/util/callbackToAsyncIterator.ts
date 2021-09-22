// Forked from https://github.com/withspectrum/callback-to-async-iterator/blob/master/src/index.js
// to support ES5

/*!
    callback-to-async-iterator v1.1.1 - MIT license (https://github.com/withspectrum/callback-to-async-iterator.git)
*/

// @flow
// Turn a callback-based listener into an async iterator
// Based on https://github.com/apollographql/graphql-subscriptions/blob/master/src/event-emitter-to-async-iterator.ts

const defaultOnError = (err: Error) => {
    throw new Error(err.toString());
};

function callbackToAsyncIterator<CallbackInput, ReturnVal>(
    listener: (cb: (arg: CallbackInput) => any) => Promise<ReturnVal>,
    options: {
        onError?: (err: Error) => void;
        onClose?: (arg: ReturnVal) => void;
        // buffering?: boolean;
    } = {}
): AsyncIterator<CallbackInput> {
    const { onError = defaultOnError, onClose } = options;
    try {
        let pullQueue = [];
        let pushQueue = [];
        let listening = true;
        let listenerReturnValue;

        const pushValue = value => {
            if (pullQueue.length !== 0) {
                pullQueue.shift()({ value, done: false });
            } /*if (buffering === true)*/ else {
                pushQueue.push(value);
            }
        };

        const pullValue = () => {
            return new Promise<IteratorResult<CallbackInput>>(resolve => {
                if (pushQueue.length !== 0) {
                    resolve({ value: pushQueue.shift(), done: false });
                } else {
                    pullQueue.push(resolve);
                }
            });
        };

        const emptyQueue = () => {
            if (listening) {
                listening = false;
                pullQueue.forEach(resolve => resolve({ value: undefined, done: true }));
                pullQueue = [];
                pushQueue = [];
                onClose?.(listenerReturnValue);
            }
        };

        // Start listener
        listener(value => pushValue(value))
            .then(a => {
                listenerReturnValue = a;
            })
            .catch(err => {
                onError(err);
            });

        return {
            next(): Promise<IteratorResult<CallbackInput>> {
                return listening ? pullValue() : this.return();
            },
            return(): Promise<IteratorResult<CallbackInput>> {
                emptyQueue();
                return Promise.resolve({ value: undefined, done: true });
            },
            throw(error) {
                emptyQueue();
                onError(error);
                return Promise.reject(error);
            },
            [Symbol.asyncIterator]() {
                return this;
            },
        } as AsyncIterator<CallbackInput>;
    } catch (err) {
        onError(err);
        return {
            next() {
                return Promise.reject(err);
            },
            return() {
                return Promise.reject(err);
            },
            throw(error) {
                return Promise.reject(error);
            },
            [Symbol.asyncIterator]() {
                return this;
            },
        } as AsyncIterator<CallbackInput>;
    }
}

export default callbackToAsyncIterator;
