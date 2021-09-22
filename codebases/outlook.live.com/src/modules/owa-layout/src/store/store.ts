import { createStore } from 'satcheljs';
import type OwaLayoutStore from './schema/owaLayoutStore';

const owaLayoutStore: OwaLayoutStore = {
    browserWidthBucket: null,
    areDisplayAdsEnabled: false,
};

export let getStore = createStore<OwaLayoutStore>('OwaLayout', owaLayoutStore);
