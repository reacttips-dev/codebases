import { getGuid } from 'owa-guid';
import { getOwaWorkload, OwaWorkload } from 'owa-workloads';
import { getClientVersion, NATIVE, getHostValue } from 'owa-config';

export type Logger = (eventName: string, customData: any[]) => void;

export let isInitialized = false;
export let clientCorrelationId: string = undefined;
export let clientType: string = undefined;
export let clientScenario: string = undefined;
export let culture: string = undefined;
export let isConsumer: boolean = false;
export let useDogfood: boolean = false;
export let isMicrosoftUser: boolean = false;
export let clientVersion: string = undefined;

let logger: Logger = undefined;
const MicrosoftTenantId: string = '72f988bf-86f1-41af-91ab-2d7cd011db47';
const MicrosoftExoTenantId: string = '626bd560-f1d8-4cf1-a7fa-91aae03cc409';

export interface LokiConfig {
    culture: string;
    isConsumer: boolean;
    useDogfood: boolean;
    logger: Logger;
    tenantId?: string;
    clientCorrelationId?: string;
}

export function initializeLoki(config: LokiConfig): void {
    if (!isInitialized) {
        if (!config) {
            throw new Error('Loki config object is mandatory!');
        }

        const isNative = getHostValue() == NATIVE;

        if (isNative) {
            clientType = 'OneOutlook';
        } else {
            // Legacy client names.
            clientType = getOwaWorkload() === OwaWorkload.Calendar ? 'OwaCalendar' : 'OwaMail';
        }

        clientScenario = config.isConsumer ? 'OwaConsumer' : 'OwaEnterprise';
        culture = config.culture;
        isConsumer = config.isConsumer;
        useDogfood = config.useDogfood;
        logger = config.logger;
        clientVersion = getClientVersion();

        const tenantId = config.tenantId && config.tenantId.toLowerCase();
        isMicrosoftUser = tenantId === MicrosoftTenantId || tenantId === MicrosoftExoTenantId;

        clientCorrelationId = config.clientCorrelationId || getGuid();
    }
    isInitialized = true;
}

export function log(logType: string, logResultType: string, message?: string): void {
    logger(logType, [logResultType, message]);
}
