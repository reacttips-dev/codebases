import React from "react";

enum ACTION_LOADING {
    START = "LOADING_START",
    SUCCESS = "LOADING_FINISH",
    ERROR = "LOADING_ERROR",
    ABORT = "LOADING_ABORT",
    RESET = "LOADING_RESET",
}

enum STATES_LOADING {
    INIT = "init",
    LOADING = "loading",
    SUCCESS = "success",
    ERROR = "error",
    ABORTED = "aborted",
}

export interface ILoadingState<DT, ET> {
    state: STATES_LOADING;
    data: DT;
    error: ET;
    promise: Promise<DT>;
}

export interface ILoadingOperations<DT> {
    load(loadFn: () => Promise<DT>): Promise<DT>;
    abort(): void;
    reset(): void;
}

export type ILoading<DT, ET> = [ILoadingState<DT, ET>, ILoadingOperations<DT>, boolean];

interface ILoadingAction {
    type: ACTION_LOADING;
    [index: string]: any;
}

const getInitialLoadingState = <DT, ET>(): ILoadingState<DT, ET> => ({
    state: STATES_LOADING.INIT,
    data: undefined,
    error: undefined,
    promise: null,
});

const loadingReducer = <DT, ET>(state, action): ILoadingState<DT, ET> => {
    switch (action.type) {
        case ACTION_LOADING.START:
            return {
                ...getInitialLoadingState<DT, ET>(),
                state: STATES_LOADING.LOADING,
                promise: action.promise,
            };
        case ACTION_LOADING.SUCCESS:
            return {
                ...state,
                state: STATES_LOADING.SUCCESS,
                data: action.data,
            };
        case ACTION_LOADING.ERROR:
            return {
                ...state,
                state: STATES_LOADING.ERROR,
                error: action.error,
            };
        case ACTION_LOADING.ABORT:
            return {
                ...state,
                state: STATES_LOADING.ABORTED,
            };
        case ACTION_LOADING.RESET:
            return {
                ...getInitialLoadingState<DT, ET>(),
            };
    }
    return state;
};

const loadingStart = <DT>(promise: Promise<DT>): ILoadingAction => ({
    type: ACTION_LOADING.START,
    promise,
});

const loadingSuccess = <DT>(data: DT): ILoadingAction => ({
    type: ACTION_LOADING.SUCCESS,
    data,
});

const loadingError = <ET>(error: ET): ILoadingAction => ({
    type: ACTION_LOADING.ERROR,
    error,
});

const loadingAbort = (): ILoadingAction => ({
    type: ACTION_LOADING.ABORT,
});

const loadingReset = (): ILoadingAction => ({
    type: ACTION_LOADING.RESET,
});

export const useLoading = <DT = any, ET = any>(): ILoading<DT, ET> => {
    const curPromise = React.useRef(null);
    const [loadingState, loadingDispatch] = React.useReducer<
        React.Reducer<ILoadingState<DT, ET>, ILoadingAction>
    >(loadingReducer, getInitialLoadingState<DT, ET>());

    const isLoading = React.useMemo(() => {
        return [STATES_LOADING.INIT, STATES_LOADING.LOADING].includes(loadingState.state);
    }, [loadingState]);

    const loadingOperations = React.useMemo(() => {
        const load = async (loadFn: () => Promise<DT>): Promise<DT> => {
            const promise = loadFn();
            curPromise.current = promise;
            loadingDispatch(loadingStart<DT>(promise));
            try {
                const data = await promise;
                if (promise === curPromise.current) {
                    loadingDispatch(loadingSuccess(data));
                }
                return data;
            } catch (error) {
                if (promise === curPromise.current) {
                    loadingDispatch(loadingError(error));
                }
                throw error;
            } finally {
                if (promise === curPromise.current) {
                    curPromise.current = null;
                }
            }
        };

        const abort = (): void => {
            if (curPromise.current) {
                curPromise.current = null;
                loadingDispatch(loadingAbort());
            }
        };

        const reset = (): void => {
            curPromise.current = null;
            loadingDispatch(loadingReset());
        };

        return { load, abort, reset };
    }, [loadingDispatch]);

    return [loadingState, loadingOperations, isLoading];
};
useLoading.STATES = { ...STATES_LOADING };
