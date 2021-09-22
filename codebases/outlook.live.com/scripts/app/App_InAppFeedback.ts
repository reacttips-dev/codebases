/**
 * App_inAppFeedback.ts
 *
 * The entry point for inAppFeedback.
 */

import * as CommonApp from "./CommonApp";
import * as CommonUI from "./CommonUI";
import * as Configuration from "./Configuration/Configuration";
import * as Logging from "./Logging/Logging";
import * as UI from "./UI/BellyBand/BellyBand";
import * as Window from "./Window/Window";
import { ILaunchOptionsInAppFeedback } from "./Configuration/ILaunchOptions";

/**
 * Has inAppFeedback been initialized
 */
let initialized: boolean = false;

/**
 * Initialize
 * @returns A promise which will be rejected if the call fails.
 */
export function initialize(): Promise<any> {
	return new Promise((resolve, reject) => {
		if (!initialized) {
			try {
				CommonApp.initialize();
			} catch (err) {
				reject("CommonApp initialization failed: {" + err + "}");
			}

			CommonUI.initialize()
			.then(
				function onInitializeFulfilled() {
					Configuration.get().setInAppFeedbackInitOptions(Window.get().OfficeBrowserFeedback.initOptions);
					initialized = true;
					resolve();
				}
			)
			.catch(
				function onInitializeRejected(err) { reject("Initialization failed: {" + err + "}"); }
			);
		} else {
			resolve();
		}
	});
}

/**
 * Has the control been opened. Prevents more than one dialog being generated.
 */
let opened: boolean = false;

/**
 * Handler to launch the multi feedback dialog
 * @param launchOptions optional feedback properties
 * @returns A promise which will be rejected if the call fails.
 */
export function multiFeedback(launchOptions?: ILaunchOptionsInAppFeedback): Promise<any> {
	return new Promise((resolve, reject) => {
		if (opened) {
			reject("Control already open");
			return;
		}

		initialize()
		.then(
			function onInitializeFulfilled() {
				Configuration.get().setInAppFeedbackLaunchOptions(launchOptions);
				UI.createMulti(function () { opened = false; });
				Logging.getLogger().logEvent(Logging.EventIds.InApp.UI.Picker.Shown.VALUE,
					Logging.LogLevel.Critical,
					{
						IsBugEnabled: Configuration.get().getInAppFeedbackInitOptions().bugForm,
						IsIdeaEnabled: Configuration.get().getInAppFeedbackInitOptions().userVoice !== undefined,
					});
				opened = true;
				resolve();
			}
		)
		.catch(
			function onInitializeRejected(err) { reject("Initialization failed: {" + err + "}"); }
		);
	});
}

/**
 * Handler to launch the single feedback dialog
 * @param feedbackType the feedback type
 * @param launchOptions optional feedback properties
 * @returns A promise which will be rejected if the call fails.
 */
export function singleFeedback(feedbackType: string, launchOptions?: ILaunchOptionsInAppFeedback): Promise<any> {
	return new Promise((resolve, reject) => {
		if (opened) {
			reject("Control already open");
			return;
		}

		let feedbackTypeEnum = Configuration.validateFeedbackType(feedbackType);

		initialize()
		.then(
			function onInitializeFulfilled() {
				Configuration.get().setInAppFeedbackLaunchOptions(launchOptions);
				UI.createSingle(function () { opened = false; }, feedbackTypeEnum);
				Logging.getLogger().logEvent(Logging.EventIds.InApp.UI.Form.Shown.VALUE,
					Logging.LogLevel.Critical,
					{
						FeedbackType: feedbackTypeEnum,
					});
				opened = true;
				resolve();
			}
		)
		.catch(
			function onInitializeRejected(err) { reject("Initialization failed: {" + err + "}"); }
		);
	});
}

/**
 * Reset the inappfeedback module. Used in unit tests.
 */
export function reset() {
	CommonApp.reset();
	CommonUI.reset();
	initialized = false;
	opened = false;
}

/* Make the FeedbackDialog methods available globally */
Window.setMultiFeedback(multiFeedback);
Window.setSingleFeedback(singleFeedback);
