import {
    MAX_FOLDER_PANE_WIDTH,
    MAX_LIST_VIEW_WIDTH,
    MAX_LIST_VIEW_WIDTH_SLV_RP,
} from '../internalConstants';
import { BrowserWidthBucket, getBrowserWidthBucket } from 'owa-layout';
import { isFeatureEnabled } from 'owa-feature-flags';
/**
 * Gets the left nav max width for the current browser window width
 */
export function getLeftNavMaxWidth(): number {
    const browserWidthBucket = getBrowserWidthBucket();

    if (browserWidthBucket <= BrowserWidthBucket.From919_To999) {
        return 198;
    }
    if (browserWidthBucket <= BrowserWidthBucket.From1080_To1199) {
        return 236;
    }
    if (browserWidthBucket <= BrowserWidthBucket.From1366_To1399) {
        return 254;
    }
    if (browserWidthBucket <= BrowserWidthBucket.From1400_To1599) {
        return 300;
    }
    if (browserWidthBucket <= BrowserWidthBucket.From1600_Above) {
        return 320;
    }
    return MAX_FOLDER_PANE_WIDTH;
}

/**
 * Gets the compact list view max width for the current browser window width
 */
export function getCompactListViewMaxWidth(browserWidthBucket: BrowserWidthBucket): number {
    if (browserWidthBucket <= BrowserWidthBucket.From919_To999) {
        return 350;
    }
    if (browserWidthBucket <= BrowserWidthBucket.From1080_To1199) {
        return 380;
    }
    if (browserWidthBucket <= BrowserWidthBucket.From1366_To1399) {
        return 452;
    }
    if (browserWidthBucket <= BrowserWidthBucket.From1400_To1599) {
        return 540;
    }
    if (browserWidthBucket <= BrowserWidthBucket.From1600_Above) {
        return 574;
    }
    return MAX_LIST_VIEW_WIDTH;
}

/**
 * Gets the SLV max width, when there's a right reading pane, for the current browser window width
 */
export function getSLVListViewMaxWidth(browserWidthBucket: BrowserWidthBucket): number {
    if (browserWidthBucket <= BrowserWidthBucket.From919_To999) {
        return 350;
    }
    if (browserWidthBucket <= BrowserWidthBucket.From1080_To1199) {
        return 380;
    }
    if (browserWidthBucket <= BrowserWidthBucket.From1366_To1399) {
        return 452;
    }
    if (browserWidthBucket <= BrowserWidthBucket.From1400_To1599) {
        return 682;
    }
    if (browserWidthBucket <= BrowserWidthBucket.From1600_Above) {
        return 862;
    }
    if (browserWidthBucket <= BrowserWidthBucket.From1601_To1800) {
        return 863;
    }
    if (browserWidthBucket <= BrowserWidthBucket.From1801_To2000) {
        return 1063;
    }
    if (browserWidthBucket <= BrowserWidthBucket.From2001_To2200) {
        return 1263;
    }
    if (browserWidthBucket <= BrowserWidthBucket.From2201_To2400) {
        return 1463;
    }
    if (browserWidthBucket <= BrowserWidthBucket.From2401_To2600) {
        return 1663;
    }
    if (browserWidthBucket <= BrowserWidthBucket.From2601_To2800) {
        return 1863;
    }
    if (browserWidthBucket <= BrowserWidthBucket.From2801_To3000) {
        return 2063;
    }
    if (browserWidthBucket <= BrowserWidthBucket.From3001_Above) {
        return 2263;
    }

    return MAX_LIST_VIEW_WIDTH_SLV_RP;
}

/**
 * Gets the list view max width for the current browser window width
 */
export function getListViewMaxWidth(): number {
    const browserWidthBucket = getBrowserWidthBucket();

    // Allow a wider List View when using SLV with right RP
    if (isFeatureEnabled('mon-tri-slvWithRightReadingPane')) {
        return getSLVListViewMaxWidth(browserWidthBucket);
    }

    return getCompactListViewMaxWidth(browserWidthBucket);
}
