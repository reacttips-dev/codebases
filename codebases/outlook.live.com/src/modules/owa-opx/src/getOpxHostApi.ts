import type { OpxHostApi } from './OpxHostApi';

let opxHostApi: OpxHostApi;
export function getOpxHostApi(): OpxHostApi {
    if (!opxHostApi) {
        throw new Error('OpxHostApi has not been initialized yet.');
    }

    return opxHostApi;
}

export function isOpxHostInitialized(): boolean {
    return !!opxHostApi;
}

export function setOpxHostApi(value: OpxHostApi) {
    opxHostApi = value;
}
