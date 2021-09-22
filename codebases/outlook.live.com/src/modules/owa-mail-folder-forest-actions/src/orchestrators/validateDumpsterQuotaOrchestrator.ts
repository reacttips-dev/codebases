import { validateDumpsterQuota } from 'owa-storage-store/lib/actions/validateDumpsterQuota';
import {
    dumpsterQuota_Warning_Title,
    dumpsterQuota_Warning_Subtext,
    dumpsterQuota_Recoverables_Button,
} from './DumpsterQuota.locstring.json';
import loc from 'owa-localize';
import { confirm, DialogResponse } from 'owa-confirm-dialog';
import { PRIMARY_DUMPSTER_DISTINGUISHED_ID } from 'owa-folders-constants';
import { selectFolder } from '../index';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import { createLazyOrchestrator } from 'owa-bundling';
import { lazyExitOptionsFullPage } from 'owa-options-view';

export const validateDumpsterQuotaOrchestrator = createLazyOrchestrator(
    validateDumpsterQuota,
    'validateDumpsterQuota',
    () => tryValidateDumpsterQuotaHelper()
);

export async function tryValidateDumpsterQuotaHelper() {
    const response = await confirm(
        loc(dumpsterQuota_Warning_Title),
        loc(dumpsterQuota_Warning_Subtext),
        false,
        {
            okText: loc(dumpsterQuota_Recoverables_Button),
        }
    );

    if (response === DialogResponse.ok) {
        const exitOptionsPage = await lazyExitOptionsFullPage.import();
        // Checks if the mailbox cleanup page is open.
        exitOptionsPage();
        navigateToRecoverables();
    }
}

function navigateToRecoverables() {
    selectFolder(
        folderNameToId(PRIMARY_DUMPSTER_DISTINGUISHED_ID),
        'primaryFolderTree',
        'Dumpster'
    );
}
