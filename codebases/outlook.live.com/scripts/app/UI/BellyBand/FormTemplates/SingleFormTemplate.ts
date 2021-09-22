/**
 * SingleFormTemplate.ts
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
				attributes: [{ name: AttributeName.For, value: IDs.SingleFormComment }],
				classes: [
					Classes.FontSubtitle,
					Classes.TextAlignLeft,
					Classes.FormQuestionMiddleText,
				],
				id: IDs.SingleFormQuestionMiddleText,
				innerText: UIStrings.getUIStrings().SingleForm.Title,
				tag: Tags.Label,
			},
			{
				attributes: [{ name: AttributeName.Id, value: IDs.SingleFormCategoriesDropdown }],
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
				id: IDs.SingleFormComment,
				tag: Tags.TextArea,
			},
			{
				brs: false, // ratings are disabled for now
				children: [
					{
						attributes: [{ name: AttributeName.For, value: IDs.SingleFormRating }],
						classes: [
							Classes.FontSubText,
							Classes.TextAlignLeft,
							Classes.FormRatingLabel,
						],
						innerText: UIStrings.getUIStrings().Form.RatingLabel,
						tag: Tags.Label,
					},
					RatingControl.generate(IDs.SingleFormRating),
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
								name: Configuration.get().getCommonInitOptions().userEmailConsentDefault
									? AttributeValue.Checked
									: AttributeValue.Unchecked,
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
								value: IDs.SingleFormEmailInput,
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
						id: IDs.SingleFormEmailInput,
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
						id: IDs.SingleFormScreenshotCheckbox,
						tag: Tags.Input,
					},
					{
						attributes: [{ name: AttributeName.For, value: IDs.SingleFormScreenshotCheckbox }],
						brs: Configuration.get().getInAppFeedbackInitOptions().screenshot,
						classes: [Classes.FontText, Classes.TextAlignLeft, Classes.FormScreenshotLabel],
						innerText: UIStrings.getUIStrings().Form.ScreenshotLabel,
						tag: Tags.Label,
					},
					{
						attributes: [
							{
								name: AttributeName.Preview,
								value: AttributeValue.ScreenshotPreview,
							},
						],
						brs: Configuration.get().getInAppFeedbackInitOptions().screenshot,
						id: IDs.SingleFormScreenshotPreview,
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
						id: IDs.SingleFormCancelButton,
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
						classes: [Classes.SubmitButton],
						id: IDs.SingleFormSubmitButton,
						innerText: UIStrings.getUIStrings().Form.Submit,
						tag: Tags.Button,
					},
					{
						classes: [Classes.Spinner, Classes.Hidden],
						id: IDs.SingleFormSubmitButtonSpinner,
						tag: Tags.Div,
					},
				],
				classes: [Classes.FormSubmitButtonContainer],
			},
		],
		id: containerId,
	};
	return formSchema;
}

/**
 * The id for the container. This is the id of the top-most element and should
 * be unique to each form
 */
export let containerId: string = IDs.SingleFormContainer;

/**
 * Forms may be used for different feedback types. This method executes form
 * specific logic when the feedback type is selected
 * @param feedbackType feedback type
 */
export function onSelect(feedbackType: FeedbackType): void {
	document.getElementById(IDs.SingleFormComment).focus();
}

/**
 * Form template type
 */
export let type: FormTemplateType = FormTemplateType.Single;
