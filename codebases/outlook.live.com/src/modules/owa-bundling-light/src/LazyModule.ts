import { getScriptBackupPath, getScriptPath } from 'owa-config';
import sleep from 'owa-sleep';
import type { TraceableError } from 'owa-trace';
import setPublicPath from './utils/setPublicPath';
import { getConfig } from './utils/config';
import { runAfterInitialRender } from './utils/delayLoad';
import { isDogfoodEnv } from 'owa-metatags';

export const MAX_ATTEMPTS = 5;
export const INITIAL_DELAY = 1000;
const PERFORMANCE_DATAPOINT_MAX_WINDOW_MS = 10000;

const SuccessAfterRetryDatapointName = 'LazyLoadSuccessAfterRetry';
const FailureDatapointName = 'LazyLoadFailure';
const LazyModuleImportDatapointName = 'LazyModuleImports';

const isSdf = isDogfoodEnv();
const CHUNK_ID_REGEX = /.*\.bind\(null,([^)]+)\)/;

// For usage of this API, see the owa-bundling README
export default class LazyModule<TModule> {
    private promise: Promise<TModule> | undefined;
    private isLoaded: boolean = false;
    private attempts = 0;
    private pendingImports = 0;
    /**
     * Datapoints to track difference in time between lazy module evaluation
     * and evaluation time of each import
     *
     * if null, the datapoint has already been logged
     * (e.g. we have elapsed PERFORMANCE_DATAPOINT_MAX_WINDOW_MS)
     *
     * This does not use PerformanceDatapoint, since PerformanceDatapoint depends on LazyModule,
     * and we need to avoid the cyclic dependency
     */
    private importWaterfallData: { [key: string]: number } | null = {};

    constructor(
        private importCallback: () => Promise<TModule>,
        private runWhen?: (cb: () => void) => void
    ) {}

    public import(): Promise<TModule> {
        // Initiate the import, if necessary
        if (!this.promise) {
            this.promise = new Promise<TModule>((resolve, reject) => {
                // Don't load any lazy resources until the initial render is complete
                (this.runWhen || runAfterInitialRender)(async () => {
                    // We'll retry several times if the load fails
                    this.attempts = 0;
                    while (!this.isLoaded && this.attempts < MAX_ATTEMPTS) {
                        try {
                            await this.loadModule(resolve);
                        } catch (error) {
                            await this.onLoadFailed(error, reject);
                        }
                    }
                });
            });
        }

        // Keep track of how many consumers are waiting for this import
        if (!this.isLoaded) {
            this.pendingImports++;
        }

        return this.promise;
    }

    public getIsLoaded() {
        return this.isLoaded;
    }

    private getUrl(attempt: number) {
        return MAX_ATTEMPTS - attempt <= 1 ? getScriptBackupPath() : getScriptPath();
    }

    private async loadModule(resolve: (value: TModule) => void) {
        let url = this.getUrl(this.attempts++);
        setPublicPath(url);
        const importPromise = this.importCallback();
        // we should set the public path after we are done to make sure any eager scripts are loaded from the main url
        setPublicPath(getScriptPath());
        resolve(await importPromise);

        // Only log import evaluation inside of SDFv2
        //
        // We can't use feature flags for this, since LazyModule imports are
        // evaluated before flights are downloaded.
        if (isSdf) {
            this.addWaterfallCheckpoint('module');
            // Only log imports that happen in the first n seconds
            setTimeout(() => {
                getConfig().logUsage(LazyModuleImportDatapointName, {
                    entryModuleId: this.__getEntryModuleIdForLogging(),
                    ...this.importWaterfallData,
                });
                this.importWaterfallData = null;
            }, PERFORMANCE_DATAPOINT_MAX_WINDOW_MS);
        }

        this.isLoaded = true;
        this.pendingImports = 0;

        // Keep track of cases where retrying actually helps
        if (this.attempts > 1) {
            getConfig().logUsage(SuccessAfterRetryDatapointName, {
                attempts: this.attempts.toString(),
                url,
            });
        }
    }

    private async onLoadFailed(error: any, reject: (reason: any) => void) {
        if (!error.request) {
            // When Webpack fails to load a bundle it includes a 'request' property on the error; if
            // that property is absent then this must be an error that happened while evaluating
            // the module.
            error.scriptEval = true;
            getConfig().logError(error);

            // The module is loaded but in a bad state (i.e. there's no point in trying to reload
            // it because it's already in Webpack's module cache).
            this.isLoaded = true;

            // We've already logged the error with trace.error so mark it as reported.
            error.reported = true;
            reject(error);
        } else if (this.attempts >= MAX_ATTEMPTS) {
            // After MAX_ATTEMPTS, just fail
            getConfig().logUsage(FailureDatapointName, {
                message: error.message,
                pendingImports: this.pendingImports,
            });

            // The error from webpack will always be different because it includes the chunk number
            // that failed; we create a new error so our analytics can bucket them together.
            let errorString = 'Failed to load javascript.';
            if (error.httpStatus) {
                errorString += 'Status:' + error.httpStatus;
            }

            const newError: TraceableError = new Error(errorString);
            newError.networkError = true;
            newError.diagnosticInfo = error.diagnosticInfo || error.message;
            reject(newError);
            this.pendingImports = 0;

            // Reset the cached promise so that we'll retry again the next time
            // import is attempted
            this.promise = undefined;
        } else if (this.attempts > 1) {
            // Delay before retrying
            await sleep(INITIAL_DELAY * Math.pow(2, this.attempts - 2));
        }
    }

    private __getEntryModuleIdForLogging(): string {
        const importString = this.importCallback.toString();
        // Get the last occurrence of .bind in the import callback
        try {
            const match = importString.match(CHUNK_ID_REGEX);
            return match && match.length > 1 ? match[1] : importString;
        } catch {
            return importString;
        }
    }

    public addWaterfallCheckpoint(name: string): void {
        if (this.importWaterfallData && this.importWaterfallData[name] === undefined) {
            this.importWaterfallData[name] = window.performance.now();
        }
    }
}
