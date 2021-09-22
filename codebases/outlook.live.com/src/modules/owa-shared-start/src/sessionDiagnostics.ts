import { setItem, getItem } from 'owa-local-storage';
import type { SessionData } from 'owa-service/lib/types/SessionData';
import WebSessionType from 'owa-service/lib/contract/WebSessionType';

interface SessionDiagnostics {
    puid?: string;
    tid?: string;
    mbx?: string;
    prem?: string;
    isCon?: boolean;
}

let diagnostics: SessionDiagnostics;
export function getSessionDiagnostics(): SessionDiagnostics {
    if (!diagnostics) {
        const cachedDiagnosticsString = getItem(window, 'BootDiagnostics');
        if (cachedDiagnosticsString) {
            try {
                diagnostics = JSON.parse(cachedDiagnosticsString);
            } catch {
                diagnostics = {};
            }
        } else {
            diagnostics = {};
        }
    }

    return diagnostics;
}

export function updateDiagnosticsOnSessionData(settings: SessionData) {
    const sessionSettings = settings.owaUserConfig?.SessionSettings;
    if (sessionSettings) {
        diagnostics = {
            puid: sessionSettings.UserPuid,
            tid: sessionSettings.ExternalDirectoryTenantGuid,
            mbx: sessionSettings.MailboxGuid,
            prem: sessionSettings.IsPremiumConsumerMailbox ? '1' : '0',
            isCon: sessionSettings.WebSessionType != WebSessionType.Business,
        };
    }

    setItem(window, 'BootDiagnostics', JSON.stringify(diagnostics));

    return settings;
}

export function getPuid(): string | undefined {
    return getSessionDiagnostics().puid;
}

export function getTenantGuid(): string | undefined {
    return getSessionDiagnostics().tid;
}

export function getMailboxGuid(): string | undefined {
    return getSessionDiagnostics().mbx;
}

export function getPremiumUser(): string | undefined {
    return getSessionDiagnostics().prem;
}

export function isConsumer(): boolean | undefined {
    return getSessionDiagnostics().isCon;
}
