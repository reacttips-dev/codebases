import {
    useEffect,
    useMemo,
    useState
} from 'react';
import Observable from 'o_0';

function isObservable(observableOrFn) {
    return typeof observableOrFn === 'function' && typeof observableOrFn.observe === 'function';
}

function coerceToObservable(observableOrFn) {
    return isObservable(observableOrFn) ? observableOrFn : Observable(observableOrFn);
}

function unwrap({
    value
}) {
    return value;
}

function wrap(value, previousWrapped = null) {
    const isPrimitive = value !== null && typeof value !== 'object' && typeof value !== 'function';
    if (isPrimitive && previousWrapped !== null && value === unwrap(previousWrapped)) {
        return previousWrapped;
    }
    return {
        value
    };
}

function updater(valueOrObservable) {
    return (previousWrapped) => wrap(isObservable(valueOrObservable) ? valueOrObservable() : valueOrObservable, previousWrapped);
}

// distri/Observable allows storing functions as values. To support this, we
// have to use useState's lazy initial state and function update patterns. By
// default, when you pass a function to useState or the setter returned by
// useState, it calls the function and then uses the return value as its
// initial value or next value respectively. With this behavior, to put a
// function into React state, you have to wrap it in a thunk. Because of this,
// we wrap our state initialization and all of our state updates in thunks.
export default function useObservable(observableOrFn) {
    const observable = useMemo(() => coerceToObservable(observableOrFn), [observableOrFn]);
    const [wrapped, setWrapped] = useState(updater(observable));

    useEffect(() => {
        let ignore = false;
        const cb = (newValue) => {
            if (ignore === false) {
                setWrapped(updater(newValue));
            }
        };
        observable.observe(cb);
        setWrapped(updater(observable));

        return () => {
            ignore = true;
            observable.stopObserving(cb);

            // If we coerced a function into an observable, release the dependencies
            // so that the observable can be garbage collected.
            if (observable !== observableOrFn) {
                observable.releaseDependencies();
            }
        };
    }, [observable, observableOrFn]);

    return unwrap(wrapped);
}