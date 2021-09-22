import { action } from 'satcheljs';
import { addDatapointConfig } from 'owa-analytics-actions';
import type { ActionSource } from 'owa-mail-store';
import FocusedViewFilter from 'owa-service/lib/contract/FocusedViewFilter';
import { listViewStore } from 'owa-mail-list-store';

// Select focused view filter
export const selectFocusedViewFilter = action(
    'selectFocusedViewFilter',
    (focusedViewFilter: FocusedViewFilter, actionSource: ActionSource) =>
        addDatapointConfig(
            {
                name:
                    focusedViewFilter === FocusedViewFilter.Focused
                        ? 'TnS_SelectFocusedPivot'
                        : 'TnS_SelectOtherPivot',
                options: { isCore: true },
                customData: [
                    focusedViewFilter,
                    actionSource,
                    listViewStore.inboxPausedDateTime != null /* isInboxPaused */,
                ],
            },
            {
                focusedViewFilter,
                actionSource,
            }
        )
);
