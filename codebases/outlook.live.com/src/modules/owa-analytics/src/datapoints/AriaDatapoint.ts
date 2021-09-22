import type { CacheType } from '../types/CacheType';
import { GenericKeys } from '../types/DatapointEnums';
import { getUniquePropertyString } from '../utils/getUniquePropertyString';
import type {
    DatapointOptions,
    CustomDataMap,
    CustomData,
    CustomDataType,
    ActionSource,
} from 'owa-analytics-types';
import { getQueryStringParameter } from 'owa-querystring';
import { getSessionElapseTime } from '../utils/getSessionElapseTime';
import { scrubForPii } from 'owa-config';

const eventTypeQueryStringParam = 'track';
export function isEventQueryStringEnabled(eventType: string): boolean {
    let eventQueryString = getQueryStringParameter(eventTypeQueryStringParam);
    return (
        !!eventQueryString && (eventQueryString == '*' || eventQueryString.indexOf(eventType) > -1)
    );
}

export function isClientVerboseQueryStringEnabled(): boolean {
    return isEventQueryStringEnabled(VerbosePerfEventType);
}

export const VerbosePerfEventType = 'client_verbose';

let sequenceNumber = 0;

export class AriaDatapoint {
    public static sessionOccurences: { [index: string]: number };
    eventName: string;
    options?: DatapointOptions;
    properties: CustomDataMap;
    propertyBag: CustomDataMap | undefined;
    piiData?: string;
    customDataIndex: number = 1;
    sessionOccurence: number | undefined;
    constructor(
        eventName?: string,
        extraCustomData?: CustomData,
        options?: DatapointOptions,
        props?: CustomDataMap
    ) {
        this.eventName = (eventName && eventName.toString().replace('.', '_')) || '';
        this.properties = props || {};
        this.options = options;
        this.addCustomData(extraCustomData);

        const sessionElapseTime = getSessionElapseTime();
        if (sessionElapseTime) {
            this.addData('SessionElapseTime', sessionElapseTime);
        }

        if (this.eventName) {
            this.addData('EventName', this.eventName);
            this.updateSessionOccurences(this.eventName);
        }

        if (options?.actionSource) {
            this.addActionSource(options.actionSource);
        }

        if (options?.cosmosOnlyData) {
            this.addCosmosOnlyData(options.cosmosOnlyData);
        }

        this.addData('SequenceNumber', sequenceNumber++);
    }
    public addCustomData(extraCustomData?: CustomData) {
        if (extraCustomData) {
            if (Array.isArray(extraCustomData)) {
                for (var ii = 0; ii < extraCustomData.length; ii++) {
                    this.addCustomProperty(
                        `owa_${(this.customDataIndex++).toString()}`,
                        extraCustomData[ii]
                    );
                }
            } else if (extraCustomData instanceof Object) {
                let props = Object.keys(extraCustomData);
                for (var jj = 0; jj < props.length; jj++) {
                    this.addCustomProperty(props[jj], extraCustomData[props[jj]]);
                }
            }
        }
    }
    public addCustomProperty(property: string, value: CustomDataType) {
        if (!this.propertyBag) {
            this.propertyBag = {};
        }
        const uniqueProperty = getUniquePropertyString(this.propertyBag, property);
        if (uniqueProperty) {
            this.propertyBag[uniqueProperty] = value;
        }
    }
    public addPiiData(value: string) {
        if (!this.piiData) {
            this.piiData = value;
        }
    }

    public addCosmosOnlyData(value: string) {
        this.addDataWithPiiScrubbing('ExtraData', value);
    }

    public addActionSource(value: ActionSource) {
        this.addData('ActionSource', value);
    }

    public addCache(value: CacheType) {
        this.addData(GenericKeys.cache, value);
    }
    public getData(key: string) {
        return this.properties[key];
    }
    protected addDataWithPiiScrubbing(key: string, value: string) {
        this.addData(key, scrubForPii(value));
    }
    protected addData(key: string, value: CustomDataType) {
        this.properties[key] = value;
    }
    private updateSessionOccurences(eventName: string): void {
        if (!AriaDatapoint.sessionOccurences) {
            AriaDatapoint.sessionOccurences = {};
        }

        var sessionOccurences = AriaDatapoint.sessionOccurences[eventName];
        this.sessionOccurence = AriaDatapoint.sessionOccurences[eventName] = sessionOccurences
            ? sessionOccurences + 1
            : 1;

        this.addData('SessionOccurences', sessionOccurences);
    }
}
