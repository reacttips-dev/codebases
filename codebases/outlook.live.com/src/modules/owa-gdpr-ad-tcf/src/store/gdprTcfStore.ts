import type GdprTcfViewState from './schema/GdprTcfViewState';
import { createStore } from 'satcheljs';

const gdprTcfViewStateData: GdprTcfViewState = {
    gdprTcfString: null,
    firstPartyCookieFlag: 0,
};

export let getStore = createStore<GdprTcfViewState>('gdprTcfViewState', gdprTcfViewStateData);

const gdprTcfStore = getStore();
export default gdprTcfStore;
