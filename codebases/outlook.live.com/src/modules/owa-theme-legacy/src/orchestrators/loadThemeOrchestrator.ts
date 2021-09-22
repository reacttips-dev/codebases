import { normalizeThemeRequest } from '../utils/normalizeThemeId';
import { orchestrator } from 'satcheljs';
import { changeTheme as changeFabricTheme } from 'owa-fabric-theme';
import loadThemeAction from '../actions/loadTheme';
import getPalette from '../selectors/getPalette';
import setCurrentTheme from '../mutators/setCurrentTheme';
import setCssVariablesOnDocument from '../utils/setCssVariablesOnDocument';
import { isUserPersonalizationAllowed, onLoadTheme } from 'owa-theme-common';

export default orchestrator(loadThemeAction, message => {
    let { themeId, isDarkTheme } = normalizeThemeRequest(
        message.themeId,
        message.isDarkTheme,
        typeof message.themesAllowed === 'boolean'
            ? message.themesAllowed
            : isUserPersonalizationAllowed()
    );

    const palette = getPalette(themeId, isDarkTheme);

    setCurrentTheme(themeId);

    changeFabricTheme(palette, !!isDarkTheme);
    setCssVariablesOnDocument();
    onLoadTheme();
});
