import swLog from "@similarweb/sw-log";

enum MessageType {
    GET_USER_DATA_MESSAGE = "getUserData",
    GET_SETTINGS_MESSAGE = "getSettings",
    CLEAR_CACHE_WORKER_MESSAGE = "clearCache",
}

export interface IUserDataWorker {
    getUserData: (MessageEvent) => void;
    getSettings: (MessageEvent) => void;
    clearCache: (MessageEvent) => void;
}

export default class UserDataWorker implements IUserDataWorker {
    private worker: Worker;

    constructor() {
        this.worker = new Worker("/userData.worker.js");
    }

    public getUserData(cb?: (e: MessageEvent) => void) {
        this.worker.postMessage(MessageType.GET_USER_DATA_MESSAGE);

        this.worker.addEventListener(
            "message",
            (e) => {
                swLog.log("Worker said: ", e.data);

                // If we got a callback, call it
                if (cb) {
                    cb(e);
                }
            },
            { capture: true },
        );

        this.worker.addEventListener(
            "error",
            (e) => {
                swLog.log(e);
            },
            { capture: true },
        );
    }

    public getSettings(cb?: (e: MessageEvent) => void) {
        this.worker.postMessage(MessageType.GET_SETTINGS_MESSAGE);

        this.worker.addEventListener(
            "message",
            (e) => {
                swLog.log("Worker said: ", e.data);

                // If we got a callback, call it
                if (cb) {
                    cb(e);
                }
            },
            { capture: true },
        );

        this.worker.addEventListener(
            "error",
            (e) => {
                swLog.log(e);
            },
            { capture: true },
        );
    }

    public clearCache(cb?: (e: MessageEvent) => void) {
        this.worker.postMessage(MessageType.CLEAR_CACHE_WORKER_MESSAGE);
        this.worker.addEventListener(
            "message",
            (e) => {
                swLog.log("Worker said: ", e.data);

                // If we got a callback, call it
                if (cb) {
                    cb(e);
                }
            },
            { capture: true },
        );
    }
}
