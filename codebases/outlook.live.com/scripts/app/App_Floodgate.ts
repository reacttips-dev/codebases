/**
 * App_Floodgate.ts
 *
 * The entry point for floodgate.
 */

import * as CommonApp from "./CommonApp";
import * as CommonFloodgate from "./CommonFloodgate";
import * as CommonUI from "./CommonUI";
import * as UI from "./UI/UI";
import * as Configuration from "./Configuration/Configuration";
import * as Window from "./Window/Window";
import CustomUISurvey from "./FloodgateCore/UISurvey/CustomUISurvey";
import DummyUISurvey from "./FloodgateCore/UISurvey/DummyUISurvey";
import FloodgateTelemetryLogger from "./FloodgateCore/FloodgateTelemetryLogger";
import ICustomSurvey from "./FloodgateCore/ICustomSurvey";
import IUISurvey from "./FloodgateCore/UISurvey/IUISurvey";

import { FloodgateEngine } from "@ms-ofb/officefloodgatecore";
import { IFloodgateSettingIdMap } from "@ms-ofb/officefloodgatecore/dist/src/Api/Api";
import { TelemetryEvent } from "@ms-ofb/officefloodgatecore/dist/src/Constants";

export { getEngineStartPromise, resetEngine, setEngineStartPromise, start, startInternal, stop }
	from "./CommonFloodgate"

/**
 * Has the control been opened. Prevents more than one dialog being generated.
 */
let opened: boolean = false;

/**
 * Initialize. Must be called before any other call to floodgate.
 * @returns A promise which will be rejected if the call fails.
 */
export function initialize(): Promise<any> {
	return new Promise((resolve, reject) => {
		const rejectAndLogError = (errorMessage: string) => {
			const telemetryLogger = FloodgateEngine.getTelemetryLogger();
			if (telemetryLogger) {
				telemetryLogger.log_Event(TelemetryEvent.Floodgate.Initialize.Failed, { ErrorMessage: errorMessage });
			}

			reject(errorMessage);
		};

		if (!CommonFloodgate.getInitialized()) {
			try {
				CommonApp.initialize();
			} catch (err) {
				reject("CommonApp initialization failed: {" + err + "}");
			}

			FloodgateEngine.setTelemetryLogger(new FloodgateTelemetryLogger());

			CommonUI.initialize()
			.then(
				function onInitializeFulfilled() {
					try {
						CommonFloodgate.initialize();
					} catch (err) {
						rejectAndLogError("CommonFloodgate initialization failed: {" + err + "}");
					}

					resolve();
				}
			)
			.catch(
				function onInitializeRejected(err) {
					rejectAndLogError("Initialization failed: {" + err + "}");
				}
			);
		} else {
			resolve();
		}
	});
}

/**
 * Display the given Survey with it's prompt
 * @param survey the survey to show
 * @returns A promise which will be rejected if the call fails.
 */
export function showSurvey(survey: IUISurvey): Promise<any> {
	return new Promise((resolve, reject) => {
		if (opened) {
			reject("Control already open");
			return;
		}

		Configuration.get().setFloodgateSurvey(survey ? survey : new DummyUISurvey());
		UI.createSurvey(function () { opened = false; });
		opened = true;
		resolve();
	});
}

/**
 * Method to allow users to launch a custom survey directly
 * @param survey the custom survey to show
 */
export function showCustomSurvey(survey: ICustomSurvey): Promise<any> {
	return showSurvey(new CustomUISurvey(survey));
}

/**
 * Reset the floodgate module. Used in unit tests.
 */
export function reset() {
	CommonApp.reset();
	CommonUI.reset();
	CommonFloodgate.reset();
	opened = false;
}

/**
 * Get a list of setting names and ids
 * @returns the setting names and ids list
 */
export function getSettingIdMap(): IFloodgateSettingIdMap {
	return IFloodgateSettingIdMap.RoamingSettingIdMap;
}

Window.setFloodgateShowCustomSurvey(showCustomSurvey);
Window.setFloodgateShowSurvey(showSurvey);
Window.setFloodgateInitialize(initialize);
Window.getSettingIdMap(getSettingIdMap);
