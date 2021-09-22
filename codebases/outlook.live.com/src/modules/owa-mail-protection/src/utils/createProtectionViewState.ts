import type ProtectionViewState from 'owa-mail-protection-types/lib/schema/ProtectionViewState';
import type ItemId from 'owa-service/lib/contract/ItemId';
import type MessageClassificationType from 'owa-service/lib/contract/MessageClassificationType';
import type RightsManagementLicenseDataType from 'owa-service/lib/contract/RightsManagementLicenseDataType';
import createCLPViewState from './clp/createCLPViewState';
import createClassificationViewState from './classification/createClassificationViewState';

export default function createProtectionViewState(
    labelString: string,
    referenceItemId: ItemId,
    classification: MessageClassificationType,
    IRMData: RightsManagementLicenseDataType
): ProtectionViewState {
    return {
        clpViewState: createCLPViewState(labelString, referenceItemId),
        classificationViewState: createClassificationViewState(classification),
        IRMData,
    };
}
