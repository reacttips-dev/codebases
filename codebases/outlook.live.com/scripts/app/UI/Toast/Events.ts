/**
 * Events.ts
 *
 * A module for all Event handling.
 */

import { Transporter } from "./../../Transport/Transport";
import { AutoDismissValues } from "./../../Constants";
import { Classes, IDs, Keys } from "./../UiConstants";
import * as UiUtils from "./../Utils";
import { IOnDismissDelegate } from "./../../IOnDismissDelegate";
import { Spinner } from "./../SpinnerControl";
import * as Logging from "./../../Logging/Logging";
import * as Configuration from "./../../Configuration/Configuration";
import * as Api from "@ms-ofb/officefloodgatecore/dist/src/Api/Api";
import * as Utils from "../../Utils";

const { isNOU } = Utils;

/**
 * Callback for when the feedback dialog is dismissed
 */
let onDismiss: IOnDismissDelegate;

/**
 * Is the prompt up
 */
let isPromptUp: boolean;

/**
 * Dismiss all, including networking, UI, and events
 * @param submitted Was the control submitted (true), or cancelled (false)?
 */
function dismissAll(submitted: boolean): void {
	unregister();
	onDismiss(submitted);
}

/**
 * Listener un-registration
 */
function unregister(): void {
	removeListeners();
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

function logTelemetryEvent(eventId: Logging.IEventId, clientFeedbackId?: string, isEmailPolicyEnabled?: boolean): void {
	const configuration = Configuration.get();
	Logging.getLogger().logEvent(
		eventId,
		Logging.LogLevel.Critical,
		{
			CampaignId: configuration.getFloodgateSurvey().getCampaignId(),
			SurveyId: configuration.getFloodgateSurvey().getId(),
			SurveyType: configuration.getFloodgateSurvey().getSurveyType(),
			PromptAutoDismiss: configuration.getFloodgateInitOptions().autoDismiss.toString(),
			ClientFeedbackId: clientFeedbackId,
			IsEmailPolicyEnabled: isEmailPolicyEnabled,
		}
	);
}

/**
 * Register events for toast
 */
export function register(ON_DISMISS: IOnDismissDelegate = function (submitted: boolean) { return; }) {
	onDismiss = ON_DISMISS;
	isPromptUp = true;

	addListener(IDs.ToastContainer, "keyup", toastKeyEventHandler);
	addListener(IDs.ToastCancel, "click", toastCancelHandler);
	addListener(IDs.TPromptContainer, "click", promptContainerHandler);
	addListener(IDs.TFormSubmitButton, "click", submitButtonHandler);
	addListener(IDs.TFormEmailCheckBox, "click", emailCheckBoxHandler);
	emailCheckBoxHandler(null); // call the checkbox handler to process the initial state

	let ratingElements = document.querySelectorAll("input[name=\"" + IDs.TFormRating + "\"]");
	for (let i = 0; i < ratingElements.length; ++i) {
		UiUtils.registerListenerToElement(ratingElements[i] as HTMLElement, "click", ratingInputHandler);
	}

	const isIntercept = Configuration.get().getFloodgateSurvey().getSurveyType() === Api.ISurvey.Type.Intercept;

	if (!Configuration.get().getFloodgateSurvey().showPrompt && !isIntercept) {
		showSurveyScreen();
	} else {
		logTelemetryEvent(Logging.EventIds.SURVEY_UI_PROMPT_SHOWN);
	}

	// Auto dismiss if needed (No Auto dismiss for intercept)
	let autoDismiss = isIntercept ? AutoDismissValues.NoAutoDismiss : Configuration.get().getFloodgateInitOptions().autoDismiss;

	if (autoDismiss !== AutoDismissValues.NoAutoDismiss) {
		let autoDismissDuration: number;
		switch (autoDismiss) {
			case (AutoDismissValues.SevenSeconds):
				autoDismissDuration = 7000;
				break;
			case (AutoDismissValues.FourteenSeconds):
				autoDismissDuration = 14000;
				break;
			case (AutoDismissValues.TwentyOneSeconds):
				autoDismissDuration = 21000;
				break;
			case (AutoDismissValues.TwentyEightSeconds):
				autoDismissDuration = 28000;
				break;
			default:
		}
		if (autoDismissDuration !== undefined) {
			setTimeout(
				function () {
					if (isPromptUp) {
						dismissAll(false);
						logTelemetryEvent(Logging.EventIds.SURVEY_UI_PROMPT_AUTODISMISSED);
					}
				},
				autoDismissDuration
			);
		}
	}
}

function emailCheckBoxHandler(event: Event): void {
	// show email if checked and show default string if unchecked
	let emailCheckBox: HTMLInputElement = <HTMLInputElement> document.getElementById(IDs.TFormEmailCheckBox);
	if (emailCheckBox) {
		let emailTextBox: HTMLInputElement = <HTMLInputElement> document.getElementById(IDs.TFormEmailTextBox);
		emailTextBox.value = emailCheckBox.checked ? Configuration.get().getCommonInitOptions().userEmail : null;
		emailTextBox.disabled = !emailCheckBox.checked;
	}
}

function toastKeyEventHandler(event: Event): void {
	// dismiss upon pressing the escape key
	if ((<KeyboardEvent> event).keyCode === Keys.Esc) {
		event.preventDefault();
		event.stopPropagation();
		dismissAll(false);
		logTelemetryEvent(isPromptUp ? Logging.EventIds.SURVEY_UI_PROMPT_USERCLOSED : Logging.EventIds.SURVEY_UI_FORM_USERCLOSED);
	}
}

function toastCancelHandler(event: Event): void {
	event.preventDefault();
	event.stopPropagation();
	dismissAll(false);
	logTelemetryEvent(isPromptUp ? Logging.EventIds.SURVEY_UI_PROMPT_USERCLOSED : Logging.EventIds.SURVEY_UI_FORM_USERCLOSED);
}

function promptContainerHandler(event: Event): void {
	event.preventDefault();
	event.stopPropagation();

	if (Configuration.get().getFloodgateSurvey().getSurveyType() === Api.ISurvey.Type.Intercept) {
		interceptHandler();
	} else {
		showSurveyScreen();
	}
}

function interceptHandler(): void {
	const success = openInNewTab(Configuration.get().getFloodgateSurvey().getInterceptUrl());
	dismissAll(false);

	// Logging according to if opening the tab is successful. 
	if (success) {
		logTelemetryEvent(Logging.EventIds.SURVEY_UI_PROMPT_CLICKED);
	} else {
		logTelemetryEvent(Logging.EventIds.SURVEY_UI_REDIRECTIONFAILURE);
	}
}

function openInNewTab(url: string): boolean {
	const win = window.open(url, "_blank");
	if (isNOU(win)) {
		return false;
	}
	win.focus();
	return true;
}

function showSurveyScreen(): void {
	isPromptUp = false;

	UiUtils.setElementVisibility(IDs.TPromptContainer, false);
	UiUtils.setElementVisibility(IDs.TFormContainer, true);

	// Adding ToastZoom class to toastContainer. This handles zoom and small screen accesibility.
	// It is added here so that it doesn't apply to the prompt.
	UiUtils.addClassById(IDs.ToastContainer, Classes.ToastZoom);

	// remove toast container's alert attribute when after the user click toast and form is shown, so screen readers
	// like JAWS doesn't repeat all components on the form.
	if ((" " + document.getElementById(IDs.TFormContainer).className + " ").indexOf(" " + Classes.Visible + " ") > -1) {
		document.getElementById(IDs.ToastContainer).setAttribute("role", "");
	}

	// Focus should always be set to first rating item since all supported surveys showing form have rating items so far.
	const formRating = document.getElementsByName(IDs.TFormRating);
	if (formRating && formRating.length > 0) {
		formRating[0].focus();
	}

	logTelemetryEvent(Logging.EventIds.SURVEY_UI_FORM_SHOWN);
}

function ratingInputHandler(event: Event): void {
	(document.getElementById(IDs.TFormSubmitButton) as HTMLButtonElement).disabled = false;
}

function submitButtonHandler(event: Event): void {
	event.preventDefault();
	event.stopPropagation();

	UiUtils.setElementVisibility(IDs.TFormSubmitButton, false);
	let spinner = new Spinner(IDs.TFormSubmitButtonSpinner);

	let transporter: Transporter = new Transporter(
		Configuration.get().getCommonInitOptions().environment,
		Api.ISurvey.Type[Configuration.get().getFloodgateSurvey().getSurveyType()],
		Configuration.get().getCommonInitOptions().appId,
		"Survey",
		Configuration.get().getCommonInitOptions().applicationGroup,
		Configuration.get().getCommonInitOptions().telemetryGroup,
		Configuration.get().getCommonInitOptions().webGroup,
	);

	let commentElement: HTMLTextAreaElement = <HTMLTextAreaElement> document.getElementById(IDs.TFormComment);
	let commentEntered: boolean = (commentElement && !!commentElement.value);

	let selectedRating: HTMLInputElement =
		document.querySelector("input[name=\"" + IDs.TFormRating + "\"]:checked") as HTMLInputElement;

	Configuration.get().getFloodgateSurvey().setValues(
		Number(selectedRating.value),
		commentEntered ? commentElement.value : ""
	);

	// Add survey-specific data to manifest
	transporter.setManifestValues(Configuration.get().getFloodgateSurvey().getJsonElements());

	// Send email address if user gives consent
	let emailCheckBox: HTMLInputElement = <HTMLInputElement> document.getElementById(IDs.TFormEmailCheckBox);
	let emailTextBox: HTMLInputElement = <HTMLInputElement> document.getElementById(IDs.TFormEmailTextBox);

	if (emailCheckBox && emailCheckBox.checked && emailTextBox.value !== "") {
		transporter.setEmail(emailTextBox.value);
	}

	transporter.submit();
	spinner.destroy();
	dismissAll(true);
	logTelemetryEvent(Logging.EventIds.SURVEY_UI_FORM_SUBMIT, transporter.getClientFeedbackId(),
		Configuration.get().getFloodgateInitOptions().showEmailAddress);
}
