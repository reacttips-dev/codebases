import { orchestrator } from 'satcheljs';
import sendCLPAuditRequest from 'owa-mail-protection/lib/utils/clp/sendCLPAuditRequest';
import { isFeatureEnabled } from 'owa-feature-flags';
import onSendMessageSucceeded from '../actions/onSendMessageSucceeded';

export default orchestrator(onSendMessageSucceeded, actionMessage => {
    if (
        isFeatureEnabled('cmp-clp') &&
        isFeatureEnabled('cmp-clp-audit') &&
        !actionMessage.isGroupViewState
    ) {
        sendCLPAuditRequest(actionMessage.clpViewState);
    }
});
