import { windowTitleFormatString } from './initializeWindowTitle.locstring.json';
import loc, { format } from 'owa-localize';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';

export function getWindowTitle(getModuleName: () => string): string {
    return format(
        loc(windowTitleFormatString),
        getModuleName(),
        getUserConfiguration()?.SessionSettings?.UserDisplayName || ''
    );
}
