import { messageListLabel } from './ListPane.locstring.json';
import loc from 'owa-localize';
import getMailListHeader from './getMailListHeader';
import { observer } from 'mobx-react-lite';
import { logUsage } from 'owa-analytics';
import { LightningId } from 'owa-lightning-core-v2/lib/LightningId';
import { isFeatureEnabled } from 'owa-feature-flags';
import { TurnOffFocusedOtherItem } from 'owa-mail-focus-other-off-view';
import { isFocusedInboxEnabled } from 'owa-mail-triage-common';
import {
    getFocusedFilterForTable,
    listViewStore,
    isFolderPaused,
    getViewFilterForTable,
    MailFolderTableQuery,
} from 'owa-mail-list-store';
import MailList from 'owa-mail-list-view/lib/components/MailList';
import { SpotlightFre } from 'owa-mail-list-view';
import { InboxPausedBanner, MailListColumnHeaders } from '../index';
import FocusedViewFilter from 'owa-service/lib/contract/FocusedViewFilter';
import { NotificationBarHost } from 'owa-notification-bar';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import * as React from 'react';
import {
    getDataMinMaxDimensionsForListView,
    isReadingPanePositionRight,
    shouldRenderColumnHeaders,
} from 'owa-mail-layout';
import { lazyResetFocus } from 'owa-mail-focus-manager';
import { FlaggedEmailTaskLightning } from 'owa-mail-flagged-email-task-lightning';
export interface ListPaneProps {
    tableViewId: string;
    tabBar: JSX.Element | null;
    className?: string;
    shouldShowHeader: boolean;
    style?: any;
    styleSelectorAsPerUserSettings: string;
}

const ListPane = observer(function ListPane(props: ListPaneProps) {
    const {
        tableViewId,
        tabBar,
        className,
        shouldShowHeader,
        style,
        styleSelectorAsPerUserSettings,
    } = props;
    const tableView = listViewStore.tableViews.get(tableViewId);
    const {
        dataWidthMin,
        dataHeightMin,
        dataWidthMax,
        dataHeightMax,
    } = getDataMinMaxDimensionsForListView();

    const isImportantFilter =
        (tableView.tableQuery as MailFolderTableQuery)?.scenarioType == 'spotlight';

    return (
        <div
            role={'region'}
            aria-label={loc(messageListLabel)}
            tabIndex={-1}
            style={style}
            className={className}
            data-min-width={dataWidthMin}
            data-min-height={dataHeightMin}
            data-max-width={dataWidthMax}
            data-max-height={dataHeightMax}>
            {!shouldShowHeader && getMailListHeader(tableViewId, styleSelectorAsPerUserSettings)}
            {shouldRenderTurnOffFocusedOther(tableViewId) && (
                <TurnOffFocusedOtherItem lid={LightningId.FocusOtherOff} when={lightupDialogs} />
            )}
            {isFolderPaused(tableView.tableQuery.folderId) && (
                <InboxPausedBanner
                    styleSelectorAsPerUserSettings={styleSelectorAsPerUserSettings}
                />
            )}
            {shouldRenderTasksFlaggedEmailLightningUI(tableViewId) && <FlaggedEmailTaskLightning />}
            {isImportantFilter && <SpotlightFre />}
            {shouldRenderColumnHeaders(tableViewId) && (
                <MailListColumnHeaders
                    styleSelectorAsPerUserSettings={styleSelectorAsPerUserSettings}
                    tableViewId={tableViewId}
                    folderId={tableView.tableQuery.folderId}
                />
            )}
            <MailList
                key="listpane_list"
                tableViewId={tableViewId}
                styleSelectorAsPerUserSettings={styleSelectorAsPerUserSettings}
            />
            {isReadingPanePositionRight() && (
                <NotificationBarHost
                    hostId={'MailModuleNotificationBarHost'}
                    onNotificationBlur={lazyResetFocus.importAndExecute}
                />
            )}
            {tabBar}
        </div>
    );
});
export default ListPane;

// Turn off focus other dialog is shown for users who have focus/other on. It's shown for
// a maximum of 3 sessions then never again. If a user has focus/other off, we still need to
// render the dialog so we can silently remove the lightning id for that user to prevent the
// dialog from ever showing in the future.
function shouldRenderTurnOffFocusedOther(tableViewId: string) {
    const tableView = listViewStore.tableViews.get(tableViewId);

    // If user is not in flight or not in inbox, we do not want to show the dialog or
    // remove their lightning id.
    if (
        !isFeatureEnabled('tri-turnOffFocusedOther') ||
        tableView.tableQuery.folderId != folderNameToId('inbox')
    ) {
        return false;
    }

    // Special case: the user has F/O on but have not received an email in Other yet.
    // The pivot will not be shown until they receive an email for other, and we only
    // want to show it when that happens. Until then, don't render the component so we
    // remove their lightning id without them seeing it
    if (isFocusedInboxEnabled() && getFocusedFilterForTable(tableView) == FocusedViewFilter.None) {
        logUsage('TurnOffFO_NoItemsInOther');
        return false;
    }

    // Cases where we render the component
    // 1) User has focus/other on and we want to show it and increment their session count
    // 2) User has focus/other off and we silently remove their lightning id from the render
    //    function without actually showing the component
    return true;
}

function shouldRenderTasksFlaggedEmailLightningUI(tableViewId: string) {
    const tableView = listViewStore.tableViews.get(tableViewId);
    // Other task and time panel settings are lazily loaded/ checked in FlaggedEmailTaskLightning
    // to determine whether or not show the view
    return getViewFilterForTable(tableView) === 'Flagged';
}

function lightupDialogs(lightUp: () => void) {
    lightUp();
}

export type { TableView } from 'owa-mail-list-store';
