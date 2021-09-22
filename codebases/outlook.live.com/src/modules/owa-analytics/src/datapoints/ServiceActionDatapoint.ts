import getAbsoluteResourceTiming from '../utils/getAbsoluteResourceTiming';
import { addErrorToDatapoint } from '../utils/addErrorToDatapoint';
import { AriaDatapoint } from './AriaDatapoint';
import { GenericKeys } from '../types/DatapointEnums';
import type RequestOptions from 'owa-service/lib/RequestOptions';
import { getThroughEdge } from 'owa-config';
import type CalculatedResourceTimings from '../types/CalculatedResourceTimings';
import type { TraceErrorObject } from 'owa-trace';

let ResourceTimingKeys = {
    WorkerStart: 'WorkerStart',
    RedirectStart: 'RedirectStart',
    RedirectEnd: 'RedirectEnd',
    FetchStart: 'FetchStart',
    DomainLookupStart: 'DomainLookupStart',
    DomainLookupEnd: 'DomainLookupEnd',
    ConnectStart: 'ConnectStart',
    SecureConnectionStart: 'SecureConnectionStart',
    ConnectEnd: 'ConnectEnd',
    RequestStart: 'RequestStart',
    ResponseStart: 'ResponseStart',
    ResponseEnd: 'ResponseEnd',
    NextHopProtocol: 'NextHopProtocol',
    Type: 'Type',
    Start: 'Start',
};

type ResourceType = 'Asset' | 'ServiceAction';

export class ServiceActionDatapoint extends AriaDatapoint {
    private parsingTime: number | undefined;
    constructor(actionName: string, attemptCount?: number) {
        super(actionName);

        if (typeof attemptCount == 'number') {
            this.addData('AttemptCount', attemptCount);
        }
        this.addData('ThroughAFD', getThroughEdge());
    }

    public addResponseDiagnostics(response: Response, options?: RequestOptions) {
        if (response) {
            if (response.headers) {
                this.addData(GenericKeys.requestIds, response.headers.get('request-id'));
                this.addData('AfdId', response.headers.get('x-msedge-ref'));
                this.addData('ContentEncoding', response.headers.get('content-encoding'));
                this.addData('ResponseContentLength', response.headers.get('content-length'));
                this.addData(
                    'CalcBEServer',
                    response.headers.get('x-calculatedbetarget')?.split('.')[0]
                );
                this.logTimeDifferenceForHeaders(
                    response.headers,
                    'x-frontend-begin',
                    'x-frontend-end',
                    'FrontEndTimeElapsed'
                );
                this.logTimeDifferenceForHeaders(
                    response.headers,
                    'x-backend-begin',
                    'x-backend-end',
                    'BackEndTimeElapsed'
                );
            }

            this.addData('Status', response.status);
        }
        if (options) {
            if (options.headers) {
                this.addData(GenericKeys.correlationVectors, options.headers.get('ms-cv'));
            }
            if (options.datapoint) {
                if (options.datapoint.mailbox) {
                    this.addData('MailboxType', options.datapoint.mailbox);
                }
                if (options.datapoint.customData) {
                    this.addCustomData(options.datapoint.customData);
                }
                if (options.datapoint.datapointOptions) {
                    this.options = options.datapoint.datapointOptions;
                }
            }
        }
        if (window.performance?.now) {
            this.parsingTime = window.performance.now();
        }
    }
    public addErrorDiagnostics(error: TraceErrorObject) {
        // if it is an error service action, let's not sample it
        this.options = this.options || {};
        addErrorToDatapoint(this, error);
    }

    public addResourceTimings(type: ResourceType, timing: CalculatedResourceTimings) {
        this.addData(ResourceTimingKeys.Type, type);

        if (this.parsingTime) {
            this.addTiming(
                'responseRecieved',
                getAbsoluteResourceTiming(this.parsingTime, timing.ST)
            );
        }

        this.addTiming(ResourceTimingKeys.WorkerStart, timing.WS);
        this.addTiming(ResourceTimingKeys.RedirectStart, timing.RdS);
        this.addTiming(ResourceTimingKeys.RedirectEnd, timing.RdE);
        this.addTiming(ResourceTimingKeys.FetchStart, timing.FS);
        this.addTiming(ResourceTimingKeys.DomainLookupStart, timing.DS);
        this.addTiming(ResourceTimingKeys.DomainLookupEnd, timing.DE);
        this.addTiming(ResourceTimingKeys.ConnectStart, timing.CS);
        this.addTiming(ResourceTimingKeys.SecureConnectionStart, timing.SCS);
        this.addTiming(ResourceTimingKeys.ConnectEnd, timing.CE);
        this.addTiming(ResourceTimingKeys.RequestStart, timing.RqS);
        this.addTiming(ResourceTimingKeys.ResponseStart, timing.RpS);
        this.addTiming(ResourceTimingKeys.ResponseEnd, timing.RpE);
        this.addData(ResourceTimingKeys.NextHopProtocol, timing.P);
        this.addData(ResourceTimingKeys.Start, timing.ST);
    }
    private addTiming(key: string, timing: number) {
        this.addData(key, timing);
    }
    private logTimeDifferenceForHeaders(
        headers: Headers,
        startHeader: string,
        endHeader: string,
        propertyName: string
    ) {
        const startTime = headers.get(startHeader);
        const endTime = headers.get(endHeader);

        const startDate = startTime ? new Date(startTime) : undefined;
        const endDate = endTime ? new Date(endTime) : undefined;

        if (startDate && endDate) {
            const delta = Math.abs(endDate.getTime() - startDate.getTime());
            this.addCustomProperty(propertyName, delta);
        }
    }
}
