import setupMailDeeplinkCommonPostRender from './setupMailDeeplinkCommonPostRender';
import { lazyInitializeCalendarsDataForModule } from 'owa-calendar-bootstrap-utils';
import { initializeFeature, isFeatureEnabled } from 'owa-feature-flags';
import { lazyLoadLightningPrimaryView } from 'owa-lightning-view';
import { lazyModule as lazyMailFavoritesStore } from 'owa-mail-favorites-store';
import {
    initializeFocusedInboxConfig,
    subscribeSaveFocusInboxOptionStitch,
} from 'owa-mail-focused-inbox-config';
import {
    lazyPrefetchFrequentlyUsedFolders,
    lazyLogConsumerDeletedRetentionPolicy,
} from 'owa-mail-folder-forest-actions';
import { lazyReloadInboxPostBoot } from 'owa-mail-triage-table-load-extra';
import { subscribeSaveReadingPanePositionOptionStitch } from 'owa-mail-module-orchestrator';
import { getMoveToMruList } from 'owa-mail-move-mru';
import { lazyModule as mailSearchLazyModule } from 'owa-mail-search';
import { lazyModule as focusedOverrideLazyModule } from 'owa-mail-focused-inbox-override';
import { lazyInitializeUpNextV2 } from 'owa-upnext-v2';
import { subscribeToNotifications } from 'owa-app-notifications-core';
import { lazyGovern } from 'owa-tti';
import { isCacheFirstEnabled } from 'owa-readwrite-recipient-well/lib/actions/people/isCacheFirstEnabled';
import { lazyInitializeCache } from 'owa-recipient-cache';
import fetchCategoryDetailsAndSubscribeToCategoryNotifications from './helpers/fetchCategoryDetailsAndSubscribeToCategoryNotifications';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';
import { lazyCheckHxAccountSettings } from 'hx-session/lib/lazyIndex';
import { lazyInitializeTaggedEmailsFetch } from 'owa-mail-fetch-tagged-email';
import { lazyInitializeMessageExtension } from 'owa-message-extension-config';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import { lazyLoadCLPUserLabels } from 'owa-mail-protection';
import { lazyLoadSignature } from 'owa-mail-signature';

export default function setupMailModuleCommonPostRender(isFullApp?: boolean) {
    setupMailDeeplinkCommonPostRender(isFullApp);

    // important to minimize cover the delta between session data and subscription established
    lazyReloadInboxPostBoot.importAndExecute();

    // initialize setting for the mobile tag email feature.
    // TODO: Change this to a PostOpenTask after testing period.
    if (isFeatureEnabled('mobile-tag-email')) {
        lazyInitializeTaggedEmailsFetch.importAndExecute();
    }

    // These settings are critical to compose. Customer report that these settings are loaded too slowly
    // so need them out of lazyGovern
    if (isFeatureEnabled('cmp-clp') && !isConsumer()) {
        lazyLoadCLPUserLabels.importAndExecute();
    }
    lazyLoadSignature.importAndExecute();

    // This is special handling for message extensions to do initial configurations asynchronously
    // TODO vso - 5172426 to remove this initialization once dev preview is done
    if (isFeatureEnabled('me-search-global')) {
        lazyInitializeMessageExtension.importAndExecute();
    }

    // don't govern stitches
    subscribeSaveFocusInboxOptionStitch();
    subscribeSaveReadingPanePositionOptionStitch();

    lazyGovern.importAndExecute(
        {
            condition: isCacheFirstEnabled(),
            task: () => lazyInitializeCache.importAndExecute(),
        },
        () => lazyMailFavoritesStore.import(),
        getMoveToMruList,
        () => mailSearchLazyModule.import(),
        subscribeToNotifications,
        () => lazyLoadLightningPrimaryView.importAndExecute(),
        () => fetchCategoryDetailsAndSubscribeToCategoryNotifications(),
        {
            condition: isFullApp,
            task: () => lazyInitializeCalendarsDataForModule.importAndExecute(),
        },
        () => focusedOverrideLazyModule.import(),
        {
            condition: isFullApp,
            task: () => {
                initializeFeature('tri-upNextV2', () => {
                    lazyInitializeUpNextV2.importAndExecute();
                });
            },
        },
        {
            task: initializeFocusedInboxConfig,
            idle: isFullApp,
        },
        {
            task: () => lazyPrefetchFrequentlyUsedFolders.importAndExecute(),
            idle: isFullApp,
            condition: !isFeatureEnabled('fwk-prefetch-data-off'),
        },
        () => lazyLogConsumerDeletedRetentionPolicy.importAndExecute(),
        {
            condition: isHostAppFeatureEnabled('accountSettingsHx'),
            task: () => lazyCheckHxAccountSettings.importAndExecute(),
        }
    );
}
