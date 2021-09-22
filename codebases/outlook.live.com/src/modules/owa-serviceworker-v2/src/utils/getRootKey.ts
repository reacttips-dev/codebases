import { NavigateCacheName } from '../settings';
import type { ServiceWorkerSource } from 'owa-serviceworker-common/lib/types/ServiceWorkerSource';

export default function getRootKey(
    scope: ServiceWorkerSource,
    hxVersion: string | undefined
): string {
    return NavigateCacheName + scope + '/' + (hxVersion || '');
}
