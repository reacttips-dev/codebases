import type {
    SearchActionsEventType,
    SearchEntityActionsEventType,
    EntityActionTakenType,
    GroupLayoutType,
} from '../data/schema/substrateSearchLogTypes';
import type ResultsView from '../data/schema/ResultsView';
import { getLocalTime } from 'owa-search-service/lib/helpers/getLocalTime';
import type SubstrateEvent from 'owa-search-service/lib/data/schema/SubstrateEvent';
import type SubstrateSearchScenario from 'owa-search-service/lib/data/schema/SubstrateSearchScenario';
import substrateSearchLogEventsOperation from 'owa-search-service/lib/services/substrateSearchPostEventsService';
import { addLocalTimeAttribute } from '../helpers/addLocalTimeAttribute';
import type { ClientDataSourceEvent } from '../data/schema/ClientDataSourceEvent';

export function logResponseReceived(
    substrateSearchScenario: SubstrateSearchScenario,
    traceId: string,
    latency: number,
    status: number | string | undefined,
    providerName?: string
) {
    const event: SubstrateEvent = {
        Name: 'responsereceived',
        Attributes: [
            { Key: 'version', Value: '2' },
            { Key: 'traceId', Value: traceId },
            { Key: 'localtime', Value: getLocalTime() },
            { Key: 'latency', Value: latency.toString() },
            { Key: 'status', Value: status?.toString() },
        ],
    };
    if (providerName) {
        event.Attributes.push({
            Key: 'providerName',
            Value: providerName,
        });
    }

    substrateSearchLogEventsOperation(traceId, event, substrateSearchScenario);
}

export function logCachedContentRendered(
    substrateSearchScenario: SubstrateSearchScenario,
    userId: string,
    tenantId: string,
    logicalId: string,
    newLogicalId: string,
    conversationId: string,
    traceId: string
) {
    const event: SubstrateEvent = {
        Name: 'cachedcontentrendered',
        Attributes: [
            { Key: 'version', Value: '2' },
            { Key: 'userid', Value: userId },
            { Key: 'tenantid', Value: tenantId },
            { Key: 'localtime', Value: getLocalTime() },
            { Key: 'logicalid', Value: logicalId },
            { Key: 'newlogicalid', Value: newLogicalId },
            { Key: 'conversationid', Value: conversationId },
        ],
    };

    substrateSearchLogEventsOperation(traceId, event, substrateSearchScenario);
}

export function logResultsRendered(
    substrateSearchScenario: SubstrateSearchScenario,
    logicalId: string,
    traceId: string,
    e2eLatency: number
) {
    const event: SubstrateEvent = {
        Name: 'resultsrendered',
        Attributes: [
            { Key: 'version', Value: '2' },
            { Key: 'logicalid', Value: logicalId },
            { Key: 'localtime', Value: getLocalTime() },
            { Key: 'e2elatency', Value: e2eLatency.toString() },
        ],
    };

    if (traceId) {
        event.Attributes.push({
            Key: 'traceId',
            Value: traceId,
        });
    }

    /**
     * According to the 3S documentation, logicalId should be used as key (as traceId
     * isn't even a mandatory property to send with the event), but leaving traceId
     * as the primary key so scenarios that are already implemented using traceId do not
     * get broken. For scenarios just using logicalId (a mandatory property), then
     * that'll be used as the key.
     */
    substrateSearchLogEventsOperation(traceId || logicalId, event, substrateSearchScenario);
}

export function logClientDataSource(
    substrateSearchScenario: SubstrateSearchScenario,
    clientDataSourceEvent: ClientDataSourceEvent
) {
    const event: SubstrateEvent = {
        Name: 'clientdatasource',
        Attributes: [
            { Key: 'version', Value: '2' },
            { Key: 'userid', Value: clientDataSourceEvent.userId },
            { Key: 'tenantid', Value: clientDataSourceEvent.tenantId },
            { Key: 'logicalid', Value: clientDataSourceEvent.logicalId },
            { Key: 'traceId', Value: clientDataSourceEvent.traceId },
            { Key: 'providername', Value: clientDataSourceEvent.providerName },
            { Key: 'scenarioname', Value: substrateSearchScenario },
            { Key: 'localtime', Value: getLocalTime() },
            { Key: 'impressiontype', Value: clientDataSourceEvent.impressionType },
            { Key: 'results', Value: JSON.stringify(clientDataSourceEvent.results) },
        ],
    };

    substrateSearchLogEventsOperation(
        clientDataSourceEvent.traceId,
        event,
        substrateSearchScenario
    );
}

export function logClientLayout(
    substrateSearchScenario: SubstrateSearchScenario,
    userId: string,
    tenantId: string,
    logicalId: string,
    traceId: string,
    layoutType: GroupLayoutType,
    resultsView: ResultsView[],
    part?: number,
    verticalType?: string
) {
    const event: SubstrateEvent = {
        Name: 'clientlayout',
        Attributes: [
            { Key: 'version', Value: '2' },
            { Key: 'userid', Value: userId },
            { Key: 'tenantid', Value: tenantId },
            { Key: 'logicalid', Value: logicalId },
            { Key: 'localtime', Value: getLocalTime() },
            { Key: 'layouttype', Value: layoutType },
            { Key: 'resultsview', Value: JSON.stringify(resultsView) },
        ],
    };

    if (part != null) {
        event.Attributes.push({
            Key: 'part',
            Value: part.toString(),
        });
    }

    if (verticalType) {
        event.Attributes.push({
            Key: 'verticaltype',
            Value: verticalType,
        });
    }

    substrateSearchLogEventsOperation(traceId, event, substrateSearchScenario);
}

