import type OwaSessionStore from './schema/OwaSessionStore';
// tslint:disable-next-line:forbid-import
import * as satcheljs from 'satcheljs';
import { ObservableMap } from 'mobx';

const initialStore: OwaSessionStore = {
    userConfiguration: {},
    connectedAccountsUserConfigurationMap: new ObservableMap({}),
    defaultFolderNameToIdMap: new ObservableMap({}),
    defaultFolderIdToNameMap: new ObservableMap({}),
};

const getStore: () => OwaSessionStore = satcheljs.createStore('owaSessionStore', initialStore);
const store: OwaSessionStore = getStore();
export default store;
