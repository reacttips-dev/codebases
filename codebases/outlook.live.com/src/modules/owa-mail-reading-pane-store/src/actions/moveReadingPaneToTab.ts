import type { ClientItemId } from 'owa-client-ids';
import type { InstrumentationContext } from 'owa-search/lib/types/InstrumentationContext';
import type ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import { action } from 'satcheljs';

export let moveReadingPaneToTab = action(
    'MOVE_READING_PANE_TO_TAB',
    (
        id: ClientItemId,
        subject: string,
        categories: string[],
        makeActive: boolean,
        instrumentationContext: InstrumentationContext,
        listViewType?: ReactListViewType,
        makeHidden?: boolean
    ) => ({
        id,
        subject,
        categories,
        makeActive,
        instrumentationContext,
        listViewType,
        makeHidden,
    })
);

export default moveReadingPaneToTab;
