import { mutatorAction } from 'satcheljs';
import followButtonStore from '../FollowButtonStore';
import type ActionState from '../schema/ActionState';

export const setFollowButtonState = mutatorAction(
    'setFollowButtonState',
    function setFollowButtonState(groupSmtpAddress: string, newState: ActionState) {
        const groupActionState = followButtonStore.groupActionState;

        groupActionState.set(groupSmtpAddress.toLowerCase(), newState);
    }
);

export default setFollowButtonState;
