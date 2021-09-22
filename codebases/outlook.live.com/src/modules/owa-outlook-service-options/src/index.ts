import { LazyAction, LazyModule, LazyImport } from 'owa-bundling';

// import orchestrators
import './orchestrators/applyDefaultOptionsOnLoadFail';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "OutlookServiceOptions" */ './lazyIndex')
);

export let lazyCreateOrUpdateOptionsForFeature = new LazyAction(
    lazyModule,
    m => m.createOrUpdateOptionsForFeature
);

export let lazyUpdateAddinPinStatus = new LazyAction(lazyModule, m => m.updateAddinPinStatus);

export let lazyUpdateAddInArray = new LazyAction(lazyModule, m => m.updateAddInArray);

// Synchronous exports
export { default as getDefaultOptions } from './data/defaultOptions';

export const lazyGetServerOptionsForFeature = new LazyImport(
    lazyModule,
    m => m.getServerOptionsForFeature
);

// Load the options after bootstrap
// We may, in the future, move this to bootstrap and block boot on its resolution
//
// 'loadOptions' will be called by the following
// 'runAfterInitialRender'. It returns a promise, so if any consumer wants
// to act after this is completed, it can wait on its completion and do work
export let lazyLoadOptions = new LazyAction(lazyModule, m => m.loadOptions);

export * from 'owa-outlook-service-option-store';
export * from './store/store';
export { default as AddinPinModes } from './utils/AddinPinModes';
