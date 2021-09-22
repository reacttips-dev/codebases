import { getExtensionFromFileName } from 'owa-file';
import type { ReadOnlyAttachmentPolicyType } from 'owa-service/lib/ReadOnlyTypes';
import type AttachmentType from 'owa-service/lib/contract/AttachmentType';
import { getAttachmentPolicyBasedOnFlag } from 'owa-attachment-policy-access-issue-checker';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { isImageExtension } from 'owa-file/lib/utils/isImageFile';
import { isTextExtension } from 'owa-file/lib/utils/isTextFile';
import { TypeOfAttachment, getTypeOfAttachment } from 'owa-attachment-type';

export enum AttachmentPolicyLevel {
    Undefined = 0,
    Block,
    ForceSave,
    Allow,
    AccessDisabled,
}

export interface AttachmentPolicyInfo {
    directFileAccessEnabled: boolean;
    level: AttachmentPolicyLevel;
    useWac: boolean;
    forceBrowserViewingFirst: boolean;
    wacEdit: boolean;
}

export default class AttachmentPolicyChecker {
    public readonly saveAttachmentsToCloudEnabled: boolean;
    public readonly convertClassicToCloudyEnabled: boolean;
    public readonly convertCloudyToClassicEnabled: boolean;
    public readonly printWithoutDownloadEnabled: boolean;
    public readonly linkPreviewEnabled: boolean;
    private directFileAccessEnabled: boolean;
    private fileTypeToPolicyMap: { [key: string]: AttachmentPolicyLevel };
    private mimeTypeToPolicyMap: { [key: string]: AttachmentPolicyLevel };
    private policyForUnknownTypes: AttachmentPolicyLevel;

    constructor(
        private attachmentPolicy: ReadOnlyAttachmentPolicyType,
        private shouldTreatAsPublicLogon: boolean
    ) {
        if (this.shouldTreatAsPublicLogon) {
            this.directFileAccessEnabled = this.attachmentPolicy.DirectFileAccessOnPublicComputersEnabled;
            this.linkPreviewEnabled = this.attachmentPolicy.WacViewingOnPublicComputersEnabled;
        } else {
            this.directFileAccessEnabled = this.attachmentPolicy.DirectFileAccessOnPrivateComputersEnabled;
            this.linkPreviewEnabled = this.attachmentPolicy.WacViewingOnPrivateComputersEnabled;
        }

        this.saveAttachmentsToCloudEnabled =
            this.attachmentPolicy.AttachmentDataProviderAvailable &&
            this.attachmentPolicy.SaveAttachmentsToCloudEnabled;
        this.convertClassicToCloudyEnabled =
            this.attachmentPolicy.AttachmentDataProviderAvailable &&
            this.attachmentPolicy.ReferenceAttachmentsEnabled;
        this.convertCloudyToClassicEnabled =
            this.attachmentPolicy.AttachmentDataProviderAvailable &&
            this.attachmentPolicy.ClassicAttachmentsEnabled;
        this.fileTypeToPolicyMap = this.createPolicyMap(
            this.attachmentPolicy.BlockedFileTypes,
            this.attachmentPolicy.ForceSaveFileTypes,
            this.attachmentPolicy.AllowedFileTypes
        );
        this.mimeTypeToPolicyMap = this.createPolicyMap(
            this.attachmentPolicy.BlockedMimeTypes,
            this.attachmentPolicy.ForceSaveMimeTypes,
            this.attachmentPolicy.AllowedMimeTypes
        );
        this.policyForUnknownTypes =
            AttachmentPolicyLevel[this.attachmentPolicy.ActionForUnknownFileAndMIMETypes];
        this.printWithoutDownloadEnabled = this.attachmentPolicy.PrintWithoutDownloadEnabled;
    }

