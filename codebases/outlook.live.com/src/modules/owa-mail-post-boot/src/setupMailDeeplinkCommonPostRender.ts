import { lazyInitializeExtensibilityContext } from 'owa-addins-core/lib/lazyFunctions';
import initializeNotifications from './initializeNotifications';
import initializePersona from './initializePersona';
import { getBrandsSubscriptionsService } from 'owa-brands-subscription';
import { isFeatureEnabled } from 'owa-feature-flags';
import { initializeBindStatusLazy } from 'owa-linkedin';
import { initialize as initializeDefaultSettingsExperiment } from 'owa-mail-defaultsettings';
import { lazySetup } from 'owa-notification';
import shouldUse3SPeopleSuggestions from 'owa-recipient-suggestions/lib/util/shouldUse3SPeopleSuggestions';
import { lazyExecute3SPrimeCall } from 'owa-substrate-people-suggestions';
import { lazyPinLikeSurfaceAction } from 'owa-surface-actions-option';
import { getTrustedSendersAndDomains } from 'owa-trusted-senders';
import { lazyGovern } from 'owa-tti';
import { isCacheFirstEnabled } from 'owa-readwrite-recipient-well/lib/actions/people/isCacheFirstEnabled';
import { lazyInitializeCache } from 'owa-recipient-cache';
import { lazyInitializeProxyAddressStore } from 'owa-mail-proxy-address';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import { isLinkedInViewProfileFeatureFlagEnabled } from 'owa-mail-reading-pane-store';
import { lazyUpdateTenantConfigForFluid } from 'owa-fluid-tenantconfig';
import { lazyModule } from 'owa-attachment-preview-initialization/lib/utils/initializeAttachmentPreviewInSxS';
import isSendAsAliasEnabled from 'owa-proxy-address-option/lib/utils/isSendAsAliasEnabled';
import { initializeAppModulePostBoot } from 'owa-app-module-post-boot';

export default function setupMailDeeplinkCommonPostRender(isFullApp?: boolean) {
    initializePersona();

    lazyModule.import();

    initializeAppModulePostBoot(isFullApp ?? false /* isFullApp */);

    lazyGovern.importAndExecute(
        {
            // Keep this notification infra initialization code earlier in the boot initialization
            task: initializeNotifications,
            condition: isFullApp || !isFeatureEnabled('auth-disableNotificationsForDeeplink'),
            idle: isFullApp,
        },
        {
            condition: !isCacheFirstEnabled(),
            task: () => lazyInitializeCache.importAndExecute(),
        },
        {
            condition: isFeatureEnabled('cmp-prague'),
            task: () => lazyUpdateTenantConfigForFluid.importAndExecute(),
        },
        {
            condition: shouldUse3SPeopleSuggestions(),
            task: () => lazyExecute3SPrimeCall.importAndExecute(),
        },
        () => lazySetup.importAndExecute(),
        {
            condition: isSendAsAliasEnabled() && !isConsumer(),
            task: () => lazyInitializeProxyAddressStore.importAndExecute(),
        },
        {
            condition: isLinkedInViewProfileFeatureFlagEnabled(),
            task: () => initializeBindStatusLazy.importAndExecute(),
        },
        {
            task: () => lazyInitializeExtensibilityContext.importAndExecute(),
            idle: isFullApp,
        },

        {
            task: getTrustedSendersAndDomains,
            idle: isFullApp,
        },
        {
            condition:
                isFeatureEnabled('rp-infoBarBrandSubscription') ||
                isFeatureEnabled('tri-unsubscribeLV'),
            task: () => getBrandsSubscriptionsService(true /* dont load brands info */),
            idle: isFullApp,
        },
        {
            task: () => lazyPinLikeSurfaceAction.importAndExecute(),
            idle: isFullApp,
        },
        {
            task: initializeDefaultSettingsExperiment,
            idle: isFullApp,
        }
    );
}
