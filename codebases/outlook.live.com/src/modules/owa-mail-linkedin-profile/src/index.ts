import { createLazyComponent, LazyModule, LazyAction } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "ViewProfileButton" */ './lazyIndex')
);

export let ViewProfileButton = createLazyComponent(lazyModule, m => m.ViewProfileButton);
export let ViewProfileBoldButton = createLazyComponent(lazyModule, m => m.ViewProfileBoldButton);
export const lazyFetchLinkedInProfileInfo = new LazyAction(
    lazyModule,
    m => m.fetchLinkedInProfileInfo
);
