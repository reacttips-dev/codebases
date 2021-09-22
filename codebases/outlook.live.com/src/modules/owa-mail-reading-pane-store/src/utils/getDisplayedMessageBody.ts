import getAlternateBodyForIRM from './getAlternateBodyForIRM';
import type BodyContentType from 'owa-service/lib/contract/BodyContentType';
import type RightsManagementLicenseDataType from 'owa-service/lib/contract/RightsManagementLicenseDataType';

export default function getDisplayedMessageBody(
    rightsManagementLicenseData: RightsManagementLicenseDataType,
    displayedBody: BodyContentType
): string {
    const displayedContent = displayedBody ? displayedBody.Value : '';
    const alternateBodyForIRM = getAlternateBodyForIRM(rightsManagementLicenseData);
    return alternateBodyForIRM ? alternateBodyForIRM : displayedContent;
}
