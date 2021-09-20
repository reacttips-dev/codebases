export const FetchStatus = {
    INITIAL: 'initial',
    LOADING: 'loading',
    SUCCESS: 'success',
    ERROR: 'error'
}

export function isFinished(fetchStatus) {
    return [FetchStatus.SUCCESS, FetchStatus.ERROR].includes(fetchStatus)
}

export function isInitial(fetchStatus) {
    return fetchStatus === FetchStatus.INITIAL
}

export function isLoading(fetchStatus) {
    return fetchStatus === FetchStatus.LOADING
}

export function isSuccess(fetchStatus) {
    return fetchStatus === FetchStatus.SUCCESS
}

export function isError(fetchStatus) {
    return fetchStatus === FetchStatus.ERROR
}