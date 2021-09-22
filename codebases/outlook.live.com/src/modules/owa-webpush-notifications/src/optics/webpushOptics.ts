import { logUsage } from 'owa-analytics';

const DATAPOINT_NAME: string = 'WebPushSetup';

window.webPushOptics = {};

export function logRadioButtonClicked(result: boolean) {
    addToMap('vipMailEnabled', result);
}

export function logMailOptionClicked(result: boolean) {
    addToMap('mailOption', result);
}

export function logReminderOptionClicked(result: boolean) {
    addToMap('reminderOption', result);
}

export function logEnableStart(source: string) {
    addToMap('enabled', source);
}

export function logDisableStart(source: string, allClients: boolean) {
    addToMap('disabled', source);
    addToMap('allClients', allClients);
}

export function logWorkFlowEnd(result: boolean) {
    if (window.webPushOptics.enabled || window.webPushOptics.disabled) {
        addToMap('result', result);
        flushLog();
    }
}

export function logLightningIgnored() {
    addToMap('lightning', 'ignored');
    flushLog();
}

export function logPermission(permission: NotificationPermission) {
    addToMap('permission', permission);
}

export function logRoamingPromptResult(result: number) {
    addToMap('roaming', result);
}

function flushLog() {
    logUsage(DATAPOINT_NAME, window.webPushOptics, { isCore: true });
    window.webPushOptics = {};
}

function addToMap(key: string, value: string | number | boolean) {
    window.webPushOptics[key] = value;
}
