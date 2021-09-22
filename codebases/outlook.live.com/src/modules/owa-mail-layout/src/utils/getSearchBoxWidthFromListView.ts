import { MAX_LIST_VIEW_WIDTH, MAX_LIST_VIEW_WIDTH_SLV_RP } from '../internalConstants';
import { getListViewDimensions } from './getListViewDimensions';
import { isFeatureEnabled } from 'owa-feature-flags';

/**
 * Gets the current width the of search box based on the list view (when using right reading pane)
 * @returns the number of pixels
 */
export default function getSearchBoxWidthFromListView(): number {
    return Math.min(
        getListViewDimensions().listViewWidth,
        isFeatureEnabled('mon-tri-slvWithRightReadingPane')
            ? MAX_LIST_VIEW_WIDTH_SLV_RP
            : MAX_LIST_VIEW_WIDTH
    );
}
