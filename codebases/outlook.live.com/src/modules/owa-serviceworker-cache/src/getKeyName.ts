import type { ServiceWorkerSource } from 'owa-serviceworker-common/lib/types/ServiceWorkerSource';

export default function getKeyName(appName: ServiceWorkerSource, suffix: string) {
    return appName + '_' + suffix;
}
