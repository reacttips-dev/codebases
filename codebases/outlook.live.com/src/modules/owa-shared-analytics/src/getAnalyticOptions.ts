import type { AnalyticsOptions } from 'owa-analytics';
import getMailAriaTenantTokens from 'owa-analytics/lib/utils/getMailAriaTenantTokens';

export function getAnalyticOptions(): AnalyticsOptions {
    return {
        ariaTenantTokens: getMailAriaTenantTokens(),
        flightControls: {
            client_event: {
                flight: 'ana-client-event',
                rate: 5,
            },
            client_error: {
                flight: 'ana-client-error',
            },
            client_verbose: {
                flight: 'ana-client-verbose',
                rate: 1,
            },
            client_network_request: {
                flight: 'ana-client-network-request',
                rate: 1,
            },
        },
        verboseWhiteListEvents: ['AttachmentRefreshDownloadToken', 'TabViewActivateTab'],
        qosDatapointNames: [
            'AddMemberModalSave',
            'CreateGrouptoAddMembers',
            'EditGroupModalSave',
            'ForwardInSMIME',
            'GroupFilesHubEnsureAuthToken',
            'GroupFilesHubListsLoad',
            'GroupMailComposeSend',
            'loadSuggestedGroupsAction',
            'MailComposeForward',
            'MailComposeNew',
            'MailComposeReply',
            'MailComposeReplyAll',
            'MailComposeSend',
            'MessageOptionsEmptyInvariantViolation',
            'MessageOptionsMultipleDialogsInvariantViolation',
            'NavigateFromMeToWe',
            'OpenItemPeek',
            'PreviewAttachmentInSxSE2E',
            'ReplyAllInSMIME',
            'ReplyInSMIME',
            'SaveCalendarEvent',
            'SearchEndToEnd',
            'SelectGroup',
            'SelectMailItem',
            'showFullCompose',
            'showFullComposeInEditMode',
            'showQuickCompose',
            'showReadingPane',
            'SwitchGroup',
            'SwitchMailFolder',
            'TnS_DeleteConversation',
            'TnS_DeleteItem',
            'ViewCalendarEvent',
        ],
        sampledQosDatapointNames: ['LoadGroupsInLeftNavFromSessionData'],
    };
}
