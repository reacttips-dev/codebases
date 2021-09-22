import { assertNever } from 'owa-assert';
import { getOpxHostApp, O365_SHELL, WIDGET, OUTLOOK_DESKTOP } from 'owa-config';
import type { ActionSource } from 'owa-todo-types';

interface ToDoReferralData {
    utmSource: string;
    removeFromOwa?: boolean;
}

/** All values must be approved by To Do team before use */
type KnownReferralSourcePrefix = 'MyDay' | 'CalendarBoard' | 'ToDoWidget';

/** Track referrals to To Do app from control hosted in other apps */
export function getToDoReferralData(actionSource: ActionSource): ToDoReferralData {
    const referralSourcePrefix = getToDoReferralSourcePrefix(actionSource);
    if (referralSourcePrefix) {
        const hostApp = getOpxHostApp();
        if (hostApp === O365_SHELL) {
            return { utmSource: `${referralSourcePrefix}SuiteHeader` };
        }
        if (hostApp === OUTLOOK_DESKTOP) {
            return { utmSource: `${referralSourcePrefix}Desktop`, removeFromOwa: true };
        }
        if (hostApp === WIDGET && referralSourcePrefix === 'ToDoWidget') {
            return { utmSource: referralSourcePrefix };
        }
    }
    return { utmSource: '' };
}

function getToDoReferralSourcePrefix(
    actionSource: ActionSource
): KnownReferralSourcePrefix | undefined {
    switch (actionSource) {
        case 'TimePanelAgenda':
        case 'TimePanelTodo':
            return 'MyDay';
        case 'SpacesCalendarAsset':
        case 'SpacesTaskListAsset':
        case 'SpacesTaskAsset':
            return 'CalendarBoard';
        case 'TodoWidget':
            return 'ToDoWidget';
        case 'AgendaTodo':
        case 'CalendarSurface':
        case 'CalendarAgenda':
            return undefined;
        default:
            assertNever(actionSource);
    }
}
