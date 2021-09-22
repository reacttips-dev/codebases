import { action } from 'satcheljs';
import type { SelectedCalendarListViewType } from 'owa-scenario-settings';

export const updateSelectedCalendarViewInStore = action(
    'updateSelectedCalendarViewInStore',
    (updatedView: SelectedCalendarListViewType) => ({
        updatedView,
    })
);
