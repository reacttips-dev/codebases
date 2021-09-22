export interface PromiseWithKey<T> {
    key: string | null; // will ignore this promise in calculating the bottleneck if undefined
    promise: Promise<T>;
}

const bottlenecks: { [bottlneck: string]: string | number } = {};
export function trackBottleneck<T>(
    bottleneck: string,
    promises: PromiseWithKey<T>[]
): Promise<T[]> {
    for (var ii = 0; ii < promises.length; ii++) {
        const key = promises[ii].key;
        if (key) {
            promises[ii].promise
                .then(_ => {
                    bottlenecks[bottleneck] = key;
                })
                .catch(() => {
                    /* do nothing if it fails */
                });
        }
    }

    return Promise.all(promises.map(p => p.promise));
}

export function addBottleneck(key: string, value: string | number) {
    if (!bottlenecks[key]) {
        bottlenecks[key] = value;
    }
}

export function getBottlenecks() {
    return JSON.stringify(bottlenecks);
}
