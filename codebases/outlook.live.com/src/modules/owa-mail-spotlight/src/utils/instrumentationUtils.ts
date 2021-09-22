import getSpotlightItemByRowKey from '../selectors/getSpotlightItemByRowKey';
import getStore from '../store/store';
import { logUsage } from 'owa-analytics';
import { lazyLogSearchEntityActions, lazyLogResultsRendered } from 'owa-search-instrumentation';
import { SubstrateSearchScenario } from 'owa-search-service';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';

const LOGICALIDS_PROCCESSED_RESULTSRENDERED = [];

export const logSpotlightItemClicked = (rowKey: string): void => {
    const {
        UserPuid: userPuid,
        ExternalDirectoryTenantGuid: tenantGuid,
    } = getUserConfiguration().SessionSettings;

    // 3S instrumentation to notify service that a Spotlight item was clicked
    lazyLogSearchEntityActions.importAndExecute(
        SubstrateSearchScenario.ContextualInsights,
        userPuid,
        tenantGuid,
        getStore().logicalId,
        null /* traceId */,
        getSpotlightItemByRowKey(rowKey).referenceId,
        'EntityClicked'
    );

    // Client datapoint to track clicks on Spotlight items
    logUsage('Spotlight_ItemClicked');
};

export const logSpotlightItemUserInteraction = (
    referenceId: string,
    interactionType: string
): void => {
    // No-op if there's no reference ID.
    if (!referenceId) {
        return;
    }

    const {
        UserPuid: userPuid,
        ExternalDirectoryTenantGuid: tenantGuid,
    } = getUserConfiguration().SessionSettings;

    lazyLogSearchEntityActions.importAndExecute(
        SubstrateSearchScenario.ContextualInsights,
        userPuid,
        tenantGuid,
        getStore().logicalId,
        null /* traceId */,
        referenceId,
        interactionType
    );

    // Client datapoint to track item interactions on Spotlight items
    logUsage('Spotlight_ItemInteraction', { interactionType });
};

export const logSpotlightResultsRendered = (): void => {
    const { logicalId, requestStartTime, spotlightItems } = getStore();

    if (LOGICALIDS_PROCCESSED_RESULTSRENDERED.indexOf(logicalId) === -1) {
        // Add logicalId to array of processed logical IDs so it's not processed again.
        LOGICALIDS_PROCCESSED_RESULTSRENDERED.push(logicalId);

        // Log 3S event
        lazyLogResultsRendered.importAndExecute(
            SubstrateSearchScenario.ContextualInsights,
            logicalId,
            null /* traceId */,
            Date.now() - requestStartTime
        );

        // Log client event
        logUsage('Spotlight_SetRendered', {
            hasSpotlightItems: spotlightItems.length > 0,
            logicalId: logicalId,
        });
    }
};
