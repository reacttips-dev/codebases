import { isFeatureEnabled } from 'owa-feature-flags';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import {
    AdsAggregateOptions,
    TranslationOptions,
    CalendarHelpOptions,
    CalendarSurfaceOptions,
    BohemiaOptions,
    GdprAdsV3Options,
    ProofingOptions,
    ActiveProxyAddressOptions,
    AmpDeveloperOptions,
    LinkedInViewProfileOptions,
    EventCaptureOptions,
    ExternalImagesOptions,
    CalendarSurfaceAddinsOptions,
    OwsOptionsFeatureType,
    ComposeAssistanceOptions,
    ConfettiOptions,
    DiverseEmojisOptions,
    SurfaceActionsOptions,
    SmartSuggestionsOptions,
    SkypeNotificationOptions,
    OwsOptionsBase,
    OutlookSpacesOptions,
    SxSOptions,
    EditOptionsCommand,
    ReadingPaneConversationOptions,
    ListViewColumnHeadersOptions,
    MailLayoutOptions,
    SearchOptions,
    LgpdAdsOptions,
    MicrosoftChoiceOptions,
} from 'owa-outlook-service-option-store';

export type DefaultOptionsType = { [key: number]: Partial<OwsOptionsBase> };

/**
 * These are the default options to use when we have successfully retrieved the user's options,
 * and they have not yet set any of the values for a given feature's options.
 *
 * Options are loaded into the store from the sources. First, some options are pulled down
 * as a part of session data. Store values are set up for these options in `userConfigurationSetMutator`.
 * All options are pulled down later in the boot flow when the `loadOptions` request is made. It is after this
 * request is made that these default options are applied.
 *
 * These are distinct from the "fail-safe" options specified in the default store value in store.ts
 */
