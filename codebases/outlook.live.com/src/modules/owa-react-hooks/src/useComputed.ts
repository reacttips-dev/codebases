import { computed } from 'mobx';
import { useMemo } from 'react';

/**
 * Currently, this hook doesn't actually return an IComputedProperty, as I've been unable to get it to work
 * as expected when gettors reference non-observable values, such as component props.
 * As such, currently just returns a getter.
 * https://outlookweb.visualstudio.com/Outlook%20Web/_workitems/edit/63552
 */
export function useComputed<T>(getter: () => T): { get(): T } {
    return {
        get: getter,
    };
}

// createTransformer<A, B>(transformation: (value: A) => B, onCleanup?: (result: B, value?: A) => void): (value: A) => B
export function useComputedValue<T>(getter: () => T, deps?: React.DependencyList): T {
    const computedValue = useMemo(() => computed(getter), deps);
    return computedValue.get();
}
