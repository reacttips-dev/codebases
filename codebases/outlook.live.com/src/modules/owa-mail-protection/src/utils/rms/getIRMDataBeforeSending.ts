import type ProtectionViewState from 'owa-mail-protection-types/lib/schema/ProtectionViewState';
import { protectionStore } from '../..//store/protectionStore';
import type RightsManagementLicenseDataType from 'owa-service/lib/contract/RightsManagementLicenseDataType';

export default function getIRMDataBeforeSending(
    viewState: ProtectionViewState
): RightsManagementLicenseDataType {
    if (!viewState) {
        return null;
    }
    const { IRMData } = viewState;
    return IRMData &&
        (!IRMData.RmsTemplateId || protectionStore.rmsTemplates.get(IRMData.RmsTemplateId))
        ? IRMData
        : null;
}
