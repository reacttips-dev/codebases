import type {
    OUTLOOK_DESKTOP,
    MAC_OUTLOOK,
    IOS_OUTLOOK,
    ANDROID_OUTLOOK,
    NATIVE,
    TEAMS,
    O365_SHELL,
    WIDGET,
    WIN32_OUTLOOK_HUB,
    TEAMS_HUB,
    HUB,
} from 'owa-config';

// Very often we want to enable/disable a flag for all OPX scenarios at the same time.
// In order to not define a value for each OPX type we can use 'opx' fallback.
// In this case we are able to simplify a config, but still keep flexibility to define different values for each OPX type separately.
const OPX = 'opx';

// MetaOS
// HUB is the default set of values for when the app is hosted on the majority of the cases
// for special hubs where there few special deviations, we use WIN32_OUTLOOK_HUB or HUB
// to override any default value from HUB

export type HOST_APP_TYPES =
    | typeof OUTLOOK_DESKTOP
    | typeof MAC_OUTLOOK
    | typeof IOS_OUTLOOK
    | typeof ANDROID_OUTLOOK
    | typeof NATIVE
    | typeof TEAMS
    | typeof O365_SHELL
    | typeof OPX
    | typeof WIDGET
    | typeof WIN32_OUTLOOK_HUB
    | typeof TEAMS_HUB
    | typeof HUB;

export type HOST_APP_FLAG = { default: boolean } & { [key in HOST_APP_TYPES]?: boolean };

