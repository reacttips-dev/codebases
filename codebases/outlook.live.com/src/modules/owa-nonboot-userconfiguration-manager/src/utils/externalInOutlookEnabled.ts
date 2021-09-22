import { getNonBootUserConfigurationSync } from '../index';

export default function externalInOutlookEnabled() {
    const { ExternalInOutlookEnabled = false } = getNonBootUserConfigurationSync() || {};
    return ExternalInOutlookEnabled;
}
