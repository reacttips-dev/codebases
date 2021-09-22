/**
 * BasicFormTemplate.ts
 *
 * A form template with contact info fields.
 */

import * as UIStrings from "./../../../UIStrings/UIStrings";
import { FormTemplateType } from "./FormTemplateType";
import { IUIAsJson } from "./../../Renderer";
import * as CategoriesDropdown from "./../../CategoriesDropdown";
import * as RatingControl from "./../../RatingControl";
import * as Configuration from "./../../../Configuration/Configuration";
import { FeedbackType } from "./../../../Constants";
import { AttributeName, AttributeValue, Classes, IDs, Tags, Urls } from "./../../UiConstants";

/**
 * Generate the markup
 * @returns the markup as json
 */
export function generate(): IUIAsJson {
	let categories = Configuration.get().getInAppFeedbackLaunchOptions().categories;
	let formSchema = {
		children: [
			{
				attributes: [{ name: AttributeName.For, value: IDs.BasicFormComment }],
				classes: [Classes.FontSubtitle, Classes.TextAlignLeft, Classes.FormQuestionMiddleText],
				id: IDs.BasicFormQuestionMiddleText,
				tag: Tags.Label,
				innerText: !Configuration.get().getInAppFeedbackInitOptions().transitionEnabled
					? UIStrings.getUIStrings().SingleForm.Title
					: "",
			},
			{
				attributes: [{ name: AttributeName.Id, value: IDs.BasicFormCategoriesDropdown }],
				brs: categories.show,
				children: CategoriesDropdown.generate(categories ? categories.customCategories : null),
				classes: [Classes.FontSubText, Classes.FormCategoriesDropdown, Classes.TextInput],
				tag: Tags.Select,
			},
			{
				attributes: [
					{
						name: AttributeName.Placeholder,
						value: UIStrings.getUIStrings().Form.CommentPlaceholder,
					},
					{
						name: AttributeName.MaxLength,
						value: AttributeValue.TextAreaMaxLength,
					},
				],
				classes: [Classes.FontSubText, Classes.FormComment, Classes.TextInput],
				id: IDs.BasicFormComment,
				tag: Tags.TextArea,
			},
			{
				brs: false, // disable rating for now
				children: [
					{
						attributes: [{ name: AttributeName.For, value: IDs.BasicFormRating }],
						classes: [Classes.FontText, Classes.TextAlignLeft, Classes.FormRatingLabel],
						innerText: UIStrings.getUIStrings().Form.RatingLabel,
						tag: Tags.Label,
					},
					RatingControl.generate(IDs.BasicFormRating),
				],
				classes: [Classes.FormRatingContainer],
			},
			{
				brs: Configuration.get().getInAppFeedbackInitOptions().showEmailAddress,
				children: [
					{
						attributes: [
							{
								name: AttributeName.Type,
								value: AttributeValue.Checkbox,
							},
							{
								name: AttributeValue.Unchecked,
								value: "",
							},
						],
						classes: [Classes.FormEmailCheckBox, Classes.CheckBox],
						id: IDs.EmailCheckBox,
						tag: Tags.Input,
					},
					{
						attributes: [{ name: AttributeName.For, value: IDs.EmailCheckBox }],
						classes: [Classes.FontSubText, Classes.TextAlignLeft, Classes.FormEmailLabel],
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
								value:
									Configuration.get().getInAppFeedbackInitOptions().userEmail
									? Configuration.get().getInAppFeedbackInitOptions().userEmail
									: "",
							},
						],
						classes: [Classes.FontSubText, Classes.FormEmailInput, Classes.TextInput],
						id: IDs.BasicFormEmailInput,
						tag: Tags.Input,
					},
				],
				classes: [Classes.FormEmailContainer],
			},
			{
				children: [
					{
						attributes: [
							{
								name: AttributeName.Type,
								value: AttributeValue.Checkbox,
							},
							{
								name: AttributeName.Value,
								value: AttributeValue.Unchecked,
							},
						],
						brs: Configuration.get().getInAppFeedbackInitOptions().screenshot,
						classes: [Classes.FormScreenshotCheckbox, Classes.CheckBox],
						id: IDs.BasicFormScreenshotCheckbox,
						tag: Tags.Input,
					},
					{
						attributes: [{ name: AttributeName.For, value: IDs.BasicFormScreenshotCheckbox }],
						brs: Configuration.get().getInAppFeedbackInitOptions().screenshot,
						classes: [Classes.FontSubText, Classes.TextAlignLeft, Classes.FormScreenshotLabel],
						innerText: UIStrings.getUIStrings().Form.ScreenshotLabel,
						tag: Tags.Label,
					},
					{
						attributes: [
							{
								name: AttributeName.Preview,
								value: AttributeValue.ScreenshotPreview,
							},
							{
								name: AttributeName.Alt,
								value: UIStrings.getUIStrings().Form.ScreenshotImgAltText,
							},
						],
						brs: Configuration.get().getInAppFeedbackInitOptions().screenshot,
						id: IDs.BasicFormScreenshotPreview,
						classes: [Classes.FormScreenshotPreview],
						tag: Tags.Img,
					},
				],
				classes: [Classes.FormScreenshotContainer],
			},
			{
				children:
				[
					{
						classes: [Classes.FontSubSubText, Classes.TextAlignLeft],
						innerText: UIStrings.getUIStrings().Form.PrivacyLabel,
						tag: Tags.Label,
					},
					{
						classes: [Classes.FontSubSubText, Classes.TextAlignLeft],
						innerText: Configuration.get().getCommonInitOptions().isCommercialHost
						? UIStrings.getUIStrings().Form.PrivacyConsent + " " : "",
						tag: Tags.Label,
					},
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
						id: IDs.PrivacyStatementLink,
						innerText: UIStrings.getUIStrings().PrivacyStatement,
						tag: Tags.Anchor,
					},
				],
				classes: [Classes.FontSubSubText, Classes.TextAlignLeft, Classes.PrivacyStatementLinkDiv],
			},
			{
				children: [
					{
						attributes: [
							{ name: AttributeName.Type, value: AttributeValue.Button},
							{ name: AttributeName.AriaLabel, value: UIStrings.getUIStrings().Form.Cancel },
						],
						classes: [
							Classes.CancelButton,
						],
						id: IDs.BasicFormCancelButton,
						innerText: UIStrings.getUIStrings().Form.Cancel,
						tag: Tags.Button,
					},
					{
						attributes: [
						{
							name: AttributeName.Disabled,
							value: AttributeValue.True,
						},
						],
						classes: [
							Classes.SubmitButton,
						],
						id: IDs.BasicFormSubmitButton,
						innerText: UIStrings.getUIStrings().Form.Submit,
						tag: Tags.Button,
					},
					{
						classes: [Classes.Spinner, Classes.Hidden],
						id: IDs.BasicFormSubmitButtonSpinner,
						tag: Tags.Div,
					},
				],
				classes: [Classes.FormSubmitButtonContainer],
			},
		],
		classes: [
			Configuration.get().getInAppFeedbackInitOptions().transitionEnabled ? Classes.Hidden : Classes.Visible,
			Classes.MarginLeft60px,
		],
		id: containerId,
	};
	return formSchema;
}

