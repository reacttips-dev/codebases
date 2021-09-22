import CLPAuditAction, {
    CLPAuditLogType,
    CLPAuditOperation,
    CLPAuditOperationTrigger,
    CLPAuditSensitivityChange,
} from 'owa-mail-protection-types/lib/schema/clp/CLPAuditAction';
import type CLPLabel from 'owa-mail-protection-types/lib/schema/CLPLabel';
export default function constructCLPAuditAction(
    label: CLPLabel,
    logType: CLPAuditLogType,
    operation: CLPAuditOperation,
    trigger: CLPAuditOperationTrigger,
    sensitivityChange?: CLPAuditSensitivityChange,
    prevLabel?: CLPLabel,
    justification?: string
): CLPAuditAction {
    const auditAction: CLPAuditAction = {
        operationDateTime: new Date().toISOString(),
        logType,
        operation,
        policyId: '',
        labelId: label ? label.id : '',
        currentLabelId: label ? label.id : '',
        trigger,
        previousLabelId: prevLabel ? prevLabel.id : '',
        justification: justification ? justification : '',
        sensitivityChange,
    };

    // Case: When automatically applying a label
    if (
        trigger == CLPAuditOperationTrigger.Recommended ||
        trigger == CLPAuditOperationTrigger.Automatic
    ) {
        auditAction.policyId = label.id;
    }
    return auditAction;
}
