/**
 * UserVoiceFormTemplate
 *
 * A form template for directing to user voice.
 */

import * as UIStrings from "./../../../UIStrings/UIStrings";
import { FormTemplateType } from "./FormTemplateType";
import { IUIAsJson } from "./../../Renderer";
import { FeedbackType } from "./../../../Constants";
import { AttributeName, Classes, IDs, Tags } from "./../../UiConstants";
import * as Configuration from "./../../../Configuration/Configuration";

export interface IUserVoiceInitOptions {
	// Url for user voice.
	url: string;
}

/**
 * Generate the markup
 * @returns the markup as json
 */
export function generate(): IUIAsJson {
	let initOptions: IUserVoiceInitOptions = Configuration.get().getInAppFeedbackInitOptions().userVoice;

	let formSchema = {
		children: [
			{
				classes: [Classes.FontSubtitle, Classes.TextAlignLeft,
					Classes.FormQuestionMiddleText],
				innerText: UIStrings.getUIStrings().UserVoiceForm.Title,
			},
			{
				classes: [Classes.FontText, Classes.TextAlignLeft,
					Classes.FormMiddleText],
				innerText: UIStrings.getUIStrings().UserVoiceForm.Text,
			},
			{
				children: [
					{
						children: [
							{
								attributes: [
									{
										name: AttributeName.Source,
										value: initOptions.url,
									},
								],
								classes: [
									Classes.SubmitButton,
								],
								id: IDs.UserVoiceFormGoButton,
								innerText: UIStrings.getUIStrings().UserVoiceForm.Button,
								tag: Tags.Button,
							},
						],
						classes: [Classes.FormSubmitButtonContainer],
					},
				],
				classes: [Classes.FormBottomContainer],
			},
		],
		classes: [Classes.Hidden, Classes.MarginLeft60px],
		id: containerId,
	};
	return formSchema;
}

/**
 * The id for the container. This is the id of the top-most element and should
 * be unique to each form
 */
export let containerId: string = IDs.UserVoiceFormContainer;

/**
 * Forms may be used for different feedback types. This method executes form
 * specific logic when the feedback type is selected
 * @param feedbackType feedback type
 */
export function onSelect(feedbackType: FeedbackType): void {
	document.getElementById(IDs.UserVoiceFormGoButton).focus();
}

/**
 * Form template type
 */
export let type: FormTemplateType = FormTemplateType.UserVoice;