export default function getDefaultOptions(): DefaultOptionsType {
    return {
        [OwsOptionsFeatureType.AdsAggregate]: {
            feature: OwsOptionsFeatureType.AdsAggregate,
            nativeAdsSeenRunningSum: 0,
            nativeAdsClickedRunningSum: 0,
            nativeCPMRunningSum: 0,
            wasAdSeenInLastSession: false,
            startOfAdFreeTrial: '',
        } as AdsAggregateOptions,
        [OwsOptionsFeatureType.SmartSuggestions]: {
            smartSuggestionsEnabled: true,
            browserLocationEnabled: false,
        } as SmartSuggestionsOptions,
        [OwsOptionsFeatureType.DiverseEmojis]: {
            diverseEmojisSelectedSkinTone: '',
        } as DiverseEmojisOptions,
        [OwsOptionsFeatureType.SurfaceActions]: {
            readSurfaceActions: ['Reply', 'ReplyAll', 'Forward'].concat(
                !isConsumer() ? ['LikeUnlike'] : []
            ),
            readSurfaceAddins: [],
            composeSurfaceActions: [
                'AddAttachment',
                'AddClassicAttachment',
                'InsertLink',
                'AddInlineImage',
                'AddEmoji',
                'ToggleDictation',
                'ProofingOptions',
                'QuickUse',
                'ToggleRibbon',
                'FluidHeroButton',
            ],
            composeSurfaceAddins: [],
        } as SurfaceActionsOptions,
        [OwsOptionsFeatureType.SkypeNotifications]: {
            skypeMessageNotification: 1, // Toast and Sound
            skypeCallingNotification: 1, // Toast and Sound
        } as SkypeNotificationOptions,
        [OwsOptionsFeatureType.Confetti]: {
            confettiEnabled: true,
        } as ConfettiOptions,
        [OwsOptionsFeatureType.ComposeAssistance]: {
            composeAssistanceEnabled: true,
        } as ComposeAssistanceOptions,
        [OwsOptionsFeatureType.CalendarSurfaceAddins]: {
            calendarSurfaceAddins: [],
        } as CalendarSurfaceAddinsOptions,
        [OwsOptionsFeatureType.ExternalImages]: {
            externalImagesSelectedOption: 0, //Display via image proxy
        } as ExternalImagesOptions,
        [OwsOptionsFeatureType.EventCapture]: {
            autoCollectionEnabled: false,
        } as EventCaptureOptions,
        [OwsOptionsFeatureType.Translation]: {
            translationMode: 0,
            targetLanguage: '',
            excludedLanguages: [],
        } as TranslationOptions,
        [OwsOptionsFeatureType.CalendarSurfaceOptions]: {
            agendaPaneIsClosed: false,
            lastKnownRoamingTimeZone: null,
            roamingTimeZoneNotificationsIsDisabled: false,
            allDayWellHeight: 0,
            numDaysInDayRange: 1,
            workLifeView: 3,
        } as CalendarSurfaceOptions,
        [OwsOptionsFeatureType.AmpDeveloper]: {
            enabled: isFeatureEnabled('rp-ampDefault'),
            allowedSender: [],
        } as AmpDeveloperOptions,
        [OwsOptionsFeatureType.CalendarHelp]: {
            calendarHelpEnabled: false,
        } as CalendarHelpOptions,
        [OwsOptionsFeatureType.LinkedInViewProfile]: {
            dismissed: false,
        } as LinkedInViewProfileOptions,
        [OwsOptionsFeatureType.Bohemia]: {
            bohemiaEnabled: isFeatureEnabled('cmp-prague'),
        } as BohemiaOptions,
        [OwsOptionsFeatureType.GdprAdsV3]: {
            feature: OwsOptionsFeatureType.GdprAdsV3,
            encodedTCString: null,
            allStoreAndAccessDevice: false,
            allowDevelopAndImproveProduct: false,
            allowPersonalisedAds: false,
            allowPersonalisedAdsSelectBasicAd: false,
            allowPersonalisedAdsApplyMarketResearch: false,
            allowPersonalisedAdsMeasureContentPerformance: false,
            allowPersonalisedAdsSelectPersonalisedAds: false,
            allowPersonalisedAdsMeasureAdPerf: false,
            allowPersonalisedAdsSelectPersonalisedContent: false,
            allowPersonalisedAdsCreatePersonalisedContentProfile: false,
            allowPersonalisedAdsCreatePersonalisedAdsProfile: false,
            allowPreciseGeoDataAndIdentifyDevice: false,
            allowPreciseGeoDataAndIdentifyDeviceScanDevice: false,
            allowPreciseGeoDataAndIdentifyDeviceGeoData: false,
            disselectedVendorId: [],
            selectedVendorId: [],
        } as GdprAdsV3Options,
        [OwsOptionsFeatureType.Proofing]: {
            feature: OwsOptionsFeatureType.Proofing,
            spellCheckEnabled: true,
            grammarEnabled: true,
            writingRefinementsEnabled: true,
            proofingLocale: undefined,
            overriddenOptions: undefined,
            isTonalFreExperienceEnabled: true,
        } as ProofingOptions,
        [OwsOptionsFeatureType.ActiveProxyAddress]: {
            feature: OwsOptionsFeatureType.ActiveProxyAddress,
            activeProxyAddresses: [],
        } as ActiveProxyAddressOptions,
        [OwsOptionsFeatureType.OutlookSpaces]: {
            feature: OwsOptionsFeatureType.OutlookSpaces,
            backgroundColor: '',
            gestureScheme: 'pointer',
            toolboxCollapsed: true,
        } as OutlookSpacesOptions,
        [OwsOptionsFeatureType.SxS]: {
            feature: OwsOptionsFeatureType.SxS,
            hideReadingPane: false,
            defaultEditCommand: EditOptionsCommand.EditInBrowser,
        } as SxSOptions,
        [OwsOptionsFeatureType.ReadingPaneConversation]: {
            feature: OwsOptionsFeatureType.ReadingPaneConversation,
            conversationEnabled: true,
            conversationEnabledNativeHost: false,
        } as ReadingPaneConversationOptions,
        [OwsOptionsFeatureType.ListViewColumnHeaders]: {
            feature: OwsOptionsFeatureType.ListViewColumnHeaders,
            senderColumnWidth: 332,
            subjectColumnWidth: 1000,
            receivedColumnWidth: isFeatureEnabled('mon-tri-mailListItemHoverDeleteSlv') ? 215 : 80,
        } as ListViewColumnHeadersOptions,
        [OwsOptionsFeatureType.MailLayoutOptions]: {
            feature: OwsOptionsFeatureType.MailLayoutOptions,
            useSingleLineMessageListWithRightReadingPane: false,
        } as MailLayoutOptions,
        [OwsOptionsFeatureType.Search]: {
            feature: OwsOptionsFeatureType.Search,
            defaultSearchScope: 0,
        } as SearchOptions,
        [OwsOptionsFeatureType.LgpdAds]: {
            feature: OwsOptionsFeatureType.LgpdAds,
            optIn: false,
            optInBit: 0,
        } as LgpdAdsOptions,
        [OwsOptionsFeatureType.MicrosoftChoice]: {
            feature: OwsOptionsFeatureType.MicrosoftChoice,
            optOut: false,
        } as MicrosoftChoiceOptions,
    };
}
