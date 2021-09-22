import getStore from '../store/store';
import type { ApplicationSettingsReport } from '../store/schema/ApplicationSettingsReport';

export default function getApplicationSettingsReport(): ApplicationSettingsReport | undefined {
    return getStore().report;
}
