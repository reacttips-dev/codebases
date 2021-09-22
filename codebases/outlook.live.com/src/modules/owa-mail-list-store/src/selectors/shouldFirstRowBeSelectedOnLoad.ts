import type { TableView } from '../index';
import { getUserConfiguration } from 'owa-session-store';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';

export default function shouldFirstRowBeSelectedOnLoad(tableView: TableView) {
    // First row should only be selected on load when the user option is set
    // and the user is not in the junk folder (don't want to accidentally open
    // malicious email). Also, if OWA policy setting MessagePreviewsDisabled
    // is set to true, disable selecting first row on load.
    const userConfig = getUserConfiguration();
    const disabledByPolicySetting = userConfig.PolicySettings.MessagePreviewsDisabled == true;
    return (
        userConfig.UserOptions.ShowReadingPaneOnFirstLoad &&
        !disabledByPolicySetting &&
        tableView.tableQuery.folderId !== folderNameToId('junkemail')
    );
}
