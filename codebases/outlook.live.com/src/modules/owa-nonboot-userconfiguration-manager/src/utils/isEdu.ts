import { getNonBootUserConfigurationSync } from '../index';

export default function isEdu() {
    const { IsEdu = false } = getNonBootUserConfigurationSync() || {};
    return IsEdu;
}
