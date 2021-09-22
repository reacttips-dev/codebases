import * as React from 'react';

type EventSubscriberMap = {
    [K in keyof WindowEventMap]?: Map<unknown, (event: WindowEventMap[K]) => void>;
};

const eventSubscriberMap: EventSubscriberMap = {};

function onEvent<K extends keyof WindowEventMap, E extends WindowEventMap[K]>(event: E) {
    eventSubscriberMap[event.type as K]?.forEach(handler => handler(event));
}

function getEventSubscribers<K extends keyof WindowEventMap>(
    eventName: K
): Map<unknown, (event: WindowEventMap[K]) => void> {
    return (eventSubscriberMap[eventName] =
        eventSubscriberMap[eventName] ??
        (new Map<unknown, (event: WindowEventMap[K]) => void>() as any));
}

function subscribeToWindowEvent<K extends keyof WindowEventMap>(
    eventName: K,
    ref: any,
    handler: (event: WindowEventMap[K]) => void
) {
    const subscribers = getEventSubscribers<K>(eventName);
    if (subscribers.size === 0) {
        window.addEventListener(eventName, onEvent);
    }
    subscribers.set(ref, handler);
}

function unsubscribeToWindowEvent<K extends keyof WindowEventMap>(eventName: K, ref: any) {
    const subscribers = getEventSubscribers<K>(eventName);
    subscribers.delete(ref);
    if (subscribers.size === 0) {
        window.removeEventListener(eventName, onEvent);
    }
}

// Reuses a single attached event handle for the resize event, rather than attaching
//  a new handler to the DOM for each component using this hook.
export function useWindowEvent<K extends keyof WindowEventMap>(
    eventName: K,
    handler: (event: WindowEventMap[K]) => void,
    deps?: React.DependencyList
): void {
    const handlerRef = React.useRef();

    React.useEffect(() => {
        subscribeToWindowEvent(eventName, handlerRef, handler);

        return () => unsubscribeToWindowEvent(eventName, handlerRef);
    }, deps);
}
