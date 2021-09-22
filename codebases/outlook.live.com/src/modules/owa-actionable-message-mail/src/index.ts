import { createLazyComponent, LazyModule, LazyImport } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "ActionableMessageMail" */ './lazyIndex')
);

export const ActionableMessageMailWrapper = createLazyComponent(
    lazyModule,
    m => m.ActionableMessageMailWrapper
);

export const lazyDoesActionableMessageEnabled = new LazyImport(
    lazyModule,
    m => m.doesActionableMessageEnabled
);

export const lazyGetCardDetails = new LazyImport(lazyModule, m => m.getCardDetails);

export { default as getActionableMessageCardMessageContextFromItem } from './utils/getActionableMessageCardMessageContextFromItem';
export { default as ActionableMessageLoggingHandler } from './utils/ActionableMessageLoggingHandler';
