let prefetchMode = false;
let prefetchPriority: number | undefined;
// Use prefetch() to run a section of code under prefetch mode.  Service calls
// made under prefetch mode are issued with a lower priority so as not to
// interfere with requests that need to return immediately.
//
// Example usage:
//
// prefetch(() => {
//     makeSomeServiceRequest();
// });
//
export default function prefetch(callback: () => void, priority?: number) {
    if (prefetchMode) {
        throw new Error('Calls to prefetch() may not be nested.');
    }

    try {
        prefetchMode = true;
        prefetchPriority = priority;
        callback();
    } finally {
        prefetchMode = false;
        prefetchPriority = undefined;
    }
}

export function isInPrefetchMode() {
    return prefetchMode;
}

export function getPrefetchPriority(): number | undefined {
    return prefetchPriority;
}
