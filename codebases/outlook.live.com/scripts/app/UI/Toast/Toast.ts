/**
 * Toast.ts
 *
 * Module for the Toast UI
 */

import { IDs } from "./../UiConstants";
import * as Events from "./Events";
import * as Layout from "./Layout";
import * as Renderer from "./../Renderer";
import * as Utils from "./../Utils";
import * as Configuration from "./../../Configuration/Configuration";

/**
 * UI initialization for toast
 */
export function createSurvey(onClose: () => void) {
	create(Renderer.elementFromJson(Layout.generate()));
	Events.register(
		function (submitted: boolean) {
			Utils.setElementVisibility(IDs.ToastContainer, false);
			Utils.deleteElementById(IDs.ToastContainer);
			Configuration.get().getFloodgateInitOptions().onDismiss(
				Configuration.get().getFloodgateSurvey().getCampaignId(),
				submitted
			);
			onClose();
		});
}

function create(userInterface: Element) {
	document.body.insertBefore(userInterface, document.body.firstChild);

	Utils.setElementVisibility(IDs.ToastContainer, true);
}
