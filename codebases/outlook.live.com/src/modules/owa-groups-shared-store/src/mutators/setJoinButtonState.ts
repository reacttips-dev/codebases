import { mutatorAction } from 'satcheljs';
import joinButtonStore from '../JoinButtonStore';
import type ActionState from '../schema/ActionState';

export const setJoinButtonState = mutatorAction(
    'setJoinButtonState',
    function setJoinButtonState(groupSmtpAddress: string, newState: ActionState) {
        const groupActionState = joinButtonStore.groupActionState;
        groupActionState.set(groupSmtpAddress.toLowerCase(), newState);
    }
);

export default setJoinButtonState;
