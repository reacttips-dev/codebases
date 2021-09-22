/* tslint:disable:jsx-no-lambda WI:47690 */
import { expressionHeaderText, userVoiceIdeasPaneHeader } from './OwaSuiteFlexPane.locstring.json';
import { timePanelHeaderText } from '../strings.locstring.json';
import type { ShellFlexPane, CustomShellFlexPane } from '@suiteux/suiteux-shell-react';
import { ThemeProvider } from '@fluentui/react/lib/utilities/ThemeProvider';
import { ActivityFeed, ActivityFeedTitle } from 'owa-activity-feed';
import { logUsage } from 'owa-analytics';
import { lazyCloseExpressionPane } from 'owa-expressions-store';
import { ExpressionPane } from 'owa-expressions-view';
import { UserVoiceIdeasPane } from 'owa-uservoice';
import { KnownIssuesFeedbackFormHeader, KnownIssuesFeedbackForm } from 'owa-smiley-feedback';
import { RolloutOverridesPane, MiniMavenPane } from 'owa-header-pane';
import { InboxForMe } from 'owa-inbox-for-me-surface';
import { deactivateCharm, getActiveCharm, HeaderCharmType, toggleCharm } from 'owa-header-store';
import loc from 'owa-localize';
import { activityFeedTitle } from 'owa-locstrings/lib/strings/activityfeedtitle.locstring.json';
import { feedbackCharm_ariaLabel } from 'owa-locstrings/lib/strings/feedbackcharm_arialabel.locstring.json';
import { helpCharm_ariaLabel } from 'owa-locstrings/lib/strings/helpcharm_arialabel.locstring.json';
import { noteFeedFlexPaneTitle } from 'owa-locstrings/lib/strings/notefeedflexpanetitle.locstring.json';
import { settingsCharm_ariaLabel } from 'owa-locstrings/lib/strings/settingscharm_arialabel.locstring.json';
import { whatsNew_FlexPane_Title } from 'owa-locstrings/lib/strings/whatsnew_flexpane_title.locstring.json';
import { inboxForMeFlexPaneTitle } from 'owa-locstrings/lib/strings/inboxformeflexpanetitle.locstring.json';
import { NotesPane } from 'owa-notes-components';
import resetSearch from 'owa-options-search/lib/actions/resetSearch';
import { QuickOptions } from 'owa-options-view';
import { lazyTriggerResizeEvent } from 'owa-resize-event';
import { lazyPopoutReadingPane } from 'owa-popout-utils';
import closeFlexPane from 'owa-suite-header-apis/lib/flexpanes/actions/closeFlexPane';
import { lazySetIsSkypeShown } from 'owa-skype-for-business';
import { TimePanel, TimePanelHeaderBar } from 'owa-time-panel';
import { WhatsNewFluentPane } from 'owa-whats-new';
import {
    lazyRenderFeedbackPane,
    lazyRenderSupportPane,
    lazyOnFeedbackPaneOpen,
    lazyOnSupportPaneOpen,
    lazyOnFeedbackPaneClose,
    lazyOnSupportPaneClose,
} from 'diagnostics-and-support';
import { getDensity } from 'owa-fabric-theme';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { wrapInApolloProvider } from 'owa-apollo';

import {
    OwaFeedbackButtonID,
    OwaDiagFeedbackButtonID,
    OwaRolloutOverridesButtonID,
    OwaWhatsNewButtonID,
    OwaSettingsButtonID,
    OwaHelpButtonID,
    OwaSupportButtonID,
    OwaTimePanelButtonID,
    OwaActivityFeedButtonID,
    OwaNoteFeedButtonID,
    OwaInboxForMeButtonID,
    OwaFeedbackFlexPaneID,
    OwaDiagFeedbackFlexPaneID,
    OwaRolloutOverridesFlexPaneID,
    OwaWhatsNewFlexPaneID,
    OwaSettingsFlexPaneID,
    OwaHelpFlexPaneID,
    OwaSupportFlexPaneID,
    OwaTimePanelFlexPaneID,
    OwaActivityFeedFlexPaneID,
    OwaExpressionFlexPaneID,
    OwaSkypeFlexPaneID,
    OwaIdeasFlexPaneID,
    OwaNoteFeedFlexPaneID,
    OwaInboxForMeFlexPaneID,
} from '../constants';
import { setShellButtonCustomBadgeCount } from 'owa-suite-header-apis';
import { setIsFlexPaneShown } from 'owa-suite-header-store';
import { popoutReadingPane } from 'owa-popout';
import headerStyles from './OwaSuiteHeader.scss';
import headerPaneStyles from 'owa-header-pane/lib/components/HeaderPane.scss';
import classNames from 'classnames';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';

