import { createStore } from 'satcheljs';
import type EmitterStore from './schema/EmitterStore';

var initialEmitterStore: EmitterStore = {
    emitters: {},
};
var store = createStore<EmitterStore>('resizeEmitters', initialEmitterStore)();

export default store;
