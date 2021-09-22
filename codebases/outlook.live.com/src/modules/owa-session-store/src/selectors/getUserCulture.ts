import getUserConfiguration from '../actions/getUserConfiguration';

/**
 * Prefer using `getCurrentCulture` from `owa-localize` package for context-agnostic behavior
 *
 * This selector should only be used when looking up OWA user config setting persisted on backend
 * (which may not match the current value being used to localize UX content for the user)
 */
export default function getUserCulture(): string | undefined {
    const userConfiguration = getUserConfiguration();
    return userConfiguration.SessionSettings?.UserCulture;
}
