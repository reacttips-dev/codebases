import { isReadingPanePositionRight } from '../selectors/readingPanePosition';
import { isFeatureEnabled } from 'owa-feature-flags';
import { getListViewDimensions } from './getListViewDimensions';
import { MAX_LIST_VIEW_WIDTH_SLV_RP } from '../internalConstants';

export function shouldShowSingleLineViewWithRightReadingPane(): boolean {
    return (
        isFeatureEnabled('mon-tri-slvWithRightReadingPane') &&
        isReadingPanePositionRight() &&
        isWidthTooLargeForCompactView()
    );
}

function isWidthTooLargeForCompactView(): boolean {
    const listViewWidth = getListViewDimensions().listViewWidth;

    return listViewWidth > MAX_LIST_VIEW_WIDTH_SLV_RP;
}
