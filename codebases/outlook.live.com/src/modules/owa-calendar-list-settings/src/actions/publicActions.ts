import { action } from 'satcheljs';
import type { SelectedCalendarListViewType } from 'owa-scenario-settings';
import { addDatapointConfig } from 'owa-analytics-actions';

export const updateSelectedCalendarView = action(
    'updateSelectedCalendarView',
    (updatedView: SelectedCalendarListViewType) => ({
        updatedView,
    })
);

export const updateIsTaskListSelected = action('updateIsTaskListSelected', (isSelected: boolean) =>
    addDatapointConfig(
        {
            name: 'updateIsTaskListSelected',
            customData: { isSelected: isSelected },
        },
        {
            isSelected,
        }
    )
);

export const updateIsDatePickerExpanded = action(
    'updateIsDatePickerExpanded',
    (isExpanded: boolean) =>
        addDatapointConfig(
            {
                name: 'updateIsDatePickerExpanded',
                customData: { isExpanded: isExpanded },
            },
            {
                isExpanded,
            }
        )
);
