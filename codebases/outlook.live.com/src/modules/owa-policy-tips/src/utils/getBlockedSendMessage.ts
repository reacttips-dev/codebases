import {
    policyTipsBlockedSendDialogOverrideWarning,
    policyTipsBlockedSendDialogRecipientsWarning,
} from './getBlockedSendMessage.locstring.json';
import loc from 'owa-localize';
import DlpPolicyTipAction from 'owa-service/lib/contract/DlpPolicyTipAction';
import type PolicyTipsViewState from '../store/schema/PolicyTipsViewState';

import { getHighestPriorityPolicyTipMatchDetail } from './getHighestPriorityPolicyTipMatchDetail';

export function getBlockedSendMessage(viewState: PolicyTipsViewState): string {
    const matchDetail = getHighestPriorityPolicyTipMatchDetail(viewState.succeededPolicyMatch);
    if (!matchDetail) {
        return null;
    }

    switch (matchDetail.Action) {
        case DlpPolicyTipAction.RejectUnlessSilentOverride:
        case DlpPolicyTipAction.RejectUnlessExplicitOverride:
            return loc(policyTipsBlockedSendDialogOverrideWarning);
        case DlpPolicyTipAction.RejectUnlessFalsePositiveOverride:
        case DlpPolicyTipAction.RejectMessage:
            return loc(policyTipsBlockedSendDialogRecipientsWarning);
        case DlpPolicyTipAction.NotifyOnly:
            return null;
    }
}
