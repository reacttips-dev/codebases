import { logUsage } from 'owa-analytics';
import { LightningId } from '../LightningId';

export function logLightningUsage(event: string, id: string) {
    Object.keys(LightningId).some(key => {
        if (LightningId[key] == id) {
            logUsage(event, { key: key, id: id }, { isCore: true });
            return true;
        }
        return false;
    });
}
