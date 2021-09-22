/**
 * Layout.ts
 *
 * Module for the layout
 */

import * as Renderer from "./../Renderer";
import * as ChoiceGroupControl from "./../ChoiceGroupControl";
import * as Configuration from "./../../Configuration/Configuration";
import { AttributeName, AttributeValue, Classes, IDs, Tags, Urls } from "./../UiConstants";
import * as UIStrings from "./../../UIStrings/UIStrings";
import * as Utils from "./../Utils";
import * as Api from "@ms-ofb/officefloodgatecore/dist/src/Api/Api";

/**
 * Generates the toast
 *
 * @returns {Renderer.IUIAsJson} Renderer.IUIAsJson object
 */
export function generate(): Renderer.IUIAsJson {
	let schema: Renderer.IUIAsJson = {
		attributes: [
			{ name: AttributeName.DataHtml2CanvasIgnore, value: AttributeValue.True },
			{ name: AttributeName.Role, value: "alert" },
		],
		children: [
			generatePrompt(),
			{
				attributes: [
					{ name: AttributeName.Type, value: AttributeValue.Button },
					{ name: AttributeName.AriaLabel, value: UIStrings.getUIStrings().CloseLabel },
				],
				id: IDs.ToastCancel,
				// tslint:disable-next-line:max-line-length
				innerHTML: '<svg viewBox="4 4 16 16" width="16px" height="16px" focusable="false"><path d="M19,6.41L17.59,5 12,10.59 6.41,5 5,6.41 10.59,12 5,17.59 6.41,19 12,13.41 17.59,19 19,17.59 13.41,12z"/></svg>',
				tag: Tags.Button,
			},
			(Configuration.get().getFloodgateSurvey().getSurveyType() !== Api.ISurvey.Type.Intercept) ? generateForm() : {},
		],
		classes: [Classes.Toast, Utils.isRightToLeft() ? Classes.Rtl : ""],
		id: IDs.ToastContainer,
	};
	return schema;
}

function generatePrompt(): Renderer.IUIAsJson {
	// Checking if the campaign is an intercept one to render the relevant prompt strings.
	const isIntercept = (Configuration.get().getFloodgateSurvey().getSurveyType() === Api.ISurvey.Type.Intercept);

	let promptSchema: Renderer.IUIAsJson = {
		children: [
			{
				classes: [
					Classes.FontText,
					Classes.TextAlignLeft,
				],
				id: IDs.TPromptTitle,
				innerText: isIntercept ?
					Configuration.get().getFloodgateSurvey().getInterceptTitle() :
					Configuration.get().getFloodgateSurvey().getTitle(),
			},
			{
				classes: [
					Classes.FontSubText,
					Classes.TextAlignLeft,
				],
				id: IDs.TPromptText,
				innerText: isIntercept ?
					Configuration.get().getFloodgateSurvey().getInterceptQuestion() :
					Configuration.get().getFloodgateSurvey().getPromptQuestion(),
			},
		],
		id: IDs.TPromptContainer,
		tag: Tags.Button,
	};

	return promptSchema;
}

function userEmailConsentDefault(): string {
	return Configuration.get().getCommonInitOptions().userEmailConsentDefault ? AttributeValue.Checked : AttributeValue.Unchecked;
}

