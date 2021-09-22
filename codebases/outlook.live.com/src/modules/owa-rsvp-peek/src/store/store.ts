import type RSVPPeekStore from './schema/RSVPPeekStore';
import { createStore } from 'satcheljs';

const defaultRSVPPeekStore: RSVPPeekStore = {
    itemId: null,
    entrySource: null,
    meetingRequestViewState: null,
};

export const getRSVPPeekStore = createStore<RSVPPeekStore>('RSVPPeekStore', defaultRSVPPeekStore);

export default getRSVPPeekStore();
