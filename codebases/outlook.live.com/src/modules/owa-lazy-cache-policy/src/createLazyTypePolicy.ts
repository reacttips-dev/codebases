import { LazyModule, LazyImport, Getter } from 'owa-bundling-light';
import type { OwaTypePolicy, LazyTypePolicyFactory } from './LazyTypedTypePolicy';
import type { TypedTypePolicies } from 'owa-graph-schema-type-policies';

export function createLazyTypePolicy<TModule, TPolicy extends keyof TypedTypePolicies>(
    importCallback: () => Promise<TModule>,
    getter: Getter<OwaTypePolicy<TPolicy>, TModule>
): LazyTypePolicyFactory<TPolicy> {
    const lazyModule = new LazyModule(importCallback);
    const lazyImport = new LazyImport(lazyModule, getter);

    return () => lazyImport.import();
}
