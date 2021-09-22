import type * as Schema from 'owa-graph-schema';
import type OwaUserConfiguration from 'owa-service/lib/contract/OwaUserConfiguration';
import type PrimeBootSettings from 'owa-service/lib/contract/PrimeBootSettings';
import type SessionSettings from 'owa-service/lib/contract/SessionSettingsType';
import WebSessionType from 'owa-service/lib/contract/WebSessionType';
import type UserOptions from 'owa-service/lib/contract/UserOptionsType';
import WeatherEnabledStatus from 'owa-service/lib/contract/WeatherEnabledStatus';
import type ViewStateConfiguration from 'owa-service/lib/contract/OwaViewStateConfiguration';
import TemperatureUnit from 'owa-service/lib/contract/TemperatureUnit';
import type WeatherTemperatureUnit from 'owa-service/lib/contract/WeatherTemperatureUnit';
import LocalEventsEnabledStatus from 'owa-service/lib/contract/LocalEventsEnabledStatus';
import NewNotification from 'owa-service/lib/contract/NewNotification';
import FontFlags from 'owa-service/lib/contract/FontFlags';
import Pont from 'owa-service/lib/contract/PontType';
import KeyboardShortcutsMode from 'owa-service/lib/contract/KeyboardShortcutsMode';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import ClientTypeOptInState from 'owa-service/lib/contract/ClientTypeOptInState';
import MailSwipeAction from 'owa-service/lib/contract/MailSwipeAction';
import MailTriageAction from 'owa-service/lib/contract/MailTriageAction';
import type UnifiedGroupsSets from 'owa-service/lib/contract/UnifiedGroupsSetsType';
import type UnifiedGroupsSet from 'owa-service/lib/contract/UnifiedGroupsSet';
import UnifiedGroupsFilterType from 'owa-service/lib/contract/UnifiedGroupsFilterType';
import GroupsSetType from 'owa-service/lib/contract/GroupsSetType';
import type RetentionPolicyTag from 'owa-service/lib/contract/RetentionPolicyTag';
import RetentionActionType from 'owa-service/lib/contract/RetentionActionType';
import ElcFolderType from 'owa-service/lib/contract/ElcFolderType';

function convertPrimeSettingsToGraphQLSchema(
    primeSettings?: PrimeBootSettings
): Schema.PrimeBootSettings {
    const settings = {} as Schema.PrimeBootSettings;

    primeSettings?.Items?.forEach(item => {
        if (item.Id) {
            settings[item.Id] = item.Value;
        }
    });

    return settings;
}

const webSessionType = (type: WebSessionType | undefined): Schema.WebSessionType | null => {
    switch (type) {
        case WebSessionType.Business:
            return 'Business';
        case WebSessionType.ExoConsumer:
            return 'ExoConsumer';
        case WebSessionType.GMail:
            return 'GMail';
        default:
            return null;
    }
};

const weatherEnabledStatus = (
    type: WeatherEnabledStatus | undefined
): Schema.WeatherEnabledStatus | null => {
    switch (type) {
        case WeatherEnabledStatus.Disabled:
            return 'Disabled';
        case WeatherEnabledStatus.Enabled:
            return 'Enabled';
        case WeatherEnabledStatus.FirstRun:
            return 'FirstRun';
        default:
            return null;
    }
};

const temperatureUnit = (
    type: TemperatureUnit | WeatherTemperatureUnit | undefined
): Schema.TemperatureUnit | null => {
    switch (type) {
        case TemperatureUnit.Celsius:
            return 'Celsius';
        case TemperatureUnit.Default:
            return 'Default';
        case TemperatureUnit.Fahrenheit:
            return 'Fahrenheit';
        default:
            return null;
    }
};

const localEventsEnabledStatus = (
    type: LocalEventsEnabledStatus | undefined
): Schema.LocalEventsEnabledStatus | null => {
    switch (type) {
        case LocalEventsEnabledStatus.Disabled:
            return 'Disabled';
        case LocalEventsEnabledStatus.Enabled:
            return 'Enabled';
        case LocalEventsEnabledStatus.FirstRun:
            return 'FirstRun';
        default:
            return null;
    }
};

const newNotification = (type: NewNotification | undefined): Schema.NewNotification | null => {
    switch (type) {
        case NewNotification.EMailToast:
            return 'EmailToast';
        case NewNotification.FaxToast:
            return 'FaxToast';
        case NewNotification.None:
            return 'None';
        case NewNotification.Sound:
            return 'Sound';
        case NewNotification.VoiceMailToast:
            return 'VoiceMailToast';
        default:
            return null;
    }
};

