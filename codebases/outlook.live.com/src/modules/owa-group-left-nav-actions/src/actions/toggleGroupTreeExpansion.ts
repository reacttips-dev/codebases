import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { updateUserConfigurationAndService } from 'owa-session-store/lib/utils/updateUserConfigurationAndService';

/**
 * Toggle the expansion of group tree and update both local and server user config
 */
export default function toggleGroupTreeExpansion() {
    const newValue = !getUserConfiguration().UserOptions.IsGroupsTreeCollapsed;
    updateUserConfigurationAndService(
        config => {
            config.UserOptions.IsGroupsTreeCollapsed = newValue;
        },
        [{ key: 'IsGroupsTreeCollapsed', valuetype: 'Boolean', value: [String(newValue)] }]
    );
}
