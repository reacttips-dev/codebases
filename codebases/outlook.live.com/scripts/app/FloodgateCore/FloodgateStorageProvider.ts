/**
 * Implementation of IFloodgateStorageProvider for Web SDK
 */

import { IFloodgateStorageProvider } from "@ms-ofb/officefloodgatecore/dist/src/Api/Api";
import * as Window from "./../Window/Window";
import * as Logging from "./../Logging/Logging";
import FileType = IFloodgateStorageProvider.FileType;

const fileTypeToKeyMap: { [k in FileType]: string } = {
	[FileType.CampaignDefinitions]: "obf-CampaignDefinitions",
	[FileType.CampaignStates]: "obf-CampaignStates",
	[FileType.FloodgateSettings]: "obf-FloodgateSettings",
	[FileType.GovernedChannelStates]: "obf-GovernedChannelStates",
	[FileType.SurveyActivationStats]: "obf-SurveyActivationStats",
	[FileType.SurveyEventActivityStats]: "obf-SurveyEventActivityStats",
	[FileType.TmsCache_CampaignContent]: "obf-TmsCampaignContent",
	[FileType.TmsCache_MessageMetadata]: "obf-TmsMessageMetadata",
	[FileType.TmsCache_UserGovernance]: "obf-TmsUserGovernance",
	[FileType.Tms_DynamicSettings]: "obf-TmsDynamicSettings",
	[FileType.LogLevelSettings]: "obf-LogLevelSettings",
	[FileType.UserFacts]: "obf-UserFacts",
	[FileType.DebugOverrides]: "obf-DebugOverrides",
};

export default class FloodgateStorageProvider implements IFloodgateStorageProvider {
	/**
	 * Code to detect localStorage presence.
	 * Copied from MDN: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
	 */
	public static isStorageAvailable(): boolean {
		try {
			let x = "__storage_test__";
			Window.getGlobal().localStorage.setItem(x, x);
			Window.getGlobal().localStorage.removeItem(x);
			return true;
		} catch (e) {
			return e instanceof DOMException && (
				// everything except Firefox
				e.code === 22 ||
				// Firefox
				e.code === 1014 ||
				// test name field too, because code might not be present
				// everything except Firefox
				e.name === "QuotaExceededError" ||
				// Firefox
				e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
				// acknowledge QuotaExceededError only if there's something already stored
				Window.getGlobal().localStorage.length !== 0;
		}
	}

	/**
	 * Safely read an object
	 */
	public static safeReadObject<T>(fileType: FileType, defaultValue: T = undefined): T {
		if (!(fileType in FileType)) {
			return defaultValue;
		}

		try {
			let storageKey = fileTypeToKeyMap[fileType];
			const result = Window.getGlobal().localStorage.getItem(storageKey);
			const parsedObject = result && (result[0] === "{" || result[0] === "[") ? JSON.parse(result) : result;
			return parsedObject ?? defaultValue;
		} catch (e) {
			// ignore
		}

		return defaultValue;
	}

	/**
	 * Lock the file to prevent access from another process.
	 */
	public fileLock(fileType: FileType): void {
		// JS runs on a single thread in the browser.
		return;
	}

	/**
	 * Unlock the file.
	 */
	public fileUnlock(fileType: FileType): void {
		// JS runs on a single thread in the browser.
		return;
	}

	/**
	 * Read the file
	 */
	public read(fileType: FileType): string {
		if (!(fileType in FileType)) {
			return "";
		}

		let storageKey = fileTypeToKeyMap[fileType];
		let result: string;
		try {
			result = Window.getGlobal().localStorage.getItem(storageKey);
		} catch (e) {
			Logging.getLogger().logEvent(Logging.EventIds.SURVEY_FLOODGATE_FILEREAD_FAILED,
				Logging.LogLevel.Error,
				{
					ErrorMessage: e.toString(),
					FileName: storageKey,
				});
			return "";
		}

		return result;
	}

	/**
	 * Write to the file
	 */
	public write(fileType: FileType, content: string): void {
		if (!(fileType in FileType)) {
			return;
		}

		let storageKey = fileTypeToKeyMap[fileType];
		try {
			Window.getGlobal().localStorage.setItem(storageKey, content);
		} catch (e) {
			Logging.getLogger().logEvent(Logging.EventIds.SURVEY_FLOODGATE_FILEWRITE_FAILED,
				Logging.LogLevel.Error,
				{
					ErrorMessage: e.toString(),
					FileName: storageKey,
				});
			return;
		}
	}
}
