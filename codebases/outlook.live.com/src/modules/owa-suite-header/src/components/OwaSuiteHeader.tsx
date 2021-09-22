import { observer } from 'mobx-react-lite';
/* tslint:disable:jsx-no-lambda WI:47690 */

import type { IO365ShellShim } from '@suiteux/suiteux-shell';
// tslint:disable-next-line:no-duplicate-imports
import '@suiteux/suiteux-shell';
import setAppPaneUnderlayVisibility from 'owa-application/lib/actions/setAppPaneUnderlayVisibility';
import { getBposNavBarData } from 'owa-bpos-store';
import { getApp } from 'owa-config';
import { getOwaResourceUrl } from 'owa-resource-url';
import { getQueryStringParameter } from 'owa-querystring';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';
import { OpenAnotherMailboxDialog } from 'owa-explicit-logon';
import { getIsDarkTheme } from 'owa-fabric-theme';
import { isFeatureEnabled } from 'owa-feature-flags';
import { lazySignout } from 'owa-header';
import { HEADER_BUTTONS_REGION_ID, OWA_SEARCH_SCOPE_PICKER_ID } from 'owa-header-constants';
import { getMergedNotificationPane } from 'owa-header/lib/components/getMergedNotificationPane';
import { lazyHandleSocPostMessageEvents } from 'owa-help-charm';
import loc, {
    getCurrentLanguage,
    getCurrentCulture,
    isCurrentCultureRightToLeft,
} from 'owa-localize';
import { feedbackLink } from 'owa-locstrings/lib/strings/feedbacklink.locstring.json';
import { helpLink } from 'owa-locstrings/lib/strings/helplink.locstring.json';
import { openAnotherMailbox } from 'owa-locstrings/lib/strings/openanothermailbox.locstring.json';
import { privacyLink } from 'owa-locstrings/lib/strings/privacylink.locstring.json';
import { reportCalendarAbuseLink } from 'owa-locstrings/lib/strings/reportcalendarabuselink.locstring.json';
import { termsLink } from 'owa-locstrings/lib/strings/termslink.locstring.json';
import { showModal } from 'owa-modal';
import { DEFAULT_COLLAPSED_WIDTH } from 'owa-search-constants';
import { getConfig } from 'owa-service/lib/config';
import WebSessionType from 'owa-service/lib/contract/WebSessionType';
import { isConsumer, isPremiumConsumer } from 'owa-session-store';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { logCalendarUsage } from 'owa-shared-analytics';
import { lazyInitializeOneNoteFeed } from 'owa-notes-feed-bootstrap';
import { isTimePanelAvailable } from 'owa-time-panel-bootstrap';
import { lazyInitializeTimePanel } from 'owa-time-panel';
import { lazyGetAccessTokenforResource } from 'owa-tokenprovider/lib/lazyFunctions';
import { getNewScope, getOrigin, getRootVdirName } from 'owa-url';
import { lazyLaunchInAppFeedback } from 'owa-uservoice';
import OwaWorkload from 'owa-workloads/lib/store/schema/OwaWorkload';
import isWorkloadSupported from 'owa-workloads/lib/utils/isWorkloadSupported';
import {
    isSupportEnabled,
    isDiagFeedbackEnabled,
    lazyHandleSupportPaneEvents,
    lazyInitializeSupportOnBoot,
    lazyInitializeFeedbackOnBoot,
} from 'diagnostics-and-support';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { dispatch } from 'satcheljs';
import {
    lazyOnHideNotificationReceived,
    lazyOnNotificationReceived,
    addChatTab,
    isSkypeInTabsEnabled,
    shouldOwaInitializeSkype,
    lazyBeginSkypeInitialization,
    lazyCreateOnSwcReadyEvent,
} from 'owa-skype';
import {
    getCurrentThemeId,
    isUserPersonalizationAllowed,
    getHeaderImageData,
    getPaletteAsRawColors,
    getCobrandingThemeResources,
} from 'owa-theme';
import { OwaPalette, ThemeConstants } from 'owa-theme-shared';
import {
    LinkClickEventArgs,
    SuiteHeader,
    NavBarData as ShellNavBarData,
    ShellLayout,
    CustomizationRegion,
    ShellControl,
    ThemeDataOverride,
    NavBarLinkData,
    SignOutEventArgs,
    FlexPaneChangeListenerProperties,
    BaseTheme,
} from '@suiteux/suiteux-shell-react';
import {
    OwaWhatsNewButton,
    OwaRolloutOverridesButton,
    OwaFeedbackButton,
    OwaDiagFeedbackButton,
    OwaSupportButton,
    OwaSettingsButton,
    OwaShellHelpButton,
    OwaBusinessChatButton,
    OwaConsumerChatButton,
    OwaDiagnosticsButton,
    OwaActivityFeedButton,
    OwaPremiumButton,
    OwaTimePanelButton,
    OwaNoteFeedButton,
    OwaMeetNowButton,
    OwaInboxForMeButton,
} from './OwaSuiteHeaderButton';
import {
    OwaFeedbackFlexPane,
    OwaDiagFeedbackFlexPane,
    OwaRolloutOverridesFlexPane,
    OwaSettingsFlexPane,
    OwaTimePanelFlexPane,
    OwaWhatsNewFlexPane,
    OwaHelpFlexPane,
    OwaSupportFlexPane,
    OwaActivityFeedFlexPane,
    OwaExpressionFlexPane,
    OwaSkypeFlexPane,
    OwaIdeasFlexPane,
    OwaNoteFeedFlexPane,
    OwaInboxForMeFlexPane,
} from './OwaSuiteFlexPane';
import {
    OwaActivityFeedButtonID,
    OwaWhatsNewButtonID,
    OwaFeedbackButtonID,
    OwaSupportButtonID,
} from '../constants';
import { lazyInitializeActivityFeed } from 'owa-activity-feed';
import { getUnseenItemsCount } from 'owa-activity-feed/lib/store/unseenItemsSelector';
import { setShellButtonCustomBadgeCount } from 'owa-suite-header-apis';
import { getUnreadWhatsNewCardCount, initializeWhatsNewCardsLazy } from 'owa-whats-new';
import { lazyInitializeSkypeForBusiness } from 'owa-skype-for-business';
import { useWindowEvent } from 'owa-react-hooks/lib/useWindowEvent';
import { lazyInitializeKnownIssuesPoll, lazyGetKnownIssuesBadgeCount } from 'owa-known-issues';
import { lazyIsMeetNowEnabled } from 'owa-meet-now';
import { BASE_LIGHT_THEME_PALETTE } from 'owa-theme-common';
import { getIsOfficeThemePreferred, getCurrentTheme } from 'owa-suite-theme';
import { isEnvironmentAirGap } from 'owa-metatags';
import type { OwaSuiteHeaderProps } from 'owa-bootstrap';
import { isFeedbackEnabled } from 'owa-feedback-common';
import { lazyGovern } from 'owa-tti';
import { lazyLoadAllowedOptions } from 'owa-allowed-options';
import { suiteRenderedCallback } from '../utils/suiteRenderedCallback';