    getPolicyInfo(
        extension: string,
        mimeType: string,
        isWacPreviewSupportedOnPlatform: boolean,
        attachmentType: TypeOfAttachment
    ): AttachmentPolicyInfo {
        if (extension) {
            extension = extension.toLowerCase();
        }

        let level: AttachmentPolicyLevel = this.getFileAccessLevel(extension, mimeType);
        let useWac: boolean = false;
        let forceBrowserViewingFirst: boolean = false;
        let wacEdit: boolean = false;
        const isCloudy =
            attachmentType === TypeOfAttachment.Reference ||
            attachmentType === TypeOfAttachment.Link;

        if (level !== AttachmentPolicyLevel.Block && isWacPreviewSupportedOnPlatform) {
            if (this.isWacViewingEnabled(extension)) {
                useWac = true;
            }

            // If a cloudy doc is displayed in the WAC, WAC enabled the user to
            // download or print the document. So we need to prevent this if
            // the attachment policy doesn't allow download
            if (!this.directFileAccessEnabled && isCloudy) {
                useWac = false;
            }

            forceBrowserViewingFirst = this.isForceBrowserViewingFirst(useWac);

            if (useWac && this.attachmentPolicy.WacEditableFileTypes != null && extension != null) {
                if (attachmentType === TypeOfAttachment.File) {
                    wacEdit =
                        this.attachmentPolicy.WacEditableFileTypes.indexOf(extension) >= 0 ||
                        this.attachmentPolicy.WacConvertibleFileTypes.indexOf(extension) >= 0;
                } else {
                    wacEdit =
                        this.attachmentPolicy.WacEditableFileTypes.indexOf(extension) >= 0 &&
                        this.attachmentPolicy.WacConvertibleFileTypes.indexOf(extension) === -1;
                }
            }

            const isPreviewable: boolean =
                useWac || isImageExtension(extension) || isTextExtension(extension);

            if (!isPreviewable && !this.directFileAccessEnabled) {
                level = AttachmentPolicyLevel.AccessDisabled;
            }
        }

        const result: AttachmentPolicyInfo = {
            directFileAccessEnabled: this.directFileAccessEnabled,
            level: level,
            useWac: useWac,
            forceBrowserViewingFirst: forceBrowserViewingFirst,
            wacEdit: wacEdit,
        };

        return result;
    }

    isPdfPreviewEnabled() {
        return this.shouldTreatAsPublicLogon
            ? this.attachmentPolicy.WacViewingOnPublicComputersEnabled ||
                  this.attachmentPolicy.DirectFileAccessOnPublicComputersEnabled
            : this.attachmentPolicy.WacViewingOnPrivateComputersEnabled ||
                  this.attachmentPolicy.DirectFileAccessOnPrivateComputersEnabled;
    }

    private getFileAccessLevel(extension: string, mimeType: string): AttachmentPolicyLevel {
        let fileLevel: AttachmentPolicyLevel = this.fileTypeToPolicyMap[extension];
        if (!fileLevel) {
            fileLevel = AttachmentPolicyLevel.Undefined;
        }

        if (fileLevel === AttachmentPolicyLevel.Block) {
            return AttachmentPolicyLevel.Block;
        }

        const mimeLevel: AttachmentPolicyLevel = this.mimeTypeToPolicyMap[mimeType];
        if (mimeLevel === AttachmentPolicyLevel.Block) {
            return AttachmentPolicyLevel.Block;
        } else if (
            fileLevel === AttachmentPolicyLevel.ForceSave ||
            mimeLevel === AttachmentPolicyLevel.ForceSave
        ) {
            return AttachmentPolicyLevel.ForceSave;
        } else if (
            fileLevel === AttachmentPolicyLevel.Allow ||
            mimeLevel === AttachmentPolicyLevel.Allow
        ) {
            return AttachmentPolicyLevel.Allow;
        }

        return this.policyForUnknownTypes;
    }

    private isWacViewingEnabled(extension: string): boolean {
        const isWacEnabled: boolean = this.shouldTreatAsPublicLogon
            ? this.attachmentPolicy.WacViewingOnPublicComputersEnabled
            : this.attachmentPolicy.WacViewingOnPrivateComputersEnabled;
        return (
            isWacEnabled &&
            this.attachmentPolicy.WacViewableFileTypes &&
            this.attachmentPolicy.WacViewableFileTypes.indexOf(extension) >= 0
        );
    }

