import { orchestrator } from 'satcheljs';
import logConsumerDeletedRetentionPolicy from '../actions/logConsumerDeletedRetentionPolicy';
import { isConsumer } from 'owa-session-store';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import sortResults from 'owa-service/lib/factory/sortResults';
import propertyUri from 'owa-service/lib/factory/propertyUri';
import FocusedViewFilter from 'owa-service/lib/contract/FocusedViewFilter';
import { findItemWithStartIndex, getFindItemShape } from 'owa-mail-find-rows';
import { getAggregationBucket } from 'owa-analytics-actions';
import { logUsage } from 'owa-analytics';
import folderId from 'owa-service/lib/factory/folderId';

// Max number of days for row to be in deleted items before logging
const RETENTION_LIMIT = 90 * 1000 * 3600 * 24; // 90 days * milliseconds * seconds * hours

const NUM_ROWS_TO_FETCH = 25;

// Log a temporary datapoint to see how many items consumer have in their deleted items
// that are older than what the retention policy should allow
orchestrator(logConsumerDeletedRetentionPolicy, async () => {
    if (!isConsumer()) {
        return;
    }

    const deletedItemsFolderId = folderNameToId('deleteditems');
    const timestampsOfOldestRows = await getTimestampsOfOldestItems(deletedItemsFolderId);

    // Log how many items are older than limit set for retention policy allowance
    let numItemsOlderThanRetentionAllowance = 0;
    if (timestampsOfOldestRows) {
        const currentTime = Date.now();
        for (const timestamp of timestampsOfOldestRows) {
            const timeDifference = currentTime - timestamp;
            if (timeDifference >= RETENTION_LIMIT) {
                ++numItemsOlderThanRetentionAllowance;
            } else {
                break;
            }
        }
    }

    logUsage('TnS_ConsumerDeletedItemsRetentionPolicy', [
        getAggregationBucket({
            value: numItemsOlderThanRetentionAllowance,
            exactMatches: [0, 25],
            buckets: [5, 10, 15, 20, 24],
        }),
    ]);
});

async function getTimestampsOfOldestItems(deletedItemsFolderId: string): Promise<number[]> {
    const findItemResposne = await findItemWithStartIndex(
        folderId({ Id: deletedItemsFolderId }),
        0 /* startIndex */,
        NUM_ROWS_TO_FETCH,
        'All',
        [
            sortResults({
                Order: 'Ascending',
                Path: propertyUri({ FieldURI: 'DateTimeReceived' }),
            }),
        ], // Sort by date in ascending order to get the oldest items,
        FocusedViewFilter.None,
        getFindItemShape(),
        undefined, // initialSessionData
        null, // requestOptions
        null // categoryName
    );

    // Get a list of the last received times of the oldest items
    return (
        findItemResposne.RootFolder &&
        findItemResposne.RootFolder.Items.map(item => Date.parse(item.DateTimeReceived))
    );
}
