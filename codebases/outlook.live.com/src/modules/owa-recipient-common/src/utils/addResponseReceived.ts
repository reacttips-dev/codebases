import shouldUse3SPeopleSuggestions from 'owa-recipient-suggestions/lib/util/shouldUse3SPeopleSuggestions';
import { differenceInMilliseconds, now, OwaDate } from 'owa-datetime';
import { lazyLogResponseReceivedV2 } from 'owa-search-instrumentation';
import type SubstrateSearchScenario from 'owa-search-service/lib/data/schema/SubstrateSearchScenario';

/**
 * Adds a 3s "transaction complete" event, which may also be a timeout or other failure
 */

// If status is timeout (408) by client handing a long hang (not an actual server 408)
// "timeout" param should be the client-set timeout length. Otherwise, leave undefined.
export default function addTransactionComplete(
    scenario: SubstrateSearchScenario,
    transactionId: string,
    transactionRequestTime: OwaDate,
    status: number | string | undefined,
    timeout?: number
) {
    if (shouldUse3SPeopleSuggestions()) {
        let transactionRequestDuration = timeout
            ? timeout
            : differenceInMilliseconds(now(), transactionRequestTime);

        lazyLogResponseReceivedV2.importAndExecute(
            scenario,
            transactionId,
            transactionRequestDuration,
            status
        );
    }
}
