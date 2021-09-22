import PopoutChildStore, { PopoutChildState } from './schema/PopoutChildStore';
import { createStore } from 'satcheljs';
import { POPOUT_V2_QUERY, POPOUT_V2_VALUE } from '../utils/constants';
import { getQueryStringParameter } from 'owa-querystring';

const childStoreData: PopoutChildStore = {
    state: PopoutChildState.NotStarted,
    isPopoutV2: getQueryStringParameter(POPOUT_V2_QUERY) == POPOUT_V2_VALUE,
};

export const getStore = createStore<PopoutChildStore>('popoutChild', childStoreData);

const childStore = getStore();
export default childStore;
