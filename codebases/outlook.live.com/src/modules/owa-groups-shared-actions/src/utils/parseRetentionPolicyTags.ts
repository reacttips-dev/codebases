import type * as Schema from 'owa-graph-schema';
import type RetentionPolicyTag from 'owa-service/lib/contract/RetentionPolicyTag';
import RetentionActionType from 'owa-service/lib/contract/RetentionActionType';
import ElcFolderType from 'owa-service/lib/contract/ElcFolderType';

function retentionAction(type: Schema.RetentionAction | null): RetentionActionType | undefined {
    switch (type) {
        case 'None':
            return RetentionActionType.None;
        case 'MoveToDeletedItems':
            return RetentionActionType.MoveToDeletedItems;
        case 'MoveToFolder':
            return RetentionActionType.MoveToFolder;
        case 'DeleteAndAllowRecovery':
            return RetentionActionType.DeleteAndAllowRecovery;
        case 'PermanentlyDelete':
            return RetentionActionType.PermanentlyDelete;
        case 'MarkAsPastRetentionLimit':
            return RetentionActionType.MarkAsPastRetentionLimit;
        case 'MoveToArchive':
            return RetentionActionType.MoveToArchive;
        default:
            return undefined;
    }
}

function elcFolderType(type: Schema.ElcFolderType | null): ElcFolderType | undefined {
    switch (type) {
        case 'Calendar':
            return ElcFolderType.Calendar;
        case 'Contacts':
            return ElcFolderType.Contacts;
        case 'DeletedItems':
            return ElcFolderType.DeletedItems;
        case 'Drafts':
            return ElcFolderType.Drafts;
        case 'Inbox':
            return ElcFolderType.Inbox;
        case 'JunkEmail':
            return ElcFolderType.JunkEmail;
        case 'Journal':
            return ElcFolderType.Journal;
        case 'Notes':
            return ElcFolderType.Notes;
        case 'Outbox':
            return ElcFolderType.Outbox;
        case 'SentItems':
            return ElcFolderType.SentItems;
        case 'Tasks':
            return ElcFolderType.Tasks;
        case 'All':
            return ElcFolderType.All;
        case 'ManagedCustomFolder':
            return ElcFolderType.ManagedCustomFolder;
        case 'RssSubscriptions':
            return ElcFolderType.RssSubscriptions;
        case 'SyncIssues':
            return ElcFolderType.SyncIssues;
        case 'ConversationHistory':
            return ElcFolderType.ConversationHistory;
        case 'Personal':
            return ElcFolderType.Personal;
        case 'RecoverableItems':
            return ElcFolderType.RecoverableItems;
        case 'NonIpmRoot':
            return ElcFolderType.NonIpmRoot;
        default:
            return undefined;
    }
}

function parseRetentionPolicyTag(policyTag: Schema.RetentionPolicyTag): RetentionPolicyTag {
    return {
        ...policyTag,
        Type: elcFolderType(policyTag.Type),
        RetentionAction: retentionAction(policyTag.RetentionAction),
    } as RetentionPolicyTag;
}

export default function parseRetentionPolicyTags(
    policyTags?: Schema.RetentionPolicyTag[] | null
): RetentionPolicyTag[] | null {
    return policyTags ? policyTags.map(parseRetentionPolicyTag) : null;
}
