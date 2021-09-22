import moveReadingPaneToTab from '../actions/moveReadingPaneToTab';
import findSecondaryReadingPaneTabById from '../utils/findSecondaryReadingPaneTabById';
import ensureSecondaryReadingPaneTabHandler from '../utils/secondaryReadingPaneTabHandler';
import type { ClientItemId } from 'owa-client-ids';
import getSelectedTableView from 'owa-mail-list-store/lib/utils/getSelectedTableView';
import type { InstrumentationContext } from 'owa-search/lib/types/InstrumentationContext';
import type ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import { orchestrator } from 'satcheljs';
import {
    lazyActivateTab,
    lazyAddTab,
    lazySetTabIsShown,
    TabType,
    TabState,
    SecondaryReadingPaneTabData,
} from 'owa-tab-store';

export const moveReadingPaneToTabOrchestrator = orchestrator(moveReadingPaneToTab, message => {
    let {
        id,
        subject,
        categories,
        makeActive,
        instrumentationContext,
        listViewType,
        makeHidden,
    } = message;

    const tab = findSecondaryReadingPaneTabById(id.Id);

    if (tab) {
        if (!makeHidden && tab.state == TabState.Hidden) {
            lazySetTabIsShown.importAndExecute(tab, true /* isShown */);
        }

        if (makeActive) {
            lazyActivateTab.importAndExecute(tab);
        }
    }

    if (!tab) {
        moveReadingPaneToNewTab(
            id,
            subject,
            categories,
            makeActive,
            instrumentationContext,
            listViewType,
            makeHidden
        );
    }
});

function moveReadingPaneToNewTab(
    id: ClientItemId,
    subject: string,
    categories: string[],
    makeActive: boolean,
    instrumentationContext: InstrumentationContext,
    listViewType?: ReactListViewType,
    makeHidden?: boolean
) {
    const tableView = getSelectedTableView();
    const secondaryReadingPaneTabData: SecondaryReadingPaneTabData = {
        id,
        subject: subject,
        categories: categories,
        listViewType: listViewType != undefined ? listViewType : tableView.tableQuery.listViewType,
        instrumentationContext: instrumentationContext,
        hideWhenSameWithPrimary: !makeActive,
    };

    ensureSecondaryReadingPaneTabHandler();
    lazyAddTab.importAndExecute(
        TabType.SecondaryReadingPane,
        !makeHidden /* isShown */,
        makeActive,
        secondaryReadingPaneTabData
    );
}
