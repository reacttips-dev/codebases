import type CLPViewState from 'owa-mail-protection-types/lib/schema/clp/CLPViewState';
import type CLPLabel from 'owa-mail-protection-types/lib/schema/CLPLabel';
import getCLPLabelMethod from './getCLPLabelMethod';
import extendedPropertyType from 'owa-service/lib/factory/extendedPropertyType';
import extendedPropertyUri from 'owa-service/lib/factory/extendedPropertyUri';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import type Message from 'owa-service/lib/contract/Message';
import { now, getISOString } from 'owa-datetime';
import { logCLPComposeUsage } from '../../utils/clp/logCLPDatapoints';
import {
    LABEL_PROPERTY_NAME,
    LABEL_MODIFY_HEADER,
    EMPTY_LABEL_GUID,
} from '../../utils/clp/constants';

const CLP_LABEL_PREFIX = 'MSIP_Label';

interface LabelStamp {
    Enabled: string;
    SiteId: string;
    SetDate: string;
    Name: string;
    ContentBits: number;
    Method: string;
}

export default function stampCLPLabelInExtendedProperty(clpViewState: CLPViewState, item: Message) {
    let { selectedCLPLabel, nonTenantLabelString } = clpViewState;

    const headerValue = computeLabelModifyHeader(clpViewState);
    if (headerValue) {
        addExtendedPropertyToItem(
            LABEL_MODIFY_HEADER /*PropertyName*/,
            headerValue /*PropertyValue*/,
            item
        );
    }

    if (!selectedCLPLabel && !nonTenantLabelString) {
        return;
    }

    const labelPropertyValue = computeLabelPropertyValue(clpViewState);
    addExtendedPropertyToItem(LABEL_PROPERTY_NAME, labelPropertyValue, item);

    logCLPComposeUsage(selectedCLPLabel);
}

export function computeLabelPropertyValue(clpViewState: CLPViewState): string {
    let { selectedCLPLabel, nonTenantLabelString } = clpViewState;

    const tenantId = getUserConfiguration().SessionSettings.ExternalDirectoryTenantGuid;

    let selectedLabelString = '';
    if (selectedCLPLabel) {
        const labelSetDate = getISOString(now());
        const labelNameToStamp = selectedCLPLabel.displayName;

        const labelStampObj: LabelStamp = {
            Enabled: 'True',
            SiteId: tenantId,
            SetDate: labelSetDate,
            Name: labelNameToStamp,
            ContentBits: 0,
            Method: getCLPLabelMethod(clpViewState),
        };
        selectedLabelString = getLabelStampString(labelStampObj, selectedCLPLabel);
    }

    // This string will be in following format:
    // MSIP_LABEL_<labelId>_<propertyName>=<propertyValue>;MSIP_LABEL_<labelId>_<propertyName>=<propertyValue>
    const labelPropertyValue = nonTenantLabelString
        ? nonTenantLabelString + selectedLabelString
        : selectedLabelString;

    return labelPropertyValue;
}

export function computeLabelModifyHeader(clpViewState: CLPViewState) {
    let { selectedCLPLabel, originalCLPLabel } = clpViewState;
    if (!selectedCLPLabel && !originalCLPLabel) {
        //If there are neither of the labels exist, there is no change of labels
        //Skip
        return undefined;
    }

    let applyDefaultLabel = selectedCLPLabel && !originalCLPLabel && selectedCLPLabel.isDefault;

    //The header value format for modifying label is --> <fromLabel>;<toLabel>
    //If both labels are the same default label, set in the property the from label guid as empty
    return `${originalCLPLabel && !applyDefaultLabel ? originalCLPLabel.id : EMPTY_LABEL_GUID};${
        selectedCLPLabel ? selectedCLPLabel.id : EMPTY_LABEL_GUID
    }`;
}

function addExtendedPropertyToItem(propertyName: string, value: string, item: Message): void {
    const extendedProperty = extendedPropertyType({
        ExtendedFieldURI: extendedPropertyUri({
            PropertyName: propertyName,
            DistinguishedPropertySetId: 'InternetHeaders',
            PropertyType: 'String',
        }),
        Value: value,
    });

    if (item.ExtendedProperty) {
        item.ExtendedProperty.push(extendedProperty);
    } else {
        item.ExtendedProperty = [extendedProperty];
    }
}

function getLabelStampString(labelStampObj: LabelStamp, selectedCLPLabel: CLPLabel): string {
    let stampString = '';
    stampString = Object.keys(labelStampObj)
        .map(key => {
            return `${CLP_LABEL_PREFIX}_${selectedCLPLabel.id}_${key}=${labelStampObj[key]};`;
        })
        .join('');
    return stampString;
}
