import { orchestrator } from 'satcheljs';
import toggleDarkModeTheme from 'owa-dark-mode-option/lib/actions/toggleDarkModeTheme';
import onCommitThemeChange from 'owa-options-actions/lib/onCommitThemeChange';

const DARK_MODE_THEME_NAME = 'dark';

orchestrator(toggleDarkModeTheme, actionMessage => {
    updateSkypeThemeOrchestrator(DARK_MODE_THEME_NAME);
});

orchestrator(onCommitThemeChange, actionMessage => {
    updateSkypeThemeOrchestrator(actionMessage.themeId);
});

export default function updateSkypeThemeOrchestrator(themeName: string) {
    if (window.swc && typeof window.swc.setTheme === 'function') {
        window.swc.setTheme(themeName);
    }
}
