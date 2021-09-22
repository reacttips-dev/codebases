export interface RetriableOptions {
    maximumAttempts?: number;

    /**
     * retryAttempt will start from 1 onwards
     */
    timeBetweenRetryInMS?: (retryAttempt: number) => number;
}

export interface RetriableFunction<T> {
    retriableFunc: () => Promise<T>;
    cancel: () => void;
}

/**
 * This creates a function that will retry if the function call throws.
 * You can specify the properties related to retry e.g. maximum attemp,
 * time between the next retry. Using it you can also create an exponential backoff
 * retry or any other kind of retry mechanism you want.
 * @param options related to retry properties
 */
export default function createRetriableFunction(
    options: RetriableOptions = {}
): <T>(funcToRetry: () => Promise<T>) => RetriableFunction<T> {
    setDefaultOptions(options);
    const { maximumAttempts, timeBetweenRetryInMS } = options;

    return <T>(funcToRetry: () => Promise<T>): RetriableFunction<T> => {
        let attempt = 0; // The attempted call
        let isCancelled = false; // Variable to track if the retry was cancelled
        const cancel = () => (isCancelled = true);

        const handleErrorAndRetry = (resolve, reject) => {
            if (!isCancelled) {
                // If is is not cancelled then execute the function.
                attempt++;
                funcToRetry()
                    .then(response => resolve(response))
                    .catch(error => {
                        // In case of failure if the maximumAttempts was provided then
                        // check if we have exhausted that, if we have then throw the error
                        // otherwise wait for the specified time and retry again
                        if (maximumAttempts && attempt >= maximumAttempts) {
                            reject(error);
                        } else {
                            setTimeout(
                                () => handleErrorAndRetry(resolve, reject),
                                timeBetweenRetryInMS(attempt)
                            );
                        }
                    });
            } else {
                reject(new Error('The function retry was cancelled'));
            }
        };

        return {
            retriableFunc: () =>
                new Promise((resolve, reject) => handleErrorAndRetry(resolve, reject)),
            cancel: cancel,
        };
    };
}

/**
 * Sets the options that were not specified by the user
 */
function setDefaultOptions(options: RetriableOptions) {
    options.timeBetweenRetryInMS = options.timeBetweenRetryInMS || (() => 1000 * 60); // No exponential backoff instead 60 seconds between each retry
}
