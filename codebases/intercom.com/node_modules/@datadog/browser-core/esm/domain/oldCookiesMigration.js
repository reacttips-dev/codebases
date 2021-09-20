import { getCookie } from '../browser/cookie';
import { persistSession } from './sessionManagement';
export var OLD_SESSION_COOKIE_NAME = '_dd';
export var OLD_RUM_COOKIE_NAME = '_dd_r';
export var OLD_LOGS_COOKIE_NAME = '_dd_l';
// duplicate values to avoid dependency issues
export var RUM_SESSION_KEY = 'rum';
export var LOGS_SESSION_KEY = 'logs';
/**
 * This migration should remain in the codebase as long as older versions are available/live
 * to allow older sdk versions to be upgraded to newer versions without compatibility issues.
 */
export function tryOldCookiesMigration(sessionCookie) {
    var sessionString = sessionCookie.get();
    var oldSessionId = getCookie(OLD_SESSION_COOKIE_NAME);
    var oldRumType = getCookie(OLD_RUM_COOKIE_NAME);
    var oldLogsType = getCookie(OLD_LOGS_COOKIE_NAME);
    if (!sessionString) {
        var session = {};
        if (oldSessionId) {
            session.id = oldSessionId;
        }
        if (oldLogsType && /^[01]$/.test(oldLogsType)) {
            session[LOGS_SESSION_KEY] = oldLogsType;
        }
        if (oldRumType && /^[012]$/.test(oldRumType)) {
            session[RUM_SESSION_KEY] = oldRumType;
        }
        persistSession(session, sessionCookie);
    }
}
//# sourceMappingURL=oldCookiesMigration.js.map