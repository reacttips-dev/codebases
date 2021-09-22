import { lazyValidateCache } from 'owa-boot-cache';
import { lazyAddEndpointDataForOwa } from 'owa-endpoint-tracker';
import { setupErrorHandler } from 'owa-exception-handler-devtools';
import { isFeatureEnabled } from 'owa-feature-flags';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';
import { lazyLoadOptions } from 'owa-outlook-service-options';
import { getUserConfiguration, isBusiness } from 'owa-session-store';
import { lazyRegisterAndInitializeSharedABT } from 'owa-shared-activity-based-timeout';
import { lazyGovern } from 'owa-tti';
import {
    isWebPushNotificationSupported,
    lazybootStrapWebPushService,
} from 'owa-webpush-notifications';

/**
 * Common post-boot tasks for OWA core app modules (Mail, Calendar, FilesHub, People, AppHost) that will support
 * module-switching feature, along with associated deeplinks
 *
 * Should not be used by non-core app modules (e.g. Bookings, Eventify, Timestream, OrgExplorer) or anonymous modules
 * (e.g. FindTime, Published Calendar) even if there are similarities due to leveraging shared bootstrap tech stack
 *
 * @param isFullApp - true if full app, false if deeplink
 */
export function initializeAppModulePostBoot(isFullApp: boolean) {
    // bypass certain tasks for OPX deeplinks as not applicable
    // temporary, will be deprecated once all OPX deeplinks are migrated to dedicated OPX entrypoint
    const isOpxPostBoot = isHostAppFeatureEnabled('opxDeeplink');

    lazyGovern.importAndExecute(
        setupErrorHandler,
        {
            task: () => lazyLoadOptions.importAndExecute(),
            condition: !isOpxPostBoot,
        },
        {
            task: () => lazyRegisterAndInitializeSharedABT.importAndExecute(),
            condition:
                isBusiness() &&
                isFeatureEnabled('auth-sharedActivityBasedTimeout') &&
                !!getUserConfiguration()?.PolicySettings?.IsSharedActivityBasedTimeoutEnabled,
            idle: isFullApp,
        },
        {
            task: () => lazyValidateCache.importAndExecute(),
            idle: isFullApp,
        },
        {
            task: () => lazybootStrapWebPushService.importAndExecute(window),
            condition: isFullApp && !isOpxPostBoot && isWebPushNotificationSupported(window),
            idle: true,
        },
        {
            task: () => lazyAddEndpointDataForOwa.importAndExecute(),
            condition: !isOpxPostBoot,
            idle: isFullApp,
        }
    );
}