interface ExtendedWindow {
    O365Shell: IO365ShellShim;
}

declare var window: Window & ExtendedWindow;
const ShellMailId = 'ShellMail';

/**
 * When the UserThemeId is set to 'base', the Shell uses an AppBrandTheme palette, if provided.
 * This will be taken from the OWA theme definition with Id 'base'.
 */
const APP_BRAND_THEME = generateSuitePaletteFromFabricPalette(BASE_LIGHT_THEME_PALETTE);
const OWA_APP_ID = '00000002-0000-0ff1-ce00-000000000000';
const OWA_CONSUMER_APP_ID = '292841';
const SELECT_ACCOUNT_PARAM = 'prompt=select_account';
const LOGIN_HINT_PARAM = 'login_hint';
const ACCOUNT_SWITCH_PARAM = 'actSwt=true';

export default observer(function OwaSuiteHeader(props: OwaSuiteHeaderProps) {
    const setSearchContainer = useReactDomRender(props.renderSearch);
    const setSearchScopeContainer = useReactDomRender(props.renderSearchScopePicker);

    React.useEffect(() => {
        lazyGovern.importAndExecute(
            {
                task: () => lazyBeginSkypeInitialization.importAndExecute(),
                condition: shouldOwaInitializeSkype(),
            },
            {
                // Even if OWA is not responsbile for initializing Skype,
                // Still need listen to SWC ready events and try to intitialize notification settings
                task: () => lazyCreateOnSwcReadyEvent.importAndExecute(),
            },
            {
                task: () => lazyInitializeSkypeForBusiness.importAndExecute(),
                condition: isFeatureEnabled('fwk-skypeBusinessV2'),
            }
        );
        if (headerChatEnabled.current) {
            window.addEventListener('swc:core:ready', () => {
                onSwcCoreReady();
            });
        }
    }, []);

    useWindowEvent('message', (messageEvent: any) => {
        lazyHandleSocPostMessageEvents.importAndExecute(messageEvent);
        if (isSupportEnabled() || isDiagFeedbackEnabled()) {
            lazyHandleSupportPaneEvents.importAndExecute(messageEvent);
        }
    });

    const feedbackNavLink = createHelpLink('OwaFeedbackLink', loc(feedbackLink), undefined, () => {
        lazyLaunchInAppFeedback.importAndExecute();
        return false;
    });

    const helpNavLink = createHelpLink(
        'OwaHelpLink',
        loc(helpLink),
        'https://go.microsoft.com/fwlink/?linkid=853225'
    );

    const privacyNavLink = createHelpLink(
        'OwaPrivacyLink',
        loc(privacyLink),
        'https://go.microsoft.com/fwlink/?linkId=521839'
    );

    const legalNavLink = createHelpLink(
        'OwaTermsLink',
        loc(termsLink),
        'https://www.microsoft.com/en-us/servicesagreement'
    );

    const isShadowMailbox = React.useRef(getUserConfiguration().SessionSettings?.IsShadowMailbox);
    const owaChatEnabled = React.useRef(
        !(
            isFeatureEnabled('fwk-partner-code-off') ||
            isFeatureEnabled('fwk-skypeSuite') ||
            isFeatureEnabled('fwk-teamsSuite')
        ) &&
            (isFeatureEnabled('fwk-skypeBusinessV2') || isFeatureEnabled('fwk-skypeConsumer')) &&
            !isShadowMailbox.current
    );
    const headerChatEnabled = React.useRef(
        isFeatureEnabled('fwk-skypeSuite') &&
            (isFeatureEnabled('fwk-skypeBusinessV2') || isFeatureEnabled('fwk-skypeConsumer'))
    );

    const headerTeamsChatEnabled = React.useRef(isFeatureEnabled('fwk-teamsSuite'));
    /**
     * Register for Skype notifications when SWC is initialized.
     *
     * @private
     * @memberof OwaSuiteHeader
     */
    const onSwcCoreReady = (): void => {
        window.removeEventListener('swc:core:ready', () => {
            onSwcCoreReady();
        });
        if (window.swc) {
            window.swc.API.registerEvent(
                'receivedNotification',
                lazyOnNotificationReceived.importAndExecute
            );
            window.swc.API.registerEvent(
                'hideNotification',
                lazyOnHideNotificationReceived.importAndExecute
            );
            if (isSkypeInTabsEnabled()) {
                // 1) Pass in ParallelView = false
                window.swc.API.registerEvent('ready', function () {
                    window.swc.shared.app.isParallelView = false;
                });
                // 2) Recents proxy
                window.swc
                    .getRecents()
                    .then(recentsProxy => recentsProxy.setOptions({ PreventOpenChat: true }));
                // 3) On recents selected
                window.swc.API.registerEvent('onRecentItemSelected', function (id: string) {
                    dispatch(addChatTab(id));
                });
            }
        }
    };

    const getNavBarData = (): ShellNavBarData | undefined => {
        const owaNavBarData: ShellNavBarData = getBposNavBarData() as ShellNavBarData;
        if (owaNavBarData) {
            const navBarData: ShellNavBarData = {
                ...owaNavBarData,
                CurrentMainLinkElementID: ShellMailId,
                ThemeDataOverride: createThemeData() as any,
                AppBrandTheme: APP_BRAND_THEME,
                FeedbackLink: feedbackNavLink,
                HelpLink: helpNavLink,
                PrivacyLink: privacyNavLink,
                LegalLink: legalNavLink,
                CurrentWorkloadHelpSubLinks: getWorkloadHelpSublinks(
                    owaNavBarData.CurrentWorkloadHelpSubLinks
                ),
            };
            return navBarData;
        } else {
            return undefined;
        }
    };
    const createCustomLayout = (): ShellLayout => {
        const customHeaderButtons: ShellControl[] = [];
        const { renderSearchScopePicker, searchBoxRespond } = props;

        pushOnCondition(
            customHeaderButtons,
            OwaMeetNowButton,
            isFeatureEnabled('fwk-meetNowButtonHeader') &&
                lazyIsMeetNowEnabled.tryImportForRender()?.()
        );

        pushOnCondition(
            customHeaderButtons,
            isFeatureEnabled('fwk-skypeBusinessV2') ? OwaBusinessChatButton : OwaConsumerChatButton,
            owaChatEnabled.current
        );

        pushOnCondition(
            customHeaderButtons,
            { id: 'owaChatButton', nativeControlID: 'ChatIcon' } as ShellControl,
            headerChatEnabled.current || headerTeamsChatEnabled.current
        );

        pushOnCondition(
            customHeaderButtons,
            OwaPremiumButton,
            isPremiumConsumer() &&
                isFeatureEnabled('auth-leftNavPremiumUpsell') &&
                !isShadowMailbox.current
        );

        if (isFeatureEnabled('inboxForMe-owa-panel')) {
            pushOnCondition(customHeaderButtons, OwaInboxForMeButton);
        }

        // Push button standard header button if flight is enabled
        // and we're not running against Cloud Cache mailbox.
        if (
            isFeatureEnabled('notes-noteFeedSidePanel') &&
            isHostAppFeatureEnabled('noteFeedSidePanel') &&
            !isShadowMailbox.current
        ) {
            pushOnCondition(customHeaderButtons, OwaNoteFeedButton);
            lazyGovern.importAndExecute({
                task: () => lazyInitializeOneNoteFeed.importAndExecute(),
                idle: true,
            });
        }

        if (isTimePanelAvailable()) {
            pushOnCondition(customHeaderButtons, OwaTimePanelButton);
            lazyGovern.importAndExecute({
                task: () => lazyInitializeTimePanel.importAndExecute(),
                idle: true,
            });
        }

        if (isFeatureEnabled('auth-activityFeed')) {
            pushOnCondition(customHeaderButtons, OwaActivityFeedButton);
            lazyGovern.importAndExecute({
                task: () => lazyInitializeActivityFeed.importAndExecute(),
                idle: true,
            });
            setShellButtonCustomBadgeCount(OwaActivityFeedButtonID, getUnseenItemsCount());
        }

        pushOnCondition(customHeaderButtons, OwaSettingsButton);
        lazyGovern.importAndExecute({
            condition: !isConsumer(),
            task: () => lazyLoadAllowedOptions.importAndExecute(),
        });

        if (!isEnvironmentAirGap()) {
            pushOnCondition(customHeaderButtons, OwaShellHelpButton);
        }

        if (isSupportEnabled()) {
            pushOnCondition(customHeaderButtons, OwaSupportButton);
            lazyGovern.importAndExecute({
                task: () => {
                    lazyInitializeSupportOnBoot.importAndExecute((badgeCount: number) => {
                        setShellButtonCustomBadgeCount(OwaSupportButtonID, badgeCount);
                    });
                },
                idle: true,
            });
        }

        if (isDiagFeedbackEnabled()) {
            pushOnCondition(customHeaderButtons, OwaDiagFeedbackButton);
            lazyGovern.importAndExecute({
                task: () => {
                    lazyInitializeFeedbackOnBoot.importAndExecute();
                },
                idle: true,
            });
        }

        if (isFeatureEnabled('fwk-feedbackCharm') && !isDiagFeedbackEnabled()) {
            pushOnCondition(customHeaderButtons, OwaFeedbackButton);
            if (isFeatureEnabled('fwk-knownIssues')) {
                lazyGovern.importAndExecute({
                    task: () => lazyInitializeKnownIssuesPoll.importAndExecute(),
                    idle: true,
                });

                // Update badge count when known issues state changes.
                const getKnownIssuesBadgeCount = lazyGetKnownIssuesBadgeCount.tryImportForRender();
                const knownIssuesBadgeCount = getKnownIssuesBadgeCount?.();
                setShellButtonCustomBadgeCount(OwaFeedbackButtonID, knownIssuesBadgeCount || 0);
            }
        }

        pushOnCondition(
            customHeaderButtons,
            OwaRolloutOverridesButton,
            isFeatureEnabled('fwk-devTools')
        );

        if (
            isHostAppFeatureEnabled('whatsNew') &&
            (getApp() === 'Mail' || getApp() === 'Calendar')
        ) {
            // Only push whats new for mail and calendar because they are the only supported apps
            pushOnCondition(customHeaderButtons, OwaWhatsNewButton);
            lazyGovern.importAndExecute({
                task: () => initializeWhatsNewCardsLazy.importAndExecute(),
                idle: true,
            });
            setShellButtonCustomBadgeCount(OwaWhatsNewButtonID, getUnreadWhatsNewCardCount());
        }

        pushOnCondition(
            customHeaderButtons,
            OwaDiagnosticsButton(props.DiagnosticsPanel),
            isFeatureEnabled('fwk-devTools') && !!props.DiagnosticsPanel
        );

        // Now define responsive behavior for all the custom header buttons, with the
        // right-most one getting dropped first
        customHeaderButtons.forEach((control, index, array) => {
            if (!control.responsiveBehavior) {
                control.responsiveBehavior = {
                    responsivePriority: array.length - 1 - index + 2,
                    minimizeBehavior: 'overflow',
                    delayMinimize: false,
                };
            } else if (control.responsiveBehavior.responsivePriority == 0) {
                // Update the responsive priorities for the buttons as per its position in the collection
                control.responsiveBehavior.responsivePriority = array.length - 1 - index + 2;
            }
        });

        const hideOwaBranding = !isHostAppFeatureEnabled('owaBrandingCharm');
        let leftCharms = [
            {
                id: 'owaBranding',
                flex: renderSearchScopePicker ? '1 1 auto' : '',
                nativeControlID: 'O365Branding',
                minWidth: 'auto',
            } as ShellControl,
        ];

        if (hideOwaBranding) {
            leftCharms.pop();
        } else {
            leftCharms.unshift({
                id: 'tenantLogo',
                nativeControlID: 'TenantLogo',
                minWidth: 'auto',
            } as ShellControl);
        }

        const leftCharmsWidth =
            (props.searchAlignmentWidth /* getSearchBoxLeftPadding */ ||
                getUserConfiguration().UserOptions?.NavigationBarWidth ||
                228) - (hideOwaBranding ? 0 : 48); /* Subtract the button width */
        if (renderSearchScopePicker) {
            leftCharms.push({
                id: OWA_SEARCH_SCOPE_PICKER_ID,
                flex: '1 1 auto',
                justifyContent: 'flex-end',
                minWidth: 'auto',
                render: setSearchScopeContainer,
            } as ShellControl);
        }
        const layout = {
            enableResponsive: !!props.enableResponsiveLayout,
            leftCustomizationRegion: {
                includeAppLauncher: isHostAppFeatureEnabled('appLauncher'),
            },
            centerCustomizationRegion: {
                alignItems: 'center',
                flex: '1 0 auto',
                children: [
                    {
                        /* Left aligned */
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        flex: '1 0 auto',
                        children: [
                            {
                                /* Left Charms */
                                children: leftCharms,
                                flex: '0 0 auto',
                                minWidth: `${leftCharmsWidth}px`,
                            } as CustomizationRegion,
                            {
                                /* Search Box */
                                id: 'owaSearchBox',
                                flex: '1 0 auto',
                                render: setSearchContainer,
                                respond: (step: number) => searchBoxRespond?.(step),
                                responsiveBehavior: {
                                    responsivePriority: 1,
                                    minimizeBehavior: 'custom',
                                    delayMinimize: true,
                                    responsiveSteps: [DEFAULT_COLLAPSED_WIDTH],
                                },
                            } as ShellControl,
                        ],
                    } as CustomizationRegion,
                    {
                        /* Menu Buttons - Right aligned */
                        regionID: HEADER_BUTTONS_REGION_ID,
                        flex: '0 0 auto',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        children: [
                            ...customHeaderButtons,
                            {
                                id: 'OwaMergedNotificationPane',
                                render: (container: HTMLDivElement) =>
                                    ReactDOM.render(getMergedNotificationPane(), container),
                            } as ShellControl,
                        ],
                    } as CustomizationRegion,
                ],
            } as CustomizationRegion,
            rightCustomizationRegion: {
                includeMeControl: true,
                id: 'O365_HeaderRightRegion2',
            },
            flexPaneCollection: [
                OwaFeedbackFlexPane,
                OwaDiagFeedbackFlexPane,
                OwaRolloutOverridesFlexPane,
                OwaSettingsFlexPane,
                OwaWhatsNewFlexPane,
                OwaHelpFlexPane,
                OwaSupportFlexPane,
                OwaTimePanelFlexPane,
                OwaActivityFeedFlexPane,
                OwaExpressionFlexPane,
                OwaSkypeFlexPane,
                OwaIdeasFlexPane,
                OwaNoteFeedFlexPane,
                OwaInboxForMeFlexPane,
            ],
        } as ShellLayout;
        return layout;
    };

    const sessionSettings = getUserConfiguration().SessionSettings;
    const createMeSublinks = (): NavBarLinkData[] => {
        return !props.hideOpenAnotherMailbox &&
            sessionSettings?.WebSessionType === WebSessionType.Business
            ? [
                  {
                      Id: 'OwaOpenTargetMailboxLink',
                      Text: loc(openAnotherMailbox),
                      Url: 'javascript:void(0)',
                      Action: showOpenAnotherMailboxDialog,
                  },
              ]
            : [];
    };

    const culture = getCurrentCulture();

    const userPrincipalName = isShadowMailbox.current
        ? sessionSettings?.UserEmailAddress
        : sessionSettings?.UserPrincipalName;

    const accountSwitchingEnabled =
        (isFeatureEnabled('auth-meControl-accountSwitcher') || isAccountSwitchingParamPresent()) &&
        !isShadowMailbox.current &&
        isHostAppFeatureEnabled('meControlAccountSwitching');

    const suiteHeader = (
        <SuiteHeader
            onLinkClick={onLinkClick}
            culture={culture}
            language={getCurrentLanguage()}
            isRTL={isCurrentCultureRightToLeft()}
            isConsumer={isConsumer()}
            userDisplayName={sessionSettings?.UserDisplayName}
            userPrincipalName={userPrincipalName}
            workloadID={'Exchange'}
            appBrandTheme={APP_BRAND_THEME}
            currentMainLinkElementID={ShellMailId}
            themeData={createThemeData()}
            customLayout={createCustomLayout()}
            meSublinks={createMeSublinks()}
            shellAssetsContainerOverride={getOwaResourceUrl('resources/suiteux-shell')}
            navBarData={getNavBarData()}
            onSignOut={signout_0}
            onFlexPaneVisibilityChanged={flexPaneVisiblityChanged}
            helpSublinks={props.MAXHelpDisabled ? props.helpSublinks : undefined}
            shellDataOverrides={{
                SuiteServiceUrl: `${window.location.origin}${getConfig().baseUrl}/service.svc`,
                HideMyProfileLink: isShadowMailbox.current,
                HideMyAccountLink: isShadowMailbox.current,
                AppHeaderLinkText: props.AppHeaderLinkText,
                AppHeaderLinkUrl: props.AppHeaderLinkUrl,
                MAXHelpEnabled: !props.MAXHelpDisabled,
                FeedbackLink: isFeedbackEnabled() ? feedbackNavLink : undefined,
                HelpLink: props.MAXHelpDisabled ? helpNavLink : undefined,
                UniversalMeControlEnabled: isFeatureEnabled('fwk-meControl'),
                SocHelpUrl: isConsumer()
                    ? 'https://support.office.live.com'
                    : 'https://support.office.com',
                AccountSwitchingEnabled: accountSwitchingEnabled,
                // DO NOT OVERRIDE PrivacyLink and LegalLink here.
            }}
            shellAuthProviderConfig={
                accountSwitchingEnabled && userPrincipalName
                    ? getAuthProviderConfig(userPrincipalName)
                    : undefined
            }
            renderedCallback={suiteRenderedCallback}
            supportShyHeaderMode={true}
            getAccessTokenforResource={headerChatEnabled.current ? getToken : undefined}
            disableToasts={true} // This will turn off suite header toasts
            userID={sessionSettings?.UserPuid}
            helpNamespace={
                isConsumer()
                    ? isFeatureEnabled('help-rave-tickets')
                        ? 'OLWACB'
                        : 'OLWAC'
                    : undefined
            }
            workloadContext={`OfficeRailEnabled:${isFeatureEnabled('tri-officeRail')}`}
        />
    );

    const wrapSuiteHeader = props.wrapSuiteHeader;
    if (wrapSuiteHeader) {
        return <>{wrapSuiteHeader(suiteHeader)}</>;
    } else {
        return <div tabIndex={-1}>{suiteHeader}</div>;
    }
});

