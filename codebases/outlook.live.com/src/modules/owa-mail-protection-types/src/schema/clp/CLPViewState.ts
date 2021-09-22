import type CLPLabel from '../CLPLabel';
import type CLPAuditAction from './CLPAuditAction';
import type AutoLabelViewState from './AutoLabelViewState';

interface CLPViewState {
    justificationSent: boolean;
    tempCLPLabel?: CLPLabel; // When mandatory label show up use this temp to store selected label.
    selectedCLPLabel: CLPLabel;
    originalCLPLabel?: CLPLabel;
    existingLabelString?: string;
    nonTenantLabelString?: string;
    labelApplyMethod: LabelApplyMethod;
    autoLabelViewState: AutoLabelViewState;
    auditActionStack: CLPAuditAction[];
}

export enum LabelApplyMethod {
    Manual = 'manual',
    Automatic = 'automatic',
    Default = 'default',
}

export default CLPViewState;
