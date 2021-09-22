import { logUsage } from 'owa-analytics';
import type { CustomData } from 'owa-analytics-types';
import { getClientVersion, getHostValue, getSessionId, NATIVE } from 'owa-config';
import { isFeatureEnabled } from 'owa-feature-flags';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';
import { getCurrentCulture } from 'owa-localize';
import {
    BootstrapperConfig,
    getLokiBootstrapperConfig,
    initializeLivePersonaCardAsync as initializeLivePersonaCard,
    initializeLoki,
    isLokiInitialized,
} from 'owa-people-loki';
import { getSharedMailboxAadObjectId } from 'owa-people-loki/lib/utils/getSharedMailboxAadObjectId';
import { DEPRECATED_openDeeplinkPopout } from 'owa-popout/lib/utils/DEPRECATED_openDeeplinkPopout';
import { getMailToComposeDeeplink } from 'owa-popout/lib/utils/getMailComposeDeeplink';
import { getMailReadDeeplink } from 'owa-popout/lib/utils/getMailReadDeeplink';
import sessionStore from 'owa-session-store/lib/store/store';
import { default as getIsConsumer } from 'owa-session-store/lib/utils/isConsumer';
import { lazyGetTopicDefinition, lazyLogEvent } from 'owa-topic-annotations/lib/lazyFunctions';
import { trace } from 'owa-trace';
import { getOwaWorkload, OwaWorkload } from 'owa-workloads';
import { onMeetingInfoRequested, openMeeting } from '../actions/meetingCardActions';
import type ComposeEmailFunction from '../ComposeEmailFunction';
import { createOwsPersona } from '../dataLayer/createOwsPersona';
import { getNotesForPersona } from '../dataLayer/getNotesForPersona';
import { getOwsPersona } from '../dataLayer/getOwsPersona';
import { getOwsPersonaByEmailAddress } from '../dataLayer/getOwsPersonaByEmailAddress';
import { updateOwsPersona } from '../dataLayer/updateOwsPersona';
import { lazyEnhanceLpcConfigForOffline } from '../lazyFunctions';
import {
    ActionProperties,
    ComposeMailProperties,
    DataCallback,
    getConfig,
    Persona,
    PersonaConfig,
    PersonaIdentifiers,
} from '../personaConfig';
import getBrandUnsubscribeInfo from '../services/getBrandUnsubscribeInfo';
import unsubscribeFromBrand from '../services/unsubscribeFromBrand';
import getAndPrefetchPersonaImageUri from './getAndPrefetchPersonaImageUri';
import makeMeetingActionCallbacks from './makeMeetingActionCallbacks';
import onPersonaUpdated from './onPersonaUpdated';

let initializeLivePersonaCardPromise: Promise<void>;

export default async function initializeLivePersonaCardAsync(
    composeEmailOverride?: ComposeEmailFunction
): Promise<void> {
    let config: PersonaConfig = {};
    try {
        // Here be dragons...
        //
        // There is a race condition between the initialization of the LPC config using initializePersona()
        // and the getConfig() call reading the initialized config. We therefore wrap this logic in a promise
        // (in personaConfig.ts) to ensure that the getConfig() call will always wait for the execution of
        // the initializePersona() call. However, for some reason OWA calendar is not properly calling
        // initializePersona(), meaning the config is never set. That means LPC bootstrapping will always
        // be delayed 45 seconds in Calendar. To quickly hack around this we simply do not request this
        // config for Calendar. This is super hacky and a proper fix for this is tracked here:
        // https://msfast.visualstudio.com/FAST/_workitems/edit/306710
        //
        // NOTE: As of June 2020, it seems that only Mail module and Groups code explicitly initialize
        // a custom config, so it's unclear whether the details in the above comment are wrong vs outdated.
        // In any case, ownership of a proper fix is still on FAST team, so for now the workload check is
        // just being expanded to consider 'skipAwaitLpcConfig' host flag as an additional context where we want to
        // skip waiting for the config (as otherwise we will wait 45+ seconds for LPC to bootstrap).
        const workload = getOwaWorkload();
        const shouldSkipAwaitConfig =
            workload === OwaWorkload.Calendar || isHostAppFeatureEnabled('skipAwaitLpcConfig');
        if (workload === OwaWorkload.LeaveGroupOpx || !shouldSkipAwaitConfig) {
            config = await getConfig();
        }
    } catch {
        logUsage('LpcCallbacksWereNotInitialized');
    }

    initializeLivePersonaCardPromise =
        initializeLivePersonaCardPromise ||
        initializeLivePersonaCard(
            await offlineEnhancedMakeLivePersonaCardConfig(config, composeEmailOverride)
        );

    return initializeLivePersonaCardPromise;
}

