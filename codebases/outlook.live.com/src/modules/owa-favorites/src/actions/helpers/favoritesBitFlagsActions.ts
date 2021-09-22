import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { updateUserConfiguration } from 'owa-session-store/lib/actions/updateUserConfiguration';

export const enum FavoritesBitFlagsMasks {
    None = 0,
    FirstRunFavoritesMigration = 1 << 1,
    PersonaHeaderFirstRunSeen = 1 << 2,
    RoamingFavoritesMigrationFirstAttemptDone = 1 << 3,
    RoamingFavoritesMigrationCompleted = 1 << 4,
    NewsFavoriteDefaultAdded = 1 << 5,
    // Do not exceed MAX_VALUE 1 << 31
}

/**
 * Gets a boolean to indicate if the n th bit is 1
 * @param bitMask represents the nth bit
 * @return true if nth bit is 1, false if 0
 */
export function getIsBitEnabled(bitMask: FavoritesBitFlagsMasks): boolean {
    const favoritesBitFlags = getUserConfiguration().UserOptions.FavoritesBitFlags;
    return !!(bitMask & favoritesBitFlags);
}

/**
 * Set the n th bit value in local user configuration to 1 or 0 depends on the value
 * @param value set to 1 if true, 0 otherwise
 * @param bitMask represents the nth bit
 */
export function setBit(value: boolean, bitMask: FavoritesBitFlagsMasks) {
    updateUserConfiguration(userConfig => {
        if (value) {
            // Set the bit to 1
            userConfig.UserOptions.FavoritesBitFlags |= bitMask;
        } else {
            // Clear the bit to 0
            userConfig.UserOptions.FavoritesBitFlags &= ~bitMask;
        }
    });
}
