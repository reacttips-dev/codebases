import { LazyAction, LazyModule, LazyImport } from 'owa-bundling';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "TabView" */ './lazyIndex'));

export let lazyActivateTab = new LazyAction(lazyModule, m => m.activateTab);
export let lazyAddTab = new LazyAction(lazyModule, m => m.addTab);
export let lazyCloseTab = new LazyAction(lazyModule, m => m.closeTab);
export let lazySetTabIsShown = new LazyAction(lazyModule, m => m.setTabIsShown);
export let lazyReloadSecondaryTabAsDeeplink = new LazyAction(
    lazyModule,
    m => m.reloadSecondaryTabAsDeeplink
);

export let lazyGetTabById = new LazyImport(lazyModule, m => m.getTabById);

export type { default as SecondaryReadingPaneTabData } from './store/schema/SecondaryReadingPaneTabData';
export { getStore, primaryTab } from './store/tabStore';
export { default as getActiveContentTab } from './utils/getActiveContentTab';
export { default as findTabByData } from './utils/findTabByData';
export { default as findTabIdBySxSId } from './utils/findTabIdBySxSId';
export { default as getSxSIdFromProjection } from './utils/getSxSIdFromProjection';
export { default as secondaryTabsHaveId } from './utils/secondaryTabsHaveId';
export { default as getTabTitle } from './utils/getTabTitle';
export { TabType, TabState } from './store/schema/TabViewState';
export type {
    default as TabViewState,
    SecondaryReadingPaneTabViewState,
    MailComposeTabViewState,
} from './store/schema/TabViewState';
export { registerTabHandler } from './utils/TabHandler';
export type { default as TabHandler } from './utils/TabHandler';
export { default as getPopoutTabsViewState } from './selectors/getPopoutTabsViewState';