async function offlineEnhancedMakeLivePersonaCardConfig(
    config: PersonaConfig,
    composeEmailOverride?: ComposeEmailFunction
): Promise<BootstrapperConfig> {
    const lpcConfig = makeLivePersonaCardConfig(config, composeEmailOverride);

    if (getHostValue() === NATIVE && isFeatureEnabled('peo-offline')) {
        const enhanceLpcConfigForOffline = await lazyEnhanceLpcConfigForOffline.import();
        enhanceLpcConfigForOffline(lpcConfig);
    }

    return lpcConfig;
}

function makeLivePersonaCardConfig(
    config: PersonaConfig,
    composeEmailOverride?: ComposeEmailFunction
): BootstrapperConfig {
    // TODO(jdferre): we should define types for action, data and privateData callbacks.
    // We should also update their definitions, or maybe get a package from LPC with them?
    const actionCallbacks: any = makeActionCallbacks(config, composeEmailOverride);
    const dataCallbacks: any = makeDataCallbacks(config);
    const privateDataCallbacks: any = makePrivateDataCallbacks();
    const dataUpdateBroadcaster: any = makeDataUpdateBroadcaster(config);

    // We need to initialize Loki's configuration before obtaining the BootstrapperConfig
    initializeLokiConfiguration();

    const bootstrapperConfig = getLokiBootstrapperConfig();
    const timeFormat: string = sessionStore.userConfiguration.UserOptions.TimeFormat;
    const dateFormat: string = sessionStore.userConfiguration.UserOptions.DateFormat;
    const isSetPhotoEnabled: boolean = sessionStore.userConfiguration.SegmentationSettings.SetPhoto;
    const is24HourFormat: boolean = timeFormat && timeFormat.indexOf('tt') === -1;
    const sharedMailboxAadObjectId = getSharedMailboxAadObjectId();

    return {
        ...bootstrapperConfig,
        actionCallbacks: actionCallbacks,
        dataCallbacks: dataCallbacks,
        privateDataCallbacks: privateDataCallbacks,
        dataUpdateBroadcaster: dataUpdateBroadcaster,
        options: {
            isSetPhotoEnabled: isSetPhotoEnabled,
            isLinkedInIntegrationEnabled: false,
            timeFormat: timeFormat,
            dateFormat: dateFormat,
            is24HourFormat: is24HourFormat,
            sharedMailboxAadObjectId,
        },
    };
}

function makeActionCallbacks(
    config: PersonaConfig,
    composeEmailOverride?: ComposeEmailFunction
): any {
    const actionCallbacks: any = {
        readMail: readMail,
        composeMail: makeComposeMailCallback(config, composeEmailOverride),
        meetingActionCallbacks: makeMeetingActionCallbacks(config),
        onPersonaUpdated: onPersonaUpdated,
        openMeeting: onOpenMeeting,
    };

    if (isFeatureEnabled('rp-brandCardsUnsubscribe')) {
        actionCallbacks.unsubscribeFromBrand = unsubscribeFromBrand;
    }

    if (isFeatureEnabled('csi-owa-topic-card')) {
        actionCallbacks.removeTopicHighlight = removeTopicHighlight;
    }

    if (config.actionCallbacks) {
        if (config.actionCallbacks.favoritePersona) {
            actionCallbacks.favoritePersona = config.actionCallbacks.favoritePersona;
        }

        if (config.actionCallbacks.unfavoritePersona) {
            actionCallbacks.unfavoritePersona = config.actionCallbacks.unfavoritePersona;
        }

        if (config.actionCallbacks.readMail) {
            actionCallbacks.readMail = config.actionCallbacks.readMail;
        }

        if (config.actionCallbacks.toggleSubscribeToGroup) {
            actionCallbacks.toggleSubscribeToGroup = config.actionCallbacks.toggleSubscribeToGroup;
        }
        if (config.actionCallbacks.editGroup) {
            actionCallbacks.editGroup = config.actionCallbacks.editGroup;
        }
        if (config.actionCallbacks.addGroupMembers) {
            actionCallbacks.addGroupMembers = config.actionCallbacks.addGroupMembers;
        }
        if (config.actionCallbacks.updateMembership) {
            actionCallbacks.updateMembership = config.actionCallbacks.updateMembership;
        }
        const startChat = config.actionCallbacks.getStartChatCallback?.();
        if (startChat) {
            actionCallbacks.startChat = startChat;
        }
    }

    return actionCallbacks;
}

