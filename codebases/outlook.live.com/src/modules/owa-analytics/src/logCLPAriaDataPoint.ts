import { createEventProperties, getLogger } from './AriaWrapper';
import { getCLPAriaTenantTokens } from './utils/getMailAriaTenantTokens';

export function logCLPAriaDataPoint(clpAriaData: Object) {
    let clpAriaEventProperties = createEventProperties('CLPLabel' /* EventName */);
    Object.keys(clpAriaData).map(key => {
        clpAriaEventProperties.properties[key] = clpAriaData[key];
    });
    getLogger(getCLPAriaTenantTokens()).logEvent(clpAriaEventProperties);
}
