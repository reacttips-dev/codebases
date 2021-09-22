import { surveryCampaignDefinitions, SurveyStringMap } from './surveySettingsAndConstants';
import type { FloodgateSettingDataType } from '../services/constants';
import deleteSettings from '../services/deleteSettings';
import readSettings from '../services/readSettings';
import upsertSettings from '../services/upsertSettings';
import { getGuid } from 'owa-guid';
import { getPackageBaseUrl } from 'owa-config';
import { getUserEmailAddress } from 'owa-session-store';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import { getPalette } from 'owa-theme';
import * as trace from 'owa-trace';
import { hasQueryStringParameter, isGulpOrBranchingValue } from 'owa-querystring';
import { getSupportedCultures } from 'owa-regional-option';
import { isFeatureEnabled } from 'owa-feature-flags';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';
import { getCurrentCulture } from 'owa-localize';

import '../resources/custom_officebrowserfeedback.scss';

const CONSUMER_GUID = '00000000-0000-0000-0000-000000000000';
const CampaignStates = 'CampaignStates';
const GovernedChannelStates = 'GovernedChannelStates';
const SurveyActivationStats = 'SurveyActivationStats';
const APP_USAGE_ACTIVITY_NAME: string = 'AppUsageTime';
const APP_RESUME_ACTIVITY_NAME: string = 'AppResume';

interface FloodgateSetting {
    // A collection settings
    [key: string]: string;
}

const SettingsMap: { [key: string]: FloodgateSetting } = {};

// used for debugging and testing without the roaming settings from SDS
let bypassRoamingSettings = true;

// used for logging app usage time through the floodgate engine
let logAppUsageActivity = false;

function loadFloodgateScript(): Promise<any> {
    return import('@ms-ofb/officebrowserfeedback/scripts/officebrowserfeedback_floodgate.min.js');
}

function getFloodgateFlights(): string {
    let floodgateFlights: string = '';

    if (isFeatureEnabled('doc-SxS-jsApi-ODB-Base')) {
        floodgateFlights += 'JsApi;';
    } else if (isFeatureEnabled('doc-SxS-jsApi-ODB-BaseNoEditString')) {
        floodgateFlights += 'WacNoEditString;';
    } else if (isFeatureEnabled('doc-SxS-jsApi-ODB-Readonly')) {
        floodgateFlights += 'WacReadonly;';
    } else {
        floodgateFlights += 'LegacyWac;';
    }

    return floodgateFlights;
}

function isLocalStorageSupported(): boolean {
    try {
        return !!window?.localStorage;
    } catch (error) {
        return false;
    }
}

function isScriptLoadingFailure(error: any): boolean {
    return error && typeof error === 'string' && error.indexOf('Script load failed') >= 0;
}

/**
 * Loads and initialize the floodgate engine. If the engine is loaded/initalized, it will just return
 * For documentation on the InitOptions, please refer to:
 * https://microsoft.sharepoint.com/teams/Office_CLE/officecustomervoice/SitePages/Office%20Feedback%20SDK%20-%20Web%20-%20Floodgate.aspx
 */
