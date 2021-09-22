import { isFeatureEnabled } from 'owa-feature-flags';
import { getOfficeOnlineAppFromExtension, OfficeOnlineApp } from 'owa-file';
import { FileProviders } from 'owa-attachment-constants/lib/fileProviders';

export function calculateUseJsApi(
    isReferenceAttachment: boolean,
    providerType: string,
    fileName: string
): boolean {
    if (
        isReferenceAttachment &&
        providerType === FileProviders.ONE_DRIVE_PRO &&
        (isFeatureEnabled('doc-SxS-jsApi-ODB-Base') ||
            isFeatureEnabled('doc-SxS-jsApi-ODB-BaseNoEditString') ||
            isFeatureEnabled('doc-SxS-jsApi-ODB-Readonly'))
    ) {
        const extension = fileName && fileName.substring(fileName.lastIndexOf('.'));
        const officeOnlineApp: OfficeOnlineApp | null = getOfficeOnlineAppFromExtension(extension);
        switch (officeOnlineApp) {
            case OfficeOnlineApp.Word:
                return isFeatureEnabled('doc-SxS-jsApi-ODB-Word');
            case OfficeOnlineApp.Excel:
                return isFeatureEnabled('doc-SxS-jsApi-ODB-Excel');
            case OfficeOnlineApp.PowerPoint:
                // We only support Word and Excel in JsAPI readonly mode.
                return (
                    !isFeatureEnabled('doc-SxS-jsApi-ODB-Readonly') &&
                    isFeatureEnabled('doc-SxS-jsApi-ODB-PowerPoint')
                );
        }
    }

    return false;
}
