import { toPairs } from "lodash";
import { getUuid } from "UtilitiesAndConstants/UtilityFunctions/crypto";
import { GeneralResponse } from "../@types/responseInterfaces";
import { SwLog } from "@similarweb/sw-log";

declare const window: any;

export type CommonRequestOptions = {
    headers?: object;
    credentials?: object;
    preventAutoCancellation?: boolean;
    cancellation?: AbortSignal;
    numberOfRetry?: number;
    timeout?: number;
};

export type PutConfigObject = CommonRequestOptions & {
    bodyParams?: object;
};

export type PostConfigObject = CommonRequestOptions & {
    bodyParams?: object;
};

export type ConfigObject = CommonRequestOptions & {
    url?: string;
    method?: string;
    params?: any;
    bodyParams?: object;
    payload?: any;
};

export enum HTTP_METHOD {
    get = "GET",
    post = "POST",
    delete = "DELETE",
    patch = "PATCH",
    put = "PUT",
}

export interface IFetchService {
    get<T>(url: string, params?: any, config?: CommonRequestOptions): Promise<T>;

    post<T>(url: string, payload?: any, config?: PostConfigObject): Promise<T>;

    delete(
        url: string,
        params?: any,
        bodyParams?: any,
        config?: CommonRequestOptions,
    ): Promise<Response>;

    put<T>(url: string, payload?: any, config?: PutConfigObject): Promise<T>;

    patch<T>(url: string, payload: any): Promise<T>;

    send<T>(url: string, config: ConfigObject): Promise<T>;
}

let pendingRequestsAbortControllers: Record<string, AbortController> = {};

// create a single abort controller for multiple signals
export const createMultiAbortController = (signals: AbortSignal[]) => {
    const controller = new AbortController();
    function onAbort() {
        controller.abort();
        // Cleanup
        for (const signal of signals) {
            signal.removeEventListener("abort", onAbort);
        }
    }

    for (const signal of signals) {
        if (signal.aborted) {
            onAbort();
            break;
        }
        signal.addEventListener("abort", onAbort);
    }
    return controller;
};

export const multiAbortSignalMixin = (signal: AbortSignal) => {
    const controller = new AbortController();
    return createMultiAbortController([signal, controller.signal]);
};

export const abortAllPendingRequests = () => {
    SwLog.log(`${Object.values(pendingRequestsAbortControllers).length} Pending requests canceled`);
    Object.values(pendingRequestsAbortControllers).forEach((ctrl) => ctrl.abort());
    pendingRequestsAbortControllers = {};
};

export const NoCacheHeaders = {
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: 0,
};

export const requestParams = (params: any): string => {
    if (params.isWindow === true) {
        params.latest = "28d";
    }
    return toPairs(params)
        .filter(([key, value]) => value !== undefined)
        .map(([key, value]) => {
            if (key !== "metric") {
                return `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`;
            }
        })
        .join("&");
};

export const ProPageHeaders = () => {
    return {
        "X-Sw-Page": location.href,
        "X-Sw-Page-View-Id": getUuid(),
        "X-Requested-With": "XMLHttpRequest",
    };
};

abstract class BaseFetchService<R> implements IFetchService {
    public async get<T>(url: string, params?: any, config: CommonRequestOptions = {}): Promise<T> {
        return this.send(url, {
            method: HTTP_METHOD.get,
            params,
            cancellation: AbortController["signal"],
            numberOfRetry: 1,
            ...config,
        });
    }

    public async post<T>(url: string, payload?: any, config?: PostConfigObject): Promise<T> {
        return this.send(url, {
            method: HTTP_METHOD.post,
            payload,
            ...config,
        });
    }

    public async put<T>(url: string, payload?: any, config?: PutConfigObject): Promise<T> {
        return this.send(url, {
            method: HTTP_METHOD.put,
            payload,
            ...config,
        });
    }

    public async delete(
        url: string,
        params?: any,
        bodyParams?: any,
        config?: CommonRequestOptions,
    ): Promise<Response> {
        const requestInit = {
            body: bodyParams && JSON.stringify(bodyParams),
            method: HTTP_METHOD.delete,
            ...config,
        };

        if (params) {
            url = `${url}?${this.requestParams(params)}`;
        }

        return this.executeDeleteRequest(url, requestInit);
    }

    public async patch<T>(url: string, payload: any): Promise<T> {
        return this.send(url, {
            method: HTTP_METHOD.patch,
            payload,
        });
    }

