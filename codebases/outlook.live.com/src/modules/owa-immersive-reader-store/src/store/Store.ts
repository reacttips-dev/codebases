import { createStore } from 'satcheljs';
import type ImmersiveReaderStore from './schema/ImmersiveReaderStore';
import ImmersiveReaderFrameState from './schema/ImmersiveReaderFrameState';
import { getGuid } from 'owa-guid';

const initialImmersiveReaderStore: ImmersiveReaderStore = {
    sessionId: getGuid(),
    isLoading: false,
    immersiveReaderFrameState: ImmersiveReaderFrameState.Closed,
    apiResponse: null,
};

export let getStore = createStore<ImmersiveReaderStore>(
    'immersivereader',
    initialImmersiveReaderStore
);
const store = getStore();

export default store;
