import { LazyBootModule, LazyAction } from 'owa-bundling-light';

const lazyModule = new LazyBootModule(
    () => import(/* webpackChunkName: "OwaManagedQueryLink" */ './lazyIndex')
);

export const lazyCreateManagedQueryLink = new LazyAction(lazyModule, m => m.createManagedQueryLink);
export type { SessionIdContext } from './SessionIdContext';
export type { ManagedQueryContext } from './ManagedQueryContext';
export type { ManagedMutationOptions } from './ManagedOptions';
export type { ManagedQueryOptions } from './ManagedOptions';
