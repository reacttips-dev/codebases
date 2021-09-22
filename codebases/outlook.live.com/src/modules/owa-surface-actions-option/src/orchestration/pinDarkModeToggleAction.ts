import toggleDarkModeThemeAction from 'owa-dark-mode-option/lib/actions/toggleDarkModeTheme';
import { orchestrator } from 'satcheljs';
import { getFallbackValueIfNull } from 'owa-options-core';
import getStore from '../store/store';
import {
    getOptionsForFeature,
    SurfaceActionsOptions,
    OwsOptionsFeatureType,
} from 'owa-outlook-service-options';
import selectSurfaceActionsOption from '../actions/selectSurfaceActionsOption';
import saveSurfaceActionsOption from '../actions/saveSurfaceActionsOption';

export default function pinDarkModeToggleAction(isDarkModeTheme: boolean) {
    // Get the currently pinned actions.
    let pinnedActions = getFallbackValueIfNull(
        getStore().readSurfaceActions,
        getOptionsForFeature<SurfaceActionsOptions>(OwsOptionsFeatureType.SurfaceActions)
            .readSurfaceActions
    ).slice();

    // Select ToggleDarkMode and save the option.
    selectSurfaceActionsOption(
        'readSurfaceActions',
        pinnedActions,
        'ToggleDarkMode',
        isDarkModeTheme
    );
    saveSurfaceActionsOption();
}

orchestrator(toggleDarkModeThemeAction, msg => pinDarkModeToggleAction(msg.isDarkModeEnabled));
