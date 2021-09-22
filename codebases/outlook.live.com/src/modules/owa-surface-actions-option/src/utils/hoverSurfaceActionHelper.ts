import MailTriageAction from 'owa-service/lib/contract/MailTriageAction';
import type SurfaceActionsOptionState from '../store/schema/SurfaceActionsOptionState';
import type { HoverActionKey } from 'owa-outlook-service-options';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
export interface SelectSurfaceActionsOptionState {
    optionState: SurfaceActionsOptionState;
}
export function getMailTriageActionsFromHoverActionKeys(
    hoverActionKeys: HoverActionKey[]
): MailTriageAction[] {
    let actionKeys: MailTriageAction[] = [];
    hoverActionKeys.forEach(action => {
        switch (action) {
            case 'None':
                actionKeys.push(0);
                break;
            case 'Delete':
                actionKeys.push(1);
                break;
            case 'Archive':
                actionKeys.push(2);
                break;
            case 'PinUnpin':
                actionKeys.push(3);
                break;
            case 'ReadUnread':
                actionKeys.push(4);
                break;
            case 'FlagUnflag':
                actionKeys.push(5);
                break;
            case 'Move':
                actionKeys.push(6);
                break;
        }
    });
    return actionKeys;
}

export default function getHoverSurfaceAction(): HoverActionKey[] {
    const viewStateConfiguration = getUserConfiguration().ViewStateConfiguration;
    const mailTriageActions = viewStateConfiguration.MailTriageOnHoverActions;
    let hoverKeys: HoverActionKey[] = [];
    mailTriageActions.forEach(action => {
        switch (action) {
            case MailTriageAction.None:
                hoverKeys.push('None');
                break;
            case MailTriageAction.Delete:
                hoverKeys.push('Delete');
                break;
            case MailTriageAction.Archive:
                hoverKeys.push('Archive');
                break;
            case MailTriageAction.PinUnpin:
                hoverKeys.push('PinUnpin');
                break;
            case MailTriageAction.FlagUnflag:
                hoverKeys.push('FlagUnflag');
                break;
            case MailTriageAction.ReadUnread:
                hoverKeys.push('ReadUnread');
                break;
            case MailTriageAction.Move:
                hoverKeys.push('Move');
                break;
        }
    });
    return hoverKeys;
}
