import type Getter from './types/Getter';
import type { LazyModuleType } from './types/LazyModuleType';
import LazyImport from './LazyImport';
import type LazyModule from './LazyModule';
import { setGlobalImportStartTime } from './globalImportStartTime';

/**
 * A flattened Promise (i.e. if T is Promise<U>, it returns Promise<U>, not Promise<Promise<U>>)
 * that correctly wraps `any` and `unknown` into `Promise<any>` and `Promise<unknown>`, respectively
 */
export type Promisify<T> =
    // `unknown` only extends `any` and `unknown`; needed to differentiate `any` into `Promise<any>`
    unknown extends T ? Promise<T> : FlattenNonAnyPromise<T>;

type FlattenNonAnyPromise<T> =
    // If T is already a Promise, the type is just T; otherwise, wraps T in a Promise<T>
    T extends Promise<infer U> ? T : Promise<T>;

export type AsyncFunction<T> = T extends (...args: any[]) => any
    ? (...args: Parameters<T>) => Promisify<ReturnType<T>>
    : T;

export interface LazyActionOptions {
    captureBundleTime?: boolean;
}

// For usage of this API, see the owa-bundling README
export default class LazyAction<
    TAction extends (...args: any[]) => any,
    TLazyModule extends LazyModule<any>
> extends LazyImport<TAction, TLazyModule> {
    public importAndExecute: AsyncFunction<TAction>;

    constructor(
        lazyModule: TLazyModule,
        getter: Getter<TAction, LazyModuleType<TLazyModule>>,
        options?: LazyActionOptions
    ) {
        super(lazyModule, getter);

        let self = this;
        this.importAndExecute = <AsyncFunction<TAction>>(
            function importAndExecute(...args: Parameters<TAction>) {
                let importStartTime = options?.captureBundleTime ? Date.now() : null;
                return self.import().then(concreteAction => {
                    setGlobalImportStartTime(importStartTime);
                    const results = <ReturnType<TAction>>concreteAction.apply(null, args);
                    setGlobalImportStartTime(null);
                    return results;
                });
            }
        );
    }
}
