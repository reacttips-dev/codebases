import { LazyModule, registerLazyOrchestrator, LazyImport } from 'owa-bundling';
import { default as onModuleClick } from './actions/onModuleClick';
import { default as onOfficeAppClick } from './actions/onOfficeAppClick';
export { default as onModuleClick } from './actions/onModuleClick';
export { default as onOfficeAppClick } from './actions/onOfficeAppClick';
export { default as onAppHostHeaderStartSearch } from './actions/onAppHostHeaderStartSearch';

export type { OfficeApp } from './store/schema/OfficeApp';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "LeftRailUtils" */ './lazyIndex')
);
export { isModuleSwitchEnabled } from './isModuleSwitchEnabled';
export const lazyGetSelectedOfficeRailApp = new LazyImport(
    lazyModule,
    m => m.getSelectedOfficeRailApp
);
export const lazyGetLeftRailItemContextualMenuItems = new LazyImport(
    lazyModule,
    m => m.getLeftRailItemContextualMenuItems
);

registerLazyOrchestrator(onModuleClick, lazyModule, m => m.onModuleClickOrchestrator);
registerLazyOrchestrator(onOfficeAppClick, lazyModule, m => m.onOfficeAppClickOrchestrator);

import './mutators/clearSelectedOfficeAppMutators';
import './mutators/selectOfficeRailAppMutators';
