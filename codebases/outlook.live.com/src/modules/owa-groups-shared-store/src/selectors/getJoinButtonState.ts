import ActionState from '../schema/ActionState';
import joinButtonStore from '../JoinButtonStore';

export function getJoinButtonState(groupSmtpAddress: string): ActionState {
    groupSmtpAddress = groupSmtpAddress.toLowerCase();

    const groupActionState = joinButtonStore.groupActionState;

    if (groupActionState.has(groupSmtpAddress)) {
        return groupActionState.get(groupSmtpAddress);
    }
    return ActionState.None;
}
