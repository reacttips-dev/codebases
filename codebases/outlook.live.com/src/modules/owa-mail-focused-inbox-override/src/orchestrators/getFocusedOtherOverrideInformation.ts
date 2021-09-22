import itemResponseShape from 'owa-service/lib/factory/itemResponseShape';
import extendedPropertyUri from 'owa-service/lib/factory/extendedPropertyUri';
import { getExtendedPropertyUri } from 'owa-service/lib/ServiceRequestUtils';
import { DatapointStatus, PerformanceDatapoint } from 'owa-analytics';
import {
    INFERENCE_CLASSIFICATION_RESULT_PROPERTY_NAME,
    INFERENCE_CLASSIFICATION_RESULT_PROPERTY_ID,
} from '../constants';
import { onAfterSelectionChanged } from 'owa-mail-actions/lib/mailListSelectionActions';
import {
    getFocusedFilterForTable,
    MailRowDataPropertyGetter,
    TableView,
} from 'owa-mail-list-store';
import { getItem } from 'owa-mail-store';
import FocusedViewFilter from 'owa-service/lib/contract/FocusedViewFilter';
import { createLazyOrchestrator } from 'owa-bundling';
import { setInferenceClassificationResultForItem } from '../mutators/setInferenceClassificationResultForItem';
import { getStore } from '../store/store';

// cache the property uri
const focusedOverridePropertyPath = extendedPropertyUri(
    getExtendedPropertyUri(
        INFERENCE_CLASSIFICATION_RESULT_PROPERTY_ID,
        INFERENCE_CLASSIFICATION_RESULT_PROPERTY_NAME,
        'Integer' // property type
    )
);

/**
 * On after selection change is dispatched only when a single selection happens.
 * Hence this orchestrator will not be called when user performs multi selection
 */
export const getFocusedOverrideOrchestrator = createLazyOrchestrator(
    onAfterSelectionChanged,
    'clone_onAfterSelectionChanged',
    actionMessage => {
        const { rowKey, tableView } = actionMessage;
        /**
         * Currently we only get the override information for the latest item (local in case of conversation)
         */
        const itemIds = MailRowDataPropertyGetter.getItemIds(rowKey, tableView);
        if (!itemIds) {
            return;
        }

        const latestItemId = itemIds[0];
        setTimeout(() => getFocusedInboxOverride(latestItemId, tableView), 100);
    }
);

async function getFocusedInboxOverride(itemId: string, tableView: TableView) {
    /**
     * Get override information only when the row is present in the focused view filter
     * (which is only set for Inbox folder)
     */
    if (getFocusedFilterForTable(tableView) != FocusedViewFilter.Focused) {
        return;
    }

    /**
     * Do not fetch property if it already exists
     */
    if (getStore().inferenceClassificationResultMap.get(itemId)) {
        return;
    }

    const datapoint: PerformanceDatapoint = new PerformanceDatapoint('FocusedOverride_GetProperty');
    const itemOrError = await getItem(
        [itemId],
        itemResponseShape({
            BaseShape: 'IdOnly',
            AdditionalProperties: [focusedOverridePropertyPath],
        }),
        null /* shapeName */
    );

    if (itemOrError && !(itemOrError instanceof Error)) {
        setInferenceClassificationResultForItem(itemOrError[0]);
        datapoint.end();
    } else {
        datapoint.endWithError(DatapointStatus.ServerError);
    }
}
