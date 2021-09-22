import LazyModule from './LazyModule';

export class LazyBootModule<TModule> extends LazyModule<TModule> {
    constructor(importCallback: () => Promise<TModule>) {
        super(importCallback, func => {
            func();
        });
    }
    // this method is needed even if it is not called so LazyBootModule
    // has a different Signature than LazyModule
    public isBootModule = () => true;
}
