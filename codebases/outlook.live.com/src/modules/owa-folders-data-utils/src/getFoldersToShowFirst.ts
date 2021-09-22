import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import { isFeatureEnabled } from 'owa-feature-flags';
import type DistinguishedFolderIdName from 'owa-service/lib/contract/DistinguishedFolderIdName';

export function getFoldersToShowFirst(): DistinguishedFolderIdName[] {
    const firstFolders: DistinguishedFolderIdName[] = !isConsumer()
        ? ['inbox', 'drafts', 'sentitems', 'scheduled', 'deleteditems', 'junkemail', 'archive']
        : ['inbox', 'junkemail', 'drafts', 'sentitems', 'scheduled', 'deleteditems', 'archive'];

    if (isFeatureEnabled('notes-folder-view')) {
        firstFolders.push('notes');
    }

    return firstFolders;
}
