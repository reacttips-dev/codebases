import {
    irm_featureDisabled,
    irm_corruptProtectedMessage,
    irm_viewRightNotGranted,
    irm_serverMisConfigured,
    irm_reachNotConfigured,
    irm_preLicensingFailure,
    irm_externalLicensingDisabled,
    irm_useLicenseAcquisitionFailed,
    irm_rmsErrorCode,
    irm_outlookTrialDownloadUrl,
    irm_microsoftOfficeOutlook,
    irm_downloadOutlookFreeTrialHtml,
} from './getAlternateBodyForIRM.locstring.json';
import loc, { format } from 'owa-localize';
import RightsManagementFailureCode from 'owa-mail-store/lib/store/schema/RightsManagementFailureCode';
import type RightsManagementLicenseDataType from 'owa-service/lib/contract/RightsManagementLicenseDataType';

export default function getDefaultBodyForIrm(
    rightsManagementLicenseData: RightsManagementLicenseDataType
): string {
    let alternateBody: string;

    if (
        rightsManagementLicenseData?.RightsManagedMessageDecryptionStatus &&
        rightsManagementLicenseData.RightsManagedMessageDecryptionStatus !=
            RightsManagementFailureCode.Success
    ) {
        switch (rightsManagementLicenseData.RightsManagedMessageDecryptionStatus) {
            case RightsManagementFailureCode.InternalLicensingDisabled:
            case RightsManagementFailureCode.FeatureDisabled:
            case RightsManagementFailureCode.NotSupported:
                alternateBody = format(loc(irm_featureDisabled), getOutlookDownloadURL());
                break;

            case RightsManagementFailureCode.CorruptData:
                alternateBody = loc(irm_corruptProtectedMessage);
                break;

            case RightsManagementFailureCode.UserRightNotGranted:
                alternateBody = format(loc(irm_viewRightNotGranted), getOutlookDownloadURL());
                break;

            case RightsManagementFailureCode.ServerRightNotGranted:
                alternateBody = loc(irm_serverMisConfigured);
                break;

            case RightsManagementFailureCode.FailedToDownloadMexData:
            case RightsManagementFailureCode.FailedToExtractTargetUriFromMex:
                alternateBody = loc(irm_reachNotConfigured);
                break;

            case RightsManagementFailureCode.PreLicenseAcquisitionFailed:
            case RightsManagementFailureCode.InvalidLicensee:
                alternateBody = loc(irm_preLicensingFailure);
                break;

            case RightsManagementFailureCode.ExternalLicensingDisabled:
                alternateBody = loc(irm_externalLicensingDisabled);
                break;

            case RightsManagementFailureCode.UseLicenseAcquisitionFailed:
                alternateBody = loc(irm_useLicenseAcquisitionFailed);
                break;

            case RightsManagementFailureCode.MissingLicense:
            // For now, treating missing license as generic error.
            // Once we add retry logic, we'll show a "Loading" instead.
            // O15:2313547
            default:
                // For now, just show the error code.
                // Once we have the error message and error location, we should show that with a "Details" button.
                // O15:2313547
                alternateBody = format(
                    loc(irm_rmsErrorCode),
                    rightsManagementLicenseData.RightsManagedMessageDecryptionStatus
                );
                break;
        }
    }

    return alternateBody;
}

function getOutlookDownloadURL() {
    const anchor = format(
        '<a href="{0}" target="_blank">{1}</a>',
        loc(irm_outlookTrialDownloadUrl),
        loc(irm_microsoftOfficeOutlook)
    );
    return format(loc(irm_downloadOutlookFreeTrialHtml), anchor);
}
