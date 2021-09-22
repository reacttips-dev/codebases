import getUserConfiguration from '../actions/getUserConfiguration';

/**
 * Prefer using `getDensityMode` from `owa-fabric-theme` package for context-agnostic behavior
 *
 * This selector should only be used when looking up OWA user config setting persisted on backend
 * (which may not match the current value being used to style UX content for the user)
 */
export default function getUserDisplayDensityMode() {
    return getUserConfiguration().UserOptions?.DisplayDensityMode;
}
