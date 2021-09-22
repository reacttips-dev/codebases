import { LazyImport, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "SharingData"*/ './lazyIndex'));

// Delay loaded services
export const lazyGetSharingInformation = new LazyImport(lazyModule, m => m.getSharingInformation);

// delay loaded utils
export const lazyGetSharingIssuesForSharingData = new LazyImport(
    lazyModule,
    m => m.getSharingIssuesForSharingData
);
export const lazyGetInfoBarCreator = new LazyImport(lazyModule, m => m.getInfoBarCreator);
export const lazyHasLargeDLRecipient = new LazyImport(lazyModule, m => m.hasLargeDLRecipient);
export const lazyhasRecipientExpansionFailure = new LazyImport(
    lazyModule,
    m => m.hasRecipientExpansionFailure
);
export const lazyGetGroupsAndSmallDLs = new LazyImport(lazyModule, m => m.getGroupsAndSmallDLs);
export const lazyGetInvididualRecipients = new LazyImport(
    lazyModule,
    m => m.getInvididualRecipients
);
export const lazyHasGetRecipientPermissionFailed = new LazyImport(
    lazyModule,
    m => m.hasGetRecipientPermissionFailed
);
export const lazyLogSharingTipChangesForLinkRemoval = new LazyImport(
    lazyModule,
    m => m.logSharingTipChangesForLinkRemoval
);

// export public actions
export { refreshExpirationDate } from './actions/publicActions';
// Interfaces & constants
export { GetPermissionInfoStatus } from './schema/RecipientPermissionInfo';
export type { RecipientPermissionInfo } from './schema/RecipientPermissionInfo';
export type { SharingTipRecipientInfo } from './types/SharingTipRecipientInfo';
export type { SharingTipInfo } from './types/SharingTipInfo';
export { getSharingTipIdsList, SharingTipId } from './types/sharingTipId';
export { SharingTipAction } from './types/SharingTipAction';
export type { SharingRecipientsInfo } from './schema/SharingRecipientsInfo';
export type { SharingInfoBase } from './schema/SharingInfoBase';
export type { SharingData } from './schema/SharingData';
export type { IdType } from './schema/SharingData';
export type { GDriveSharingInfo } from './schema/GDriveSharingInfo';
export type { ODCSharingInfo } from './schema/ODCSharingInfo';
export type { ODBSharingInfo } from './schema/ODBSharingInfo';
export type { DropboxSharingInfo } from './schema/DropboxSharingInfo';
export type { BoxSharingInfo } from './schema/BoxSharingInfo';
