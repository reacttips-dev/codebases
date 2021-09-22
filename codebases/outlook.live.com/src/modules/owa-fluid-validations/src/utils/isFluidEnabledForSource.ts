import { logUsage } from 'owa-analytics';
import { assertNever } from 'owa-assert';
import { isFeatureEnabled } from 'owa-feature-flags';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import {
    getOptionsForFeature,
    getOptionsLoadState,
    OwsOptionsFeatureType,
    BohemiaOptions,
    LoadState,
} from 'owa-outlook-service-options';
import {
    getBrowserInfo,
    getOsInfo,
    isMinimumBrowserVersion,
    Browser,
    OperatingSystem,
} from 'owa-user-agent';
import getAttachmentPolicy from 'owa-session-store/lib/utils/getAttachmentPolicy';
import { FluidOwaSource } from '../enums/FluidEnums';

export function isFluidEnabledForSource(source: FluidOwaSource): boolean {
    // Bohemia was the old name for Fluid. BohemiaOptions is a server enum so it is not being renamed
    const bohemiaOptions = getOptionsForFeature<BohemiaOptions>(OwsOptionsFeatureType.Bohemia);

    if (
        // once Fluid is supported in consumer, we want to continue restricting feature access to Cloud Cache users
        // therefore replace isConsumer() with getUserConfiguration().SessionSettings?.IsShadowMailbox
        isConsumer() ||
        !getAttachmentPolicy()?.AttachmentDataProviderAvailable ||
        !isBrowserSupported() ||
        !bohemiaOptions.fluidEnabledForTenant ||
        !bohemiaOptions.bohemiaEnabled
    ) {
        if (getOptionsLoadState().loadState !== LoadState.OptionsLoaded) {
            logUsage('FluidEnabledNotFetchedWhenChecked', { source: source }, { isCore: true });
        }
        return false;
    }

    switch (source) {
        case FluidOwaSource.MailReadingPane:
        case FluidOwaSource.MailCompose:
        case FluidOwaSource.AgendaEditor:
        case FluidOwaSource.None:
            return isFeatureEnabled('cmp-prague');
        case FluidOwaSource.CalendarReadingPane:
        case FluidOwaSource.CalendarCompose:
        case FluidOwaSource.MailCalendarCard:
            return (
                isFeatureEnabled('cmp-prague') &&
                isFeatureEnabled('cal-cmp-fluidCollaborativeSpace')
            );
        case FluidOwaSource.Timestream:
            return isFeatureEnabled('cmp-prague') && isFeatureEnabled('outlookSpaces-fluid-asset');
        default:
            return assertNever(source);
    }
}

function isBrowserSupported(): boolean {
    const browser: Browser = getBrowserInfo().browser;
    switch (browser) {
        case Browser.CHROME:
        case Browser.FIREFOX:
        case Browser.EDGE_CHROMIUM:
        case Browser.OPERA:
            return true;
        case Browser.SAFARI:
            return getOsInfo().os !== OperatingSystem.WINDOWS && isMinimumBrowserVersion([13, 1]);
        default:
            return false;
    }
}
