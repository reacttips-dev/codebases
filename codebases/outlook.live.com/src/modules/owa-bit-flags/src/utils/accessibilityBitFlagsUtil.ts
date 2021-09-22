import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';

/* PLEASE DO NOT CHANGE THE BIT POSITIONS FOR THE FLAGS STORED IN AccessibilityBitFlagsMasks */
export const enum AccessibilityBitFlagsMasks {
    None = 0,
    ShouldNotDismissLatestNotification = 1 << 1, // Flag to indicate if latest notification should stay on screen instead of being auto-dismnissed
    // MAX = 1 << 31
}

/**
 * Gets a boolean to indicate if the n th bit is 1
 * @param bitMask represents the nth bit
 * @return true if nth bit is 1, false if 0
 */
export function getIsBitSet(bitMask: AccessibilityBitFlagsMasks): boolean {
    let accessibilityBitFlags =
        getUserConfiguration().ViewStateConfiguration?.AccessibilityBitFlags ||
        AccessibilityBitFlagsMasks.None;
    return !!(bitMask & accessibilityBitFlags);
}
