import { Module } from 'owa-workloads/lib/store/schema/Module';

export function determineModule(): Module {
    const pathname = window?.location?.pathname;
    if (pathname) {
        const pathnameParts = pathname.split('/');
        if (checkDeepLink('mail', pathnameParts)) {
            return Module.MailDeepLink;
        } else if (checkDeepLink('calendar', pathnameParts)) {
            return Module.CalendarDeepLink;
        } else if (pathname.indexOf('/calendar') == 0) {
            return Module.Calendar;
        } else if (pathname.indexOf('/people') == 0) {
            return Module.People;
        } else if (pathname.indexOf('/files') == 0) {
            return Module.FilesHub;
        } else if (pathname.indexOf('/spaces') == 0) {
            return Module.OutlookSpaces;
        } else if (pathname.indexOf('/orgexplorer') == 0) {
            return Module.OrgExplorer;
        } else if (pathname.indexOf('/host') == 0) {
            return Module.AppHost;
        }
    }
    return Module.Mail;
}

function checkDeepLink(vdir: string, pathnameParts: string[]): boolean {
    return (
        pathnameParts[1] == vdir &&
        (pathnameParts[2]?.indexOf('deeplink') == 0 || pathnameParts[3]?.indexOf('deeplink') == 0)
    );
}
