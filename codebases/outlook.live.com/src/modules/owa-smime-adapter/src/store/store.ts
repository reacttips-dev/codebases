import type SmimeStore from './schema/SmimeStore';
import SmimeInstallationStatus from './schema/SmimeInstallationStatus';
import { createStore } from 'satcheljs';
import isBrowserSupportActiveX from '../utils/isBrowserSupportActiveX';

let initialSmimeStoreData: SmimeStore = {
    installationStatus: SmimeInstallationStatus.Unknown,
    isBrowserSupportActiveX: isBrowserSupportActiveX(),
    version: '',
};

export const getStore = createStore<SmimeStore>('SmimeStore', initialSmimeStoreData);

const smimeStore = getStore();

export default smimeStore;
