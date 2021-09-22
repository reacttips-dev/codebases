import { LazyImport, LazyModule } from 'owa-bundling';

export type GetLazyParameters<T> = T extends LazyImport<(...args: infer TArgs) => any, any>
    ? TArgs
    : never;

export type TModule<TLazyModule> = TLazyModule extends LazyModule<infer M> ? M : never;

export default function wrapLazy<
    TLazyModule extends LazyModule<any>,
    TName extends keyof TModule<TLazyModule>
>(lazyModule: TLazyModule, name: TName) {
    const lazyImport = new LazyImport(lazyModule, m => m[name]);

    return (...args: GetLazyParameters<typeof lazyImport>) => {
        return lazyImport.import().then(func => {
            return func(...args);
        });
    };
}
