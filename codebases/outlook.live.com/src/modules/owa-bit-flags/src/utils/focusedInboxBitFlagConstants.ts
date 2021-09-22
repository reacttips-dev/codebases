import { getUserConfiguration, updateUserConfiguration } from 'owa-session-store';

// Intelligent features owned by FocusedInbox backend team
// such as Focused/Other, Inbox+, Nudge
// Please note that the first 2 bits and the 4th bit of this flag are used in JsMvvm to store the last visited pivot.
// The 3rd bit is still available.
export const enum FocusedInboxBitFlagsMasks {
    None = 0,
    HasUserClickedEasyTurnOffFocusedInbox = 1 << 3,
    IsNudgeDisabled = 1 << 5,
    // Do not exceed MAX_VALUE 1 << 31
}

/**
 * Gets a boolean to indicate if the n th bit is 1
 * @param bitMask represents the nth bit
 * @return true if nth bit is 1, false if 0
 */
export function getIsBitSet(bitMask: FocusedInboxBitFlagsMasks): boolean {
    let focusedOtherBitFlags =
        getUserConfiguration().ViewStateConfiguration?.FocusedInboxBitFlags ||
        FocusedInboxBitFlagsMasks.None;
    return !!(bitMask & focusedOtherBitFlags);
}

/**
 * Set bit flag
 * @param value set to 1 if true, 0 otherwise
 * @param bitMask represents the nth bit
 */
export function setBit(value: boolean, bitMask: FocusedInboxBitFlagsMasks) {
    // Already same value, no need to set again and update user config
    if (getIsBitSet(bitMask) === value) {
        return;
    }

    updateUserConfiguration(userConfig => {
        if (userConfig.ViewStateConfiguration?.FocusedInboxBitFlags) {
            if (value) {
                // Set the bit to 1
                userConfig.ViewStateConfiguration.FocusedInboxBitFlags |= bitMask;
            } else {
                // Clear the bit to 0
                userConfig.ViewStateConfiguration.FocusedInboxBitFlags &= ~bitMask;
            }
        }
    });
}
