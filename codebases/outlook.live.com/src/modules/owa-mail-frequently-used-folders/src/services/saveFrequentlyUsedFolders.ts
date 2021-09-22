import { updateUserConfigurationAndService } from 'owa-session-store/lib/utils/updateUserConfigurationAndService';
import { getStore } from '../store/store';
import { trace } from 'owa-trace';

// save frequently used folder list to the server
export default function saveFrequentlyUsedFolders() {
    const serializedFolders: string[] = [];
    getStore().frequentlyUsedFolders.forEach(folder => {
        serializedFolders.push(JSON.stringify(folder));
    });

    updateUserConfigurationAndService(
        config => {
            config.UserOptions.FrequentlyUsedFolders = serializedFolders;
        },
        [{ key: 'FrequentlyUsedFolders', valuetype: 'StringArray', value: serializedFolders }]
    ).catch(error => {
        // no-op if FUF fails to update
        trace.warn(`saveFrequentlyUsedFolders: ${error}`);
    });
}
