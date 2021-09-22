import type CookieTargetingState from './schema/CookieTargetingState';
import { createStore } from 'satcheljs';

const cookieTargetingState: CookieTargetingState = {
    lgpdOptInBit: 0,
    gdprFirstPartyCookieOptInBit: 0,
    microsoftChoiceCookieOptOutBit: 0,
    effectiveOptInValue: true,
};

export let getStore = createStore<CookieTargetingState>(
    'cookieTargetingState',
    cookieTargetingState
);

const cookieTargetingStore = getStore();
export default cookieTargetingStore;
