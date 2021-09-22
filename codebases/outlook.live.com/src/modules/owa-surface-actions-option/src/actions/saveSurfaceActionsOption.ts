import saveHoverSurfaceActionService from '../services/saveHoverSurfaceActionService';
import getStore from '../store/store';
import type SurfaceActionsOptionState from '../store/schema/SurfaceActionsOptionState';
import { action } from 'satcheljs/lib/legacy';
import { getFallbackValueIfNull } from 'owa-options-core';
import { logUsage } from 'owa-analytics';
import {
    getOptionsForFeature,
    lazyCreateOrUpdateOptionsForFeature,
    OwsOptionsFeatureType,
    SurfaceActionsOptions,
} from 'owa-outlook-service-options';

export interface SaveSurfaceActionsOptionState {
    optionState: SurfaceActionsOptionState;
    userOptions?: SurfaceActionsOptions;
}

export default action('saveSurfaceActionsOption')(function saveSurfaceActionsOption(
    state: SaveSurfaceActionsOptionState = {
        optionState: getStore(),
        userOptions: getOptionsForFeature<SurfaceActionsOptions>(
            OwsOptionsFeatureType.SurfaceActions
        ),
    }
) {
    let { optionState, userOptions } = state;
    userOptions.readSurfaceActions = getFallbackValueIfNull(
        optionState.readSurfaceActions,
        userOptions.readSurfaceActions
    );
    userOptions.readSurfaceAddins = getFallbackValueIfNull(
        optionState.readSurfaceAddins,
        userOptions.readSurfaceAddins
    );
    userOptions.composeSurfaceActions = getFallbackValueIfNull(
        optionState.composeSurfaceActions,
        userOptions.composeSurfaceActions
    );
    userOptions.composeSurfaceAddins = getFallbackValueIfNull(
        optionState.composeSurfaceAddins,
        userOptions.composeSurfaceAddins
    );
    optionState.hoverSurfaceActions = getFallbackValueIfNull(
        optionState.hoverSurfaceActions,
        [] // Indicate that no options were selected
    );
    logUserSavedSettings(
        userOptions.readSurfaceActions.length,
        userOptions.readSurfaceAddins.length,
        userOptions.composeSurfaceActions.length,
        userOptions.composeSurfaceAddins.length,
        optionState.hoverSurfaceActions.length
    );

    return Promise.all([
        saveHoverSurfaceActionService(optionState.hoverSurfaceActions),
        lazyCreateOrUpdateOptionsForFeature.importAndExecute(
            OwsOptionsFeatureType.SurfaceActions,
            userOptions
        ),
    ]);
});

function logUserSavedSettings(
    readStaticCount: number,
    readAddinCount: number,
    composeStaticCount: number,
    composeAddinCount: number,
    hoverStaticCount: number
) {
    logUsage('CSACountUserSaveSettings', [
        truncateCount(readStaticCount),
        truncateCount(readAddinCount),
        truncateCount(composeStaticCount),
        truncateCount(composeAddinCount),
        truncateCount(hoverStaticCount),
    ]);
}

function truncateCount(value: number): number {
    // For datapoint aggregation in azure we can only have 24 unique possible values for any custom data key.
    // Accounting for 0, bucket all values >=23 as "23".
    return value >= 23 ? 23 : value;
}
