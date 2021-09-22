import { whatsNew_FlexPane_Title } from 'owa-locstrings/lib/strings/whatsnew_flexpane_title.locstring.json';
import { UpgradeMessage } from 'owa-locstrings/lib/strings/upgrademessage.locstring.json';
import { timePanelHeaderText, meetNowHeaderText } from '../strings.locstring.json';
import { skypeCharm_ariaLabel } from 'owa-locstrings/lib/strings/skypecharm_arialabel.locstring.json';
import { skypeEnterpriseCharm_ariaLabel } from 'owa-locstrings/lib/strings/skypeenterprisecharm_arialabel.locstring.json';
import { settingsCharm_ariaLabel } from 'owa-locstrings/lib/strings/settingscharm_arialabel.locstring.json';
import { helpCharm_ariaLabel } from 'owa-locstrings/lib/strings/helpcharm_arialabel.locstring.json';
import { supportCharm_ariaLabel } from 'owa-locstrings/lib/strings/supportcharm_arialabel.locstring.json';
import { feedbackCharm_ariaLabel } from 'owa-locstrings/lib/strings/feedbackcharm_arialabel.locstring.json';
import { noteFeedFlexPaneTitle } from 'owa-locstrings/lib/strings/notefeedflexpanetitle.locstring.json';
import { activityFeedTitle } from 'owa-locstrings/lib/strings/activityfeedtitle.locstring.json';
import { inboxForMeFlexPaneTitle } from 'owa-locstrings/lib/strings/inboxformeflexpanetitle.locstring.json';
import loc from 'owa-localize';
import React from 'react';
import * as ReactDOM from 'react-dom';
import { ControlIconsDefinitions } from 'owa-control-icons/lib/data/controlIconsRegistration';
import type { ShellControl } from '@suiteux/suiteux-shell-react';
import { lazyOpenPremiumDashboard } from 'owa-whats-new';
import { SkypeCharmStub } from 'owa-header/lib/components/charmStubs';
import type { HeaderPaneProps } from 'owa-bootstrap';
import { updateHeaderButtonState } from 'owa-suite-header-apis';
import { logUsage } from 'owa-analytics';
import { MeetNowSuiteHeaderButton } from 'owa-meet-now';

import {
    OwaFeedbackButtonID,
    OwaDiagFeedbackButtonID,
    OwaDiagnosticsButtonId,
    OwaRolloutOverridesButtonID,
    OwaSettingsButtonID,
    OwaHelpButtonID,
    OwaSupportButtonID,
    OwaTimePanelButtonID,
    OwaActivityFeedButtonID,
    OwaWhatsNewButtonID,
    OwaPremiumButtonID,
    OwaNoteFeedButtonID,
    OwaMeetNowButtonID,
    OwaInboxForMeButtonID,
} from '../constants';

export const owaIconFontFamily = 'controlIcons';

const rolloutOverridesLabel = 'Rollout Overrides'; // No need to localize as it is a DEV feature only
export const OwaRolloutOverridesButton = {
    id: 'owaRolloutOverridesBtn',
    headerButtonRenderData: {
        id: OwaRolloutOverridesButtonID,
        iconFontName: ControlIconsDefinitions.Flag,
        iconFontFamily: owaIconFontFamily,
        ariaLabel: rolloutOverridesLabel,
        affordanceMenuItemText: rolloutOverridesLabel,
    },
} as ShellControl;

const premiumLabel = () => loc(UpgradeMessage);
export const OwaPremiumButton = {
    id: 'owaPremiumBtn',
    headerButtonRenderData: {
        id: OwaPremiumButtonID,
        iconFontName: ControlIconsDefinitions.Diamond,
        iconFontFamily: owaIconFontFamily,
        ariaLabel: premiumLabel,
        affordanceMenuItemText: premiumLabel,
        onShow() {
            logUsage('HeaderPremiumDiamondClicked');
            lazyOpenPremiumDashboard.importAndExecute();
        },
        onHide() {},
    },
} as ShellControl;