function getAuthProviderConfig(userPrincipalName: string) {
    const authProviderConfigType = isConsumer() ? 'webMsaWithAadProxy' : 'webAadWithMsaProxy';

    return {
        type: authProviderConfigType,
        login_Hint: userPrincipalName,

        /* The appSignInUrl & appSignInToUrl are similar to the respective appSwitch urls,
                the difference being that these are meant for the app experience where there is
                no primary signed in user/user hasn't logged in yet. Since OWA doesn't have an
                this UX, setting these to match the corresponding appSwitch urls. */
        appSignInUrl: params => {
            return getSignInToDifferentAccountUrl(params);
        },

        appSignInToUrl: params => {
            return getAppSwitchToUrl(params);
        },

        /* This is the url used to signout the primary/logged in user. */
        appSignOutUrl: params => {
            return getAppSignOutUrl(params);
        },

        /* The appSwitchUrl is used for signing into a different account. */
        appSwitchUrl: params => {
            return getSignInToDifferentAccountUrl(params);
        },

        /* The appSwitchToUrl is used for switching to an account from the remembered accounts list,
           this is customised based on the type of account being switched to (aad vs msa). */
        appSwitchToUrl: params => {
            return getAppSwitchToUrl(params);
        },

        /* The wreply url for the aad & msa configs below, needs to be a ReplyTo Url registered with the respective identity provider, and should match the domain of the logged in user.
               It is used to generate the url to fetch remembered accounts, and signOut, signOutAndForget, forgetUser links that apply to each of the individual remembered accounts. */
        aad: {
            wreply: getReplyToUrl(),
            appId: OWA_APP_ID,
        },
        msa: {
            wreply: getReplyToUrl(),
            siteId: OWA_CONSUMER_APP_ID,
        },
    } as any;
}

