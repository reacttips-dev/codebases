import * as Utils from "../Utils";
import FloodgateStorageProvider from "../FloodgateCore/FloodgateStorageProvider";
import { TargetedMessagingCache } from "../TargetedMessaging/TargetedMessagingCache";
import { ContentType } from "../TargetedMessaging/TargetedMessagingContentType";

import * as Logging from "../Logging/Logging";

const { isNOU } = Utils;

export const enum SettingKey {
	// General
	logLevelSettings = "LogLevelSettings",

	// Web surfaces
	teachingMessageCooldown = "TeachingMessageCooldown",
	webSurfacesLink = "WebSurfacesLink",

	// TMS settings
	tmsAppId = "TmsAppId",
	tmsServiceUrl = "TmsServiceUrl",
	tmsActionUrl = "TmsActionUrl",
	tmsLoadTimeout = "TmsLoadTimeout",
	tmsMessageMetadataExpiry = "TmsMessageMetadataExpiry",
	tmsUserGovernanceRulesExpiry = "TmsUserGovernanceRulesExpiry",
	tmsCampaignContentExpiry = "TmsCampaignContentExpiry",
	tmsDynamicSettingsExpiry = "TmsDynamicSettingsExpiry",
	tmsLogLevelSettingsExpiry = "TmsLogLevelSettingsExpiry",
	tmsUserFactsExpiry = "TmsUserFactsExpiry",

	// Tulips
	tulipsAppId = "TulipsAppId",
	tulipsLoadTimeout = "TulipsLoadTimeout",
	tulipsServiceUrl = "TulipsServiceUrl",
	tulipsIngestionTimeInterval = "TulipsIngestionTimeInterval",

	// AugLoop
	tulipsAugLoopAnnotationName = "TulipsAugLoopAnnotationName",
	tulipsAugLoopPackageDelayLoad = "TulipsAugLoopPackageDelayLoad",
	tulipsAugLoopLoadRetryTimes = "TulipsAugLoopLoadRetryTimes",
	tulipsAugLoopLoadTimeout = "TulipsAugLoopLoadTimeout",
}

let dynamicSettingsTmsgCache: TargetedMessagingCache = null;

export function getDynamicSetting<T>(key: SettingKey, defaultValue: T): T {
	try	{
		if (!dynamicSettingsTmsgCache && FloodgateStorageProvider.isStorageAvailable()) {
			dynamicSettingsTmsgCache =  new TargetedMessagingCache([ContentType.dynamicSettings]);
		}

		if (!dynamicSettingsTmsgCache) {
			return defaultValue;
		}

		const settingsObj = dynamicSettingsTmsgCache.getItemContent<Record<string, T>>(ContentType.dynamicSettings);
		if (!isNOU(settingsObj)
			&& settingsObj.hasOwnProperty(key)
			&& !isNOU(settingsObj[key])) {
			const settingValue = settingsObj[key];

			// parse types
			if (typeof defaultValue === "number" && typeof settingValue !== "number") {
				if (typeof settingValue === "string") {
					const returnValue = settingValue.indexOf(".") === -1 ? parseInt(settingValue, 10) : parseFloat(settingValue);
					return isNaN(returnValue) ? defaultValue : returnValue as unknown as T;
				}

				return defaultValue;
			}

			return settingValue;
		}
	} catch (error) {
		Logging.getLogger().logEvent(
			Logging.EventIds.Common.Error.VALUE,
			Logging.LogLevel.Error,
			{
				ErrorMessage: `Error reading dynamic setting ${error && error.message}`,
				Type: key,
			});
	}

	return defaultValue;
}

export function resetDynamicSettingsTmsgCache() {
	dynamicSettingsTmsgCache = null;
}