const fontFlags = (type: FontFlags | undefined): Schema.FontFlags | null => {
    switch (type) {
        case FontFlags.All:
            return 'All';
        case FontFlags.Bold:
            return 'Bold';
        case FontFlags.Italic:
            return 'Italic';
        case FontFlags.Normal:
            return 'Normal';
        case FontFlags.Underline:
            return 'Underline';
        default:
            return null;
    }
};

const keyboardShortcutsMode = (
    type: KeyboardShortcutsMode | undefined
): Schema.KeyboardShortcutsMode | null => {
    switch (type) {
        case KeyboardShortcutsMode.Gmail:
            return 'Gmail';
        case KeyboardShortcutsMode.Hotmail:
            return 'Hotmail';
        case KeyboardShortcutsMode.Off:
            return 'Off';
        case KeyboardShortcutsMode.Owa:
            return 'Owa';
        case KeyboardShortcutsMode.Yahoo:
            return 'Yahoo';
        default:
            return null;
    }
};

const reactListViewType = (
    type: ReactListViewType | undefined
): Schema.ReactListViewType | null => {
    switch (type) {
        case ReactListViewType.CalendarItems:
            return 'CalendarItems';
        case ReactListViewType.Conversation:
            return 'Conversation';
        case ReactListViewType.Message:
            return 'Message';
        default:
            return null;
    }
};

const clientTypeOptInState = (
    type: ClientTypeOptInState | undefined
): Schema.ClientTypeOptInState | null => {
    switch (type) {
        case ClientTypeOptInState.Jsmvvm:
            return 'Jsmvvm';
        case ClientTypeOptInState.None:
            return 'None';
        case ClientTypeOptInState.React:
            return 'React';
        default:
            return null;
    }
};

const mailSwipeAction = (type: MailSwipeAction | undefined): Schema.MailSwipeAction | null => {
    switch (type) {
        case MailSwipeAction.Archive:
            return 'Archive';
        case MailSwipeAction.Delete:
            return 'Delete';
        case MailSwipeAction.None:
            return 'None';
        case MailSwipeAction.ToggleFlag:
            return 'ToggleFlag';
        case MailSwipeAction.TogglePin:
            return 'TogglePin';
        case MailSwipeAction.ToggleRead:
            return 'ToggleRead';
        default:
            return null;
    }
};

const pont = (type: Pont | undefined): Schema.Pont | null => {
    switch (type) {
        case Pont.None:
            return 'None';
        case Pont.ExternalLink:
            return 'ExternalLink';
        case Pont.DeleteFlaggedMessage:
            return 'DeleteFlaggedMessage';
        case Pont.DeleteFlaggedContacts:
            return 'DeleteFlaggedContacts';
        case Pont.DeleteFlaggedItems:
            return 'DeleteFlaggedItems';
        case Pont.DeleteOutlookDisabledRules:
            return 'DeleteOutlookDisabledRules';
        case Pont.DisabledRulesLeft:
            return 'DisabledRulesLeft';
        case Pont.DeleteConversation:
            return 'DeleteConversation';
        case Pont.IgnoreConversation:
            return 'IgnoreConversation';
        case Pont.CancelIgnoreConversation:
            return 'CancelIgnoreConversation';
        case Pont.FilteredByUnread:
            return 'FilteredByUnread';
        case Pont.DeleteAllClutter:
            return 'DeleteAllClutter';
        case Pont.ShowFirstRunModalDialog:
            return 'ShowFirstRunModalDialog';
        case Pont.StopShowConsumerPromotion:
            return 'StopShowConsumerPromotion';
        case Pont.ShowAdsEdgePromotionMiddle:
            return 'ShowAdsEdgePromotionMiddle';
        case Pont.UseUCMALegacyChat:
            return 'UseUCMALegacyChat';
        case Pont.DonotShowAds:
            return 'DonotShowAds';
        case Pont.FocusedInboxFirstRunExperience:
            return 'FocusedInboxFirstRunExperience';
        case Pont.ShowGroupsAppUpsellBanner:
            return 'ShowGroupsAppUpsellBanner';
        case Pont.HideUpNextAgendaButtonLabel:
            return 'HideUpNextAgendaButtonLabel';
        case Pont.FocusedInboxFeedback:
            return 'FocusedInboxFeedback';
        case Pont.NotO365HomesubscribedUser:
            return 'NotO365HomesubscribedUser';
        case Pont.SweepGreyEmails:
            return 'SweepGreyEmails';
        case Pont.ReactDefaultSettingsOverride:
            return 'ReactDefaultSettingsOverride';
        case Pont.AdsExperiments:
            return 'AdsExperiments';
        case Pont.AdsDisplayOn:
            return 'AdsDisplayOn';
        case Pont.AdsNativeOn:
            return 'AdsNativeOn';
        case Pont.AdsFocusOnOnly:
            return 'AdsFocusOnOnly';
        case Pont.ShowGetStartedPane:
            return 'ShowGetStartedPane';
        case Pont.GdprAdsPrefNotSet:
            return 'GdprAdsPrefNotSet';
        case Pont.GetStartedEnabledViaNewUserPath:
            return 'GetStartedEnabledViaNewUserPath';
        case Pont.OneNoteFeedEverInitialized:
            return 'OneNoteFeedEverInitialized';
        case Pont.All:
            return 'All';
        default:
            return null;
    }
};

