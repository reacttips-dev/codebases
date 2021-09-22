/**
 * CommonApp.ts
 *
 * Common logic for entrypoints.
 */

import "./Polyfills/Promise";

import Version from "./Version";
import * as Configuration from "./Configuration/Configuration";
import * as Window from "./Window/Window";
import * as Logging from "./Logging/Logging";

const APP_NAME: string = "OfficeFeedbackSDK";

/**
 * Has the SDK been initialized
 */
let initialized: boolean = false;

/**
 * Initialize
 */
export function initialize(): void {
	if (initialized) {
		return;
	}

	if (!Window.get().OfficeBrowserFeedback.initOptions) {
		throw new Error("Window.OfficeBrowserFeedback.initOptions not set");
	}

	Window.get().OfficeBrowserFeedback.sdkVersion = Version;
	Configuration.get().setCommonInitOptions(Window.get().OfficeBrowserFeedback.initOptions);

	Logging.initialize(
		Configuration.get().getCommonInitOptions(),
		APP_NAME,
		Version,
		Configuration.get().getSdkSessionId(),
		Configuration.get().getEventSampling()
	);

	initialized = true;
}

/**
 * Reset the module. Used in unit tests.
 */
export function reset() {
	initialized = false;
}