function makeDataCallbacks(config: PersonaConfig): any {
    const dataCallbacks: any = {
        getAndPrefetchPersonaImageUri: getAndPrefetchPersonaImageUri,
        getPersonaInfo: getPersonaInfo,
    };

    if (config.dataCallbacks?.getIsPersonaFavorited) {
        dataCallbacks.getIsPersonaFavorited = config.dataCallbacks.getIsPersonaFavorited;
    }

    if (isFeatureEnabled('rp-brandCardsUnsubscribe')) {
        dataCallbacks.getBrandUnsubscribeInfo = getBrandUnsubscribeInfo;
    }

    if (config.dataCallbacks?.getPresence) {
        dataCallbacks.getPresence = config.dataCallbacks.getPresence;
    }

    if (isFeatureEnabled('csi-owa-topic-card')) {
        dataCallbacks.getTopicPageData = getTopicPageData;
    }

    // csi-gettopicdata flight makes getTopicData happen directly in the LPC, no need for callbacks
    if (isFeatureEnabled('csi-owa-topic-card') && !isFeatureEnabled('csi-gettopicdata')) {
        dataCallbacks.getTopicData = getTopicData;
    }

    return dataCallbacks;
}

function makePrivateDataCallbacks(): any {
    return {
        updateOwsPersona,
        getOwsPersona,
        getOwsPersonaByEmailAddress,
        getNotesForPersona,
        createOwsPersona,
    };
}

function makeDataUpdateBroadcaster(config: PersonaConfig): any {
    const dataUpdateBroadcaster: any = {};

    if (!config.dataUpdateBroadcaster) {
        return dataUpdateBroadcaster;
    }

    if (config.dataUpdateBroadcaster.setGroupUpdateListener) {
        dataUpdateBroadcaster.setGroupUpdateListener =
            config.dataUpdateBroadcaster.setGroupUpdateListener;
    }

    if (config.dataUpdateBroadcaster.setGroupMembersUpdateListener) {
        dataUpdateBroadcaster.setGroupMembersUpdateListener =
            config.dataUpdateBroadcaster.setGroupMembersUpdateListener;
    }

    if (config.dataUpdateBroadcaster.setGroupDeleteListener) {
        dataUpdateBroadcaster.setGroupDeleteListener =
            config.dataUpdateBroadcaster.setGroupDeleteListener;
    }

    if (config.dataUpdateBroadcaster.updatePopupStateListener) {
        dataUpdateBroadcaster.updatePopupStateListener =
            config.dataUpdateBroadcaster.updatePopupStateListener;
    }

    if (config.dataUpdateBroadcaster.setGroupUpdateSmtpListener) {
        dataUpdateBroadcaster.setGroupUpdateSmtpListener =
            config.dataUpdateBroadcaster.setGroupUpdateSmtpListener;
    }

    return dataUpdateBroadcaster;
}