/**
 * The id for the container. This is the id of the top-most element and should
 * be unique to each form
 */
export let containerId: string = IDs.BasicFormContainer;

/**
 * Forms may be used for different feedback types. This method executes form
 * specific logic when the feedback type is selected
 * @param feedbackType feedback type
 */
export function onSelect(feedbackType: FeedbackType): void {
	switch (feedbackType) {
		case FeedbackType.Smile: {
			document.getElementById(IDs.BasicFormQuestionMiddleText).textContent = UIStrings.getUIStrings().SmileForm.Title;
			break;
		}
		case FeedbackType.Frown: {
			document.getElementById(IDs.BasicFormQuestionMiddleText).textContent = UIStrings.getUIStrings().FrownForm.Title;
			break;
		}
		case FeedbackType.Idea: {
			document.getElementById(IDs.BasicFormQuestionMiddleText).textContent = UIStrings.getUIStrings().IdeaForm.Title;
			break;
		}
		case FeedbackType.Bug: {
			document.getElementById(IDs.BasicFormQuestionMiddleText).textContent = UIStrings.getUIStrings().BugForm.Title;
			break;
		}
		default: {
			break;
		}
	}

	document.getElementById(IDs.BasicFormComment).focus();
}

/**
 * Form template type
 */
export let type: FormTemplateType = FormTemplateType.Basic;
