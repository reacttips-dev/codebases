/**
 * Events.ts
 *
 * A module for all Event handling.
 */

import { Transporter } from "./../../Transport/Transport";
import * as Configuration from "./../../Configuration/Configuration";
import { IFormTemplate } from "./FormTemplates/IFormTemplate";
import { FeedbackType, PanelType } from "./../../Constants";
import { AttributeName, AttributeValue, Classes, IDs, Keys } from "./../UiConstants";
import * as Logging from "./../../Logging/Logging";
import { IOnDismissDelegate } from "./../../IOnDismissDelegate";
import * as Screenshot from "./../../Screenshot";
import { Spinner } from "./../SpinnerControl";
import * as UiUtils from "./../Utils";
import * as TabFocus from "./TabFocus";
import { IPanelTemplate } from "./PanelTemplates/IPanelTemplate";

/**
 * Whether to use narrow layout
 */
let useNarrowLayout: boolean = false;

/**
 * Whether transition enabled or not
 */
let transitionEnabled: boolean = true;

/**
 * Callback for when the feedback dialog is dismissed
 */
let onDismiss: IOnDismissDelegate;

/**
 * The Selected feedback type, undefined if none selected
 */
let selectedFeedbackType: FeedbackType = undefined;

/**
 * The Selected panel type, undefined if none selected
 */
let selectedPanelType: PanelType = undefined;

/**
 * feedbackType -> IFormTemplate mapping for multi BellyBand
 */
let formTemplates: { [key: number]: IFormTemplate };

/**
 * panelType -> IPanelTemplate mapping for multi BellyBand
 */
let panelTemplates: { [key: number]: IPanelTemplate };

const anchors: string[] = [IDs.OverallSmileAnchor, IDs.OverallFrownAnchor, IDs.OverallIdeaAnchor, IDs.OverallBugAnchor];

function setAriaSelectedAttributes(anchorID: string): void {
	let i: number;
	for (i = 0; i < anchors.length; i++) {
		if (anchors[i] === anchorID) {
			UiUtils.setAttributeOnHtmlElement(anchors[i], AttributeName.AriaSelected, AttributeValue.True);
		} else {
			UiUtils.setAttributeOnHtmlElement(anchors[i], AttributeName.AriaSelected, AttributeValue.False);
		}
	}
}

/**
 * Dismiss all, including networking, UI, and events
 * @param submitted Was the control submitted (true), or cancelled (false)?
 */
function dismissAll(submitted: boolean): void {
	unregister();
	onDismiss(submitted);
}

/**
 * List of listeners and the ids they are attached to. This ensures all events are correctly unregistered.
 */
let listenersList: { id: string, event: string, listener: (event: Event) => void }[] = [];

function addListener(id: string, event: string, listener: (event: Event) => void): void {
	UiUtils.registerListener(id, event, listener);
	listenersList.push({ event: event, id: id, listener: listener });
}

function removeListeners(): void {
	for (let listener of listenersList) {
		UiUtils.unregisterListener(listener.id, listener.event, listener.listener);
	}
	listenersList = [];
}

/**
 * Register events for single belly band
 */
export function registerSingle(feedbackType: FeedbackType,
	PANELTEMPLATES: { [key: number]: IPanelTemplate },
	ON_DISMISS: IOnDismissDelegate = function (submitted: boolean) { return; }) {
	selectedFeedbackType = feedbackType;
	panelTemplates = PANELTEMPLATES;

	// SingleFormTemplate events
	addListener(IDs.SingleFormSubmitButton, "click", submitButtonHandlerFactory(IDs.SingleFormSubmitButton,
		IDs.SingleFormSubmitButtonSpinner, IDs.SingleFormComment, IDs.SingleFormEmailInput,
		IDs.SingleFormScreenshotCheckbox, IDs.SingleFormScreenshotPreview, IDs.SingleFormCategoriesDropdown));

	// Screenshot checkbox click events
	addListener(IDs.SingleFormScreenshotCheckbox, "click", ScreenshotCheckboxClickHandler
		(IDs.SingleFormScreenshotCheckbox, IDs.SingleFormScreenshotPreview));

	// Close button click event.
	addListener(IDs.CloseButton, "click", () => { dismissAll(false); });

	// cancel button events
	addListener(IDs.SingleFormCancelButton, "click", CancelButtonHandler);
	registerCommon(ON_DISMISS);
}

/**
 * Register events for multi belly band
 */
