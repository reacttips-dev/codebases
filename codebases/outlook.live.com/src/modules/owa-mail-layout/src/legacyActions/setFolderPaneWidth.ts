import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { updateUserConfigurationAndService } from 'owa-session-store/lib/utils/updateUserConfigurationAndService';

/**
 * Sets the folder pane width in the local user config and makes a call to update it in server userConfig
 * @param newFolderPaneWidth the width of navigation pane
 */
export default function setFolderPaneWidth(newFolderPaneWidth: number) {
    const storedFolderPaneWidth = getUserConfiguration().UserOptions?.NavigationBarWidth;

    // Width did not change
    if (storedFolderPaneWidth == newFolderPaneWidth) {
        return;
    }

    updateUserConfigurationAndService(
        config => {
            /* Update in local user config */
            if (config.UserOptions) {
                config.UserOptions.NavigationBarWidth = newFolderPaneWidth;
            }
        },
        [{ key: 'NavigationBarWidth', valuetype: 'Integer32', value: [`${newFolderPaneWidth}`] }]
    );
}
