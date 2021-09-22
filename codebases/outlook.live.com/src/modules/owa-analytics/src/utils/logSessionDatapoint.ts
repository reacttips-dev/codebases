import { getServerVersion, getDag, BootType } from 'owa-config';
import getNetworkInfo from './getNetworkInfo';
import getConditionalAccessString from './getConditionalAccessString';
import { getUserConfiguration } from 'owa-session-store';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import { getDefaultFeatureFlags, checkUberFlight, checkUserTypeFlight } from 'owa-feature-flags';
import { getApplicationSettingsReport } from 'owa-application-settings';
import isDevEnvironment from './isDevEnvironment';
import type { InternalAnalyticOptions } from '../types/InternalAnalyticOptions';
import { createEvent, logOneDSDatapoint } from '../OneDsWrapper';
import { hashString } from './hashString';
import { ValueKind, IEventProperty } from '@microsoft/1ds-analytics-js';
import { getPlt } from 'owa-plt-data';

export function logSessionDatapoint(
    analyticsOptions: InternalAnalyticOptions,
    token: string,
    bootType: BootType
): void {
    // we need to create a seperate datapoint for each event, because there is a bug
    // in the aria code which will force the events to be sent to the same tenant if
    // the event is the same instance
    const properties: { [key: string]: string | number | boolean } = {
        Features: JSON.stringify(getDefaultFeatureFlags()),
        BootType: bootType,
        UserAgent: window.navigator.userAgent,
    };

    const serviceVersion = getServerVersion();
    if (serviceVersion) {
        properties.ServiceVersion = serviceVersion;
    }

    const dag = getDag();
    if (dag) {
        properties.dag = dag;
    }

    let hashedEmail: string | undefined;
    const userConfiguration = getUserConfiguration();
    if (userConfiguration) {
        let userOptions = userConfiguration.UserOptions || {};
        let viewConfig = userConfiguration.ViewStateConfiguration || {};
        let Dimensions: any = {
            WindowWidth: window.innerWidth,
            WindowHeight: window.innerHeight,
        };
        if (window.screen) {
            Dimensions.ScreenWidth = window.screen.availWidth;
            Dimensions.ScreenHeight = window.screen.availHeight;
        }
        properties.Settings = JSON.stringify({
            ReadingPanePosition: userOptions.GlobalReadingPanePositionReact,
            ListViewType: userOptions.GlobalListViewTypeReact,
            ConditionalAccess: getConditionalAccessString(),
            FocusedEnabled: userOptions.IsFocusedInboxEnabled,
            FocusedInboxBits: viewConfig.FocusedInboxBitFlags,
            ListViewBits: viewConfig.ListViewBitFlags /* Date headers disabled */,
            FolderViewBits: viewConfig.GlobalFolderViewState,
            PreviewText: userOptions.ShowPreviewTextInListView,
            SenderOnTop: userOptions.ShowSenderOnTopInListView,
            InlinePreviews: userOptions.ShowInlinePreviews,
            HoverActions: viewConfig.MailTriageOnHoverActions,
            Ponts: userOptions.NewEnabledPonts,
            Theme: (userOptions.ThemeStorageId || '') + '|' + userOptions.IsDarkModeTheme,
            MasterCategories: (userConfiguration.MasterCategoryList?.MasterList || []).length,
            IsEdu: !!analyticsOptions.isEdu,
            NetworkInfo: getNetworkInfo(),
            Dimensions,
            AdMarket: userConfiguration.AdMarket,
            DisplayDensity: userOptions.DisplayDensityMode,
            ConsumerAdsExperiment: userOptions.ConsumerAdsExperimentMode,
            Domain: userConfiguration.SessionSettings?.TenantDomain,
            ApplicationSettings: getApplicationSettingsReport(),
            CerberusFlagMatch: checkUberFlight(),
            FlagsUserMatch: checkUserTypeFlight(isConsumer()),
        });
        properties.Dates = JSON.stringify({
            OwaLogon: userOptions.FirstOWALogon,
            MailLogon: userOptions.FirstOWAReactMailLogon,
            PeopleLogon: userOptions.FirstOWAReactPeopleLogon,
            CalendarLogon: userOptions.FirstOWAReactCalendarLogon,
            MiniLogon: userOptions.FirstOWAReactMiniLogon,
            MailboxCreate: userConfiguration.MailboxCreateDate,
        });
        const plt = getPlt();
        if (plt) {
            properties.LoadTime = plt;
        }

        const email = userConfiguration.SessionSettings?.UserEmailAddress;
        if (email) {
            hashedEmail = hashString(email);
        }
    }

    if (!isDevEnvironment(analyticsOptions)) {
        let e = createEvent('session');
        e.baseType = 'session';
        e.data = properties;
        if (hashedEmail) {
            e.data.HashEmail = <IEventProperty>{
                value: hashedEmail,
                kind: ValueKind.Pii_Identity,
            };
        }
        logOneDSDatapoint({ tenantToken: token, item: e, analyticsOptions });
    }
}
