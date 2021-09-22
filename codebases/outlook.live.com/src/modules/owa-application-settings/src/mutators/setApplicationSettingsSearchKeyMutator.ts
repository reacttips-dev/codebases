import { mutator } from 'satcheljs';

import setApplicationSettingsSearchKeyAction from '../actions/setApplicationSettingsSearchKeyAction';
import getStore from '../store/store';

const setApplicationSettingsSearchKeyMutator = mutator(
    setApplicationSettingsSearchKeyAction,
    ({ key }) => {
        const store = getStore();

        store.searchKey = key;
    }
);

export default setApplicationSettingsSearchKeyMutator;