export const OwaDiagFeedbackFlexPane = createShellFlexPane({
    flexPaneID: OwaDiagFeedbackFlexPaneID,
    flexPaneTitle: () => '',
    triggerControlID: OwaDiagFeedbackButtonID,
    containerClassName: headerStyles.customFlexPane,
    render: (container: HTMLDivElement) => {
        lazyRenderFeedbackPane.importAndExecute(container, () => {
            closeFlexPane(OwaDiagFeedbackFlexPaneID);
        });
    },
    onFlexPaneOpen: () => {
        lazyOnFeedbackPaneOpen.importAndExecute();
    },
    onFlexPaneClose: () => {
        lazyOnFeedbackPaneClose.importAndExecute();
    },
} as ShellFlexPane);

export const OwaFeedbackFlexPane = createShellFlexPane({
    flexPaneID: OwaFeedbackFlexPaneID,
    flexPaneTitle: () => loc(feedbackCharm_ariaLabel),
    customTitle: (container: HTMLDivElement) => {
        ReactDOM.render(<KnownIssuesFeedbackFormHeader />, container);
    },
    triggerControlID: OwaFeedbackButtonID,
    containerClassName: headerStyles.customFlexPane,
    render: (container: HTMLDivElement) => {
        ReactDOM.render(
            <React.StrictMode>
                <KnownIssuesFeedbackForm
                    onSendFeedback={() => {
                        closeFlexPane(OwaFeedbackFlexPaneID);
                    }}
                    onKnownIssuesRendered={() => {
                        setShellButtonCustomBadgeCount(OwaFeedbackButtonID, 0);
                    }}
                />
            </React.StrictMode>,
            container
        );
    },
} as ShellFlexPane);

export const OwaRolloutOverridesFlexPane = createShellFlexPane({
    flexPaneID: OwaRolloutOverridesFlexPaneID,
    flexPaneTitle: () => 'Rollout Overrides', // No need to localize as it is a DEV feature only
    triggerControlID: OwaRolloutOverridesButtonID,
    containerClassName: headerStyles.customFlexPane,
    render: renderInsideFlexPane(<RolloutOverridesPane />, 'Rollout Overrides'),
} as ShellFlexPane);

export const OwaSettingsFlexPane = createShellFlexPane({
    flexPaneID: OwaSettingsFlexPaneID,
    flexPaneTitle: () => loc(settingsCharm_ariaLabel),
    onFlexPaneClose: resetSearch,
    triggerControlID: OwaSettingsButtonID,
    containerClassName: headerStyles.customFlexPane,
    render: renderInsideFlexPane(
        <QuickOptions onDismiss={onQuickSettingsDismiss} />,
        loc(settingsCharm_ariaLabel)
    ),
} as ShellFlexPane);

export const OwaTimePanelFlexPane = createShellFlexPane({
    flexPaneID: OwaTimePanelFlexPaneID,
    flexPaneTitle: () => loc(timePanelHeaderText),
    triggerControlID: OwaTimePanelButtonID,
    containerClassName: classNames(headerStyles.timePanelContainer, headerStyles.customFlexPane),
    customTitle: (container: HTMLDivElement) => {
        ReactDOM.render(
            <React.StrictMode>
                <TimePanelHeaderBar onClosePanel={onTimePanelDismiss} />
            </React.StrictMode>,
            container
        );
    },
    render: renderInsideFlexPane(
        <TimePanel onClosePanel={onTimePanelDismiss} />,
        loc(timePanelHeaderText)
    ),
    customEscapeKeyHandling: true,
} as ShellFlexPane);

