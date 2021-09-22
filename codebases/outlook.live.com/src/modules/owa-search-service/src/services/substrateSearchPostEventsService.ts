import type SubstrateEvent from '../data/schema/SubstrateEvent';
import type SubstrateSearchScenario from '../data/schema/SubstrateSearchScenario';
import getSubstrateSearchEndpoint from '../helpers/getSubstrateSearchEndpoint';
import { logUsage } from 'owa-analytics';
import { getSessionId } from 'owa-config';
import { makePostRequest } from 'owa-ows-gateway';
import buildQueryParams from '../helpers/buildQueryParams';
import { getUrlWithAddedQueryParameters } from 'owa-url';

export interface EventsBatch {
    [traceId: string]: SubstrateEvent[];
}

export interface EventBatchGroup {
    [scenario: string]: EventsBatch;
}

export let batch = <EventBatchGroup>{};

export default function substrateSearchLogEventsOperation(
    traceId: string,
    event: SubstrateEvent,
    substrateSearchScenario: SubstrateSearchScenario
) {
    const nonNullAttributes = event.Attributes.filter(attribute => {
        return attribute.Value != null;
    });

    event.Attributes = nonNullAttributes;
    event.Attributes.forEach(element => {
        if (!!element.Value && typeof element.Value !== 'string') {
            throw new Error(
                'All values in substrate search event attributes must be strings or null/undefines'
            );
        }
    });

    if (batch[substrateSearchScenario] === undefined) {
        // if we don't yet have a batch, create one, and
        // wait 5sec before logging the batch
        batch[substrateSearchScenario] = <EventsBatch>{};
        setTimeout(logBatch(substrateSearchScenario), 5000);
    }

    // Ensure we have an initialized batch, and add our event
    // to the right traceId key
    batch[substrateSearchScenario][traceId] = (
        batch[substrateSearchScenario][traceId] || []
    ).concat(event);
}

export function logBatch(substrateSearchScenario: SubstrateSearchScenario) {
    return () => {
        const batchToLog = batch[substrateSearchScenario];

        // transform the EventsBatch into the expected server schema
        // FROM: [{'traceId1': [eventA, eventB]}, {'traceId2': [eventC]}
        // TO: [{ Key: 'traceId1', Value: [eventA, eventB]}, {Key: 'traceId2': Value: [eventC]}]
        const body = Object.keys(batchToLog).reduce((eventGroups, traceId) => {
            eventGroups.push({ Key: traceId, Value: batchToLog[traceId] });
            return eventGroups;
        }, []);

        const defaultParams = { scenario: substrateSearchScenario };
        const params = buildQueryParams(defaultParams);

        batch[substrateSearchScenario] = undefined;

        makePostRequest(
            getUrlWithAddedQueryParameters(getSubstrateSearchEndpoint('events'), params),
            body,
            undefined /* correlationId */,
            true /* returnFullResponse */,
            { 'Client-Session-Id': getSessionId() } /* customHeaders */,
            undefined /* throwServiceError */,
            undefined /* sendPayloadAsBody */,
            /* 3S does not need auth cookies so omitting them will decrease request header size */
            false /* includeCredentials */
        ).then((response: any) => {
            const countsPerEvent: { [eventName: string]: number } = {};

            const events = Object.keys(batchToLog).reduce((eventGroups, traceId) => {
                batchToLog[traceId].forEach(event => {
                    eventGroups.push({
                        TraceId: traceId,
                        EventName: event.Name,
                    });

                    if (countsPerEvent[event.Name]) {
                        countsPerEvent[event.Name] = countsPerEvent[event.Name] + 1;
                    } else {
                        countsPerEvent[event.Name] = 1;
                    }
                });

                return eventGroups;
            }, []);

            const instPayload = {
                scenario: substrateSearchScenario,
                status: response.status,
                totalEvents: events.length,
                events: JSON.stringify(events),
            };

            Object.keys(countsPerEvent).forEach(key => {
                instPayload[key] = countsPerEvent[key];
            });

            logUsage('3SInstEvent', instPayload);
        });
    };
}

export function setBatchForTest(testBatch: EventBatchGroup) {
    batch = { ...testBatch };
}
