/**
 * BellyBand.ts
 *
 * Module for the BellyBand UI
 */

import { FeedbackType, PanelType } from "./../../Constants";
import { Classes, IDs } from "./../UiConstants";
import * as Events from "./Events";
import * as Layout from "./Layout";
import * as Renderer from "./../Renderer";
import * as Utils from "./../Utils";
import * as WindowProperties from "./../../WindowProperties";
import { IFormTemplate } from "./FormTemplates/IFormTemplate";
import * as BasicFormTemplate from "./FormTemplates/BasicFormTemplate";
import * as ThanksPanelTemplate from "./PanelTemplates/ThanksPanelTemplate";
import * as UserVoiceFormTemplate from "./FormTemplates/UserVoiceFormTemplate";
import * as Configuration from "./../../Configuration/Configuration";
import { IPanelTemplate } from "./PanelTemplates/IPanelTemplate";

export {IUserVoiceInitOptions} from "./FormTemplates/UserVoiceFormTemplate";

/**
 * UI initialization for multi, including creating all feedback related HTML elements and setting
 * initial visibility of elements
 */
export function createMulti(onClose: () => void) {
	// Create the panelType -> IPanelTemplate mapping
	let panelTemplates: { [key: number]: IPanelTemplate } = {};
	if (Configuration.get().getInAppFeedbackInitOptions().isShowThanks) {
		panelTemplates[PanelType.Thanks] = ThanksPanelTemplate;
	}

	// Create the feedbackType -> IFormTemplate mapping
	let formTemplates: {[key: number]: IFormTemplate} = {};
	let transitionEnabled: boolean = Configuration.get().getInAppFeedbackInitOptions().transitionEnabled;
	formTemplates[FeedbackType.Smile] = BasicFormTemplate;
	formTemplates[FeedbackType.Frown] = BasicFormTemplate;

	// Show uservoice only if locale is en
	if (Configuration.get().getInAppFeedbackInitOptions().userVoice &&
		Configuration.get().getCommonInitOptions().locale === "en") {
		formTemplates[FeedbackType.Idea] = UserVoiceFormTemplate;
	} else {
		formTemplates[FeedbackType.Idea] = BasicFormTemplate;
	}

	if (Configuration.get().getInAppFeedbackInitOptions().bugForm) {
		formTemplates[FeedbackType.Bug] = BasicFormTemplate;
	}

	create(Renderer.elementFromJson(Layout.generateMulti(formTemplates, panelTemplates)));

	let useNarrowScreenLayout = WindowProperties.isNarrow();

	Events.registerMulti(
		formTemplates,
		panelTemplates,
		useNarrowScreenLayout,
		transitionEnabled,
		function (submitted: boolean) {
			Utils.setElementVisibility(IDs.OverlayBackground, false);
			Utils.deleteElementById(IDs.OverlayBackground);
			Configuration.get().getInAppFeedbackInitOptions().onDismiss(submitted);
			onClose();
		}
	);

	// If the screen size is narrow, add the Narrow class to the outermost div so that 
	// the CSS used corresponds to the small screen UI
	if (useNarrowScreenLayout) {
		Utils.addClassById(IDs.OverlayBackground, Classes.NarrowLayout);
	}
}

/**
 * UI initialization for single, including creating all feedback related HTML elements and setting
 * initial visibility of elements
 * @return {void}
 */
export function createSingle(onClose: () => void, feedbackType: FeedbackType) {
	// Create the panelType -> IPanelTemplate mapping
	let panelTemplates: { [key: number]: IPanelTemplate } = {};
	if (Configuration.get().getInAppFeedbackInitOptions().isShowThanks) {
		panelTemplates[PanelType.Thanks] = ThanksPanelTemplate;
	}

	create(Renderer.elementFromJson(Layout.generateSingle(panelTemplates)));

	Events.registerSingle(
		feedbackType,
		panelTemplates,
		function (submitted: boolean) {
			Utils.setElementVisibility(IDs.OverlayBackground, false);
			Utils.deleteElementById(IDs.OverlayBackground);
			Configuration.get().getInAppFeedbackInitOptions().onDismiss(submitted);
			onClose();
		}
	);

	Utils.addClassById(IDs.OverlayBackground, Classes.SingleLayout);
	Utils.ScreenshotPreviewByCheckbox(IDs.SingleFormScreenshotCheckbox, IDs.SingleFormScreenshotPreview);
}

/**
 * Attach the UI element to the DOM.
 * @param userInterface the UI element
 */
function create(userInterface: Element) {
	document.body.insertBefore(userInterface, document.body.firstChild);

	Utils.setElementVisibility(IDs.OverlayBackground, true);

	if (Utils.getInternetExplorerVersion() > 9 || Utils.getInternetExplorerVersion() === -1) {
		// Show the main feedback UI after a certain time to wait for the CSS keyframes animation to finish if 
		// the browser is IE10 and above or non-IE
		setTimeout(onMainContainerRender, 900);
	} else {
		onMainContainerRender();
	}
}

/**
 * Code to run when the main container animation has completed.
 */
function onMainContainerRender(): void {
	// Show the MainContentHolder inside the MainContainer
	Utils.setElementVisibility(IDs.MainContentHolder, true);
	if (document.getElementById(IDs.OverallSmileAnchor)) {
		// Multi feedback
		document.getElementById(IDs.OverallSmileAnchor).focus();

		// If screenshot checkbox is selected, display the preview
		Utils.ScreenshotPreviewByCheckbox(IDs.BasicFormScreenshotCheckbox, IDs.BasicFormScreenshotPreview);
	} else if (document.getElementById(IDs.SingleFormComment)) {
		// Single feedback
		document.getElementById(IDs.SingleFormComment).focus();

		// If screenshot checkbox is selected, display the preview
		Utils.ScreenshotPreviewByCheckbox(IDs.SingleFormScreenshotCheckbox, IDs.SingleFormScreenshotPreview);
	}
}

/**
 * UI dismiss. Delete all feedback related HTML elements
 * @return {void}
 */
export function dismiss(): void {
	return;
}