    public async send<T>(url, config: ConfigObject): Promise<T> {
        const {
            method,
            bodyParams,
            params,
            payload,
            cancellation,
            preventAutoCancellation,
            numberOfRetry = 1,
            headers,
            credentials,
            ...other
        } = config;

        let realUrl = url;
        if (params) {
            realUrl = `${url}?${this.requestParams(params)}`;
        }

        const requestInit: any = {
            method: method.toUpperCase(),
            ...other,
        };

        switch (requestInit.method) {
            case HTTP_METHOD.put:
            case HTTP_METHOD.patch:
                requestInit.body = JSON.stringify(payload);
                return this.executeRequest<T>(realUrl, requestInit);
            case HTTP_METHOD.get:
                const requestId = getUuid();
                if (cancellation) {
                    // if the request contains abort signal and doesn't prevent auto abort
                    if (!preventAutoCancellation) {
                        const multiSignal = multiAbortSignalMixin(cancellation);
                        requestInit.signal = multiSignal.signal;
                        pendingRequestsAbortControllers[requestId] = multiSignal;
                        // if the request contains abort signal and prevent auto abort
                    } else {
                        requestInit.signal = cancellation;
                    }
                    // if the request doesn't contain abort signal and doesn't prevent auto abort
                } else if (!preventAutoCancellation) {
                    const controller = new AbortController();
                    requestInit.signal = controller.signal;
                    pendingRequestsAbortControllers[requestId] = controller;
                }

                try {
                    return await this.executeRequest<T>(realUrl, requestInit, headers);
                } catch (err) {
                    if (numberOfRetry === 1) {
                        throw err;
                    }
                    return await this.get<T>(url, params, {
                        headers,
                        preventAutoCancellation,
                        cancellation,
                        numberOfRetry: numberOfRetry - 1,
                    });
                } finally {
                    delete pendingRequestsAbortControllers[requestId];
                }
                break;
            case HTTP_METHOD.post:
                if (cancellation) {
                    requestInit.signal = cancellation;
                }
                requestInit.body = JSON.stringify(payload);

                try {
                    return await this.executeRequest<T>(realUrl, requestInit, headers, credentials);
                } catch (err) {
                    if (numberOfRetry === 1) {
                        throw err;
                    }
                    return await this.post<T>(realUrl, payload, {
                        headers,
                        credentials,
                        numberOfRetry: numberOfRetry - 1,
                    });
                }
                break;
        }
    }

    /**
     * returns a string error if failed
     * @param {R} result
     * @returns {string}
     */
    protected abstract validate(result: R): string;

    /**
     * transform result
     * @param {R} result
     * @returns {T}
     */
    protected abstract transform<T>(result: R): T;

    private shouldRefreshOnError(response) {
        if (response.status === 401 || response.status === 403) {
            if (response.headers.get("sw-authneedrefresh") === "true") {
                return true;
            }
        }
        return false;
    }

    private async executeRequest<T>(
        url: string,
        requestOpts: RequestInit,
        headers?: any,
        credentials?: any,
    ): Promise<T> {
        requestOpts.headers = {
            Accept: "application/json",
            "Content-Type": "application/json; charset=utf-8",
            ...ProPageHeaders(),
            ...headers,
        };
        requestOpts.credentials = credentials || "same-origin";

        const response: Response = await fetch(url, requestOpts);

        if (!response.ok) {
            if (this.shouldRefreshOnError(response)) {
                window.location.reload(true);
            }
            return Promise.reject(response.statusText);
        }

        if (response.status === 204 || response.headers.get("content-length") === "0") {
            return Promise.resolve(null);
        }

        try {
            const result = (await response.json()) as R;
            const error = this.validate(result);
            // TODO: remove signal from activeAbortSignals list
            if (error) {
                return Promise.reject(error);
            }
            return this.transform(result);
        } catch (e) {
            // TODO: remove signal from activeAbortSignals list
            return Promise.reject(e);
        }
    }

    private async executeDeleteRequest(url: string, requestOpts): Promise<Response> {
        requestOpts.headers = {
            Accept: "application/json",
            "Content-Type": "application/json; charset=utf-8",
            ...ProPageHeaders(),
        };
        requestOpts.credentials = "same-origin";
        // promise<Response>
        const response: Response = await fetch(url, requestOpts);

        if (!response.ok) {
            if (this.shouldRefreshOnError(response)) {
                window.location.reload(true);
            }
            return Promise.reject(response.statusText);
        }

        if (response.status === 204 || response.headers.get("content-length") === "0") {
            return Promise.resolve(null);
        }

        try {
            const result = (await response.json()) as R;
            const error = this.validate(result);
            // TODO: remove signal from activeAbortSignals list
            if (error) {
                return Promise.reject(error);
            }
            return this.transform(result);
        } catch (e) {
            // TODO: remove signal from activeAbortSignals list
            return Promise.reject(e);
        }
    }
    public requestParams = requestParams;
}

export class GeneralFetchService extends BaseFetchService<GeneralResponse<any>> {
    private static _instance: GeneralFetchService;
    private constructor() {
        super();
    }
    public static getInstance() {
        if (!GeneralFetchService._instance) {
            GeneralFetchService._instance = new GeneralFetchService();
        }
        return GeneralFetchService._instance;
    }
    protected transform<T>(result: GeneralResponse<any>): T {
        return result.Result;
    }

    protected validate<T>(result: GeneralResponse<T>): string {
        return result.Error || "";
    }
}

export class DefaultFetchService extends BaseFetchService<any> {
    private static _instance: DefaultFetchService;
    private constructor() {
        super();
    }
    public static getInstance() {
        if (!DefaultFetchService._instance) {
            DefaultFetchService._instance = new DefaultFetchService();
        }
        return DefaultFetchService._instance;
    }
    protected transform<T>(result: T): T {
        return result;
    }

    protected validate<T>(result: T): string {
        return !result ? "Error" : ""; // TODO: default error
    }
}