function isAccountSwitchingParamPresent() {
    var accountSwitchingParamValue = getQueryStringParameter('actSwt');
    return accountSwitchingParamValue?.toLowerCase() == 'true';
}

function getAadLoginDomain() {
    // When the currently logged in user is an aad user, we want to use the same domain for logging into aad,
    // to account for scenarios where outlook.office.com domain could be blocked for the user.
    // When the logged in user is an MSA type, since the aad domain would be different from the user domain,
    // we are explicitly passing https://outlook.office.com
    return isConsumer() ? 'https://outlook.office.com' : getOrigin();
}

function getReplyToUrl() {
    return `${getOrigin()}/${getRootVdirName()}/`;
}

function getAppSignOutUrl(params) {
    return `${getReplyToUrl()}logoff.owa`;
}

function getSignInToDifferentAccountUrl(params: any) {
    return `${getAadLoginDomain()}/${getRootVdirName()}/?${SELECT_ACCOUNT_PARAM}&${ACCOUNT_SWITCH_PARAM}`;
}

function getAppSwitchToUrl(params: any) {
    if (!params || !params.nextAccount) {
        return '';
    }

    // This aad login url is used when the account selected is an aad account type.
    const aadLogin = getAadLoginDomain();

    // This is the login domain used for switching to the selected account. This depends on the account type - when selected account
    // is aad type, aadLogin would be used, and for consumer type, live.com login would be used instead.
    const domain =
        params.nextAccount.type?.toLowerCase() == 'aad' ? aadLogin : 'https://outlook.live.com';

    const account = params.nextAccount.memberName;
    const appSwitchToUrl = `${domain}/${getRootVdirName()}/?${LOGIN_HINT_PARAM}=${encodeURIComponent(
        account
    )}&${ACCOUNT_SWITCH_PARAM}`;

    return appSwitchToUrl;
}

