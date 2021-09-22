import { LazyModule, LazyAction } from 'owa-bundling-light';
export { ConvertIdSource } from './schema';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "OwaImmId" */ './lazyIndex'));

// declare a wrapper here that just calls through to importAndExecute,
// since we dont' want to change the calling convention for all
// immutable ID code.
const transparentLazyFn = <
    TModule,
    TWrappedAsyncFunctionArgs extends any[],
    TPromisedReturn extends any,
    TFunc extends (...args: TWrappedAsyncFunctionArgs) => Promise<TPromisedReturn>
>(
    m: LazyModule<TModule>,
    getter: (t: TModule) => TFunc
): TFunc => {
    const lazyAction = new LazyAction<TFunc, LazyModule<TModule>>(m, getter);
    return ((...args: TWrappedAsyncFunctionArgs): Promise<TPromisedReturn> => {
        return lazyAction.importAndExecute(...args);
        // This cast to the precise function type is required to preserve
        // overloads. Otherwise, we end up constructing a new function type
        // straight from the concrete signature, whcih discards the overloads.
    }) as TFunc;
};

export const convertIdsToTargetFormat = transparentLazyFn(
    lazyModule,
    m => m.convertIdsToTargetFormat
);
export const translateRestImmutableIdsToEwsIds = transparentLazyFn(
    lazyModule,
    m => m.translateRestImmutableIdsToEwsIds
);
export const translateEwsIdsToEwsImmutableIds = transparentLazyFn(
    lazyModule,
    m => m.translateEwsIdsToEwsImmutableIds
);
export const translateEwsIdsToRestImmutableIds = transparentLazyFn(
    lazyModule,
    m => m.translateEwsIdsToRestImmutableIds
);
export const translateEwsImmutableIdsToEwsIds = transparentLazyFn(
    lazyModule,
    m => m.translateEwsImmutableIdsToEwsIds
);
