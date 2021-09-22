import { getUserConfiguration } from 'owa-session-store';

export default function getIsDarkModeEnabledInUserSettings() {
    return getUserConfiguration().UserOptions.IsDarkModeTheme;
}