function useReactDomRender(render: (() => React.ReactElement<{}>) | undefined) {
    const containerRef = React.useRef<HTMLDivElement>();
    const setRef = React.useCallback(node => {
        containerRef.current = node;
    }, []);
    React.useEffect(() => {
        if (containerRef.current && render) {
            ReactDOM.render(render(), containerRef.current);
        }
    }, [render]);
    return (divElement: HTMLDivElement) => {
        if (render) {
            ReactDOM.render(render(), divElement);
        }
        setRef(divElement);
    };
}

/**
 * @ToDo : Please edit this method appropriately.
 *
 * @private
 * @param {string} resourceAudience
 * @returns {Promise<string>}
 * @memberof OwaSuiteHeader
 */
function getToken(resourceAudience: string): Promise<string> {
    return lazyGetAccessTokenforResource
        .importAndExecute(resourceAudience, 'OwaSuiteHeader')
        .then(t => t || '');
}

function onLinkClick(data: LinkClickEventArgs) {
    if (data && data.Id == 'Calendar') {
        logCalendarUsage('ModuleSwitchToCalendar', {
            source: 'mailWaffle',
        });
    }
}

function signout_0(eventArgs: SignOutEventArgs) {
    eventArgs.triggerEvent.preventDefault();
    lazySignout.importAndExecute(location);
}

