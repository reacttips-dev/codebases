import type SmartSuggestionsOptions from './schema/options/SmartSuggestionsOptions';
import { OwsOptionsFeatureType } from './schema/OwsOptionsFeatureType';
import type OwsOptionsStore from './schema/OwsOptionsStore';
import type DiverseEmojisOptions from './schema/options/DiverseEmojisOptions';
import type GdprAdsV3Options from './schema/options/GdprAdsV3Options';
import type SkypeNotificationOptions from './schema/options/SkypeNotificationOptions';
import type SurfaceActionsOptions from './schema/options/SurfaceActionsOptions';
import type WebPushNotificationsOptions from './schema/options/WebPushNotificationsOptions';
import type ConfettiOptions from './schema/options/ConfettiOptions';
import type CalendarSurfaceAddinsOptions from './schema/options/CalendarSurfaceAddinsOptions';
import { createStore } from 'satcheljs';
import type ExternalImagesOptions from './schema/options/ExternalImagesOptions';
import type EventCaptureOptions from './schema/options/EventCaptureOptions';
import type LinkedInViewProfileOptions from './schema/options/LinkedInViewProfileOptions';
import type TranslationOptions from './schema/options/TranslationOptions';
import type CalendarSurfaceOptions from './schema/options/CalendarSurfaceOptions';
import type MentionEventNotificationsOptions from './schema/options/MentionEventNotificationsOptions';
import type TxpEventNotificationsOptions from './schema/options/TxpEventNotificationsOptions';
import type ComposeAssistanceOptions from './schema/options/ComposeAssistanceOptions';
import type AmpDeveloperOptions from './schema/options/AmpDeveloperOptions';
import type ActivityFeedOptions from './schema/options/ActivityFeedOptions';
import type CalendarHelpOptions from './schema/options/CalendarHelpOptions';
import type BohemiaOptions from './schema/options/BohemiaOptions';
import type ProofingOptions from './schema/options/ProofingOptions';
import type ActiveProxyAddressOptions from './schema/options/ActiveProxyAddressOptions';
import type OutlookSpacesOptions from './schema/options/OutlookSpacesOptions';
import SxSOptions, { EditOptionsCommand } from './schema/options/SxSOptions';
import type ReadingPaneConversationOptions from './schema/options/ReadingPaneConversationOptions';
import type SearchOptions from './schema/options/SearchOptions';

