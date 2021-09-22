import initializeNewLikeNotificationFilter from './initialization/initializeNewLikeNotificationFilter';
import initializeNewMailNotificationFilter from './initialization/initializeNewMailNotificationFilter';
import initializeNewReactionNotificationFilter from './initialization/initializeNewReactionNotificationFilter';
import setupMailModuleCommonPostRender from './setupMailModuleCommonPostRender';
import { lazyInitializePostWeveSignal } from 'owa-activity-feed';
import { isFeatureEnabled } from 'owa-feature-flags';
import 'owa-getstarted-bootstrap';
import { initializeBindStatusLazy } from 'owa-linkedin';
import { lazyLoadSenders } from 'owa-mail-amp-store';
import { lazyGetMailModuleDiagnostics } from 'owa-mail-diagnostics';
import { lazySubscribeToHierarchyNotification } from 'owa-mail-folder-notifications';
import 'owa-mail-list-selection-actions-v2/lib/lazyIndex';
import connectedAccountsNotificationOperation from 'owa-service/lib/operation/connectedAccountsNotificationOperation';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import { lazyFetchSpotlightItems } from 'owa-mail-spotlight';
import { lazyInitializePersonalizationSuggestions } from 'owa-personalization';
import {
    lazyfindBulkActionItemAction,
    lazySubscribeToBulkActionNotification,
} from 'owa-bulk-action-store-lazy';
import { lazyGovern, lazyEnableGovernReport } from 'owa-tti';
import { lazyGetAccountInformation } from 'owa-storage-store';
import {
    isLinkedInViewProfileFeatureFlagEnabled,
    lazyEnsureSecondaryReadingPaneTabHandler,
} from 'owa-mail-reading-pane-store';
import { lazyEvaluatePlaywrightMailActions } from 'owa-mail-playwright';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { isAnswerFeatureEnabled, lazyInitializeSearchAnswers } from 'owa-mail-search';
import { lazyLoadAndInitializeFloodgateEngine } from 'owa-floodgate-feedback-view';
import { registerMailtoProtocolHandler } from 'owa-mailto-protocol-handler/lib/utils/handleAndLogOperation';
import { originTrialTokenSet } from 'owa-mailto-protocol-handler/lib/utils/constants';
import { getOrigin } from 'owa-url';
import { isBrowserEDGECHROMIUM } from 'owa-user-agent';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';
import { lazyModule as composeModule } from 'owa-mail-compose-command';
import { getCurrentCulture } from 'owa-localize';
import onInitialTableLoadComplete from 'owa-mail-table-loading-actions/lib/actions/onInitialTableLoadComplete';

export default function setupMailModulePostRender() {
    if (getUserConfiguration().IsMonitoring) {
        lazyEvaluatePlaywrightMailActions.importAndExecute();
    }

    // Subscribe to hierarchy notifications
    lazySubscribeToHierarchyNotification.importAndExecute();

    // tasks in here are governed individually and apply to
    // both mail module and mail deeplink scenarios.
    setupMailModuleCommonPostRender(true);

    if (isFeatureEnabled('fwk-mailtoProtocolHandler')) {
        registerMailtoProtocolHandler();
        if (isBrowserEDGECHROMIUM()) {
            const currentOrigin: string = getOrigin();
            if (currentOrigin in originTrialTokenSet) {
                const token = originTrialTokenSet[currentOrigin];
                const tokenElement = document.createElement('meta');
                tokenElement.httpEquiv = 'origin-trial';
                tokenElement.content = token;
                document.head.appendChild(tokenElement);
            }
        }
    }

    lazyGovern
        .importAndExecute(
            {
                task: () => composeModule.import(),
                idle: true,
            },
            {
                /**
                 * Initialize the singleton diagnostics store to register the
                 * diagnostics listeners if dev tools are enabled OR if the
                 * search feedback feature is enabled (since it relies on data
                 * being pushed to the diagnostics store).
                 */
                condition:
                    isFeatureEnabled('fwk-devTools') || isFeatureEnabled('sea-contextFeedback'),
                task: () => lazyGetMailModuleDiagnostics.importAndExecute(),
            },
            {
                condition:
                    isFeatureEnabled('fwk-nlqsFloodgateSurvey') &&
                    isHostAppFeatureEnabled('floodgate') &&
                    getCurrentCulture()?.toLowerCase() !== 'en-us',
                task: () => lazyLoadAndInitializeFloodgateEngine.importAndExecute(null, true),
            },
            initNotifications,
            {
                condition: isAnswerFeatureEnabled(),
                task: () => lazyInitializeSearchAnswers.importAndExecute(),
            },
            {
                condition: isFeatureEnabled('tri-spotlight2'),
                task: () => lazyFetchSpotlightItems.importAndExecute(onInitialTableLoadComplete),
            },
            {
                condition: isConsumer(),
                task: () => lazyLoadSenders.importAndExecute(),
            },
            () => lazyfindBulkActionItemAction.importAndExecute(),
            () => lazySubscribeToBulkActionNotification.importAndExecute(),
            {
                condition: isFeatureEnabled('mc-personalization'),
                task: () => {
                    lazyInitializePersonalizationSuggestions.importAndExecute();
                },
                idle: true,
            },
            {
                condition: isLinkedInViewProfileFeatureFlagEnabled(),
                task: () => initializeBindStatusLazy.importAndExecute(),
                idle: true,
            },
            {
                task: () => lazyGetAccountInformation.importAndExecute(),
                idle: true,
            },
            {
                condition:
                    isFeatureEnabled('auth-activityFeed') &&
                    isFeatureEnabled('auth-activityFeedWeveSignal'),
                task: () => lazyInitializePostWeveSignal.importAndExecute(),
                idle: true,
            },
            {
                condition: isFeatureEnabled('mail-popout-projection'),
                task: () => lazyEnsureSecondaryReadingPaneTabHandler.importAndExecute(),
                idle: true,
            }
        )
        .then(() => {
            // enable reporting after we've queued everything
            lazyEnableGovernReport.importAndExecute();
        });
}

function initNotifications() {
    initializeNewMailNotificationFilter();
    initializeNewLikeNotificationFilter();
    initializeNewReactionNotificationFilter();

    if (isConsumer()) {
        // this will try the notifications to sync now, which should be done only for consumers
        // legacy connected accounts is deprecated for enterprise users.
        // https://support.microsoft.com/en-us/office/connect-email-accounts-in-outlook-on-the-web-microsoft-365-d7012ff0-924f-4f78-8aca-c3912d886c4d
        connectedAccountsNotificationOperation({ isOWALogon: true });
    }
}