export const OwaWhatsNewFlexPane = createShellFlexPane({
    flexPaneID: OwaWhatsNewFlexPaneID,
    flexPaneTitle: () => loc(whatsNew_FlexPane_Title),
    triggerControlID: OwaWhatsNewButtonID,
    containerClassName: headerStyles.whatsNewFlexPane,
    render: renderInsideFlexPane(<WhatsNewFluentPane />, loc(whatsNew_FlexPane_Title)),
} as ShellFlexPane);

export const OwaHelpFlexPane = createShellFlexPane({
    flexPaneID: OwaHelpFlexPaneID,
    flexPaneTitle: () => loc(helpCharm_ariaLabel),
    triggerControlID: OwaHelpButtonID,
    containerClassName: headerStyles.customFlexPane,
    render: renderInsideFlexPane(
        <MiniMavenPane
            onDismiss={() => {
                closeFlexPane(OwaHelpFlexPaneID);
            }}
        />,
        loc(helpCharm_ariaLabel),
        headerPaneStyles.content
    ),
} as ShellFlexPane);

export const OwaSupportFlexPane = createShellFlexPane({
    flexPaneID: OwaSupportFlexPaneID,
    flexPaneTitle: () => '',
    triggerControlID: OwaSupportButtonID,
    containerClassName: headerStyles.customFlexPane,
    render: (container: HTMLDivElement) => {
        lazyRenderSupportPane.importAndExecute(container, () => {
            closeFlexPane(OwaSupportFlexPaneID);
        });
    },
    onFlexPaneOpen: () => {
        lazyOnSupportPaneOpen.importAndExecute();
    },
    onFlexPaneClose: () => {
        lazyOnSupportPaneClose.importAndExecute();
    },
} as ShellFlexPane);

const activityFeedOpenMailAction = {
    openMail: (messageId: string, itemId?: string) => {
        // Once activity feed notifications(specifically atmention) move to immutable ids we should remove this check and have a single flow for both owa and monarch
        if (isHostAppFeatureEnabled('nativeResolvers') && itemId) {
            popoutReadingPane(itemId);
        } else {
            lazyPopoutReadingPane.importAndExecute(
                /* itemId */ itemId,
                /* internetMessageId */ messageId
            );
        }
    },
};
const activityFeedOpenLinkAction = {
    openLink: (url: string) => {
        window.open(url, '_blank');
    },
};

export const OwaActivityFeedFlexPane = createShellFlexPane({
    flexPaneID: OwaActivityFeedFlexPaneID,
    flexPaneTitle: () => loc(activityFeedTitle),
    triggerControlID: OwaActivityFeedButtonID,
    containerClassName: headerStyles.fullHeightFlexPane,
    onFlexPaneOpen: () => {
        logUsage('activityFeedCharmClicked');
    },
    customTitle: (container: HTMLDivElement) => {
        ReactDOM.render(
            <React.StrictMode>
                <ActivityFeedTitle />
            </React.StrictMode>,
            container
        );
    },
    render: renderInsideFlexPane(
        <ActivityFeed
            openMailAction={activityFeedOpenMailAction}
            openLinkAction={activityFeedOpenLinkAction}
        />,
        loc(activityFeedTitle)
    ),
} as ShellFlexPane);

export const OwaNoteFeedFlexPane = createShellFlexPane({
    flexPaneID: OwaNoteFeedFlexPaneID,
    flexPaneTitle: () => loc(noteFeedFlexPaneTitle),
    triggerControlID: OwaNoteFeedButtonID,
    containerClassName: headerStyles.fullHeightFlexPane,
    onFlexPaneOpen: () => {
        if (window.performance) {
            window.performance.mark('StartStickyNotesSDKLoad');
        }
    },
    render: renderInsideFlexPane(
        <NotesPane scenario="NotesFeedFlexPane" />,
        loc(noteFeedFlexPaneTitle)
    ),
} as ShellFlexPane);

