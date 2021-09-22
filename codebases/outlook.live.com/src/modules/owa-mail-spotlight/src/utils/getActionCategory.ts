import type { ActionType } from 'owa-mail-actions';

export enum ActionCategory {
    Unknown,
    Weak,
    Strong,
}

const getActionCategory = (interactionType: ActionType): ActionCategory => {
    switch (interactionType) {
        case 'CreateRule':
        case 'MarkAsRead':
        case 'MarkAsReadImplicit':
        case 'MarkAsUnread':
        case 'Snooze':
            return ActionCategory.Weak;
        case 'Block':
        case 'Categorize':
        case 'Delete':
        case 'Flag':
        case 'FlagCleared':
        case 'FlagComplete':
        case 'Forward':
        case 'Ignore':
        case 'Like':
        case 'MarkAsJunk':
        case 'MarkAsPhishing':
        case 'Move':
        case 'Pin':
        case 'Reaction':
        case 'Reply':
        case 'ReplyAll':
        case 'ReportAbuse':
        case 'Unpin':
            return ActionCategory.Strong;
        default:
            return ActionCategory.Unknown;
    }
};

export default getActionCategory;
