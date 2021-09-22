import BrowserWidthBucket from '../store/schema/BrowserWidthBucket';
import { getBrowserWidth } from 'owa-config';
import { isFeatureEnabled } from 'owa-feature-flags';

/**
 * Gets the available width bucket
 */
export default function calculateAvailableWidthBucket(
    skipCache?: boolean,
    areDisplayAdsEnabled?: boolean,
    isFlexPaneShown?: boolean
): BrowserWidthBucket {
    let availableWidth = getBrowserWidth(skipCache);

    /**
     * Subtract the ads panel width to get the available width
     * to layout the app's main content
     */

    if (areDisplayAdsEnabled) {
        if (availableWidth > 1900) {
            availableWidth = availableWidth - 305;
        } else if (availableWidth > 990) {
            availableWidth = availableWidth - 165;
        }
    }

    if (isFlexPaneShown) {
        availableWidth = availableWidth - 320;
    }

    if (isFeatureEnabled('mon-tri-slvWithRightReadingPane')) {
        if (availableWidth >= 3001) {
            return BrowserWidthBucket.From3001_Above;
        }

        if (availableWidth >= 2801) {
            return BrowserWidthBucket.From2801_To3000;
        }

        if (availableWidth >= 2601) {
            return BrowserWidthBucket.From2601_To2800;
        }

        if (availableWidth >= 2401) {
            return BrowserWidthBucket.From2401_To2600;
        }

        if (availableWidth >= 2201) {
            return BrowserWidthBucket.From2201_To2400;
        }

        if (availableWidth >= 2001) {
            return BrowserWidthBucket.From2001_To2200;
        }

        if (availableWidth >= 1801) {
            return BrowserWidthBucket.From1801_To2000;
        }

        if (availableWidth >= 1601) {
            return BrowserWidthBucket.From1601_To1800;
        }
    }

    if (availableWidth >= 1600) {
        return BrowserWidthBucket.From1600_Above;
    }

    if (availableWidth >= 1400) {
        return BrowserWidthBucket.From1400_To1599;
    }

    if (availableWidth >= 1366) {
        return BrowserWidthBucket.From1366_To1399;
    }

    if (availableWidth >= 1301) {
        return BrowserWidthBucket.From1301_To1365;
    }

    if (availableWidth >= 1239) {
        return BrowserWidthBucket.From1239_To1300;
    }

    if (availableWidth >= 1200) {
        return BrowserWidthBucket.From1200_To1238;
    }

    if (availableWidth >= 1080) {
        return BrowserWidthBucket.From1080_To1199;
    }

    if (availableWidth >= 1000) {
        return BrowserWidthBucket.From1000_To1079;
    }

    if (availableWidth >= 919) {
        return BrowserWidthBucket.From919_To999;
    }

    if (availableWidth >= 900) {
        return BrowserWidthBucket.From900_To918;
    }

    if (availableWidth >= 866) {
        return BrowserWidthBucket.From866_To899;
    }

    if (availableWidth >= 769) {
        return BrowserWidthBucket.From769_To865;
    }

    if (availableWidth >= 692) {
        return BrowserWidthBucket.From692_To768;
    }

    if (availableWidth >= 686) {
        return BrowserWidthBucket.From686_To691;
    }

    if (availableWidth >= 580) {
        return BrowserWidthBucket.From580_To685;
    }

    if (availableWidth >= 555) {
        return BrowserWidthBucket.From555_To579;
    }

    if (availableWidth >= 542) {
        return BrowserWidthBucket.From542_To554;
    }

    if (availableWidth >= 500) {
        return BrowserWidthBucket.From500_To541;
    }

    if (availableWidth >= 419) {
        return BrowserWidthBucket.From419_To499;
    }

    return BrowserWidthBucket.From418_Below;
}
