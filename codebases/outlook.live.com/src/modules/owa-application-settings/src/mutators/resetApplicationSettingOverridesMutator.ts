import { mutator } from 'satcheljs';

import resetApplicationSettingOverridesAction from '../actions/resetApplicationSettingOverridesAction';
import getStore from '../store/store';

const resetApplicationSettingOverridesMutator = mutator(
    resetApplicationSettingOverridesAction,
    () => {
        const store = getStore();

        store.overrides = {};
    }
);

export default resetApplicationSettingOverridesMutator;