export const OwaExpressionFlexPane = createShellFlexPane({
    flexPaneID: OwaExpressionFlexPaneID,
    flexPaneTitle: () => loc(expressionHeaderText),
    onFlexPaneClose: () => lazyCloseExpressionPane.importAndExecute(),
    render: (container: HTMLDivElement) => {
        ReactDOM.render(
            <React.StrictMode>
                <ExpressionPane />
            </React.StrictMode>,
            container
        );
    },
} as ShellFlexPane);

export const OwaIdeasFlexPane = createShellFlexPane({
    flexPaneID: OwaIdeasFlexPaneID,
    flexPaneTitle: () => loc(userVoiceIdeasPaneHeader),
    render: (container: HTMLDivElement) => {
        ReactDOM.render(
            <React.StrictMode>
                <UserVoiceIdeasPane />
            </React.StrictMode>,
            container
        );
    },
} as ShellFlexPane);

export const OwaSkypeFlexPane = createShellFlexPane({
    flexPaneID: OwaSkypeFlexPaneID,
    flexPaneTitle: () => null,
    onFlexPaneOpen: () => {
        if (getActiveCharm() !== HeaderCharmType.SkypeCharm) {
            toggleCharm(HeaderCharmType.SkypeCharm);
        }
    },
    onFlexPaneClose: () => {
        lazySetIsSkypeShown.import().then(setSkypeIsShown => setSkypeIsShown(false /*isShown*/));
        deactivateCharm(HeaderCharmType.SkypeCharm);
    },
    render: () => {
        // Intended to be empty, skype pane will be rendered separately
    },
} as ShellFlexPane);

export const OwaInboxForMeFlexPane = createShellFlexPane({
    flexPaneID: OwaInboxForMeFlexPaneID,
    flexPaneTitle: () => loc(inboxForMeFlexPaneTitle),
    triggerControlID: OwaInboxForMeButtonID,
    containerClassName: headerStyles.inboxForMePanelContainer,
    onFlexPaneOpen: () => {
        logUsage('inboxForMeButtonClicked');
    },
    render: (container: HTMLDivElement) => {
        ReactDOM.render(
            <React.StrictMode>
                <InboxForMe
                    isMobile={false}
                    showOnlyUnreadMailMessages={true}
                    loadTeamsChats={true}
                    loadTeamsChannels={false}
                    loadEmails={true}
                />
            </React.StrictMode>,
            container
        );
    },
} as ShellFlexPane);

function renderInsideFlexPane(
    elements: React.ReactNode | React.ReactNode[],
    flexPaneTitle: string,
    className?: string
) {
    return (container: HTMLDivElement) =>
        ReactDOM.render(
            wrapInApolloProvider(() => (
                <ThemeProvider
                    theme={{
                        ...getDensity(),
                    }}
                    tabIndex={-1}
                    role={'complementary'}
                    aria-label={flexPaneTitle}
                    className={className}
                    style={{ background: 'inherit' }}>
                    {elements}
                </ThemeProvider>
            ))(),
            container
        );
}

function onQuickSettingsDismiss() {
    closeFlexPane(OwaSettingsFlexPaneID);
}

function onTimePanelDismiss() {
    closeFlexPane(OwaTimePanelFlexPaneID);

    // normally suite header would handle this concern, but Time Panel needs custom ESC key handling
    // so we need to manually setting focus back on the panel button per A11Y best practices
    document.getElementById(OwaTimePanelButtonID)?.focus();
}

function createShellFlexPane(flexPane: ShellFlexPane): CustomShellFlexPane {
    return {
        ...flexPane,
        onFlexPaneOpen: createOnFlexPaneOpenCloseCallback(
            true,
            (flexPane as CustomShellFlexPane).onFlexPaneOpen
        ),
        onFlexPaneClose: createOnFlexPaneOpenCloseCallback(
            false,
            (flexPane as CustomShellFlexPane).onFlexPaneClose
        ),
    } as CustomShellFlexPane;
}

function createOnFlexPaneOpenCloseCallback(isOpen: boolean, callback?: () => void): () => void {
    return function () {
        lazyTriggerResizeEvent.importAndExecute();
        setIsFlexPaneShown(isOpen);
        if (callback) {
            callback();
        }
    };
}
