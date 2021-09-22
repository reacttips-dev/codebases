import { createStore } from 'satcheljs';
import type AmpStore from './schema/AmpStore';

const initialAmpStore: AmpStore = {
    allowedSenders: [],
};

const getStore = createStore<AmpStore>('ampstore', initialAmpStore);
export default getStore();
