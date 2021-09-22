import { LazyImport, LazyModule, registerLazyOrchestrator } from 'owa-bundling';
import openInClientStoreAction from 'owa-addins-view/lib/actions/openInClientStore';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "addins-marketplace" */ './lazyIndex')
);

export let lazyStoreLinkHandler = new LazyImport(lazyModule, m => m.storeLinkHandler);
export let lazyLaunchStoreUrl = new LazyImport(lazyModule, m => m.launchStoreUrl);

registerLazyOrchestrator(openInClientStoreAction, lazyModule, m => m.openInClientStoreOrchestrator);
