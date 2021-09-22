import DlpPolicyTipAction from 'owa-service/lib/contract/DlpPolicyTipAction';
import type PolicyTipsViewState from '../store/schema/PolicyTipsViewState';
import { getHighestPriorityPolicyTipMatchDetail } from './getHighestPriorityPolicyTipMatchDetail';

export function isValidToSend(viewState: PolicyTipsViewState): boolean {
    const matchDetail = getHighestPriorityPolicyTipMatchDetail(viewState.succeededPolicyMatch);
    if (!matchDetail) {
        return true;
    }

    switch (matchDetail.Action) {
        case DlpPolicyTipAction.NotifyOnly:
            return true;
        case DlpPolicyTipAction.RejectUnlessSilentOverride:
        case DlpPolicyTipAction.RejectUnlessExplicitOverride:
            return viewState.isOverridden || viewState.isReportedFalsePositive;
        case DlpPolicyTipAction.RejectUnlessFalsePositiveOverride:
        case DlpPolicyTipAction.RejectMessage:
            return viewState.isReportedFalsePositive;
    }
}
