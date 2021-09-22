import type OwaUserConfiguration from 'owa-service/lib/contract/OwaUserConfiguration';
import type FolderId from 'owa-service/lib/contract/FolderId';
import addFolderToDefaultFolderMappings from './addFolderToDefaultFolderMappings';
import store from '../store/store';
import { mutatorAction } from 'satcheljs';
import { ObservableMap } from 'mobx';
import { userConfigurationSet } from './userConfigurationSet';
import { markFunction } from 'owa-performance';
import { set } from '../utils/nonObservableStoreUtils';

function initDistinguishedFolderMappings(
    defaultFolderNames: string[] | undefined,
    defaultFolderIds: FolderId[] | undefined
) {
    if (defaultFolderNames) {
        for (let i = 0; i < defaultFolderNames.length; i++) {
            let defaultFolderName = defaultFolderNames[i];
            if (!defaultFolderName) {
                // Folder list length is longer than the number of populated entries.
                // We're done once we hit an empty entry
                break;
            }

            let folderId = defaultFolderIds?.[i];
            if (!folderId) {
                // Some default folders we don't have folderId for various reasons (such as permission).
                continue;
            }

            addFolderToDefaultFolderMappings(defaultFolderName, folderId.Id);
        }
    }
}

const setUserConfigurationInternal = mutatorAction(
    'setUserConfiguration',
    (userConfig: OwaUserConfiguration) => {
        store.userConfiguration = userConfig || {};
    }
);

const setConnectedAccountsUserConfig = mutatorAction(
    'setConnectedAccountsUserConfig',
    (userConfig: OwaUserConfiguration, mailboxId: string) => {
        if (!store.connectedAccountsUserConfigurationMap) {
            store.connectedAccountsUserConfigurationMap = new ObservableMap({});
        }
        store.connectedAccountsUserConfigurationMap.set(mailboxId, userConfig || {});
    }
);

export default markFunction((userConfiguration: OwaUserConfiguration, mailboxId?: string): void => {
    const sessionSettings = userConfiguration.SessionSettings;

    // make sure we store these in a variable so we can initialize the folder mappings
    const defaultFolderNames = sessionSettings?.DefaultFolderNames;
    const defaultFolderIds = sessionSettings?.DefaultFolderIds;

    set('smime', userConfiguration.SmimeAdminSettings);
    delete userConfiguration.SmimeAdminSettings;
    set('groups', userConfiguration.GroupsSets);
    delete userConfiguration.GroupsSets;
    set('favorites', userConfiguration.Favorites);
    delete userConfiguration.Favorites;
    if (sessionSettings) {
        delete sessionSettings.DefaultFolderIds;
        delete sessionSettings.DefaultFolderNames;
    }
    if (!mailboxId) {
        setUserConfigurationInternal(userConfiguration);
        initDistinguishedFolderMappings(defaultFolderNames, defaultFolderIds);
    } else {
        setConnectedAccountsUserConfig(userConfiguration, mailboxId);
    }
    userConfigurationSet(userConfiguration, mailboxId);
}, 'uc');
