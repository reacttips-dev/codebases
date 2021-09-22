export type IWorkerRunMethod = (...args: any) => any;

export type IWorkerProxyMethod = (...args: any) => Promise<any>;

export interface IWorkerRunObject {
    method: IWorkerRunMethod;
}

export interface IWorkerRunResolveReject {
    resolve: (result: any) => void;
    reject: (error: any) => void;
}

export default class WorkerProcessor {
    // process the given methods in the worker
    public static processMethods(runs: { [key: string]: IWorkerRunObject }): void {
        self.addEventListener(
            "message",
            (evt) => {
                const { data } = evt;
                const { key, name, args } = data;
                if (runs[name]) {
                    this.postRunResult(key, runs[name].method, args);
                }
            },
            { capture: true },
        );
    }

    // Runs the given process method to get its result, and send it back to the main thread with the run key.
    // In case the run fails, it will send the error to main thread.
    protected static async postRunResult(
        key: string,
        processMethod: IWorkerRunMethod,
        args: any[],
    ) {
        try {
            const result = await processMethod(...args);
            self.postMessage({
                key,
                result,
            });
        } catch (err) {
            self.postMessage({
                key,
                error: {
                    message: err.message,
                },
            });
        }
    }

    // hold worker data
    protected workerInst: Worker;
    protected workerRunKeyIdx = 0;
    protected workerRunsResolveReject: { [key: string]: IWorkerRunResolveReject } = {};

    // returns the worker instance
    public get worker() {
        return this.workerInst;
    }

    public start(worker: string | { new (): Worker }): void {
        // use a single worker for this service
        if (!this.workerInst) {
            // create the worker
            this.workerInst = typeof worker === "string" ? new Worker(worker) : new worker();

            // listen for messages (results) from the worker and resolve their corresponding promises
            this.workerInst.addEventListener(
                "message",
                (evt) => {
                    const { data } = evt;
                    const { key, result, error } = data;
                    const { resolve, reject } = this.workerRunsResolveReject[key]; // get the promise resolver by the run key
                    if (!resolve) {
                        console.warn(`Worker run "${key}" was not found.`);
                        return;
                    }
                    if (error) {
                        // if error, reject the run promise with error
                        reject(error);
                    } else {
                        // if success,
                        resolve(result); // resolve the run process with the result from the worker
                    }
                    delete this.workerRunsResolveReject[key]; // clear the resolver from the map
                },
                { capture: true },
            );
        }
    }

    public stop(): void {
        if (this.workerInst) {
            this.workerInst.terminate();
            this.workerInst = undefined;
        }
    }

    public isStarted(): boolean {
        return !!this.workerInst;
    }

    public run(name: string): IWorkerProxyMethod {
        return (...args: any): Promise<any> => {
            // generate a unique increasing worker run key for each run command
            ++this.workerRunKeyIdx;
            const key = `wrkRun-${this.workerRunKeyIdx}`;

            // return a promise that will be resolved as the corresponding message will be returned from worker
            return new Promise((resolve, reject) => {
                this.workerRunsResolveReject[key] = { resolve, reject }; // store the worker run key resolve and reject
                this.workerInst.postMessage({ key, name, args }); // start the worker and post a run message
            });
        };
    }
}
