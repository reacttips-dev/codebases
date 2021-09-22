import { setShowListPane, setShowReadingPane } from 'owa-mail-layout';
import { mailSxSCleanupRouteHandler } from './mailSxSRouteHandler';
import selectRow from './selectRow';
import { isReadingPanePositionOff } from 'owa-mail-layout/lib/selectors/readingPanePosition';
import { logUsage } from 'owa-analytics';

export interface SearchRouteParameters {
    rowId?: string;
}

export default function searchRouteHandler(parameters: SearchRouteParameters) {
    if (isReadingPanePositionOff()) {
        logUsage('Search_ReadingPaneClosed', ['BrowserBackButton']);
        setShowReadingPane(false);
        setShowListPane(true);
    }

    if (parameters.rowId) {
        selectRow(parameters.rowId);
    }
}

export function searchCleanupRouteHandler(
    oldRoute?: string[],
    oldParameters?: any,
    newRoute?: string[],
    newParameters?: any
): boolean {
    const wasInSxS = !!oldRoute && oldRoute.some(value => value == 'sxs');

    if (wasInSxS) {
        mailSxSCleanupRouteHandler(oldRoute, oldParameters, newRoute, newParameters);
        setShowReadingPane(false);
    }

    return false;
}
