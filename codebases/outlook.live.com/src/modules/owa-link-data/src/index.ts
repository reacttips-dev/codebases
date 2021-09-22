import { LazyImport, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "LinkData"*/ './lazyIndex'));

// Delay loaded public actions
export const lazyAddRecipientsIntoLink = new LazyImport(lazyModule, m => m.addRecipientsIntoLink);
export const lazyRemoveRecipientsFromLink = new LazyImport(
    lazyModule,
    m => m.removeRecipientsFromLink
);
export const lazyUpdateRecipientPermissionInfos = new LazyImport(
    lazyModule,
    m => m.updateRecipientPermissionInfos
);
export const lazySetGetPermissionInfoFailure = new LazyImport(
    lazyModule,
    m => m.setGetPermissionInfoFailure
);
export const lazyResetSharingRecipientsInfo = new LazyImport(
    lazyModule,
    m => m.resetSharingRecipientsInfo
);

export const lazyIgnoreSharingTip = new LazyImport(lazyModule, m => m.ignoreSharingTip);
export const lazySetLinkActionStatus = new LazyImport(lazyModule, m => m.setLinkActionStatus);

export const lazyUpdateLinkContainerIdOfLink = new LazyImport(
    lazyModule,
    m => m.updateLinkContainerIdOfLink
);

export const lazyUpdateLinkIds = new LazyImport(lazyModule, m => m.updateLinkIds);

// Delay loaded utility functions
export const lazyGetSharingTipRecipientInfo = new LazyImport(
    lazyModule,
    m => m.getSharingTipRecipientInfo
);

export const lazyCreateCloudFileFromSharingLink = new LazyImport(
    lazyModule,
    m => m.createCloudFileFromSharingLink
);

export const lazyRetrieveImageUrlsForImageFile = new LazyImport(
    lazyModule,
    m => m.retrieveImageUrlsForImageFile
);

export const lazyImageLinkPreviewCondition = new LazyImport(
    lazyModule,
    m => m.imageLinkPreviewCondition
);

// Delay loaded selectors
export const lazyGetLinksIdContainer = new LazyImport(lazyModule, m => m.getLinksIdContainer);

// boot strap - used to load the package, in cases where an action might be fired off before the package is loaded,
// but the action is subbscribed to by other packages, so it can't be lazy loaded directly.
export { lazyModule as preloadLinkData };

// Non-delay loaded subscribable actions
export {
    addSharingLink,
    addSharingLinkToContainer,
    createAttachmentFromLink,
    deleteLink,
    removeSharingLinkFromContainer,
    sharingLinkRemoved,
    onFluidLinkCreated,
    onLinkHasChanged,
    onExistingFluidLinkProcessed,
} from './actions/subscribableActions';

// Note - these are actions that are not lazy loaded, and should
// only be consumed by owa-compose-view. They act like internal actions, but
// due to store/view being in different packages must be exported.
export {
    updateSharingLinkFromSharingDialog,
    updateSharingLinkPermission,
    updateSharingLinkUrl,
    setRefreshStatus,
    createOrUpdateSharingLink,
} from './actions/internalActions';

// exported constants types and type guards
export type { RecipientPermissionResult } from './types/RecipientPermissionResult';
export type { RecipientContainer } from './types/RecipientContainer';
export type { ImageUrls } from './types/ImageUrls';
export { recipientContainerIsRecipientWell } from './utils/typeGuards';
export { AnchorElementsSource } from './types/AnchorElementsSource';
export { isFluidFile, isOneNoteFluidFile } from './utils/isFluidFile';

// export strings
export { oneNoteLinkTooltip } from './strings.locstring.json';

// non-delay loaded selectors - TODO make lazy
export {
    getAnchorElementId,
    getLinkIdFromAnchorElementId,
    isRecipientsOfThisMessagePermission,
} from './utils/getLinkIdFromAnchorElementId';
export { isNewLink } from './utils/isNewLink';
export { LinkActionStatus } from './types/LinkActionStatus';
export type { default as SharingLinkInfo } from './store/schema/SharingLinkInfo';
export type { default as LinksIdContainer } from './store/schema/LinksIdContainer';
export { default as getSharingLinkInfo } from './selectors/getSharingLinkInfo';
export { default as getSharingDataFromLink } from './selectors/getSharingData';
export { default as getNumberOfSharingLinks } from './selectors/getNumberOfSharingLinks';
export { getSharingLinkSpecialParamsFromUrl } from './utils/getSharingLinkSpecialParamsFromUrl';
