import type DefaultSettings from '../DefaultSettings';
import { updateUserConfiguration } from 'owa-session-store/lib/actions/updateUserConfiguration';

export default function updateDefaultSettings(settings: DefaultSettings) {
    updateUserConfiguration(config => {
        if (config.UserOptions) {
            config.UserOptions.GlobalReadingPanePositionReact =
                settings.GlobalReadingPanePositionReact;
            config.UserOptions.ConversationSortOrderReact = settings.ConversationSortOrderReact;
            config.UserOptions.GlobalListViewTypeReact = settings.GlobalListViewTypeReact;
        }
    });
}
