import { createLazyComponent, LazyImport, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "OwaInsertLink" */ './lazyIndex')
);

export const lazyInsertLinksIntoComposeEditor = new LazyImport(
    lazyModule,
    m => m.insertLinksIntoComposeEditor
);

export const lazyConvertClassicAttachmentToLink = new LazyImport(
    lazyModule,
    m => m.convertClassicAttachmentToLinkHandler
);

export const lazyGetAllInsertLinksIds = new LazyImport(lazyModule, m => m.getAllInsertLinksIds);

export const lazyGetAtLeastOneInsertLinkPendingOrFailed = new LazyImport(
    lazyModule,
    m => m.getAtLeastOneInsertLinkPendingOrFailed
);

export const lazyGetBlockDialogOnSendStrings = new LazyImport(
    lazyModule,
    m => m.getBlockDialogOnSendStrings
);

export const lazyGetBlockDialogOnSaveStrings = new LazyImport(
    lazyModule,
    m => m.getBlockDialogOnSaveStrings
);

export const lazyInsertLinkPlaceholdersRemoveOrRehydrate = new LazyImport(
    lazyModule,
    m => m.insertLinkPlaceholdersRemoveOrRehydrate
);

export const lazyGetPendingInsertLinkIds = new LazyImport(
    lazyModule,
    m => m.getPendingInsertLinkIds
);

export const lazyInsertLinks = new LazyImport(lazyModule, m => m.insertLinks);

export const lazyUpdateUpsellUserSelectionText = new LazyImport(
    lazyModule,
    m => m.updateUpsellUserSelectionText
);

export const LazyInsertLinksBlockDialog = createLazyComponent(
    lazyModule,
    m => m.InsertLinksBlockDialog
);

// export type
export type { GetBlockDialogOnSendStringsType } from './utils/getBlockDialogOnSendStrings';
export type { GetBlockDialogOnSaveStringsType } from './utils/getBlockDialogOnSaveStrings';

export {
    BrowseCloudLocationsHyperLink,
    CouldNotInsertHyperLinkTitle,
    BrowseCloudLocationsOnlyAllowOneFile,
} from './utils/openFilePicker.locstring.json';
