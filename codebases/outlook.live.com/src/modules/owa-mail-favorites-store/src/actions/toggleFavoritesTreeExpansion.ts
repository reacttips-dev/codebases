import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { updateUserConfigurationAndService } from 'owa-session-store/lib/utils/updateUserConfigurationAndService';

/**
 * Expand or collapse the Favorites tree ty setting the store isExpand value
 */
export default function toggleFavoritesTreeExpansion() {
    const newValue = !getUserConfiguration().UserOptions.IsFavoritesFolderTreeCollapsed;
    updateUserConfigurationAndService(
        config => {
            config.UserOptions.IsFavoritesFolderTreeCollapsed = newValue;
        },
        [{ key: 'IsFavoritesFolderTreeCollapsed', valuetype: 'Boolean', value: [String(newValue)] }]
    );
}
