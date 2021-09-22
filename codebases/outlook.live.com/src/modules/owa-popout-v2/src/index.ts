import { LazyModule, LazyImport } from 'owa-bundling';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "Popout" */ './lazyIndex'));

export const lazyBootPopout = new LazyImport(lazyModule, m => m.bootPopout);
export type { DeeplinkPopoutData } from './store/schema/PopoutData';
export type { default as PopoutData } from './store/schema/PopoutData';
export { default as addPopoutV2 } from './actions/addPopoutV2';
export { default as setPopoutChildState } from './actions/setPopoutChildState';
export { default as PopoutLoadingView } from './components/PopoutLoadingView';
export { PopoutChildState } from './store/schema/PopoutChildStore';
export { getStore } from './store/childStore';
export { default as getDataFromParentWindow } from './utils/getDataFromParentWindow';
export { getReadingPaneRouteForPopoutV2 } from './utils/getReadingPaneRouteForPopoutV2';
export { default as AddPopoutSource } from './store/schema/AddPopoutSource';
export { default as isPopout } from './utils/isPopout';
export { default as getProjectionViewState } from './selectors/getProjectionViewState';
export { default as PopoutType } from './store/schema/PopoutType';
