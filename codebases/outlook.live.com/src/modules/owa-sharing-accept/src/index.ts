import { createLazyComponent, LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "SharingAccept"*/ './lazyIndex')
);

// Synchronous utilities
export { default as shouldShowSharingMessageHeader } from './utils/shouldShowSharingMessageHeader';
export { SHARING_HOOK_ID, SHARING_MESSAGE_TYPE } from './utils/constants';

// Lazy-load actions
export const lazyAddInteractiveElementsForReadingPane = new LazyAction(
    lazyModule,
    m => m.addInteractiveElementsForReadingPane
);
export const lazyRemoveInteractiveElementsForReadingPane = new LazyAction(
    lazyModule,
    m => m.removeInteractiveElementsForReadingPane
);

// Lazy-load components
export let SharingAcceptButton = createLazyComponent(lazyModule, m => m.SharingAcceptButton);
