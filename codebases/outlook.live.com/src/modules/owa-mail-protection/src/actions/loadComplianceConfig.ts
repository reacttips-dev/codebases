import type ComplianceConfiguration from 'owa-service/lib/contract/ComplianceConfiguration';
import getComplianceConfigurationOperation from 'owa-service/lib/operation/getComplianceConfigurationOperation';
import isEncryptionEnabled from 'owa-encryption-common/lib/utils/isEncryptionEnabled';
import type RightsManagementLicenseDataType from 'owa-service/lib/contract/RightsManagementLicenseDataType';
import { getStore } from '../store/protectionStore';
import { mutatorAction } from 'satcheljs';

export default function loadComplianceConfig() {
    if (isEncryptionEnabled() && getStore().rmsTemplates.size == 0) {
        // Async load is allowed, no need to await/return here
        getComplianceConfigurationOperation().then(applyComplianceConfig);
    }
}

const applyComplianceConfig = mutatorAction(
    'ApplyComplianceConfig',
    (result: ComplianceConfiguration) => {
        const protectionStore = getStore();
        result.RmsTemplates.forEach(template => {
            const rmsTemplate: RightsManagementLicenseDataType = {
                TemplateDescription: template.Description,
                TemplateName: template.Name,
                RmsTemplateId: template.Id,
            };
            protectionStore.rmsTemplates.set(template.Id, rmsTemplate);
        });
        result.MessageClassifications.forEach(classification => {
            protectionStore.messageClassifications.set(classification.Id, classification);
        });
    }
);
