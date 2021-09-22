import type DlpPolicyMatchDetail from 'owa-service/lib/contract/DlpPolicyMatchDetail';
import DlpPolicyTipAction from 'owa-service/lib/contract/DlpPolicyTipAction';
import type PolicyMatchWrapper from '../store/schema/PolicyMatchWrapper';

export function getHighestPriorityPolicyTipMatchDetail(
    policyMatchWrapper: PolicyMatchWrapper
): DlpPolicyMatchDetail {
    const policyMatchDetails = policyMatchWrapper.policyMatchDetails;
    // Sort by action priority first
    // Amount the same action priority we sort by match priority
    return policyMatchDetails.slice().sort((detailA, detailB) => {
        const actionPriDiff =
            getDefaultActionPriority(detailB.Action) - getDefaultActionPriority(detailA.Action);

        if (actionPriDiff == 0) {
            // Action Priority is the same
            if (detailA.MatchPriority == null) {
                if (detailB.MatchPriority == null) {
                    // Neither A nor B has matchPriority
                    // retain order
                    return actionPriDiff;
                } else {
                    // A does not have match priority B has match priority
                    // Sort B before A;
                    return 1;
                }
            } else {
                if (detailB.MatchPriority == null) {
                    // B does not have match priority A has match priority
                    // Sort A before B;
                    return -1;
                } else {
                    // Both has matching priority, sort in asecending order
                    // Sort A before B;
                    return detailA.MatchPriority - detailB.MatchPriority;
                }
            }
        }
        return actionPriDiff;
    })[0];
}

function getDefaultActionPriority(action: DlpPolicyTipAction): number {
    switch (action) {
        case DlpPolicyTipAction.NotifyOnly:
            return 0;
        case DlpPolicyTipAction.RejectUnlessFalsePositiveOverride:
        case DlpPolicyTipAction.RejectUnlessSilentOverride:
        case DlpPolicyTipAction.RejectUnlessExplicitOverride:
            return 1;
        case DlpPolicyTipAction.RejectMessage:
            return 2;
        default:
            return 3;
    }
}
