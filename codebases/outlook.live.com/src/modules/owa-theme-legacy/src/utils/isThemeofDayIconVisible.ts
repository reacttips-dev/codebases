import { isWin10, isWindows, isBrowserEdge, isBrowserEDGECHROMIUM } from 'owa-user-agent';
import { isFeatureEnabled } from 'owa-feature-flags';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';

export default function isThemeofDayIconVisible(): boolean {
    let userConfig = getUserConfiguration();

    if (
        !isFeatureEnabled('fwk-edgeEnabledThemes') ||
        isFeatureEnabled('fwk-suiteThemes') ||
        userConfig?.UserOptions?.IsDarkModeTheme ||
        (isWindows() && !isWin10() && !isBrowserEDGECHROMIUM() && !isBrowserEdge())
    ) {
        return false;
    }

    return true;
}
