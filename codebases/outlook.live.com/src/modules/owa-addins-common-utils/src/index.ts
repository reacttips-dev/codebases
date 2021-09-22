import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "AddinsCommon" */ './lazyIndex')
);

export let lazyGetTypeOfAttachment = new LazyAction(lazyModule, m => m.getTypeOfAttachment);
export let lazyGetAllAttachments = new LazyAction(lazyModule, m => m.getAllAttachments);
export let lazyGetAttachmentContentHelper = new LazyAction(
    lazyModule,
    m => m.getAttachmentContentHelper
);
export let lazyPrepareAddinCommunicationInPopout = new LazyAction(
    lazyModule,
    m => m.prepareAddinCommunicationInPopout
);