const flags: { [key: string]: HOST_APP_FLAG } = {
    showOwaBranding: {
        default: true,
        native: false,
    },
    includePartnerIn3SRequest: {
        default: false,
        native: true,
    },
    /** Allow host app to specify theming configuration */
    loadThemeFromHostApp: {
        default: false,
        opx: true,
    },
    /** Allow host app to specify culture configuration */
    loadCultureFromHostApp: {
        default: false,
        opx: true,
    },
    opxDeeplink: {
        default: false,
        opx: true,
    },
    authRedirectOnSessionTimeout: {
        default: true,
        native: false,
        opx: false,
    },
    opxComponentLifecycle: {
        default: false,
        native: false,
        opx: true,
    },
    navigateToView: {
        default: false,
        opx: true,
    },
    readingPaneModal: {
        default: true,
        teams: false,
    },
    readingPaneHeaderTitleAndJoinLink: {
        default: true,
        teams: false,
    },
    composeFormSaveCloseHandlers: {
        default: false,
        teams: true,
    },
    opxServiceWorker: {
        default: false,
        opx: true,
    },
    routeOptionsStaticUrl: {
        default: false,
        opx: true,
    },
    scenarioData: {
        default: false,
        opx: true,
    },
    teamsChannelOptions: {
        default: false,
        teams: true,
    },
    macA11y: {
        default: false,
        macoutlook: true,
    },
    teamsCalendarPicker: {
        default: false,
        teams: true,
    },
    joinTeamsMeeting: {
        default: false,
        opx: true,
    },
    calendarPaneHeaderWeather: {
        default: true,
        teams: false,
    },
    use3SPeopleSuggestions: {
        default: true,
        macoutlook: false,
    },
    defaultCalendarColor: {
        default: false,
        opx: true,
    },
    roomAddedHandler: {
        default: false,
        opx: true,
    },
    roomFinderFreeBusyStyles: {
        default: false,
        macoutlook: true,
        outlookdesktop: true,
    },
    defaultSelectCalendarItemSvg: {
        default: true,
        opx: false,
    },
    opxInboxRules: {
        default: false,
        opx: true,
    },
    moduleNameFromWindow: {
        default: true,
        opx: false,
    },
    showArchiveUnreadCount: {
        default: false,
        native: true,
    },
    headerFeedback: {
        default: true,
        opx: false,
    },
    spacesTeamsMessage: {
        default: false,
        opx: true,
    },
    spacesEnabled: {
        default: true,
        native: false,
    },
    composeFrom: {
        default: false,
        opx: true,
    },
    groupDiscoverCloseButton: {
        default: false,
        opx: true,
    },
    updateModalProps: {
        default: false,
        opx: true,
    },
    modalOpenedHandler: {
        default: false,
        opx: true,
    },
    fullscreenComposeFormPopOut: {
        default: false,
        teams: true,
    },
    defaultOutlookThemeColor: {
        default: true,
        opx: false,
    },
    yammerDailyDigest: {
        default: false,
        outlookdesktop: true,
    },
    yammerDirectFollower: {
        default: false,
        outlookdesktop: true,
    },
    yammerDiscovery: {
        default: false,
        outlookdesktop: true,
    },
    yammerHostClientType: {
        default: false,
        native: true,
        opx: true,
    },
    linkClicked: {
        default: false,
        outlookdesktop: true,
    },
    showMinimumThreeInsights: {
        default: false,
        opx: true,
    },
    groupCreatedHandler: {
        default: false,
        opx: true,
    },
    groupDeletedHandler: {
        default: false,
        opx: true,
    },
    updateSearchAnswerOnQueryChange: {
        default: false,
        opx: true,
    },
    insightsCountUpdatedHandler: {
        default: false,
        opx: true,
    },
    processMeetingInsightsHandler: {
        default: false,
        opx: true,
    },
    processEmptyYammerPublishersHandler: {
        default: false,
        opx: true,
    },
    timeStreamSharedSpace: {
        default: false,
        opx: true,
    },
    focusZoneCicularNavigation: {
        default: false,
        opx: true,
    },
    componentTokenProvider: {
        default: false,
        opx: true,
        native: true,
        hub: true,
    },
    hideCalendarModuleContent: {
        default: false,
        teams: true,
    },
    hideCalendarLeftNav: {
        default: false,
        teamshub: true,
    },
    hideAppSuiteHeader: {
        default: false,
        hub: true,
    },
    metaOSTest: {
        default: false,
        hub: true,
    },
    hideOfficeRail: {
        default: false,
        hub: true,
    },
    openMailInHub: {
        default: false,
        win32outlookhub: true,
    },
    fullComposeFormModal: {
        default: true,
        teams: false,
    },
    renderCalendarHeader: {
        default: true,
        teams: false,
    },
    weekWeatherIcon: {
        default: true,
        teams: false,
    },
    surfacePLTDataPoint: {
        default: false,
        teams: true,
    },
    schedulingAssistant: {
        default: true,
        teams: false,
    },
    composeFormHeader: {
        default: true,
        teams: false,
    },
    saveInFullCompose: {
        default: true,
        teams: false,
    },
    discardInFullCompose: {
        default: true,
        teams: false,
    },
    addIns: {
        default: true,
        teams: false,
    },
    settings: {
        default: true,
        teams: false,
    },
    /** Enables multi-account (connected personal accounts) infrastructure */
    multiAccounts: {
        default: true,
        teams: false,
        outlookdesktop: false, // Intentionally disabled in Win32 OPX to avoid multi-account experience inconsistencies with host app
        widget: false, // Temporarily disabled in Widget OPX due to routing hint bug. See ADO #116602
        native: false, // Not yet supported in Monarch
    },
    multiAccountSourceId: {
        default: false,
        native: true,
    },
    accountSettingsHx: {
        default: false,
        native: true,
    },
    nativeDiagnostics: {
        default: false,
        native: true,
    },
    nativeQsp: {
        default: false,
        native: true,
    },
    moduleSwitch: {
        default: false,
        native: true,
    },
    diagInAppSupport: {
        default: false,
        native: true,
    },
    diagFeedbackJs: {
        default: false,
        native: true,
    },
    diagFeedbackEmailGroup: {
        default: false,
        native: true,
    },
    diagFeedbackNoAttachSR: {
        default: false,
        native: true,
    },
    diagFeatureCrew: {
        default: false,
        native: true,
    },
    folderHierarchyHx: {
        default: false,
        native: true,
    },
    monarchErrorMessage: {
        default: false,
        native: true,
    },
    noteFeedSidePanel: {
        default: true,
        native: false,
    },
    whatsNew: {
        default: true,
        native: false,
    },
    owaBrandingCharm: {
        default: true,
        native: false,
    },
    appLauncher: {
        default: true,
        native: false,
    },
    incorrectNativeEntryPoint: {
        default: false,
        native: true,
    },
    metaOSFeedback: {
        default: false,
        hub: true,
    },
    monarchFeedback: {
        default: false,
        native: true,
    },
    nativeResolvers: {
        default: false,
        native: true,
    },
    managedQueryLink: {
        default: false,
        native: true,
    },
    wrongIndex: {
        default: false,
        native: true,
    },
    outlookSuiteHeaderStrategy: {
        default: false,
        native: true,
    },
    calendarRibbon: {
        default: false,
        native: true,
    },
    mailRibbon: {
        default: false,
        native: true,
    },
    hxDiagnostics: {
        default: false,
        native: true,
    },
    pauseInbox: {
        default: true,
        native: false,
    },
    hxVersionQueryStringParam: {
        default: false,
        native: true,
    },
    nativeServiceWorker: {
        default: false,
        native: true,
    },
    /** When true, route Hx attachment downloads through the native host's local file system access API */
    nativeHostAttachmentHijack: {
        default: false,
        native: true,
    },
    /** When true, use OWS' conversationEnabledNativeHost option, otherwise use conversationEnabled option. Also used for monarch specific conversation view */
    useNativeConversationOptions: {
        default: false,
        native: true,
    },
    reboot: {
        default: false,
        native: true,
    },
    calendarFolderHx: {
        default: false,
        native: true,
    },
    /** When true, skip await LPC config so LPC bootstrap doesn't block for 45 seconds */
    skipAwaitLpcConfig: {
        default: false,
        opx: true,
    },
    /** When true, allow read/write of per-workload scenario settings */
    workloadScenarioSettings: {
        default: true,
        opx: false,
    },
    /** When true, ribbon defaults to SLR instead of toolbar **/
    ribbonDefaultToSLR: {
        default: false,
        native: true,
    },
    /** When true, if the ribbon falls back to the default, immediately persist it **/
    ribbonPersistDefault: {
        default: false,
        native: true,
    },
    updateHostAppIcon: {
        default: false,
        native: true,
    },
    projectionCustomTitlebar: {
        default: false,
        native: true,
    },
    monarchDensity: {
        default: false,
        native: true,
    },
    toDoNewTab: {
        default: false,
        native: true,
    },
    reduceCalBarExp: {
        default: true,
        native: false,
        opx: false,
    },
    /** When true, Floodgate engine can be loaded/used */
    floodgate: {
        default: true,
        opx: false,
    },
    meControlAccountSwitching: {
        default: true,
        native: false,
    },
    smimeExtension: {
        default: true,
        native: false,
    },
    platformAppSdk: {
        default: false,
        hub: true,
    },
    resourceTokenFromHost: {
        default: false,
        native: true,
        opx: true,
    },
    useBaseTheme: {
        default: false,
        win32outlookhub: true,
        hub: false,
    },
    acctmonaccounts: {
        default: false,
        native: true,
    },
};

export const getFlagDefaults = (flagName: string) => {
    return flags[flagName];
};
