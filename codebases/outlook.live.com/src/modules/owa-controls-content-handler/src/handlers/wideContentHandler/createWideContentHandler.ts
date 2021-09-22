import { isCurrentCultureRightToLeft } from 'owa-localize';
import { WideContentHandler } from 'owa-controls-content-handler-wide';
import * as trace from 'owa-trace';
import { onScaleElement, onUndoScaleElement } from './scaleControlManager';
import { WIDE_CONTENT_HOST_CLASS_NAME } from './WideContentHost';
import { isFeatureEnabled } from 'owa-feature-flags';

import styles from './ScaleElementStyles.scss';

export default function createWideContentHandler(): WideContentHandler {
    return new WideContentHandler(
        isFeatureEnabled('rp-wait-all-table-images-finish-loading'),
        WIDE_CONTENT_HOST_CLASS_NAME,
        styles.container,
        2000, // scaleElementsInterval
        () => isCurrentCultureRightToLeft(),
        onScaleElement,
        onUndoScaleElement,
        () => {}, // onAllElementsFinallyScaled
        traceOwaError
    );
}

function traceOwaError(message: string) {
    trace.errorThatWillCauseAlert(message);
}
