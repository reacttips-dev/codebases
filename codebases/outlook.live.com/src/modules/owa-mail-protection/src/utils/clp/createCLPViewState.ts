import CLPViewState, {
    LabelApplyMethod,
} from 'owa-mail-protection-types/lib/schema/clp/CLPViewState';
import type CLPLabel from 'owa-mail-protection-types/lib/schema/CLPLabel';
import type ItemId from 'owa-service/lib/contract/ItemId';
import getExistingCLPInfo from './getExistingCLPInfo';
import getDefaultClPLabel from './getDefaultCLPLabel';
import {
    CLPAuditLogType,
    CLPAuditOperation,
    CLPAuditOperationTrigger,
    CLPAuditSensitivityChange,
} from 'owa-mail-protection-types/lib/schema/clp/CLPAuditAction';
import constructCLPAuditAction from './constructCLPAuditAction';
import { isFeatureEnabled } from 'owa-feature-flags';

export default function createCLPViewState(
    labelString: string,
    referenceItemId: ItemId
): CLPViewState {
    let existingCLPInfo: { nonTenantLabelString: string; selectedLabel: CLPLabel } = null;
    existingCLPInfo = getExistingCLPInfo(labelString);
    let applyDefaultLabel = false;
    let clpAuditInitialActions = [];
    // Add auditing action for adopting reference item label
    if (existingCLPInfo && isFeatureEnabled('cmp-clp-audit')) {
        clpAuditInitialActions.push(
            constructCLPAuditAction(
                existingCLPInfo.selectedLabel,
                CLPAuditLogType.LabelAction,
                CLPAuditOperation.LabelApplied,
                CLPAuditOperationTrigger.Manual,
                CLPAuditSensitivityChange.Unchanged
            )
        );
    }

    if ((labelString && !existingCLPInfo.selectedLabel) || (!labelString && !referenceItemId)) {
        existingCLPInfo.selectedLabel = getDefaultClPLabel();
        //Add auditing action for default label;
        if (isFeatureEnabled('cmp-clp-audit') && existingCLPInfo.selectedLabel) {
            clpAuditInitialActions.push(
                constructCLPAuditAction(
                    existingCLPInfo.selectedLabel,
                    CLPAuditLogType.LabelAction,
                    CLPAuditOperation.LabelApplied,
                    CLPAuditOperationTrigger.Default,
                    CLPAuditSensitivityChange.Upgraded
                )
            );
        }
        if (existingCLPInfo.selectedLabel) {
            applyDefaultLabel = true;
        }
    }

    let autoLabelViewState = {
        inProgressAutoLabelRequest: null,
        pendingAutoLabelRequest: null,
        automatic: null,
        recommended: null,
        contentOfExistingAutoLabel: '',
        shouldKeepGettingAutoLabel: true,
    };

    return {
        justificationSent: false,
        tempCLPLabel: null,
        originalCLPLabel:
            existingCLPInfo?.selectedLabel && !applyDefaultLabel
                ? existingCLPInfo.selectedLabel
                : null,
        selectedCLPLabel: existingCLPInfo?.selectedLabel ? existingCLPInfo.selectedLabel : null,
        existingLabelString: labelString,
        nonTenantLabelString: existingCLPInfo?.nonTenantLabelString
            ? existingCLPInfo.nonTenantLabelString
            : '',
        labelApplyMethod: LabelApplyMethod.Default,
        autoLabelViewState,
        auditActionStack: clpAuditInitialActions,
    };
}
