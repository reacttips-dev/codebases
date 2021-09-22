import type { SessionData } from 'owa-service/lib/types/SessionData';
import { addBottleneck } from 'owa-performance';
import type FindItemResponseMessage from 'owa-service/lib/contract/FindItemResponseMessage';

export function extractFindMailFolderItemResponse(
    sessionData: SessionData
): FindItemResponseMessage | undefined {
    const bottleneck = 'fir';
    const response: FindItemResponseMessage =
        sessionData.findMailFolderItem?.Body?.ResponseMessages?.Items?.[0];
    let bottleneckReason: string | undefined;
    if (!response) {
        bottleneckReason = 'njr';
    } else if (response.ResponseClass == 'Error') {
        bottleneckReason = 'e';
        addBottleneck(bottleneck + '_c', response.ResponseCode || 'un');
    } else {
        const rootFolder = response?.RootFolder;
        if (!rootFolder?.Items) {
            bottleneckReason = 'ni';
        } else if (
            typeof rootFolder.IndexedPagingOffset != 'number' ||
            0 !== rootFolder.Items.length - rootFolder.IndexedPagingOffset
        ) {
            bottleneckReason = 'wi';
        }
    }
    addBottleneck(bottleneck, bottleneckReason || 's');
    return bottleneckReason ? undefined : response;
}
