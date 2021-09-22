import { orchestrator } from 'satcheljs';
import { onAvailableWidthBucketChanged } from '../actions/onAvailableWidthBucketChanged';
import { setIsFlexPaneShown } from 'owa-suite-header-store';
import LayoutChangeSource from '../store/schema/LayoutChangeSource';
import calculateAvailableWidthBucket from '../utils/calculateAvailableWidthBucket';
import { getAreDisplayAdsEnabled } from '../selectors/getAreDisplayAdsEnabled';
import setBrowserWidthBucket from '../mutators/setBrowserWidthBucket';

orchestrator(setIsFlexPaneShown, actionMessage => {
    const newAvailableWidthBucket = calculateAvailableWidthBucket(
        false,
        getAreDisplayAdsEnabled(),
        actionMessage.isShown
    );
    setBrowserWidthBucket(newAvailableWidthBucket);
    onAvailableWidthBucketChanged(
        newAvailableWidthBucket,
        LayoutChangeSource.OwaSuiteHeaderFlexPane
    );
});
