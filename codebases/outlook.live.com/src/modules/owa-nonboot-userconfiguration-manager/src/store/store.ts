import { createStore } from 'satcheljs';
import type NonBootUserConfigurationStore from './schema/NonBootUserConfigurationStore';

var initialNonBootUserConfigurationStore: NonBootUserConfigurationStore = {
    nonBootUserConfiguration: null,
};
var store = createStore<NonBootUserConfigurationStore>(
    'nonBootUserConfiguration',
    initialNonBootUserConfigurationStore
)();

export default store;
