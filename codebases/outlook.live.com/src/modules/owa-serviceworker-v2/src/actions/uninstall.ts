import { deleteScopeWrapper } from '../cacheWrapperMap';
import { ClientMessage, CacheStatus } from 'owa-serviceworker-common';
import { createPerfDatapoint, DatapointStatus } from '../analytics/createPerfDatapoint';
import * as trace from '../utils/trace';
import cleanupOldCaches from '../utils/cleanupOldCaches';
import { handleCacheMessage } from '../utils/eventSubscriber';

export default async function uninstall(message: ClientMessage) {
    const endGroupTrace = trace.group('UninstallCache');
    const dp = createPerfDatapoint('SwUninstall', message.source);
    let status: DatapointStatus = 'Success';
    let error: Error | undefined = undefined;
    try {
        await deleteScopeWrapper(message.source);
        await cleanupOldCaches();
    } catch (e) {
        status = 'ClientError';
        error = e;
    } finally {
        trace.log(`Status=${status}`, error);
        handleCacheMessage(message.source, {
            status: status == 'Success' ? CacheStatus.CacheInstalled : CacheStatus.CacheFailed,
        });
        endGroupTrace();
        dp.end(status, error);
    }
}