const mailTriageAction = (type: MailTriageAction): Schema.MailTriageAction => {
    switch (type) {
        case MailTriageAction.Archive:
            return 'Archive';
        case MailTriageAction.Delete:
            return 'Delete';
        case MailTriageAction.None:
            return 'None';
        case MailTriageAction.FlagUnflag:
            return 'FlagUnflag';
        case MailTriageAction.Move:
            return 'Move';
        case MailTriageAction.PinUnpin:
            return 'PinUnpin';
        case MailTriageAction.ReadUnread:
            return 'ReadUnread';
    }
};

const unifiedGroupsFilterType = (
    type: UnifiedGroupsFilterType | undefined
): Schema.UnifiedGroupsFilterType | null => {
    switch (type) {
        case UnifiedGroupsFilterType.All:
            return 'All';
        case UnifiedGroupsFilterType.DistributionGroups:
            return 'DistributionGroups';
        case UnifiedGroupsFilterType.ExcludeFavorites:
            return 'ExcludeFavorites';
        case UnifiedGroupsFilterType.FamilyGroup:
            return 'FamilyGroup';
        case UnifiedGroupsFilterType.Favorites:
            return 'Favorites';
        case UnifiedGroupsFilterType.PublicOnly:
            return 'PublicOnly';
        default:
            return null;
    }
};

const groupsSetType = (type: GroupsSetType | undefined): Schema.GroupsSetType | null => {
    switch (type) {
        case GroupsSetType.MemberOfUnifiedGroups:
            return 'MemberOfUnifiedGroups';
        case GroupsSetType.OwnerOfDeletedUnifiedGroups:
            return 'OwnerOfDeletedUnifiedGroups';
        default:
            return null;
    }
};

const retentionAction = (type: RetentionActionType | undefined): Schema.RetentionAction | null => {
    switch (type) {
        case RetentionActionType.DeleteAndAllowRecovery:
            return 'DeleteAndAllowRecovery';
        case RetentionActionType.MarkAsPastRetentionLimit:
            return 'MarkAsPastRetentionLimit';
        case RetentionActionType.MoveToArchive:
            return 'MoveToArchive';
        case RetentionActionType.MoveToDeletedItems:
            return 'MoveToDeletedItems';
        case RetentionActionType.MoveToFolder:
            return 'MoveToFolder';
        case RetentionActionType.None:
            return 'None';
        case RetentionActionType.PermanentlyDelete:
            return 'PermanentlyDelete';
        default:
            return null;
    }
};
const elcFolderType = (type: ElcFolderType | undefined): Schema.ElcFolderType | null => {
    switch (type) {
        case ElcFolderType.Calendar:
            return 'Calendar';
        case ElcFolderType.Contacts:
            return 'Contacts';
        case ElcFolderType.DeletedItems:
            return 'DeletedItems';
        case ElcFolderType.Drafts:
            return 'Drafts';
        case ElcFolderType.Inbox:
            return 'Inbox';
        case ElcFolderType.JunkEmail:
            return 'JunkEmail';
        case ElcFolderType.Journal:
            return 'Journal';
        case ElcFolderType.Notes:
            return 'Notes';
        case ElcFolderType.Outbox:
            return 'Outbox';
        case ElcFolderType.SentItems:
            return 'SentItems';
        case ElcFolderType.Tasks:
            return 'Tasks';
        case ElcFolderType.All:
            return 'All';
        case ElcFolderType.ManagedCustomFolder:
            return 'ManagedCustomFolder';
        case ElcFolderType.RssSubscriptions:
            return 'RssSubscriptions';
        case ElcFolderType.SyncIssues:
            return 'SyncIssues';
        case ElcFolderType.ConversationHistory:
            return 'ConversationHistory';
        case ElcFolderType.Personal:
            return 'Personal';
        case ElcFolderType.RecoverableItems:
            return 'RecoverableItems';
        case ElcFolderType.NonIpmRoot:
            return 'NonIpmRoot';
        default:
            return null;
    }
};

