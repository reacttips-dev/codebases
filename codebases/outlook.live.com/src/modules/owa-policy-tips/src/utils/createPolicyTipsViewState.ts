import {
    policyTipsBlockDefault,
    policyTipsNotifyDefault,
} from './createPolicyTipsViewState.locstring.json';
import loc from 'owa-localize';
import type PolicyTipsViewState from '../store/schema/PolicyTipsViewState';

export default function createPolicyTipsViewState(): PolicyTipsViewState {
    return {
        inProgressPolicyMatch: createPolicyMatchWrapper(),
        succeededPolicyMatch: createPolicyMatchWrapper(),
        pendingPolicyMatch: createPolicyMatchWrapper(),
        isRequestInProgress: false,
        pendingRequests: false,
        handlerDisabled: false,
        isOverridden: false,
        overrideJustification: null,
        isReportedFalsePositive: false,
        complianceUrl: '',
        blockString: loc(policyTipsBlockDefault),
        notifyString: loc(policyTipsNotifyDefault),
        overrideString: loc(policyTipsBlockDefault),
    };
}

function createPolicyMatchWrapper() {
    return {
        itemId: null,
        scanResultData: null,
        scanResultMetaData: null,
        subjectChecksum: 0,
        contentChecksum: 0,
        eventTrigger: null,
        policyMatchDetails: [],
        attachmentIds: [],
    };
}
