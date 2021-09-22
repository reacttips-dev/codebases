import initializeCLPStore from 'owa-mail-protection/lib/actions/clp/initializeCLPStore';
import recreateNestedMruCacheFromMailTipsCacheEntries from 'owa-mail-tips/lib/utils/recreateNestedMruCacheFromMailTipsCacheEntries';
import { AttachmentModel, attachmentStore } from 'owa-attachment-model-store';
import { isFeatureEnabled } from 'owa-feature-flags';
import { ObservableMap } from 'mobx';
import type { ComposeViewState, ComposePopoutData } from 'owa-mail-compose-store';
import type { NestedMruCache } from 'owa-nested-mru-cache';
import { mutatorAction } from 'satcheljs';
import type MailTipsCacheEntry from 'owa-mail-tips/lib/store/schema/MailTipsCacheEntry';
import mailTipsCacheStore from 'owa-mail-tips/lib/store/store';
import {
    getOptionsForFeature,
    OwsOptionsFeatureType,
    BohemiaOptions,
} from 'owa-outlook-service-options';
import type { SessionStoreSchema } from 'owa-editor-addin-plugin-types/lib/utils/AddinViewState';
import { updatePolicyTipMessage } from '../actions/triggerPolicyTips';

export default function extractComposePopoutData(source: ComposePopoutData): ComposeViewState {
    const {
        composeViewState,
        attachments,
        mailtips,
        protectionStore,
        includeFluidOnPopout,
    } = source;

    if (composeViewState.addin?.internetHeaders) {
        composeViewState.addin.internetHeaders = new ObservableMap<string, string>(
            composeViewState.addin.internetHeaders
        );
    } else if (composeViewState.addin) {
        composeViewState.addin.internetHeaders = new ObservableMap<string, string>();
    }

    if (composeViewState.addin?.sessionStore) {
        composeViewState.addin.sessionStore = new ObservableMap<string, SessionStoreSchema>(
            composeViewState.addin.sessionStore
        );
        composeViewState.addin.sessionStore.forEach((dataStoreVar: SessionStoreSchema) => {
            dataStoreVar.dataStore = new ObservableMap<string, string>(dataStoreVar.dataStore);
        });
    } else if (composeViewState.addin) {
        composeViewState.addin.sessionStore = new ObservableMap<string, SessionStoreSchema>();
    }

    // Reset post open tasks to not executed if they need to be reset in new deeplink window,
    // so that they can be executed again
    (composeViewState.postOpenTasks || []).forEach(task => {
        if (task.resetInNewDeeplink) {
            task.executed = false;
        }
    });

    if (includeFluidOnPopout) {
        let option = getOptionsForFeature<BohemiaOptions>(OwsOptionsFeatureType.Bohemia);
        enableBohemia(option);
    }

    // Set up attachments, if present.
    setUpAttachments(attachments);

    // Set up MailTipsCache if present
    if (mailtips) {
        const mailtipsData = recreateNestedMruCacheFromMailTipsCacheEntries(mailtips);
        setUpMailTips(mailtipsData);
    }

    if (isFeatureEnabled('cmp-clp') && protectionStore) {
        const clpStore = {
            clpLabels: protectionStore.clpLabels,
            learnMoreUrl: protectionStore.learnMoreUrl,
            hasMandatoryLabel: protectionStore.hasMandatoryLabel,
        };
        initializeCLPStore(clpStore);
    }

    // Set up PolicyTips if present
    if (composeViewState.policyTipsViewState?.succeededPolicyMatch) {
        updatePolicyTipMessage(composeViewState);
    }

    return composeViewState;
}

const setUpAttachments = mutatorAction(
    'Popout_SetUpAttachments',
    (attachments: AttachmentModel[]) => {
        if (attachments) {
            attachments.forEach(model => {
                attachmentStore().attachments.set(model.id.Id, model);
            });
        }
    }
);

const setUpMailTips = mutatorAction(
    'Popout_SetUpMailTips',
    (mailtipsData: NestedMruCache<MailTipsCacheEntry>) => {
        mailTipsCacheStore.mailTips.initialize(mailtipsData);
    }
);

const enableBohemia = mutatorAction('Popout_EnableBohemia', (options: BohemiaOptions) => {
    options.fluidEnabledForTenant = true;
});