export function registerMulti(FORMTEMPLATES: { [key: number]: IFormTemplate },
	PANELTEMPLATES: { [key: number]: IPanelTemplate },
	USE_NARROW_LAYOUT: boolean,
	TRANSITIONENABLED: boolean,
	ON_DISMISS: IOnDismissDelegate = function (submitted: boolean) { return; }) {
	useNarrowLayout = USE_NARROW_LAYOUT;
	formTemplates = FORMTEMPLATES;
	panelTemplates = PANELTEMPLATES;
	transitionEnabled = TRANSITIONENABLED;

	addListener(IDs.OverallSmileAnchor, "click", overallSmileHandler);
	addListener(IDs.OverallFrownAnchor, "click", overallFrownHandler);
	addListener(IDs.OverallIdeaAnchor, "click", overallIdeaHandler);
	addListener(IDs.OverallBugAnchor, "click", overallBugHandler);
	addListener(IDs.CloseButton, "click", () => { dismissAll(false); });

	// BasicFormTemplate events
	addListener(IDs.BasicFormSubmitButton, "click", submitButtonHandlerFactory(IDs.BasicFormSubmitButton,
		IDs.BasicFormSubmitButtonSpinner, IDs.BasicFormComment, IDs.BasicFormEmailInput,
		IDs.BasicFormScreenshotCheckbox, IDs.BasicFormScreenshotPreview, IDs.BasicFormCategoriesDropdown));

	// Screenshot checkbox click events
	addListener(IDs.BasicFormScreenshotCheckbox, "click", ScreenshotCheckboxClickHandler(IDs.BasicFormScreenshotCheckbox,
		IDs.BasicFormScreenshotPreview));

	// UserVoiceFormTemplate events
	addListener(IDs.UserVoiceFormGoButton, "click", UserVoiceFormGoButtonHandler);

	// ThanksPanel events
	addListener(IDs.ThanksPanelCloseButton, "click", (event: Event) => CloseButton(event, true));

	// cancel button events
	addListener(IDs.BasicFormCancelButton, "click", CancelButtonHandler);

	registerCommon(ON_DISMISS);

	if (!transitionEnabled) {
		UiUtils.addClassById(IDs.MainContentHolder, Classes.MarginLeft180px);
		UiUtils.addClassById(IDs.ColumnSeparatorDiv, Classes.ShowRightBorder);
	}
}

function registerCommon(ON_DISMISS: IOnDismissDelegate): void {
	onDismiss = ON_DISMISS;

	UiUtils.addEventListenerHelper(window, "keyup", keyEventHandler);

	addListener(IDs.OverlayBackground, "click", overlayBackgroundHandler);
	addListener(IDs.MainContainer, "click", mainContainerHandler);
	addListener(IDs.MainContainer, "keyup", tabKeyEventHandler);
	addListener(IDs.PrivacyStatementLink, "click", privacyStatementLinkHandler);
	addListener(IDs.EmailCheckBox, "click", emailCheckBoxHandler);
	addListener(IDs.BasicFormComment, "keyup", basicFormInputHandler);
	addListener(IDs.SingleFormComment, "keyup", singleFormInputHandler);
	emailCheckBoxHandler(null); // call the checkbox handler to process the initial state
}

/**
 * Listener un-registration
 */
function unregister(): void {
	UiUtils.removeEventListenerHelper(window, "keyup", keyEventHandler);
	removeListeners();
}

/**
 * Tab key event handler
 * @param event The Event object
 */
function tabKeyEventHandler(event: Event): void {
	let keyCode = (<KeyboardEvent> event).keyCode || (<KeyboardEvent> event).which;

	if (keyCode === Keys.Tab) {
		if ((document.activeElement.id === IDs.FirstTabbable && (<KeyboardEvent> event).shiftKey) ||
			(document.activeElement.id === IDs.LastTabbable && !(<KeyboardEvent> event).shiftKey)) {
			event.stopPropagation();
			TabFocus.cycleTabFocus(document.activeElement);
		}
	}
}

/**
 * Key event handler
 * @param event The Event object
 */
function keyEventHandler(event: Event): void {
	// dismiss feedback upon pressing the escape key
	if ((<KeyboardEvent> event).keyCode === Keys.Esc) {
		event.preventDefault();
		event.stopPropagation();

		dismissAll(false /*submitted*/);
	}
}

/**
 * Overlay background event handler. Dismiss feedback upon clicking on the background area
 * @param event The Event object
 */
function overlayBackgroundHandler(event: Event): void {
	event.preventDefault();
	event.stopPropagation();
	dismissAll(false /*submitted*/);
}

/**
 * Main container event handler. When clicking on main container area, do not propagate the event to lower level.
 * @param event The Event object
 */