export function logSearchActions(
    substrateSearchScenario: SubstrateSearchScenario,
    userId: string,
    tenantId: string,
    logicalId: string,
    traceId: string = null,
    searchActionEventType: SearchActionsEventType,
    metaData?: Map<string, string>
) {
    const event: SubstrateEvent = {
        Name: 'searchactions',
        Attributes: [
            { Key: 'version', Value: '2' },
            { Key: 'userid', Value: userId },
            { Key: 'tenantid', Value: tenantId },
            { Key: 'localtime', Value: getLocalTime() },
            { Key: 'logicalid', Value: logicalId },
            { Key: 'eventType', Value: searchActionEventType },
        ],
    };

    if (traceId) {
        event.Attributes.push({
            Key: 'traceId',
            Value: traceId,
        });
    }

    if (metaData) {
        event.Attributes.push({
            Key: 'metadata',
            Value: formatMetaData(metaData),
        });
    }

    substrateSearchLogEventsOperation(logicalId, event, substrateSearchScenario);
}

function formatMetaData(metaData: Map<string, string>) {
    let metaDataValue = {};
    metaData.forEach((value, key) => {
        metaDataValue[key] = value;
    });
    return JSON.stringify(metaDataValue);
}

export function logSearchEntityActions(
    substrateSearchScenario: SubstrateSearchScenario,
    userId: string,
    tenantId: string,
    logicalId: string,
    traceId: string = null,
    referenceId: string,
    eventType: string,
    metaData?: Map<string, string>,
    overrideKey?: string
) {
    const event: SubstrateEvent = {
        Name: 'searchentityactions',
        Attributes: [
            { Key: 'version', Value: '2' },
            { Key: 'userid', Value: userId },
            { Key: 'tenantid', Value: tenantId },
            { Key: 'logicalid', Value: logicalId },
            { Key: 'localtime', Value: getLocalTime() },
            { Key: 'id', Value: referenceId },
            { Key: 'eventtype', Value: eventType },
        ],
    };

    if (traceId) {
        event.Attributes.push({
            Key: 'traceId',
            Value: traceId,
        });
    }

    if (metaData) {
        event.Attributes.push({
            Key: 'metadata',
            Value: formatMetaData(metaData),
        });
    }

    /**
     * This is worth calling out that we are passing logicalId here instead of
     * traceId because the V2 instrumentation contract prioritizes this new
     * ID (logical ID) over the trace ID that was prioritized in V1. This will
     * all be cleaned up when we migrate to V2.
     *
     * For now, some scenarios still need traceId to be used, they can pass it
     * in the overrideKey param of this function
     */
    substrateSearchLogEventsOperation(
        overrideKey || logicalId /* traceId */,
        event,
        substrateSearchScenario
    );
}

export function logSecondaryEntityActionClicked(
    traceId: string,
    referenceId: string,
    eventType: SearchEntityActionsEventType,
    substrateSearchScenario: SubstrateSearchScenario,
    entityActionTaken: EntityActionTakenType,
    logicalId: string
) {
    logSearchEntityActions(
        substrateSearchScenario,
        null /* userId */,
        null /* tenantId */,
        logicalId,
        traceId,
        referenceId,
        eventType,
        new Map<string, string>([['entityactiontaken', entityActionTaken]])
    );
}

export function logFeedback(
    currentTime: Date,
    traceId: string,
    yesSelected: boolean,
    feedbackString: string,
    substrateSearchScenario: SubstrateSearchScenario
) {
    const event: SubstrateEvent = { Name: 'SearchFeedback', Attributes: [] };
    event.Attributes.push({ Key: 'TraceId', Value: traceId });
    addLocalTimeAttribute(event, currentTime);
    event.Attributes.push({ Key: 'Version', Value: '2' });

    const feedbackResponse = {
        Type: 'ResultFoundResponse',
        ResponseValue: yesSelected ? 'Yes' : 'No',
        FeedbackString: feedbackString,
    };

    event.Attributes.push({ Key: 'FeedbackResponse', Value: JSON.stringify(feedbackResponse) });

    substrateSearchLogEventsOperation(traceId, event, substrateSearchScenario);
}

export function logSearchFeedbackActions(
    substrateSearchScenario: SubstrateSearchScenario,
    logicalId: string,
    traceId: string,
    referenceId: string,
    feedbackresponse: string
) {
    const event: SubstrateEvent = {
        Name: 'searchfeedback',
        Attributes: [
            { Key: 'version', Value: '2' },
            { Key: 'logicalid', Value: logicalId },
            { Key: 'localtime', Value: getLocalTime() },
            { Key: 'id', Value: referenceId },
            { Key: 'feedbackresponse', Value: feedbackresponse },
        ],
    };

    substrateSearchLogEventsOperation(traceId, event, substrateSearchScenario);
}

export function logEntitiesFromFilePicker(
    substrateSearchScenario: SubstrateSearchScenario,
    userId: string,
    tenantId: string,
    traceId: string,
    fileType: string,
    fileId: string
) {
    const event: SubstrateEvent = {
        Name: 'EntitiesFromFilePicker',
        Attributes: [
            { Key: 'userid', Value: userId },
            { Key: 'tenantid', Value: tenantId },
            { Key: 'localtime', Value: getLocalTime() },
            { Key: 'fileType', Value: fileType },
            { Key: 'fileId', Value: fileId },
            { Key: 'traceId', Value: traceId },
        ],
    };

    substrateSearchLogEventsOperation(traceId, event, substrateSearchScenario);
}
