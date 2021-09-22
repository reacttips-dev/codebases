import { PerformanceDatapoint, DatapointStatus } from 'owa-analytics';
import { LogModules, Status } from './enum';
import type { PropertiesType } from './types/PropertiesType';

export class PerfMarker extends PerformanceDatapoint {
    constructor(logModule: LogModules, metricName: string, appId: string, correlationId: string) {
        let eventName = `message_extension_metrics_${metricName}`;
        super(eventName, { isCore: true });
        this.addCustomData({
            LogModule: logModule,
            AppId: appId,
            CorrelationId: correlationId ? correlationId : '',
        });
    }
    /**
     * Event Type: client_event,
     * Log perf end marker in case of Success.
     */
    logMetricEnd(metricProps?: PropertiesType) {
        this.addCustomData({ ...metricProps });
        this.end();
    }

    /**
     * Event Type: client_event,
     * Log perf end marker in case of Failure.
     */
    logMetricEndWithError(status: Status, errorMessage: string, metricProps?: PropertiesType) {
        this.addCustomData({
            ErrorMessage: errorMessage,
            ...metricProps,
        });
        this.endWithError(
            status == Status.ServerError
                ? DatapointStatus.ServerError
                : status == Status.ClientError
                ? DatapointStatus.ClientError
                : DatapointStatus.Timeout
        );
    }

    /**
     * Event Type: client_event,
     * Log additional metric properties.
     */
    addMetricProps(metricProps: PropertiesType) {
        this.addCustomData({ ...metricProps });
    }
}
