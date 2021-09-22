import { getStore } from '../store/store';
import BrowserWidthBucket from '../store/schema/BrowserWidthBucket';
import LayoutChangeSource from '../store/schema/LayoutChangeSource';
import setBrowserWidthBucket from '../mutators/setBrowserWidthBucket';
import calculateAvailableWidthBucket from './calculateAvailableWidthBucket';
import { onAvailableWidthBucketChanged } from '../actions/onAvailableWidthBucketChanged';
import setAreDisplayAdsEnabled from '../mutators/setAreDisplayAdsEnabled';
import { getAreDisplayAdsEnabled } from '../selectors/getAreDisplayAdsEnabled';
import { isFlexPaneShown } from 'owa-suite-header-store';

export function initializeDynamicLayout(areDisplayAdsEnabled: boolean) {
    window.addEventListener('resize', onWindowResize);

    setAreDisplayAdsEnabled(areDisplayAdsEnabled);

    // Calculate once on boot.
    setAvailableWidthBucket(LayoutChangeSource.Init);
}

/**
 * On Window resize handler.
 */
function onWindowResize() {
    setAvailableWidthBucket(LayoutChangeSource.WindowResize);
}

/**
 * Update the layout on the available app width change
 * @param source source of the width change
 */
function setAvailableWidthBucket(source: LayoutChangeSource) {
    // Update available app width bucket
    const availableWidthBucket = calculateAvailableWidthBucket(
        source != LayoutChangeSource.Init,
        getAreDisplayAdsEnabled(),
        isFlexPaneShown()
    );

    // No-op if the width bucket did not change
    if (getStore().browserWidthBucket == availableWidthBucket) {
        return;
    }

    setBrowserWidthBucket(availableWidthBucket);

    if (availableWidthBucket <= BrowserWidthBucket.From418_Below) {
        addOverflowOnBody();
    } else {
        hideOverflowOnBody();
    }

    /* action to listen to for consumers to know that the availableWidthBucket had updated,
     * passes new availableWidthBucket
     */
    onAvailableWidthBucketChanged(availableWidthBucket, source);
}

export function addOverflowOnBody() {
    if (window.document?.body) {
        document.body.style.overflowX = 'auto';
    }
}

export function hideOverflowOnBody() {
    if (window.document?.body) {
        document.body.style.overflow = 'hidden';
    }
}