    private isForceBrowserViewingFirst(useWac: boolean): boolean {
        if (!useWac) {
            return false;
        }

        return this.shouldTreatAsPublicLogon
            ? this.attachmentPolicy.ForceWacViewingFirstOnPublicComputers
            : this.attachmentPolicy.ForceWacViewingFirstOnPrivateComputers;
    }

    private addPolicyIntoMap(
        map: { [key: string]: AttachmentPolicyLevel },
        list: readonly string[],
        level: AttachmentPolicyLevel
    ) {
        if (list) {
            list.forEach(key => {
                map[key] = level;
            });
        }
    }

    private createPolicyMap(
        block: readonly string[],
        forceSave: readonly string[],
        allow: readonly string[]
    ): { [key: string]: AttachmentPolicyLevel } {
        const map: { [key: string]: AttachmentPolicyLevel } = {};
        this.addPolicyIntoMap(map, allow, AttachmentPolicyLevel.Allow);
        this.addPolicyIntoMap(map, forceSave, AttachmentPolicyLevel.ForceSave);
        this.addPolicyIntoMap(map, block, AttachmentPolicyLevel.Block);
        return map;
    }
}

let attachmentPolicyChecker: AttachmentPolicyChecker = null;
let attachmentPolicyCheckerForPublicComputer: AttachmentPolicyChecker = null;

export function getUserAttachmentPolicyChecker(): AttachmentPolicyChecker {
    if (!attachmentPolicyChecker) {
        const userConfiguration = getUserConfiguration();
        const attachmentPolicy = getAttachmentPolicyBasedOnFlag();
        const shouldTreatAsPublicLogon: boolean =
            userConfiguration.SessionSettings.IsPublicLogon ||
            (userConfiguration.PublicComputersDetectionEnabled &&
                userConfiguration.SessionSettings.IsPublicComputerSession);

        attachmentPolicyChecker = new AttachmentPolicyChecker(
            attachmentPolicy,
            shouldTreatAsPublicLogon
        );

        if (shouldTreatAsPublicLogon) {
            attachmentPolicyCheckerForPublicComputer = attachmentPolicyChecker;
        }
    }

    return attachmentPolicyChecker;
}

export function getUserAttachmentPolicyCheckerForPublicComputer(): AttachmentPolicyChecker {
    if (!attachmentPolicyCheckerForPublicComputer) {
        const userConfiguration = getUserConfiguration();
        const shouldTreatAsPublicLogon: boolean =
            userConfiguration.SessionSettings.IsPublicLogon ||
            (userConfiguration.PublicComputersDetectionEnabled &&
                userConfiguration.SessionSettings.IsPublicComputerSession);

        if (shouldTreatAsPublicLogon) {
            return getUserAttachmentPolicyChecker();
        }

        attachmentPolicyCheckerForPublicComputer = new AttachmentPolicyChecker(
            getAttachmentPolicyBasedOnFlag(),
            true /* shouldTreatAsPublicLogon */
        );
    }

    return attachmentPolicyCheckerForPublicComputer;
}

export function getAttachmentPolicyInfo(
    attachment: AttachmentType,
    isWacPreviewSupportedOnPlatform: boolean
): AttachmentPolicyInfo {
    const extension = getExtensionFromFileName(attachment.Name);
    const contentType = attachment.ContentType;

    return getUserAttachmentPolicyChecker().getPolicyInfo(
        extension,
        contentType,
        isWacPreviewSupportedOnPlatform,
        getTypeOfAttachment(attachment)
    );
}

export function getAttachmentPolicyInfoForPublicComputer(
    attachment: AttachmentType,
    isWacPreviewSupportedOnPlatform: boolean
): AttachmentPolicyInfo {
    const extension = getExtensionFromFileName(attachment.Name);
    const contentType = attachment.ContentType;

    return getUserAttachmentPolicyCheckerForPublicComputer().getPolicyInfo(
        extension,
        contentType,
        isWacPreviewSupportedOnPlatform,
        getTypeOfAttachment(attachment)
    );
}
