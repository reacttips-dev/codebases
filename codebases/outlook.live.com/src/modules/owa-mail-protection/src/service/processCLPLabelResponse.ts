import type CLPLabel from 'owa-mail-protection-types/lib/schema/CLPLabel';
import type {
    default as CLPResponse,
    LabelRawResponse,
} from '../store/schema/clp/CLPLabelResponse';
import { getCurrentCulture } from 'owa-localize';
import type CLPUserLabelStore from '../store/schema/clp/CLPUserLabelStore';
import { isFeatureEnabled } from 'owa-feature-flags';

export default function (CLPResponse: CLPResponse): CLPUserLabelStore {
    if (!CLPResponse || !CLPResponse.value) {
        return { clpLabels: [], learnMoreUrl: '', hasMandatoryLabel: false };
    }

    let { value } = CLPResponse;
    const userLanguage = getCurrentCulture()?.toLowerCase();
    let idLabelMap: { [key: string]: CLPLabel } = {};
    let learnMoreUrl: string = '';
    let hasMandatoryLabel: boolean = false;

    value.forEach(label => {
        if (!learnMoreUrl && label.PolicySetting_customurl) {
            learnMoreUrl = label.PolicySetting_customurl;
        }
        if (
            !(
                isFeatureEnabled('cmp-clp-outlookcustomfield') &&
                label.PolicySetting_disablemandatoryinoutlook?.toLowerCase() == 'true'
            )
        ) {
            if (!hasMandatoryLabel && label.PolicySetting_mandatory?.toLowerCase() == 'true') {
                hasMandatoryLabel = true;
            }
        }
        idLabelMap[label.Id] = convertCLPResponseLabelToLabelObject(label, userLanguage);
    });

    Object.keys(idLabelMap).forEach(labelId => {
        const label = idLabelMap[labelId];
        if (label.parentId) {
            let labelParentObject = idLabelMap[label.parentId];
            if (labelParentObject) {
                label.infobarDisplayText = `${labelParentObject.displayName}\\${label.displayName}`;
                labelParentObject.children.push(label);
            }
            // There are at most two levels of labels.
            // So it's safe to remove the label from the map
            // if a label is already been added as other label's chilren
            delete idLabelMap[labelId];
        }
    });

    return {
        clpLabels: sortUserLabels(Object.values(idLabelMap)),
        learnMoreUrl,
        hasMandatoryLabel,
    };
}

function convertCLPResponseLabelToLabelObject(
    labelResp: LabelRawResponse,
    userLanguage: string
): CLPLabel {
    const respDisplayName =
        labelResp[`LocaleSetting_DisplayName_${userLanguage}`] ||
        labelResp[`DisplayName_${userLanguage}`] ||
        labelResp['DisplayName_Fallback'];

    // displayName is used to build a menu item; it is needed to make sure that it doesn't match the divider menu item name.
    const displayName = respDisplayName == '-' ? ` ${respDisplayName}` : respDisplayName;

    const tooltip =
        labelResp[`LocaleSetting_Tooltip_${userLanguage}`] || labelResp['Setting_tooltip'];

    // if outlookdefaultlabel is set, it overrides the default label setting
    const isDefault =
        isFeatureEnabled('cmp-clp-outlookcustomfield') &&
        labelResp.PolicySetting_outlookdefaultlabel &&
        labelResp.PolicySetting_outlookdefaultlabel.length > 0
            ? labelResp.PolicySetting_outlookdefaultlabel == labelResp.Id
            : labelResp.PolicySetting_default?.toLowerCase() == 'true';
    return {
        id: labelResp.Id,
        parentId: labelResp.ParentId,
        displayName: displayName,
        infobarDisplayText: displayName,
        tooltip: tooltip, // this is currently not being localized, since the backend localization is not ready yet.
        settingOrder: parseInt(labelResp.Setting_order),
        isDefault: isDefault,
        isEncryptingLabel: labelResp.RightsProtectMessage_Disabled
            ? labelResp.RightsProtectMessage_Disabled?.toLowerCase() == 'false'
            : false,
        isAutoLabelingOn:
            labelResp.AutoLabeling_SensitiveTypeIds &&
            labelResp.AutoLabeling_SensitiveTypeIds.length > 0,
        children: [],
        isLabelEnabled:
            labelResp.Setting_enabled.toLowerCase() == 'true' && !labelIsNotOutlookLabel(labelResp),
        shouldShowDowngradeDialog:
            labelResp.PolicySetting_requiredowngradejustification?.toLowerCase() == 'true',
    };
}

function labelIsNotOutlookLabel(labelResp: LabelRawResponse) {
    const protectionType = labelResp.RightsProtectMessage_ProtectionType?.toLowerCase();
    const dnfFlag = labelResp.RightsProtectMessage_donotforward?.toLowerCase();
    const eoFlag = labelResp.RightsProtectMessage_encryptonly?.toLowerCase();
    if (isFeatureEnabled('cmp-clp-enableencryptonlylabel')) {
        return protectionType == 'userdefined' && dnfFlag == 'false' && eoFlag == 'false';
    }
    return protectionType == 'userdefined' && dnfFlag == 'false';
}

function sortUserLabels(clpLabels: CLPLabel[]): CLPLabel[] {
    if (!clpLabels) {
        return null;
    }
    clpLabels.sort(compareLabels);
    clpLabels.forEach(label => {
        if (label.children) {
            label.children.sort(compareLabels);
        }
    });

    return clpLabels;
}

function compareLabels(labelA: CLPLabel, labelB: CLPLabel): number {
    return labelA.settingOrder - labelB.settingOrder;
}
