export interface RequestQueue {
    add<T>(request: () => Promise<T>): Promise<T>;
    getRunningCount(): number;
    getQueueLength(): number;
}

export function createRequestQueue(maxRequests: number): RequestQueue {
    let requestCounter = 0;
    const queue: (() => void)[] = [];

    function add<T>(request: () => Promise<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            const runRequest = (): void => {
                requestCounter = requestCounter + 1;
                request().then(
                    (value: T): void => {
                        requestCompleted();
                        resolve(value);
                    },
                    error => {
                        requestCompleted();
                        reject(error);
                    }
                );
            };
            if (requestCounter === maxRequests) {
                queue.push(runRequest);
            } else {
                runRequest();
            }
        });
    }

    function requestCompleted(): void {
        requestCounter = requestCounter - 1;
        if (queue.length > 0) {
            queue.shift()();
        }
    }

    return {
        add,
        getRunningCount: () => requestCounter,
        getQueueLength: () => queue.length,
    };
}
