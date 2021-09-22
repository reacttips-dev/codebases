import isSpotlightEnabled from './isSpotlightEnabled';
import processSpotlightItemsResponse from './processSpotlightItemsResponse';
import onSpotlightItemsFetched from '../actions/onSpotlightItemsFetched';
import fetchSpotlightItemsService from '../services/fetchSpotlightItemsService';
import { PerformanceDatapoint } from 'owa-analytics';
import { isConversationView } from 'owa-mail-list-store';
import { getDefaultInboxTableView } from 'owa-mail-triage-table-utils/lib/getDefaultInboxTableView';
import type { OnInitialTableLoadComplete } from 'owa-mail-loading-action-types';
import debounce from 'lodash-es/debounce';

const POLL_INTERVAL = 60 * 60 * 1000; // 1 hour
const SERVICE_CALL_DEBOUNCE_LIMIT = 20 * 1000; // 20 sec
const SERVICE_CALL_DEBOUNCE_TIME = 10 * 1000; // 10 sec

// Interval Id of the set interval
let intervalId: NodeJS.Timer = null;

/**
 * Fetches Spotlight items
 *
 */
const fetchSpotlightItems = (onInitialTableLoadComplete?: OnInitialTableLoadComplete) => {
    // Don't make request if feature isn't enabled.
    if (!isSpotlightEnabled()) {
        return;
    }

    if (!intervalId) {
        // For the first time we request the non-debounced version so
        // we dont have to wait
        fetchSpotlightItemsServiceCall(onInitialTableLoadComplete);

        intervalId = setInterval(() => {
            // We need to still refresh due to expiration
            // time for spotlight items, until server code
            // unsets the SpotlightIsVisible and we are notified
            fetchSpotlightItemsServiceCall(onInitialTableLoadComplete);
        }, POLL_INTERVAL);
    } else {
        // Calls the debounced function.
        // Since we are calling this on properties updates
        // we can get a burst of notification calls
        fetchSpotlightItemsDebounced(onInitialTableLoadComplete);
    }
};

const fetchSpotlightItemsServiceCall = async (
    onInitialTableLoadComplete?: OnInitialTableLoadComplete
) => {
    const inboxTableView = getDefaultInboxTableView();

    const networkPerformanceDatapoint = new PerformanceDatapoint('SpotlightService', {
        sessionSampleRate: 20,
    });
    const requestStartTime = Date.now();

    const spotlightResponse: Response = await fetchSpotlightItemsService(inboxTableView);

    networkPerformanceDatapoint.end();

    const spotlightItems = await processSpotlightItemsResponse(
        spotlightResponse,
        inboxTableView,
        networkPerformanceDatapoint,
        onInitialTableLoadComplete
    );

    onSpotlightItemsFetched(spotlightItems, isConversationView(inboxTableView), requestStartTime);
};

const fetchSpotlightItemsDebounced = debounce(
    fetchSpotlightItemsServiceCall,
    SERVICE_CALL_DEBOUNCE_TIME,
    {
        maxWait: SERVICE_CALL_DEBOUNCE_LIMIT,
        trailing: true,
    }
);

export default fetchSpotlightItems;
