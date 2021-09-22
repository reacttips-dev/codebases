import toggleDarkModeTheme from 'owa-dark-mode-option/lib/actions/toggleDarkModeTheme';
import { changeTheme } from 'owa-fabric-theme';
import { isFeatureEnabled } from 'owa-feature-flags';
import { getStore } from 'owa-mail-compose-store';
import { mutator } from 'satcheljs';

function toggleDarkModeOnViewStates(newDarkModeState: boolean) {
    getStore().viewStates.forEach(viewState => {
        viewState.isDarkMode = newDarkModeState;
    });
}

mutator(
    toggleDarkModeTheme,
    msg =>
        !isFeatureEnabled('settings-gqlDarkMode') &&
        toggleDarkModeOnViewStates(msg.isDarkModeEnabled)
);

mutator(
    changeTheme,
    msg => isFeatureEnabled('settings-gqlDarkMode') && toggleDarkModeOnViewStates(msg.isDarkTheme)
);
