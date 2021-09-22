export type { default as InternetHeaders } from './apis/internetHeaders/InternetHeaders';
export type { SetInternetHeadersArgs } from './apis/internetHeaders/InternetHeadersArgs';
export type { GetRemoveInternetHeadersArgs } from './apis/internetHeaders/InternetHeadersArgs';
export {
    isValidInternetHeaderKeysArray,
    internetHeaderDictionaryIsValid,
} from './apis/internetHeaders/internetHeaderValidationUtils';
export { DelegatePermissionsBitMapValues } from './apis/sharedProperties/SharedProperties';
export type {
    AdapterSharedProperties,
    ApiSharedProperties,
    DelegatePermissions,
} from './apis/sharedProperties/SharedProperties';
export { AttachmentContentFormat } from './apis/attachments/AttachmentContent';
export type { AttachmentContent } from './apis/attachments/AttachmentContent';
export type { default as LocationDetails } from './apis/location/LocationDetails';
export { LocationType } from './apis/location/LocationDetails';
export type { AddRemoveEnhancedLocationsArgs } from './apis/location/LocationDetails';
export type { LocationIdentifier } from './apis/location/LocationDetails';
export { default as RecipientFieldEnum } from './apis/recipients/RecipientFieldEnum';
export {
    AddinsSupportedAttachmentType,
    createAttachmentDetails,
} from './apis/attachments/AttachmentDetails';
export type { AttachmentDetails } from './apis/attachments/AttachmentDetails';
export { default as AttachmentStatusEnum } from './apis/attachments/AttachmentStatusEnum';
export {
    createLocationDetails,
    isValidLocationIdentifiersArray,
} from './apis/location/enhancedLocationsUtils';
