import {
    infoMarkedAsConfidential,
    infoMarkedAsPrivate,
    infoMarkedAsPersonal,
    sensitivityConfidential,
    sensitivityPrivate,
    sensitivityPersonal,
    sensitivityNormal,
} from './messageSensitivityUtilities.locstring.json';
import loc from 'owa-localize';
import type { IDropdownOption } from '@fluentui/react/lib/Dropdown';
import type SensitivityType from 'owa-service/lib/contract/SensitivityType';

// If for whatever reason the SensitivityType contract changes, this must be updated manually.
const SENSITIVITY_TYPES = ['Normal', 'Personal', 'Private', 'Confidential'];

function isSensititivyOption(str: string): str is SensitivityType {
    return SENSITIVITY_TYPES.indexOf(str) >= 0;
}

export function getSensitivityTypeForKey(key: string): SensitivityType {
    if (isSensititivyOption(key)) {
        return key;
    } else {
        return null;
        // Invalid situation.
    }
}

export function getSensitivityInfoBarMessage(sensitivity: SensitivityType): string[] {
    switch (sensitivity) {
        case 'Confidential':
            return [loc(infoMarkedAsConfidential)];
        case 'Private':
            return [loc(infoMarkedAsPrivate)];
        case 'Personal':
            return [loc(infoMarkedAsPersonal)];
        case 'Normal':
        default:
            return [];
    }
}

function getSensitivityStringForKey(key: string): string {
    switch (key) {
        case 'Confidential':
            return loc(sensitivityConfidential);
        case 'Private':
            return loc(sensitivityPrivate);
        case 'Personal':
            return loc(sensitivityPersonal);
        case 'Normal':
            return loc(sensitivityNormal);
    }
    return '';
}

export function getSensitivityOptions(): IDropdownOption[] {
    return SENSITIVITY_TYPES.map(item => ({ key: item, text: getSensitivityStringForKey(item) }));
}
