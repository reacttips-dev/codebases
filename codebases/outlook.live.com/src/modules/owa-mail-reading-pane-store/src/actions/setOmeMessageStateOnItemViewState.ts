import { mutatorAction } from 'satcheljs';
import type ItemViewState from '../store/schema/ItemViewState';
import type OmeMessageState from 'owa-mail-revocation/lib/store/schema/OmeMessageState';

export const setOmeMessageStateOnItemViewState = mutatorAction(
    'SET_OME_MESSAGE_STATE',
    (itemViewState: ItemViewState, omeMessageState: OmeMessageState) => {
        itemViewState.omeMessageState = omeMessageState;
    }
);
