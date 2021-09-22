import { getStore as getProtectionStore } from '../../store/protectionStore';
import type ItemCLPInfo from 'owa-mail-store/lib/store/schema/ItemCLPInfo';
import type CLPLabel from 'owa-mail-protection-types/lib/schema/CLPLabel';
import getInitialItemCLPInfo from './getInitialItemCLPInfo';
import { isNullOrWhiteSpace } from 'owa-string-utils';
const GUID_REGEX = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g;

function getExistingCLPInfo(existingLabelString: string): ItemCLPInfo {
    const existingCLPInfo = getInitialItemCLPInfo();
    if (!existingLabelString) {
        return existingCLPInfo;
    }

    const labelFields = existingLabelString.split(';');

    let existingLabels: { [key: string]: string[] } = {};

    for (let i = 0; i < labelFields.length; i++) {
        const curLabelField = labelFields[i];
        if (!curLabelField) {
            continue;
        }

        const idList = curLabelField.match(GUID_REGEX);
        if (!idList || idList.length == 0) {
            continue;
        }

        const id = idList[0];
        if (existingLabels[id]) {
            existingLabels[id].push(curLabelField);
        } else {
            existingLabels[id] = [curLabelField];
        }
    }

    const ids = Object.keys(existingLabels);
    for (let i = 0; i < ids.length; i++) {
        const setLabel = getLabelFromStore(ids[i]);
        if (setLabel) {
            existingCLPInfo.selectedLabel = setLabel;
            delete existingLabels[ids[i]];
            break;
        }
    }
    Object.values(existingLabels).forEach(labelFields => {
        existingCLPInfo.nonTenantLabelString += `${labelFields.join(';')};`;
    });

    return existingCLPInfo;
}

export function getLabelFromStore(id: string): CLPLabel {
    if (isNullOrWhiteSpace(id)) {
        return null;
    }
    const { clpLabels } = getProtectionStore();
    return getLabelFromId(id, clpLabels);
}

function getLabelFromId(id: string, labels: CLPLabel[]): CLPLabel {
    if (!labels) {
        return null;
    }

    for (let i = 0; i < labels.length; i++) {
        const label = labels[i];
        if (label.id == id) {
            return label;
        }
        const childLabelFromId = getLabelFromId(id, label.children);
        if (childLabelFromId) {
            return childLabelFromId;
        }
    }
    return null;
}

export default getExistingCLPInfo;
