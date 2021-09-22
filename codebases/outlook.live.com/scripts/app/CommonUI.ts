/**
 * CommonUI.ts
 *
 * Common logic for UI.
 */

const html2canvas: any = require("../app/thirdparty/html2canvas/html2canvas");

import * as UIStrings from "./UIStrings/UIStrings";
import * as Configuration from "./Configuration/Configuration";
import * as Window from "./Window/Window";
import * as Theme from "./Theme";
import * as Screenshot from "./Screenshot";
import { loadStylesheet, loadScript } from "./Window/DomUtils";

/**
 * Has the SDK been initialized
 */
let initialized: boolean = false;

/**
 * Set ui Strings.
 * @param data the ui strings
 */
function setUIStrings(data: any): void {
	UIStrings.setUIStrings(data);
};

/**
 * Initialize
 */
export function initialize(): Promise<any> {
	return new Promise((resolve, reject) => {
		if (!initialized) {
			const initOptionsCommon = Configuration.get().getCommonInitOptions();
			if (!initOptionsCommon) {
				reject("initOptionsCommon is null");
			}

			loadStylesheet(initOptionsCommon.stylesUrl);

			const intlFileUrl: string = initOptionsCommon.intlUrl + initOptionsCommon.locale.toLowerCase() + "/" +
				initOptionsCommon.intlFilename;

			loadScript(intlFileUrl)
			.then(
				function onLoadScriptFulfilled() {
					if (!UIStrings.getUIStrings()) {
						reject("UiStrings were not loaded from " + intlFileUrl);
						return;
					}

					Theme.initialize(initOptionsCommon.primaryColour, initOptionsCommon.secondaryColour);

					initialized = true;
					resolve();
				}
			).catch(
				function onLoadScriptRejected(err) {
					reject("Script load failed for " + intlFileUrl + ". " + err);
				}
			);
		} else {
			resolve();
		}
	});
}

/**
 * Reset the module. Used in unit tests.
 */
export function reset() {
	initialized = false;
}

/* Make the setUIStrings method available globally */
Window.setSetUiStrings(setUIStrings);
Window.setCreateScreenshot(Screenshot.createScreenshot);
Window.get().OfficeBrowserFeedback.html2canvas = html2canvas;
