import { action } from 'satcheljs';
import type BrowserWidthBucket from '../store/schema/BrowserWidthBucket';
import type LayoutChangeSource from '../store/schema/LayoutChangeSource';

export const onAvailableWidthBucketChanged = action(
    'onAvailableWidthBucketChanged',
    (availableWidthBucket: BrowserWidthBucket, source: LayoutChangeSource) => ({
        availableWidthBucket,
        source,
    })
);
