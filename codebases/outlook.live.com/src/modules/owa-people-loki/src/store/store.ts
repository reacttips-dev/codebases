import type LokiStore from './schema/lokiStore';
import { createStore } from 'satcheljs';

var initializeLokiStore: LokiStore = {
    isInitialized: false,
};
var store = createStore<LokiStore>('loki', initializeLokiStore)();

export default store;
