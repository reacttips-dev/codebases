import extensibilityState from '../store/store';
import { action } from 'satcheljs/lib/legacy';

const MINOR_KEY = 'IsMinor';

export default action('setCompliance')(function setCompliance(complianceStr: string) {
    const compliance = JSON.parse(complianceStr);
    if (compliance && compliance.hasOwnProperty(MINOR_KEY)) {
        extensibilityState.compliance.isMinor = compliance[MINOR_KEY];
    }
});
