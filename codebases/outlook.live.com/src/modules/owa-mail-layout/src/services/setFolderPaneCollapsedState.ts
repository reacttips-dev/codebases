import { ListViewBitFlagsMasks, setBit } from 'owa-bit-flags/lib/utils/listViewBitFlagsUtil';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { lazyUpdateUserConfigurationService } from 'owa-session-store/lib/lazyFunctions';

/**
 * Persist the folder pane collapsed state
 */
export default function setFolderPaneCollapsedState(isCollapsed: boolean) {
    const viewStateConfiguration = getUserConfiguration().ViewStateConfiguration;
    if (viewStateConfiguration) {
        setBit(isCollapsed /* value */, ListViewBitFlagsMasks.FolderPaneCollapsed);
        lazyUpdateUserConfigurationService.importAndExecute(
            [
                {
                    key: 'ListViewBitFlags',
                    valuetype: 'Integer32',
                    value: [`${viewStateConfiguration.ListViewBitFlags}`],
                },
            ],
            'OWA.ViewStateConfiguration'
        );
    }
}
