import { mutator } from 'satcheljs';

import setApplicationSettingOverrideAction from '../actions/setApplicationSettingOverrideAction';
import getStore from '../store/store';

const setApplicationSettingOverrideMutator = mutator(
    setApplicationSettingOverrideAction,
    ({ setting, value }) => {
        const store = getStore();

        store.overrides = {
            ...store.overrides,
            [setting]: value,
        };
    }
);

export default setApplicationSettingOverrideMutator;