function mainContainerHandler(event: Event): void {
	event.stopPropagation();
}

/**
 * Privacy statement link handler. When clicking on the privacy statement link,
 * do not propagate the event to lower level.
 * @param event The Event object
 */
function privacyStatementLinkHandler(event: Event): void {
	event.stopPropagation();
}

/**
 * Overall button click handler
 * @param event The Event object
 * @param achorId The id of the anchor html element which was selected
 */
function overallHandler(event: Event, anchorId: string): void {
	event.preventDefault();
	event.stopPropagation();

	UiUtils.replaceClassesById(IDs.OverallSmileAnchor, Classes.OverallAnchorActive);
	UiUtils.replaceClassesById(IDs.OverallFrownAnchor, Classes.OverallAnchorActive);
	UiUtils.replaceClassesById(IDs.OverallIdeaAnchor, Classes.OverallAnchorActive);
	UiUtils.replaceClassesById(IDs.OverallBugAnchor, Classes.OverallAnchorActive);

	if (anchorId) {
		UiUtils.addClassById(anchorId, Classes.OverallAnchorActive);
	}

	Logging.getLogger().logEvent(
		Logging.EventIds.InApp.UI.Form.Shown.VALUE,
		Logging.LogLevel.Critical,
		{ FeedbackType: selectedFeedbackType, PanelType: selectedPanelType });

	if (typeof(selectedFeedbackType) !== "undefined") {
		UiUtils.setElementVisibility(IDs.LeftFormContainer, true);
		UiUtils.setElementVisibility(IDs.MiddleFormContainer, true);
		UiUtils.setElementVisibility(IDs.LeftPanelContainer, false);
		let formTemplate: IFormTemplate = formTemplates[selectedFeedbackType];
		mainContentHolderSlideLeft(formTemplate.containerId);

		if (transitionEnabled) {
			mainContentHolderSlideLeft(formTemplate.containerId);
		}
		formTemplate.onSelect(selectedFeedbackType);
	}

	if (typeof(selectedPanelType) !== "undefined") {
		UiUtils.setElementVisibility(IDs.LeftFormContainer, false);
		UiUtils.setElementVisibility(IDs.MiddleFormContainer, false);
		UiUtils.setElementVisibility(IDs.LeftPanelContainer, true);
		for (let panelType in panelTemplates) {
			if (panelTemplates.hasOwnProperty(panelType)) {
				UiUtils.setElementVisibility(panelTemplates[panelType].containerId, true);
			}
		}
		let panelTemplate: IPanelTemplate = panelTemplates[selectedPanelType];
		panelTemplate.onSelect(selectedPanelType);
	}
}

/**
 * Smile button event handler
 * @param event The Event object
 */
function overallSmileHandler(event: Event): void {
	selectedFeedbackType = FeedbackType.Smile;
	selectedPanelType = undefined;
	setAriaSelectedAttributes(IDs.OverallSmileAnchor);
	UiUtils.setAttributeOnHtmlElement(IDs.MiddleFormContainer, AttributeName.AriaExpanded, AttributeValue.True);
	UiUtils.setAttributeOnHtmlElement(IDs.MiddleFormContainer, AttributeName.AriaLabelledBy, IDs.OverallSmileAnchor);
	overallHandler(event, IDs.OverallSmileAnchor);
}

/**
 * Frown button event handler
 * @param event The Event object
 */
function overallFrownHandler(event: Event): void {
	selectedFeedbackType = FeedbackType.Frown;
	selectedPanelType = undefined;
	setAriaSelectedAttributes(IDs.OverallFrownAnchor);
	UiUtils.setAttributeOnHtmlElement(IDs.MiddleFormContainer, AttributeName.AriaExpanded, AttributeValue.True);
	UiUtils.setAttributeOnHtmlElement(IDs.MiddleFormContainer, AttributeName.AriaLabelledBy, IDs.OverallFrownAnchor);
	overallHandler(event, IDs.OverallFrownAnchor);
}

/**
 * Idea button event handler
 * @param event The Event object
 */
function overallIdeaHandler(event: Event): void {
	selectedFeedbackType = FeedbackType.Idea;
	selectedPanelType = undefined;
	setAriaSelectedAttributes(IDs.OverallIdeaAnchor);
	UiUtils.setAttributeOnHtmlElement(IDs.MiddleFormContainer, AttributeName.AriaExpanded, AttributeValue.True);
	UiUtils.setAttributeOnHtmlElement(IDs.MiddleFormContainer, AttributeName.AriaLabelledBy, IDs.OverallIdeaAnchor);
	overallHandler(event, IDs.OverallIdeaAnchor);
}

