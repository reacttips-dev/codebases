import type TelemetryProvider from '../store/schema/TelemetryProvider';
import type PerfData from '../store/schema/PerfData';
import type PerfMarker from '../store/schema/PerfMarker';
import type CardLoadPerfCheckpoints from '../store/schema/CardLoadPerfCheckpoints';
import markPerfCheckpoint from '../utils/telemetry/markPerfCheckpoint';
import { differenceInMilliseconds, OwaDate } from 'owa-datetime';
import type TelemetryDetails from '../store/schema/TelemetryDetails';
import type MessageContext from '../store/schema/MessageContext';
import type CardDetails from '../store/schema/CardDetails';
import type ElementDetails from '../store/schema/ElementDetails';

export class ActionableMessageTelemetryHandler {
    public telemetryProvider: TelemetryProvider;
    public messageContext: MessageContext;
    public perfCheckpoints: CardLoadPerfCheckpoints;
    public perfData: PerfData;

    constructor(
        telemetryProvider: TelemetryProvider,
        messageContext: MessageContext,
        perfData: PerfData
    ) {
        this.perfCheckpoints = { currentCardCheckpoints: {}, previousCardCheckpoints: {} };
        this.telemetryProvider = telemetryProvider;
        this.messageContext = messageContext;
        this.perfData = perfData;
    }

    stampPerfCheckpoint(perfMarker: PerfMarker, checkPointTime?: OwaDate): void {
        markPerfCheckpoint(this.perfCheckpoints, perfMarker, checkPointTime);
    }

    logTelemetryProvider(
        cardDetails: CardDetails,
        eventName: string,
        actionContext?: string,
        elementDetails?: ElementDetails
    ) {
        let telemetryDetails: TelemetryDetails = this.getTelemetryDetailsForEvent(
            cardDetails,
            eventName,
            actionContext,
            elementDetails
        );
        this.telemetryProvider.logTelemetry(telemetryDetails);
    }

    setTotalFetchTimeForCard() {
        if (this.perfCheckpoints && this.perfCheckpoints.currentCardCheckpoints) {
            this.perfCheckpoints.currentCardCheckpoints.totalFetchTime = differenceInMilliseconds(
                this.perfData.fetchEndTime,
                this.perfData.fetchStartTime
            );
        }
    }

    getTelemetryDetailsForEvent(
        cardDetails: CardDetails,
        eventName: string,
        actionContext?: string,
        elementDetails?: ElementDetails
    ): TelemetryDetails {
        return {
            messageContext: this.messageContext,
            cardDetails: cardDetails,
            eventName: eventName,
            actionContext: actionContext,
            elementDetails: elementDetails,
            perfCheckpoints: this.perfCheckpoints,
        };
    }

    updatePerfCheckpointsBeforeUpdatingAutoInvokeResponse() {
        if (this.perfCheckpoints) {
            this.perfCheckpoints.previousCardCheckpoints = this.perfCheckpoints.currentCardCheckpoints;
            this.perfCheckpoints.currentCardCheckpoints = {};
        }
    }
}