export default async function loadAndInitializeFloodgateEngine(
    searchTraceId: string,
    trackAppUsage: boolean
) {
    if (!isHostAppFeatureEnabled('floodgate')) {
        return;
    }

    if (!isLocalStorageSupported()) {
        trace.trace.warn('LocalStorage is not supported');
        return;
    }

    if (!hasQueryStringParameter('bpfloodgatesettings')) {
        // Fetch settings to pass to floodgate engine
        SettingsMap[CampaignStates] = await readSettings(CampaignStates);
        SettingsMap[GovernedChannelStates] = await readSettings(GovernedChannelStates);
        SettingsMap[SurveyActivationStats] = await readSettings(SurveyActivationStats);
        bypassRoamingSettings = false;
    }

    if (window.OfficeBrowserFeedback) {
        // In case this is initialized and not started, just restart
        // If the engine is already started, this is a no-op on their code
        startFloodgateEngine(trackAppUsage);
        return;
    }

    try {
        // Load the script
        await loadFloodgateScript();

        const userConfig = getUserConfiguration();
        const palette = getPalette();
        const isTest = isGulpOrBranchingValue;
        let packageBaseUrl = getPackageBaseUrl();

        // If the package is not returning the protocol,
        // then add https for the url to make it work with floodgate SDK
        if (packageBaseUrl.indexOf('http') === -1) {
            packageBaseUrl = 'https:' + packageBaseUrl;
        }

        const userCultureLCID = getUserCultureLCID(getCurrentCulture());

        OfficeBrowserFeedback.initOptions = {
            appId: 2222,
            stylesUrl: '#',
            intlUrl: `${packageBaseUrl}resources/officebrowserfeedback/intl/`,
            environment: isTest ? 1 : 0, // 0 - Prod, 1 - Int
            primaryColour: palette.themePrimary,
            secondaryColour: palette.headerButtonsBackgroundHover,
            locale: getCurrentCulture(),
            sessionId: getGuid(),
            userEmail: getUserEmailAddress(),
            telemetryGroup: {
                tenantId: isConsumer() ? CONSUMER_GUID : userConfig.SessionSettings.TenantGuid,
                loggableUserId: userConfig.SessionSettings.UserPuid,
                flights: getFloodgateFlights(),
                officeUILang: userCultureLCID,
                officeEditingLang: userCultureLCID,
            },
            applicationGroup: {
                appData: JSON.stringify({
                    searchTraceId: searchTraceId,
                }),
                feedbackTenant: userConfig.SessionSettings.TenantDomain,
            },
            onError: (err: string) => {
                trace.errorThatWillCauseAlert(
                    'Floodgate SDK could not be initialized. Error: ' + err
                );
                return;
            },
        };

        OfficeBrowserFeedback.floodgate.initOptions = {
            autoDismiss: 4, // 28s
            campaignDefinitions: surveryCampaignDefinitions,
            uIStringGetter: getLocString,
            settingStorageCallback: bypassRoamingSettings
                ? null
                : {
                      readSettingList: readSettingsList,
                      deleteSettingItem: deleteSettingItem,
                      upsertSettingItem: upsertSettingItem,
                  },
        };

        await window.OfficeBrowserFeedback.floodgate.initialize();

        await window.OfficeBrowserFeedback.floodgate.start();

        if (trackAppUsage) {
            logAppUsageActivity = true;
            resumeAppUsageActivity();
        }

        addWindowEventListeners();
    } catch (error) {
        if (!isScriptLoadingFailure(error)) {
            trace.errorThatWillCauseAlert('Failed to load floodgate javascript: ' + error);
        }
    }
}

function readSettingsList(settingName: string) {
    // Always read from the local/cached settings
    return SettingsMap[settingName];
}

function upsertSettingItem(setting: string, itemKey: string, itemValue: string) {
    if (bypassRoamingSettings) {
        return;
    }

    // Update local/cached settings
    if (!SettingsMap[setting]) {
        SettingsMap[setting] = {};
    }

    SettingsMap[setting][itemKey] = itemValue;

    const request: FloodgateSettingDataType = {
        SettingName: setting,
        ItemKey: itemKey,
        ItemValue: itemValue,
    };

    // Upsert the settings on the server
    upsertSettings(request);
}

function deleteSettingItem(setting: string, itemKey: string) {
    if (bypassRoamingSettings) {
        return;
    }

    // Update local/cached settings
    SettingsMap[setting][itemKey] = null;
    const request: FloodgateSettingDataType = {
        SettingName: setting,
        ItemKey: itemKey,
    };

    // Delete the settings on the server
    deleteSettings(request);
}

function getLocString(placeholderString: string): string {
    return SurveyStringMap[placeholderString]();
}

function addWindowEventListeners() {
    window.addEventListener('focus', resumeAppUsageActivity);
    window.addEventListener('blur', pauseAppUsageActivity);
    window.addEventListener('unload', stopFloodgateEngine);
}

function startFloodgateEngine(trackAppUsage: boolean) {
    if (window.OfficeBrowserFeedback.floodgate) {
        window.OfficeBrowserFeedback.floodgate.start();
        if (trackAppUsage) {
            logAppUsageActivity = true;
            resumeAppUsageActivity();
        }
    }
}

function stopFloodgateEngine() {
    if (window.OfficeBrowserFeedback.floodgate) {
        pauseAppUsageActivity();
        window.OfficeBrowserFeedback.floodgate.stop();
    }
}

function resumeAppUsageActivity() {
    if (logAppUsageActivity) {
        window.OfficeBrowserFeedback.floodgate
            .getEngine()
            .getActivityListener()
            .logActivityStartTime(APP_USAGE_ACTIVITY_NAME);
        window.OfficeBrowserFeedback.floodgate
            .getEngine()
            .getActivityListener()
            .logActivity(APP_RESUME_ACTIVITY_NAME);
    }
}

function pauseAppUsageActivity() {
    if (logAppUsageActivity) {
        window.OfficeBrowserFeedback.floodgate
            .getEngine()
            .getActivityListener()
            .logActivityStopTime(APP_USAGE_ACTIVITY_NAME);
    }
}

function getUserCultureLCID(userCulture: string): number {
    for (const culture of getSupportedCultures()) {
        if (userCulture === culture.Name) {
            return culture.LCID;
        }
    }

    return null;
}