/**
 * Bug button event handler
 * @param event The Event object
 */
function overallBugHandler(event: Event): void {
	selectedFeedbackType = FeedbackType.Bug;
	selectedPanelType = undefined;
	setAriaSelectedAttributes(IDs.OverallBugAnchor);
	UiUtils.setAttributeOnHtmlElement(IDs.MiddleFormContainer, AttributeName.AriaExpanded, AttributeValue.True);
	UiUtils.setAttributeOnHtmlElement(IDs.MiddleFormContainer, AttributeName.AriaLabelledBy, IDs.OverallBugAnchor);
	overallHandler(event, IDs.OverallBugAnchor);
}

/**
 * Thanks pane event handler
 * @param event The Event object
 */
function overallThanksHandler(event: Event): void {
	selectedFeedbackType = undefined;
	selectedPanelType = PanelType.Thanks;

	SetVisibilityExceptFor(IDs.ThanksPanelContainer, false);

	overallHandler(event, undefined);
}

/**
 * Sets visibility for all content panes except for specified.
 * @param except Pane not to set visibility for.
 * @param visible Visibility to be set
 */
function SetVisibilityExceptFor(except: string, visible: boolean) {
	UiUtils.setElementVisibility(IDs.LeftFormContainer, visible);
	const feedbackPanes = document.getElementById(IDs.MiddleFormContainer).children;
	for (let currentFeedbackPane = 0; currentFeedbackPane < feedbackPanes.length; currentFeedbackPane++) {
		if (feedbackPanes[currentFeedbackPane].id !== except) {
			UiUtils.setElementVisibility(feedbackPanes[currentFeedbackPane].id, visible);
		}
	}
}

/**
 * Main content holder slide left animation
 * @param {string} containerId The id of the container to be made visible
 * @return {void}
 */
function mainContentHolderSlideLeft(containerId: string): void {
	for (let feedbackType in formTemplates) {
		if (formTemplates.hasOwnProperty(feedbackType)) {
			UiUtils.setElementVisibility(formTemplates[feedbackType].containerId, false);
		}
	}

	if (useNarrowLayout) {
		UiUtils.setElementVisibility(IDs.LeftFormContainer, false);
		UiUtils.setElementVisibility(IDs.MiddleFormContainer, true);
		UiUtils.setElementVisibility(containerId, true);
	} else {
		UiUtils.addClassById(IDs.ColumnSeparatorDiv, Classes.ShowRightBorder);
		UiUtils.setElementVisibility(IDs.MiddleFormContainer, true);
		UiUtils.setElementVisibility(containerId, true);
		UiUtils.addClassById(IDs.LeftFormContainer, Classes.SlideLeft);
		UiUtils.addClassById(IDs.MiddleFormContainer, Classes.SlideLeft);
	}
}

/**
 * Submit button event handler factory
 * @param event The Event object
 */