const timePanelLabel = () => loc(timePanelHeaderText);
export const OwaTimePanelButton = {
    id: 'owaTimePanelBtn',
    headerButtonRenderData: {
        id: OwaTimePanelButtonID,
        iconFontName: ControlIconsDefinitions.EventToDoLogo,
        iconFontFamily: owaIconFontFamily,
        ariaLabel: timePanelLabel,
        affordanceMenuItemText: timePanelLabel,
    },
} as ShellControl;

const settingsLabel = () => loc(settingsCharm_ariaLabel);
export const OwaSettingsButton = {
    id: 'owaSettingsBtn',
    headerButtonRenderData: {
        id: OwaSettingsButtonID,
        iconFontName: ControlIconsDefinitions.Settings,
        iconFontFamily: owaIconFontFamily,
        ariaLabel: settingsLabel,
        affordanceMenuItemText: settingsLabel,
    },
} as ShellControl;

const feedbackLabel = () => loc(feedbackCharm_ariaLabel);
export const OwaFeedbackButton = {
    id: 'owaFeedbackBtn',
    headerButtonRenderData: {
        id: OwaFeedbackButtonID,
        iconFontName: ControlIconsDefinitions.Emoji2,
        iconFontFamily: owaIconFontFamily,
        ariaLabel: feedbackLabel,
        affordanceMenuItemText: feedbackLabel,
    },
} as ShellControl;

export const OwaDiagFeedbackButton = {
    id: 'owaDiagFeedbackBtn',
    headerButtonRenderData: {
        id: OwaDiagFeedbackButtonID,
        iconFontName: ControlIconsDefinitions.Feedback,
        iconFontFamily: owaIconFontFamily,
        ariaLabel: feedbackLabel,
        affordanceMenuItemText: feedbackLabel,
    },
} as ShellControl;

const supportLabel = () => loc(supportCharm_ariaLabel);
export const OwaSupportButton = {
    id: 'owaSupportBtn',
    headerButtonRenderData: {
        id: OwaSupportButtonID,
        iconFontName: ControlIconsDefinitions.Telemarketer,
        iconFontFamily: owaIconFontFamily,
        ariaLabel: supportLabel,
        affordanceMenuItemText: supportLabel,
    },
} as ShellControl;

const whatsNewLabel = () => loc(whatsNew_FlexPane_Title);
export const OwaWhatsNewButton = {
    id: 'owaWhatsNewBtn',
    headerButtonRenderData: {
        id: OwaWhatsNewButtonID,
        iconFontName: ControlIconsDefinitions.Megaphone,
        iconFontFamily: owaIconFontFamily,
        ariaLabel: whatsNewLabel,
        affordanceMenuItemText: whatsNewLabel,
    },
} as ShellControl;

const chatKey = 'skype';
const businessChatLabel = () => loc(skypeEnterpriseCharm_ariaLabel);
export const OwaBusinessChatButton = createChildControlFromCharm(
    chatKey,
    <SkypeCharmStub key={chatKey} />,
    ControlIconsDefinitions.OfficeChat,
    businessChatLabel,
    businessChatLabel
);

const consumerChatLabel = () => loc(skypeCharm_ariaLabel);
export const OwaConsumerChatButton = createChildControlFromCharm(
    chatKey,
    <SkypeCharmStub key={chatKey} />,
    ControlIconsDefinitions.SkypeLogo,
    consumerChatLabel,
    consumerChatLabel
);

const diagnosticsKey = 'diagnostic charm';
const diagnosticsLabel = () => 'Diagnostics'; // No need to localize as it is a DEV feature only
export const OwaDiagnosticsButton = (
    DiagnosticsPanel: React.ComponentType<HeaderPaneProps> | undefined
) => {
    let container: HTMLDivElement | undefined;
    const onDismiss = () => {
        updateHeaderButtonState(OwaDiagnosticsButtonId, false);
    };
    return {
        id: diagnosticsKey,
        headerButtonRenderData: {
            id: OwaDiagnosticsButtonId,
            iconFontName: ControlIconsDefinitions.DeveloperTools,
            iconFontFamily: owaIconFontFamily,
            ariaLabel: diagnosticsLabel,
            affordanceMenuItemText: diagnosticsLabel,
            onShow() {
                if (!container) {
                    container = document.createElement('div');
                    document.body.appendChild(container);
                }

                ReactDOM.render(
                    DiagnosticsPanel ? (
                        <DiagnosticsPanel onDismiss={onDismiss} />
                    ) : (
                        <div>'No Panel'</div>
                    ),
                    container
                );
            },
            onHide() {
                if (container) {
                    ReactDOM.unmountComponentAtNode(container);
                }
            },
        },
    } as ShellControl;
};