function initializeLokiConfiguration(): void {
    if (isLokiInitialized) {
        return;
    }

    const isConsumer: boolean = getIsConsumer();
    const culture: string = getCurrentCulture();
    const tenantId: string = sessionStore.userConfiguration.SessionSettings.TenantGuid;
    const clientCorrelationId = getSessionId();
    const useDogfood: boolean = isFeatureEnabled('peo-lokiDogfood');
    const logger = (eventName: string, customData: CustomData) => {
        logUsage(eventName, customData);
    };

    initializeLoki({
        culture,
        isConsumer,
        useDogfood,
        logger,
        tenantId,
        clientCorrelationId,
    });
}

function readMail(mailId: string): void {
    DEPRECATED_openDeeplinkPopout(getMailReadDeeplink(mailId), /*isExternalApp*/ true);
}

function makeComposeMailCallback(
    config: PersonaConfig,
    composeEmailOverride?: ComposeEmailFunction
): (recipient: string, subject?: string, body?: string) => void {
    return (
        recipient: string,
        subject?: string,
        body?: string,
        properties?: ActionProperties & ComposeMailProperties,
        personaId?: PersonaIdentifiers
    ) => {
        if (composeEmailOverride) {
            composeEmailOverride(recipient, recipient);
        } else if (config.actionCallbacks?.composeMail) {
            config.actionCallbacks.composeMail(recipient, subject, body, properties);
        } else {
            DEPRECATED_openDeeplinkPopout(
                getMailToComposeDeeplink({
                    to: {
                        smtpAddress: recipient,
                        displayName: getComposeRecipientDisplayName(properties),
                    },
                }),
                /*isExternalApp*/ true
            );
        }

        // Compose view is triggered in existing window, therefore dismiss card so it's not left hanging without an anchor
        (window as any).LPC.dismissCard();
    };
}

function getComposeRecipientDisplayName(
    properties: ActionProperties & ComposeMailProperties
): string | undefined {
    if (properties) {
        if (properties.personaDisplayName) {
            return properties.personaDisplayName;
        }

        if (properties.recipientDisplayName) {
            return properties.recipientDisplayName;
        }
    }

    return undefined;
}

function getPersonaInfo(personaId: PersonaIdentifiers, callback: DataCallback<Persona>): void {
    if (personaId.PersonaType === 'Meeting') {
        onMeetingInfoRequested(personaId, callback);
    }
}

function getTopicPageData(
    personaId: PersonaIdentifiers,
    callback: (data: { feedbackClientInfo?: string }, errorMessage?: string) => void
): void {
    if (isFeatureEnabled('csi-owa-topic-card') /* && personaId.PersonaType === 'Topic' */) {
        const info = [
            '',
            `Topic data source: ${isFeatureEnabled('csi-gettopicdata') ? 'LPC' : 'OWA'}`,
            `API: ${isFeatureEnabled('csi-usetopicssdkapi') ? 'SDK' : 'KM API'}`,
            `WTQ filter: ${
                isFeatureEnabled('csi-disableTopicRelevanceFilter') ? 'Disabled' : 'Enabled'
            }`,
            `OWA version: ${getClientVersion()}`,
            `Client correlation id: ${getSessionId()}`,
        ].join('\n * ');
        callback({ feedbackClientInfo: info });
    }
}

function getTopicData(
    personaId: PersonaIdentifiers,
    callback: (topicEntity: any, errorMessage?: string) => void
): void {
    // PersonaType is not correct on the LPC code
    if (isFeatureEnabled('csi-owa-topic-card') /* && personaId.PersonaType === 'Topic' */) {
        const callbackWithError = (error: string) => {
            trace.info(error);
            callback(undefined, error);
        };

        lazyGetTopicDefinition.importAndExecute(personaId.TopicId).then(
            topic => {
                try {
                    callback(topic);
                } catch (error) {
                    callbackWithError(`Error in LPC getTopicData callback: ${error}`);
                }
            },
            error => {
                callbackWithError(`Error getting topic definition: ${error}`);
            }
        );
    }
}

function removeTopicHighlight(topicId: string): void {
    lazyLogEvent.importAndExecute('Cortex.TopicAnnotation.TopicHighlights.Remove', { topicId });
}

function onOpenMeeting(meetingId: string) {
    // Calendar forms are triggered in existing window, therefore dismiss card so it's not left hanging without an anchor
    (window as any).LPC.dismissCard();
    openMeeting(meetingId);
}
