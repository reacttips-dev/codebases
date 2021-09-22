import type * as Schema from 'owa-graph-schema';
import { addBottleneck } from 'owa-performance';
import { mapFindFolderResponseToGql } from 'owa-folder-gql-mappers';
import { shouldShowFolder } from 'owa-folders-data-utils';

export function extractFolderHierarchy(
    sessionData: Schema.SessionDataWithGraphQL | undefined,
    mailboxInfoInput: Schema.MailboxInfoInput
): Schema.FolderHierarchyResult | undefined {
    const bottleneck = 'ffr';
    let result = sessionData?.folderHierarchy;
    let bottleneckReason = 's';
    if (!result) {
        const singleResponseMessage = sessionData?.findFolders?.Body?.ResponseMessages?.Items?.[0];
        if (!singleResponseMessage) {
            bottleneckReason = 'nrm';
        } else if (singleResponseMessage.ResponseClass == 'Error') {
            bottleneckReason = 'e';
            addBottleneck(bottleneck + '_c', singleResponseMessage.ResponseCode || 'un');
        } else {
            try {
                result = mapFindFolderResponseToGql(
                    singleResponseMessage,
                    mailboxInfoInput,
                    shouldShowFolder('junkemail'),
                    shouldShowFolder('notes')
                );
            } catch (e) {
                bottleneckReason = 'm';
                addBottleneck(bottleneck + '_c', e.message);
            }
        }
    }

    addBottleneck('ffr', bottleneckReason);
    return result;
}