function flexPaneVisiblityChanged(isVisible: boolean, props: FlexPaneChangeListenerProperties) {
    setAppPaneUnderlayVisibility('suiteFlexPane', isVisible, true /* isShrinkable */);
}

function pushOnCondition(
    controlCollection: ShellControl[],
    control: ShellControl,
    condition?: boolean
) {
    if (condition === undefined || condition) {
        controlCollection.push(control);
    }
}

function generateSuitePaletteFromFabricPalette(palette: OwaPalette): BaseTheme {
    return {
        LighterAlt: palette.themeLighterAlt,
        Darker: palette.themeDarker,
        Dark: palette.themeDark,
        DarkAlt: palette.themeDarkAlt,
        Light: palette.themeLight,
        Primary: palette.themePrimary!,
        Secondary: palette.themeSecondary,
        Tertiary: palette.themeTertiary,
        Lighter: palette.themeLighter,
        NavBar: palette.headerBackground,
        DefaultText: palette.headerTextIcons,
        DefaultBackground: palette.headerButtonsBackground,
        HoverBackground: palette.headerButtonsBackgroundHover,
        AppName: palette.headerBrandText,
        SearchNavBar: palette.headerBackgroundSearch,
        SearchHoverBackground: palette.headerButtonsBackgroundSearchHover,
        SearchAccent: palette.headerBadgeBackground,
    };
}

