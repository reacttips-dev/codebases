import { PriorityTaskQueue } from './PriorityTaskQueue';
import type { HeadersWithoutIterator, RequestOptions } from './RequestOptions';

export interface ServiceRequestConfig {
    getAuthToken?: (
        headers?: HeadersWithoutIterator,
        sourceId?: string
    ) => Promise<string | undefined>;
    onAuthFailed?: (headers?: HeadersWithoutIterator) => void;
    baseUrl: string;
    onHipChallengeNeeded?: (headers: HeadersWithoutIterator) => boolean;
    timezone?: string;
    isFeatureEnabled: (feature: string) => boolean;
    isUserIdle?: () => boolean;
    prefetchTaskQueue: PriorityTaskQueue<Response>;
    serviceActionTaskQueue?: PriorityTaskQueue<Response>;
    prepareRequestOptions?: (
        options: RequestOptions | undefined
    ) => RequestOptions | null | Promise<RequestOptions>;
    timeoutMS?: number;
    disableAllRequests?: boolean;
}

const defaultCachedConfig = {
    baseUrl: '/owa',
    isFeatureEnabled: () => false,
    prefetchTaskQueue: new PriorityTaskQueue<Response>({
        taskQuanta: -1,
    }),
    timeoutMS: 90_000,
    disableAllRequests: false,
};

let cachedConfig: ServiceRequestConfig = defaultCachedConfig;

export function updateServiceConfig(config?: Partial<ServiceRequestConfig>) {
    cachedConfig = {
        ...cachedConfig,
        ...config,
    };
}

export function getConfig(): ServiceRequestConfig {
    return cachedConfig;
}

export function resetDefault() {
    cachedConfig = defaultCachedConfig;
}