function submitButtonHandlerFactory(submitButtonId: string, spinnerId: string, commentInputId: string,
	emailInputId: string, screenshotCheckboxId: string, screenshotPreviewId: string,
	categoriesDropdownId: string): (event: Event) => void {
	return function (event: Event) {
		event.preventDefault();
		event.stopPropagation();

		UiUtils.setElementVisibility(submitButtonId, false);
		let spinner = new Spinner(spinnerId);

		let transporter: Transporter = new Transporter(
			Configuration.get().getCommonInitOptions().environment,
			"Sas",
			Configuration.get().getCommonInitOptions().appId,
			selectedFeedbackType,
			Configuration.get().getCommonInitOptions().applicationGroup,
			Configuration.get().getCommonInitOptions().telemetryGroup,
			Configuration.get().getCommonInitOptions().webGroup,
		);

		let commentElement: HTMLTextAreaElement = <HTMLTextAreaElement> document.getElementById(commentInputId);
		let commentEntered: boolean = (commentElement && !!commentElement.value);
		if (commentEntered) {
			transporter.setComment(commentElement.value);
		}

		let emailCheckBox: HTMLInputElement = <HTMLInputElement> document.getElementById(IDs.EmailCheckBox);
		let emailElement: HTMLTextAreaElement = <HTMLTextAreaElement> document.getElementById(emailInputId);
		let isEmailIncluded: boolean = (emailElement && !!emailElement.value);
		if (emailCheckBox && emailCheckBox.checked && isEmailIncluded) {
			transporter.setEmail(emailElement.value);
		}

		let screenshotCheckBox = <HTMLInputElement> document.getElementById(screenshotCheckboxId);
		let screenshotCheckBoxSelected: boolean = screenshotCheckBox && screenshotCheckBox.checked;

		let categoryElement: HTMLSelectElement = <HTMLSelectElement> document.getElementById(categoriesDropdownId);
		let isCategorySelected: boolean = (categoryElement && categoryElement.selectedIndex > 0);
		if (isCategorySelected) {
			transporter.setCategory(categoryElement.value);
		}

		Logging.getLogger().logEvent(Logging.EventIds.InApp.UI.Form.Submit.VALUE,
			Logging.LogLevel.Critical,
			{
				FeedbackType: selectedFeedbackType,
				IsEmailIncluded: isEmailIncluded,
				IsScreenshotIncluded: screenshotCheckBoxSelected,
			}
		);

		if (screenshotCheckBoxSelected) {
			let startTime: number = performance.now();
			Screenshot.createScreenshot(document.body).then(
				(canvas: HTMLCanvasElement) => {
					let endTime: number = performance.now();
					Logging.getLogger().logEvent(Logging.EventIds.Shared.Screenshot.Render.Success.VALUE,
						Logging.LogLevel.Critical,
						{ TimeMilliseconds: endTime - startTime });
					transporter.setScreenshot(canvas);
					transporter.submit();
				}
			).catch((error: any) => {
				let endTime: number = performance.now();
				Logging.getLogger().logEvent(Logging.EventIds.Shared.Screenshot.Render.Failed.VALUE,
					Logging.LogLevel.Error,
					{ ErrorMessage: error, TimeMilliseconds: endTime - startTime });
				transporter.submit();
			});
		} else {
			transporter.submit();
		}

		spinner.destroy();

		if (!Configuration.get().getInAppFeedbackInitOptions().isShowThanks) {
			dismissAll(true /*submitted*/);
		} else {
			overallThanksHandler(event);
		}
	};
}

/**
 * Close button event
 * @param event The event
 * @param submitted Was the control submitted (true), or cancelled (false)?
 */
function CloseButton(event: Event, submitted: boolean) {
	SetVisibilityExceptFor(IDs.ThanksPanelContainer, true);
	dismissAll(submitted);
}

/**
 * UserVoiceForm Go button event handler
 * Opens UserVoice forum in a new window
 * @param event The Event object
 */
function UserVoiceFormGoButtonHandler(event: Event): void {
	event.preventDefault();
	event.stopPropagation();

	window.open(document.getElementById(IDs.UserVoiceFormGoButton).getAttribute(AttributeName.Source));
	dismissAll(false /* submitted */);
}

/**
 * ScreenshotCheckbox Click event handler. Populate preview if checkbox is checked 
 * @param screenshotCheckboxId The Id of screenshot checkbox
 * @param screenshotPreviewId The Id of preview
 * @param event The Event object
 */
function ScreenshotCheckboxClickHandler(screenshotCheckboxId: string, screenshotPreviewId: string)
: (event: Event) => void {
	return function (event: Event) {
		UiUtils.ScreenshotPreviewByCheckbox(screenshotCheckboxId, screenshotPreviewId);
	};
}

/**
 * Cancel button event handler factory
 */
function CancelButtonHandler(): void {
	dismissAll(false /*submitted*/);
}

function emailCheckBoxHandler(event: Event): void {
	// show email if checked and show default string if unchecked
	let emailCheckBox: HTMLInputElement = <HTMLInputElement> document.getElementById(IDs.EmailCheckBox);
	if (emailCheckBox) {
		let emailTextBox: HTMLInputElement = <HTMLInputElement> document.getElementById(IDs.BasicFormEmailInput);
		emailTextBox.value = emailCheckBox.checked ? Configuration.get().getCommonInitOptions().userEmail : null;
		emailTextBox.disabled = !emailCheckBox.checked;
	}
}

function basicFormInputHandler(event: Event): void {
	let commentElement: HTMLTextAreaElement = <HTMLTextAreaElement> document.getElementById(IDs.BasicFormComment);
	let commentEntered: boolean = (commentElement && !!commentElement.value);
	(document.getElementById(IDs.BasicFormSubmitButton) as HTMLButtonElement).disabled = !commentEntered;
}

function singleFormInputHandler(event: Event): void {
	let commentElement: HTMLTextAreaElement = <HTMLTextAreaElement> document.getElementById(IDs.SingleFormComment);
	let commentEntered: boolean = (commentElement && !!commentElement.value);
	(document.getElementById(IDs.SingleFormSubmitButton) as HTMLButtonElement).disabled = !commentEntered;
}
