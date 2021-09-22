export const DEFERRABLE_PROMISE_TIMEOUT_ERROR = 'DeferrablePromise timed out';

export class DeferrablePromise<T> implements Promise<T> {
    private internalPromise: Promise<T>;
    private internalResolve: (value?: T | PromiseLike<T>) => void;
    private internalReject: (reason?: {}) => void;
    private isFullfilled: boolean;
    private isRejected: boolean;
    private timeout: NodeJS.Timer;

    constructor(timeout: number) {
        this.internalPromise = new Promise<T>((resolve, reject) => {
            this.internalResolve = resolve;
            this.internalReject = reject;
            this.timeout = setTimeout(() => {
                reject(new Error(DEFERRABLE_PROMISE_TIMEOUT_ERROR));
                this.isRejected = true;
            }, timeout);
        });
    }

    public then<TResult1 = T, TResult2 = never>(
        onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
        onrejected?: ((reason: {}) => TResult2 | PromiseLike<TResult2>) | undefined | null
    ): Promise<TResult1 | TResult2> {
        return this.internalPromise.then(onfulfilled, onrejected);
    }

    public catch<TResult = never>(
        onrejected?: ((reason: {}) => TResult | PromiseLike<TResult>) | undefined | null
    ): Promise<T | TResult> {
        return this.internalPromise.catch(onrejected);
    }

    public resolve(value?: T | PromiseLike<T>): void {
        if (!this.isFullfilled || !this.isRejected) {
            this.internalResolve(value);
            this.isFullfilled = true;
            clearTimeout(this.timeout);
        }
    }

    public reject(reason: {}) {
        if (!this.isFullfilled || !this.isRejected) {
            this.internalReject(reason);
            this.isRejected = true;
            clearTimeout(this.timeout);
        }
    }

    public reset(timeout: number) {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(() => {
            this.reject(new Error(DEFERRABLE_PROMISE_TIMEOUT_ERROR));
            this.isRejected = true;
        }, timeout);
    }
}
