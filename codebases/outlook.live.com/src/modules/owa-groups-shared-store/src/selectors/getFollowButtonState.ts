import ActionState from '../schema/ActionState';
import followButtonStore from '../FollowButtonStore';

export function getFollowButtonState(groupSmtpAddress: string): ActionState {
    groupSmtpAddress = groupSmtpAddress.toLowerCase();

    const groupActionState = followButtonStore.groupActionState;

    if (groupActionState.has(groupSmtpAddress)) {
        return groupActionState.get(groupSmtpAddress);
    }
    return ActionState.None;
}