export default createStore<OwsOptionsStore>('owsOptionsStore', {
    options: {
        /**
         * Initial values for options in the store should be "fail-safe" values in the
         *  event that the service call to fetch the options has not yet completed or failed.
         *
         * For example, while the default setting for a feature for a user that has made no
         * changes to the options may be to have it enabled, to increase coverage and
         * discoverability, we don't want to aggravate users by potentially having it
         * enabled after they explicitly disabled it.
         * These should be nulls/falses/empty arrays and the call to LoadOptions (LoadOptions.ts)
         * should be in charge to apply defaults for non-set options and fail cases
         */
        [OwsOptionsFeatureType.SmartSuggestions]: {
            feature: OwsOptionsFeatureType.SmartSuggestions,
            smartSuggestionsEnabled: false,
            browserLocationEnabled: false,
        } as SmartSuggestionsOptions,
        [OwsOptionsFeatureType.DiverseEmojis]: {
            feature: OwsOptionsFeatureType.DiverseEmojis,
            diverseEmojisSelectedSkinTone: '',
        } as DiverseEmojisOptions,
        [OwsOptionsFeatureType.SurfaceActions]: {
            feature: OwsOptionsFeatureType.SurfaceActions,
            readSurfaceActions: [],
            readSurfaceAddins: [],
            composeSurfaceActions: [],
            composeSurfaceAddins: [],
        } as SurfaceActionsOptions,
        [OwsOptionsFeatureType.SkypeNotifications]: {
            feature: OwsOptionsFeatureType.SkypeNotifications,
            skypeMessageNotification: 1, // Toast and Sound
            skypeCallingNotification: 1, // Toast and Sound
        } as SkypeNotificationOptions,
        [OwsOptionsFeatureType.WebPushNotifications]: {
            feature: OwsOptionsFeatureType.WebPushNotifications,
            enabled: false,
            applicationServerKey: null,
        } as WebPushNotificationsOptions,
        [OwsOptionsFeatureType.Confetti]: {
            feature: OwsOptionsFeatureType.Confetti,
            confettiEnabled: false,
        } as ConfettiOptions,
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
        [OwsOptionsFeatureType.CalendarSurfaceAddins]: {
            feature: OwsOptionsFeatureType.CalendarSurfaceAddins,
            calendarSurfaceAddins: [],
        } as CalendarSurfaceAddinsOptions,
        [OwsOptionsFeatureType.ExternalImages]: {
            feature: OwsOptionsFeatureType.ExternalImages,
            externalImagesSelectedOption: null,
        } as ExternalImagesOptions,
        [OwsOptionsFeatureType.EventCapture]: {
            autoCollectionEnabled: false,
        } as EventCaptureOptions,
        [OwsOptionsFeatureType.Translation]: {
            feature: OwsOptionsFeatureType.Translation,
            translationMode: 0,
            targetLanguage: '',
            excludedLanguages: [],
        } as TranslationOptions,
        [OwsOptionsFeatureType.CalendarSurfaceOptions]: {
            feature: OwsOptionsFeatureType.CalendarSurfaceOptions,
            agendaPaneIsClosed: true /** default agendaPaneIsClosed to true as we want the panel
            to remain closed until the updated option value is fetched */,
            /** default to undefined to distinguish between null (unset) and pending value fetch as we only
             * want to display notifcation if we're certain we're in a new time zone */
            lastKnownRoamingTimeZone: undefined,
            /** default to undefined distinguish between unset (true/false) and pending value fetch */
            roamingTimeZoneNotificationsIsDisabled: undefined,
            allDayWellHeight: 0 /** default AllDayWellHeight to 0 as we want the panel to only exist if user
            manually expands it*/,
            numDaysInDayRange: 1 /** default NumDaysInRange to 1 as that should be the default Day View state
            unless the user manually changes preference */,
            workLifeView: 3 /** default to work and life view both enabled */,
        } as CalendarSurfaceOptions,
        [OwsOptionsFeatureType.MentionEventNotifications]: {
            feature: OwsOptionsFeatureType.MentionEventNotifications,
            enabled: false,
        } as MentionEventNotificationsOptions,
        [OwsOptionsFeatureType.TxpEventNotifications]: {
            feature: OwsOptionsFeatureType.TxpEventNotifications,
            enabled: false,
        } as TxpEventNotificationsOptions,
        [OwsOptionsFeatureType.ComposeAssistance]: {
            feature: OwsOptionsFeatureType.ComposeAssistance,
            composeAssistanceEnabled: false,
        } as ComposeAssistanceOptions,
        [OwsOptionsFeatureType.AmpDeveloper]: {
            feature: OwsOptionsFeatureType.AmpDeveloper,
            enabled: true,
            allowedSender: [],
        } as AmpDeveloperOptions,
        [OwsOptionsFeatureType.ActivityFeed]: {
            feature: OwsOptionsFeatureType.ActivityFeed,
            OWASurfaceOptions: {
                SupportedTypes: [],
                DisabledInFeedPanel: [],
            },
        } as ActivityFeedOptions,
        [OwsOptionsFeatureType.LinkedInViewProfile]: {
            dismissed: false,
        } as LinkedInViewProfileOptions,
        [OwsOptionsFeatureType.CalendarHelp]: {
            feature: OwsOptionsFeatureType.CalendarHelp,
            calendarHelpEnabled: false,
        } as CalendarHelpOptions,
        [OwsOptionsFeatureType.Bohemia]: {
            feature: OwsOptionsFeatureType.Bohemia,
            bohemiaEnabled: false,
            fluidEnabledForTenant: false,
        } as BohemiaOptions,
        [OwsOptionsFeatureType.Proofing]: {
            feature: OwsOptionsFeatureType.Proofing,
            spellCheckEnabled: true,
            grammarEnabled: true,
            writingRefinementsEnabled: false,
            proofingLocale: undefined,
            overriddenOptions: undefined,
            isTonalFreExperienceEnabled: false,
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
        [OwsOptionsFeatureType.Search]: {
            feature: OwsOptionsFeatureType.Search,
            defaultSearchScope: undefined,
        } as SearchOptions,
    },
});