function createHelpLink(
    id: string,
    helpText: string,
    url?: string,
    action?: () => void
): NavBarLinkData {
    return {
        Id: id,
        Text: helpText,
        Url: url,
        TargetWindow: '_blank',
        Action: action,
    } as NavBarLinkData;
}

function showOpenAnotherMailboxDialog() {
    const [modalPromise] = showModal(OpenAnotherMailboxDialog);
    modalPromise.then(targetMailbox => {
        if (targetMailbox && targetMailbox.length > 0) {
            window.open(getNewScope(targetMailbox), '_blank');
        }
    });
}

function getWorkloadHelpSublinks(
    originalLinks: NavBarLinkData[] | null | undefined
): NavBarLinkData[] {
    if (isWorkloadSupported(OwaWorkload.Calendar)) {
        originalLinks = (originalLinks || []).concat([
            createHelpLink(
                'OwaCalendarAbuseLink',
                loc(reportCalendarAbuseLink),
                'https://www.microsoft.com/concern/calendarabuse'
            ),
        ]);
    }
    return originalLinks || [];
}

function createThemeData(): ThemeDataOverride {
    const themeId: string = getCurrentThemeId();
    const themeData: ThemeDataOverride = {
        UserPersonalizationAllowed: isUserPersonalizationAllowed(),
        IsDarkTheme: getIsDarkTheme(),
        UserThemeId: themeId,
        ...(!isFeatureEnabled('fwk-suiteThemes')
            ? {
                  PreferOfficeTheme: themeId === ThemeConstants.BASE_OFFICE_THEME_ID,
                  UserThemePalette: {
                      ...generateSuitePaletteFromFabricPalette(getPaletteAsRawColors(themeId)),
                      ...getHeaderImageData(themeId),
                  },
                  TenantThemePalette: generateSuitePaletteFromFabricPalette(
                      getCobrandingThemeResources().themePalette
                  ),
              }
            : {
                  PreferOfficeTheme: getIsOfficeThemePreferred(),
                  UserThemePalette: getCurrentTheme(),
                  TenantThemePalette: generateSuitePaletteFromFabricPalette(
                      getCobrandingThemeResources().themePalette
                  ),
              }),
    } as ThemeDataOverride;
    return themeData;
}
