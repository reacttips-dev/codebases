import { createStore } from 'satcheljs';
import type AppModuleStore from './schema/AppModuleStore';

export default createStore<AppModuleStore>('appModule', {
    module: undefined,
});