function generateForm(): Renderer.IUIAsJson {
	let formSchema: Renderer.IUIAsJson = {
		children: [
			{
				classes: [
					Classes.FontText,
					Classes.TextAlignLeft,
				],
				id: IDs.TFormTitle,
				innerText: Configuration.get().getFloodgateSurvey().getTitle(),
			},
			generateRatingControl(),
			{
				attributes: [
					{
						name: AttributeName.Placeholder,
						value: Configuration.get().getFloodgateSurvey().getCommentQuestion(),
					},
					{
						name: AttributeName.AriaLabel,
						value: Configuration.get().getFloodgateSurvey().getCommentQuestion(),
					},
					{
						name: AttributeName.MaxLength,
						value: AttributeValue.TextAreaMaxLength,
					},
				],
				classes: [Classes.FontSubText, Classes.TextInput],
				id: IDs.TFormComment,
				tag: Tags.TextArea,
			},
			{
				brs: Configuration.get().getFloodgateInitOptions().showEmailAddress && Configuration.get().getFloodgateSurvey().showEmailRequest,
				children: [
					{
						attributes: [
							{
								name: AttributeName.Type,
								value: AttributeValue.Checkbox,
							},
							{
								name: userEmailConsentDefault(),
								value: "",
							},
						],
						classes: [Classes.TFormEmailCheckbox, Classes.CheckBox],
						id: IDs.TFormEmailCheckBox,
						tag: Tags.Input,
					},
					{
						attributes: [{ name: AttributeName.For, value: IDs.TFormEmailCheckBox }],
						classes: [Classes.FontSubText, Classes.TextAlignLeft, Classes.TFormEmailLabel],
						innerText: UIStrings.getUIStrings().Form.EmailCheckBoxLabel,
						tag: Tags.Label,
					},
					{
						attributes: [
							{
								name: AttributeName.Type,
								value: AttributeValue.Text,
							},
							{
								name: AttributeName.Placeholder,
								value: UIStrings.getUIStrings().Form.EmailPlaceholder,
							},
							{
								name: AttributeName.AriaLabel,
								value: UIStrings.getUIStrings().Form.EmailPlaceholder,
							},
							{
								name: AttributeName.Name,
								value: IDs.BasicFormEmailInput,
							},
							{
								name: AttributeName.MaxLength,
								value: AttributeValue.TextAreaMaxLength,
							},
							{
								name: AttributeName.Value,
								value: Configuration.get().getCommonInitOptions().userEmailConsentDefault
								? Configuration.get().getCommonInitOptions().userEmail
								:  "",
							},
						],
						classes: [Classes.FontSubText, Classes.FormEmailInput, Classes.TextInput],
						id: IDs.TFormEmailTextBox,
						tag: Tags.Input,
					},
				],
			},
			{
				children:
					[
						{
							attributes: [
								{
									name: AttributeName.HRef,
									value: Urls.PrivacyStatementLink,
								},
								{
									name: AttributeName.Target,
									value: AttributeValue.BlankWindow,
								},
								{
									name: AttributeName.Rel,
									value: AttributeValue.NoReferrer,
								},
							],
							classes: [Classes.Link],
							innerText: UIStrings.getUIStrings().PrivacyStatement,
							tag: Tags.Anchor,
						},
					],
				classes: [Classes.FontSubSubText, Classes.TextAlignLeft, Classes.PrivacyStatementLinkDiv],
			},
			{
				children: [
					{
						attributes: [{ name: AttributeName.Disabled, value: AttributeValue.True }],
						classes: [
							Classes.FontSubText,
							Classes.SubmitButton,
						],
						id: IDs.TFormSubmitButton,
						innerText: UIStrings.getUIStrings().Form.Submit,
						tag: Tags.Button,
					},
					{
						classes: [Classes.Spinner, Classes.Hidden],
						id: IDs.TFormSubmitButtonSpinner,
						tag: Tags.Div,
					},
				],
				id: IDs.TFormSubmitButtonContainer,
			},
		],
		classes: [Classes.Hidden],
		id: IDs.TFormContainer,
	};

	return formSchema;
}

function generateRatingControl(): Renderer.IUIAsJson {
	let choices: [number, string][] = [];

	let ratingValues: string[] = Configuration.get().getFloodgateSurvey().getRatingValuesAscending();
	let index = 0;

	for (let ratingValue of ratingValues) {
		choices.push([index, ratingValue]);
		index++;
	}

	// Ratings need to be shown in descending order
	return ChoiceGroupControl.generateRadioGroup(IDs.TFormRating,
		Configuration.get().getFloodgateSurvey().getRatingQuestion()?.trim(),
		choices.reverse());
}
