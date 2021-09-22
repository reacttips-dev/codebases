import type ProtectionStore from 'owa-mail-protection-types/lib/schema/ProtectionStore';
import { ObservableMap } from 'mobx';
import { createStore } from 'satcheljs';
import type ComplianceConfiguration from 'owa-service/lib/contract/ComplianceConfiguration';
import type MessageClassificationType from 'owa-service/lib/contract/MessageClassificationType';

const protectionStoreData: ProtectionStore = {
    clpLabels: [],
    learnMoreUrl: '',
    hasMandatoryLabel: false,
    rmsTemplates: new ObservableMap<string, ComplianceConfiguration>(),
    messageClassifications: new ObservableMap<string, MessageClassificationType>(),
};
export const getStore = createStore<ProtectionStore>('protection', protectionStoreData);
export const protectionStore = getStore();