const conversMailTriageActionsToGraphQLSchema = (
    actions: MailTriageAction[] | undefined
): Schema.MailTriageAction[] | null => {
    return actions ? actions.map(mailTriageAction) : null;
};

const convertUnifiedGroupsSetToGraphQLSchema = (
    groupSet: UnifiedGroupsSet
): Schema.UnifiedGroupsSet => {
    return {
        ...groupSet,
        FilterType: unifiedGroupsFilterType(groupSet?.FilterType),
        GroupsSetType: groupsSetType(groupSet?.GroupsSetType),
    };
};

const convertUnifiedGroupsSetsToGraphQLSchema = (
    groupSets: UnifiedGroupsSet[] | undefined
): Schema.UnifiedGroupsSet[] | null => {
    return groupSets ? groupSets.map(convertUnifiedGroupsSetToGraphQLSchema) : null;
};

const convertSessionSettingsToGraphQLSchema = (
    sessionSettings?: SessionSettings
): Schema.SessionSettings => {
    return {
        ...sessionSettings,
        WebSessionType: webSessionType(sessionSettings?.WebSessionType),
    };
};

const convertUserOptionsToGraphQLSchema = (userOptions?: UserOptions): Schema.UserOptions => {
    return {
        ...userOptions,
        WeatherEnabled: weatherEnabledStatus(userOptions?.WeatherEnabled),
        WeatherUnit: temperatureUnit(userOptions?.WeatherUnit),
        LocalEventsEnabled: localEventsEnabledStatus(userOptions?.LocalEventsEnabled),
        NewItemNotify: newNotification(userOptions?.NewItemNotify),
        ComposeFontFlags: fontFlags(userOptions?.ComposeFontFlags),
        NewEnabledPonts: pont(userOptions?.NewEnabledPonts),
        KeyboardShortcutsMode: keyboardShortcutsMode(userOptions?.KeyboardShortcutsMode),
        GlobalListViewTypeReact: reactListViewType(userOptions?.GlobalListViewTypeReact),
        ClientTypeOptInState: clientTypeOptInState(userOptions?.ClientTypeOptInState),
        TasksClientTypeOptInState: clientTypeOptInState(userOptions?.TasksClientTypeOptInState),
    };
};

const convertViewStateConfigurationToGraphQLSchema = (
    viewStateConfiguration?: ViewStateConfiguration
): Schema.ViewStateConfiguration => {
    return {
        ...viewStateConfiguration,
        TemperatureUnit: temperatureUnit(viewStateConfiguration?.TemperatureUnit),
        MailLeftSwipeAction: mailSwipeAction(viewStateConfiguration?.MailLeftSwipeAction),
        MailRightSwipeAction: mailSwipeAction(viewStateConfiguration?.MailRightSwipeAction),
        MailTriageOnHoverActions: conversMailTriageActionsToGraphQLSchema(
            viewStateConfiguration?.MailTriageOnHoverActions
        ),
    };
};

const convertGroupSetsToGraphQLSchema = (
    groupSets?: UnifiedGroupsSets
): Schema.UnifiedGroupsSets => {
    return {
        UnifiedGroupsSets: convertUnifiedGroupsSetsToGraphQLSchema(groupSets?.UnifiedGroupsSets),
    };
};

const convertRetentionPolicyTagToGraphQLSchema = (
    policyTag: RetentionPolicyTag
): Schema.RetentionPolicyTag => {
    return {
        ...policyTag,
        Type: elcFolderType(policyTag.Type),
        RetentionAction: retentionAction(policyTag.RetentionAction),
    };
};

const convertRetentionPolicyTagsToGraphQLSchema = (
    policyTags?: RetentionPolicyTag[] | undefined
): Schema.RetentionPolicyTag[] | null => {
    return policyTags ? policyTags.map(convertRetentionPolicyTagToGraphQLSchema) : null;
};

export function convertUserConfigToGraphQLSchema(
    config: OwaUserConfiguration,
    id?: string
): Schema.UserConfiguration {
    return {
        __typename: 'UserConfiguration',
        id: id,
        ...config,
        PrimeSettings: convertPrimeSettingsToGraphQLSchema(config.PrimeSettings),
        UserOptions: convertUserOptionsToGraphQLSchema(config.UserOptions),
        SessionSettings: convertSessionSettingsToGraphQLSchema(config.SessionSettings),
        ViewStateConfiguration: convertViewStateConfigurationToGraphQLSchema(
            config.ViewStateConfiguration
        ),
        GroupsSets: convertGroupSetsToGraphQLSchema(config.GroupsSets),
        RetentionPolicyTags: convertRetentionPolicyTagsToGraphQLSchema(config.RetentionPolicyTags),
    } as Schema.UserConfiguration;
}
