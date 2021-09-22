import {
    createLazyComponent,
    LazyModule,
    LazyAction,
    registerLazyOrchestrator,
} from 'owa-bundling';
import { onUpdateRecipientsInCompose } from './actions/publicActions';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "RecentattachmentPills"*/ './lazyIndex')
);

export const LazyRecentAttachmentPillContainer = createLazyComponent(
    lazyModule,
    m => m.RecentAttachmentPillContainer
);

export const LazyOnUpdateRecipientsInCompose = new LazyAction(
    lazyModule,
    m => m.onUpdateRecipientsInCompose
);
export { getStore } from './store/store';
export { AttachmentPillViewStatus } from './store/schema/AttachmentPillData';

registerLazyOrchestrator(
    onUpdateRecipientsInCompose,
    lazyModule,
    m => m.onUpdateRecipientsInComposeOrchestrator
);
