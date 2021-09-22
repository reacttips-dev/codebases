import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { updateUserConfiguration } from 'owa-session-store';

/* PLEASE DO NOT CHANGE THE BIT POSITIONS FOR THE FLAGS STORED IN ListViewBitFlagsMasks */
export const enum ListViewBitFlagsMasks {
    None = 0,
    DateHeadersDisabled = 1 << 1, // Flag to indicate if listview date headers are enabled or disabled. 0 => Enabled, 1 => Disabled.
    FolderPaneCollapsed = 1 << 2, // Flag to indicate if folder pane should be expanded. 0 => false, 1 => true.
    HideSenderImage = 1 << 3, // Flag to indicate if listview sender images are shown or not. 0 => Show, 1 => Hide.
    LikeSurfaceActionFirstRun = 1 << 4, // Flag to indicate if Like action was added to the RP surface
    IsCommercialUserInitialized = 1 << 5, // Flag to indicate whether Commercial user has already been initialized. 0 => First time in React, 1 => Initialized
    ShouldAutoReadInUnreadFilter = 1 << 6, // Flag to indicate whether auto mark as read is supported in unread filter. 0 => false (not supported), 1 => true (supported)
    HideSearchTopResults = 1 << 7, // Flag to indicate whether Top Results should be shown in Search results. 0 => true (hide top results), 1 => false (show top results)
    ExcludeDeletedItemsInSearch = 1 << 8, // Flag to indicate whether deleted items is to be included in search results. 0 => false (show deleted items), 1 => true (hide deleted items)
    DontShowStoragePopUp = 1 << 9, // Flag to indicate whether to show the storage warning popup dialog
    HideNews = 1 << 10, // Flag to indicate whether user has selected to hide the OWA News experience
    SpotlightDisabled = 1 << 11, // Flag to indicate if Spotlight feature is disabled
    isMonarchDensityInitialized = 1 << 12,
    // MAX = 1 << 31
}

/**
 * Gets a boolean to indicate if the n th bit is 1
 * @param bitMask represents the nth bit
 * @return true if nth bit is 1, false if 0
 */
export function getIsBitSet(bitMask: ListViewBitFlagsMasks): boolean {
    let listViewBitFlags =
        getUserConfiguration().ViewStateConfiguration?.ListViewBitFlags ||
        ListViewBitFlagsMasks.None;
    return !!(bitMask & listViewBitFlags);
}

/**
 * Set bit flag
 * @param value set to 1 if true, 0 otherwise
 * @param bitMask represents the nth bit
 */
export function setBit(value: boolean, bitMask: ListViewBitFlagsMasks) {
    // Already same value, no need to set again and update user config
    if (getIsBitSet(bitMask) === value) {
        return;
    }

    updateUserConfiguration(userConfig => {
        if (userConfig.ViewStateConfiguration?.ListViewBitFlags) {
            if (value) {
                // Set the bit to 1
                userConfig.ViewStateConfiguration.ListViewBitFlags |= bitMask;
            } else {
                // Clear the bit to 0
                userConfig.ViewStateConfiguration.ListViewBitFlags &= ~bitMask;
            }
        }
    });
}
