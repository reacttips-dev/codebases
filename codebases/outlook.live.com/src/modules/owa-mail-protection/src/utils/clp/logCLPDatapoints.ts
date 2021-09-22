import { lazyLogCLPAriaDataPoint, logUsage } from 'owa-analytics';
import type {
    CLPLabelAriaProperties,
    CLPLabelChangeAriaProperties,
} from '../../store/schema/clp/CLPLabelAriaProperties';
import type CLPViewState from 'owa-mail-protection-types/lib/schema/clp/CLPViewState';
import type CLPLabel from 'owa-mail-protection-types/lib/schema/CLPLabel';
import type CLPLabelResponse from '../../store/schema/clp/CLPLabelResponse';
import { now, getISOString } from 'owa-datetime';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import GetAutoLabelResponse, {
    GetAutoLabelResponseStatus,
} from '../../store/schema/clp/GetAutoLabelResponse';

export function logDowngradeJustification(
    clpViewState: CLPViewState,
    downgradeJustification: string
) {
    const commonCLPAriaProperties = getCommonCLPAriaProperties(
        clpViewState.selectedCLPLabel,
        'Change'
    );
    const { originalCLPLabel, selectedCLPLabel } = clpViewState;
    const clpLabelChangeAriaProperties: CLPLabelChangeAriaProperties = {
        ...commonCLPAriaProperties,
        IsLabelChanged: true,
        LabelIdBefore: originalCLPLabel ? originalCLPLabel.id : null,
        IsProtectionChanged:
            originalCLPLabel && selectedCLPLabel
                ? originalCLPLabel.isEncryptingLabel != selectedCLPLabel.isEncryptingLabel
                : false,
        ProtectedBefore: originalCLPLabel?.isEncryptingLabel,
        UserJustification: downgradeJustification,
    };

    lazyLogCLPAriaDataPoint.importAndExecute(clpLabelChangeAriaProperties);
}

export function logReadCLPLabel(clpLabelToLog: CLPLabel) {
    const clpAriaProperties = getCommonCLPAriaProperties(clpLabelToLog, 'Discover');
    lazyLogCLPAriaDataPoint.importAndExecute(clpAriaProperties);
}

export function logCLPLabelLoadDatapoint(labelResp: CLPLabelResponse) {
    if (labelResp?.value && labelResp.value.length > 0) {
        logUsage('LoadCLPLabelOnBoot', {
            labelCount: labelResp.value.length,
        });
    }
}

export function logCLPComposeUsage(label: CLPLabel) {
    if (label) {
        logUsage('LoadCLPLabelComposeUsage', {
            isDefaultLabel: label.isDefault,
            isEncryptingLabel: label.isEncryptingLabel,
        });
    }
}

export function logCLPLabelChange(originalLabel: CLPLabel, newLabel?: CLPLabel) {
    if (newLabel && originalLabel) {
        logUsage('LoadCLPLabelChange', {
            isDowngrade: originalLabel.settingOrder > newLabel.settingOrder,
            isOriginalLabelDefault: originalLabel.isDefault,
        });
    } else if (originalLabel) {
        logUsage('LoadCLPLabelUnselect', {
            isOriginalLabelDefault: originalLabel.isDefault,
            isOriginalLabelEncrypting: originalLabel.isEncryptingLabel,
        });
    }
}

export function logCLPAutoLabelingEnabled(resp: GetAutoLabelResponse) {
    if (resp.status != GetAutoLabelResponseStatus.Unauthorized) {
        logUsage('CLPAutoLabelEnabled');
    }
}

export function logMandatoryLabelDialogShown() {
    logUsage('CLPMandatoryLabelDialogShown');
}

export function logAutoLabelApplied() {
    logUsage('CLPAutoLabelAutomaticApplied');
}

export function logRecommendedLabelShown() {
    logUsage('CLPAutoLabelRecommendedShown');
}

export function logRecommendedLabelApplied() {
    logUsage('CLPAutoLabelRecommendedApplied');
}

export function logRecommendedLabelDismissed() {
    logUsage('CLPAutoLabelRecommendedDismissed');
}

function getCommonCLPAriaProperties(
    clpLabelToLog: CLPLabel,
    operation: string
): CLPLabelAriaProperties {
    const {
        ExternalDirectoryTenantGuid,
        UserEmailAddress,
    } = getUserConfiguration().SessionSettings;
    return {
        CreationTime: getISOString(now()),
        Version: '1.1',
        Operation: operation,
        OrganizationId: ExternalDirectoryTenantGuid,
        UserId: UserEmailAddress,
        ApplicationId: '00000002-0000-0ff1-ce00-000000000000',
        ApplicationName: 'Outlook Web',
        DataState: 'Use',
        LabelId: clpLabelToLog ? clpLabelToLog.id : null,
        Protected: clpLabelToLog ? clpLabelToLog.isEncryptingLabel : null,
    };
}
