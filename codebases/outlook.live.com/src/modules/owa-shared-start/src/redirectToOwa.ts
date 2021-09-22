import { redirectTo } from './redirect';
import getScopedPath from 'owa-url/lib/getScopedPath';

export function redirectToOwa(vdir: string, appName: string): true {
    let redirectPath = getScopedPath(`/${vdir}`) + '/';
    if (appName == 'Calendar' || appName == 'MiniCalendar') {
        redirectPath = redirectPath + '?path=/calendar';
    } else if (appName == 'People' || appName == 'MiniPeople') {
        redirectPath = redirectPath + '?path=/people';
    }
    return redirectTo(redirectPath);
}