export const OwaShellHelpButton = {
    id: 'owaHelpButton',
    nativeControlID: 'HelpIcon',
};

const helpButtonLabel = () => loc(helpCharm_ariaLabel);
export const OwaCustomHelpButton = {
    id: OwaHelpButtonID,
    headerButtonRenderData: {
        id: OwaHelpButtonID,
        iconFontName: ControlIconsDefinitions.Help,
        iconFontFamily: owaIconFontFamily,
        ariaLabel: helpButtonLabel,
        affordanceMenuItemText: helpButtonLabel,
    },
};

const activityFeedLabel = () => loc(activityFeedTitle);
export const OwaActivityFeedButton = {
    id: OwaActivityFeedButtonID,
    headerButtonRenderData: {
        id: OwaActivityFeedButtonID,
        iconFontName: ControlIconsDefinitions.Ringer,
        iconFontFamily: owaIconFontFamily,
        ariaLabel: activityFeedLabel,
        affordanceMenuItemText: activityFeedLabel,
    },
} as ShellControl;

const noteFeedLabel = () => loc(noteFeedFlexPaneTitle);

export const OwaNoteFeedButton = {
    id: OwaNoteFeedButtonID,
    headerButtonRenderData: {
        id: OwaNoteFeedButtonID,
        iconFontName: ControlIconsDefinitions.OneNoteLogo,
        iconFontFamily: owaIconFontFamily,
        ariaLabel: noteFeedLabel,
        affordanceMenuItemText: noteFeedLabel,
    },
} as ShellControl;

const meetNowLabel = () => loc(meetNowHeaderText);
export const OwaMeetNowButton = createChildControlFromCharm(
    OwaMeetNowButtonID,
    <MeetNowSuiteHeaderButton />,
    ControlIconsDefinitions.Video,
    meetNowLabel,
    meetNowLabel,
    undefined,
    undefined,
    true
);

function createChildControlFromCharm(
    key: React.Key,
    charm: JSX.Element,
    iconCode: string,
    ariaLabel: () => string,
    affordanceMenuItemText: () => string,
    onShow?: (ClientRect) => void,
    onHide?: () => void,
    naturalWidth?: boolean
): ShellControl {
    const headerButtonWidthInPixels = 48;
    const containerRef = React.createRef<HTMLDivElement>();

    return {
        id: key,
        flex: naturalWidth ? undefined : `0 0 ${headerButtonWidthInPixels}px`,
        render: (container: HTMLDivElement) =>
            ReactDOM.render(<div ref={containerRef}>{charm}</div>, container),
        enterSearchMode: () => containerRef.current?.classList?.add?.('inSearch'),
        exitSearchMode: () => containerRef.current?.classList?.remove?.('inSearch'),
        responsiveBehavior: {
            responsivePriority: 0,
            responsiveSteps: naturalWidth ? undefined : [headerButtonWidthInPixels],
            minimizeBehavior: 'overflow',
            affordanceBehavior: {
                customButtonRenderData: {
                    id: key,
                    iconFontName: iconCode,
                    iconFontFamily: owaIconFontFamily,
                    onHide: onHide,
                    onShow: onShow,
                    ariaLabel: ariaLabel,
                    affordanceMenuItemText: affordanceMenuItemText,
                },
            },
        },
    } as ShellControl;
}

const inboxForMeLabel = () => loc(inboxForMeFlexPaneTitle);
export const OwaInboxForMeButton = {
    id: OwaInboxForMeButtonID,
    headerButtonRenderData: {
        id: OwaInboxForMeButtonID,
        // Temporarily use the Info icon for the button, will replace it after UX create a new icon.
        iconFontName: ControlIconsDefinitions.Info,
        iconFontFamily: owaIconFontFamily,
        ariaLabel: inboxForMeLabel,
        affordanceMenuItemText: inboxForMeLabel,
    },
} as ShellControl;
