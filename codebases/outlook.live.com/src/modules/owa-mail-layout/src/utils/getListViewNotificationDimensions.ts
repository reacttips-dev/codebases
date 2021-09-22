import { getListViewDimensions } from './getListViewDimensions';
import { MIN_LIST_VIEW_WIDTH } from '../internalConstants';

const LIST_VIEW_NOTIFICATION_PADDING: number = 24;

export function getListViewNotificationDimensions() {
    return {
        minWidth: MIN_LIST_VIEW_WIDTH - LIST_VIEW_NOTIFICATION_PADDING,
        maxWidth: getListViewDimensions().listViewWidth - LIST_VIEW_NOTIFICATION_PADDING,
    };
}
