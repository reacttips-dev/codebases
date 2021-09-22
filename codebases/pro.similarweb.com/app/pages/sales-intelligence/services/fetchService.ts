import { CommonRequestOptions, DefaultFetchService } from "services/fetchService";

const defaultFetchServiceOverride = Object.create(DefaultFetchService.getInstance());

defaultFetchServiceOverride.get = function get<R>(
    url: string,
    params?: object,
    config?: CommonRequestOptions,
): Promise<R> {
    return Object.getPrototypeOf(this).get(url, params, {
        ...config,
        preventAutoCancellation: true,
    });
};

export default defaultFetchServiceOverride;
