/**
 * Layout.ts
 *
 * Module for the layout
 */

import { IFormTemplate } from "./FormTemplates/IFormTemplate";
import { FeedbackType } from "./../../Constants";
import { AttributeName, AttributeValue, Classes, IDs, Tags } from "./../UiConstants";
import * as Renderer from "./../Renderer";
import * as UIStrings from "./../../UIStrings/UIStrings";
import * as Utils from "./../Utils";
import * as SingleFormTemplate from "./FormTemplates/SingleFormTemplate";
import { IPanelTemplate } from "./PanelTemplates/IPanelTemplate";
import { IUIAsJson } from "./../Renderer";
import * as Configuration from "./../../Configuration/Configuration";

export {IFormTemplate} from "./FormTemplates/IFormTemplate";

/**
 * Generates the multi layout as a Renderer.IUIAsJson object
 *
 * The TabFocus.ts has a dependency in the mainContainer. All tabbable elements
 * should be placed inside the mainContainer otherwise TabFocus.ts will not
 * function as expected.
 * @param {[key: number]: IFormTemplate} formTemplates FeedbackType -> FormTemplate mapping
 * @param {[key: number]: IPanelTemplate} panelTemplates PanelType -> PanelTemplate mapping
 * @returns {Renderer.IUIAsJson} Renderer.IUIAsJson object
 */
export function generateMulti(
	formTemplates: { [key: number]: IFormTemplate },
	panelTemplates: { [key: number]: IPanelTemplate }
): Renderer.IUIAsJson {
	let schema: Renderer.IUIAsJson = {
		attributes: [{ name: AttributeName.DataHtml2CanvasIgnore, value: AttributeValue.True }],
		children:
		[
			{
				attributes:
				[
					{ name: AttributeName.Role, value: AttributeValue.Dialog },
					{ name: AttributeName.AriaModal, value: AttributeValue.True },
				],
				children:
				[
					{
						attributes:
						[
							{ name: AttributeName.Role, value: AttributeValue.TabList },
							{ name: AttributeName.AriaDescribedBy, value: IDs.QuestionLeftText },
							{ name: AttributeName.AriaLabel, value: UIStrings.getUIStrings().FeedbackSubtitle },
							{ name: AttributeName.AriaOrientation, value: AttributeValue.AriaOrientationValueVertical},
						],
						children:
						[

							{
								// This adds a "first" dummy tabbable div to the mainContainer. It's used as a marker
								// to handle tabs and shift tabs so focus will stay with elements on just the feedback
								// dialog. Do not relocate this without updating the TabFocus.ts code.
								attributes: [{ name: AttributeName.TabIndex, value: AttributeValue.Zero }],
								id: IDs.FirstTabbable,
							},
							{
								attributes: [
									{ name: AttributeName.Type, value: AttributeValue.Button },
									{ name: AttributeName.AriaLabel, value: UIStrings.getUIStrings().CloseLabel },
								],
								id: IDs.CloseButton,
								classes: [Classes.CloseButton],
								// tslint:disable-next-line:max-line-length
								innerHTML: '<svg viewBox="4 4 16 16" width="16px" height="16px" focusable="false"><path d="M19,6.41L17.59,5 12,10.59 6.41,5 5,6.41 10.59,12 5,17.59 6.41,19 12,13.41 17.59,19 19,17.59 13.41,12z"/></svg>',
								tag: Tags.Button,
							},
							{
								children:
								[
									{
										classes: [Classes.FormWideContainer, Classes.Hidden],
										children: generateMultiPanels(panelTemplates),
										id: IDs.LeftPanelContainer,
										tag: Tags.Div,
									},
									{
										children:
										[
											{
												classes: [Classes.FontSubtitle, Classes.TextAlignLeft],
												id: IDs.QuestionLeftText,
												innerText: UIStrings.getUIStrings().FeedbackSubtitle,
											},
											{
												children:
												[
													{
														children: generateOverallAnchors(formTemplates),
														id: IDs.OverallAnchorsContainer,
													},
												],
												id: IDs.ColumnSeparatorDiv,
											},
										],
										classes: [Classes.FormContainer],
										id: IDs.LeftFormContainer,
									},
									{
										children: generateMultiForms(formTemplates),
										classes:
											[
												Classes.FormContainer,
												Configuration.get().getInAppFeedbackInitOptions().transitionEnabled ? Classes.Hidden : Classes.Visible,
											],
										attributes:
											[
												{ name: AttributeName.Role, value: AttributeValue.TabPanel},
												{ name: AttributeName.AriaExpanded, value: AttributeValue.False},
											],
										id: IDs.MiddleFormContainer,
									},
								],
								classes: [Classes.Hidden],
								id: IDs.MainContentHolder,
								tag: Tags.Form,
							},
							{
								// This adds a "last" dummy tabbable div to the mainContainer. It's used as a marker
								// to handle tabs and shift tabs so focus will stay with elements on just the feedback
								// dialog. Do not relocate this without updating the TabFocus.ts code.
								attributes: [{ name: AttributeName.TabIndex, value: AttributeValue.Zero }],
								id: IDs.LastTabbable,
							},
						],
						id: IDs.MainContainer,
					},
				],
				classes: [Utils.isRightToLeft() ? Classes.Rtl : "" ],
				id: IDs.OverlayBackground,
			},
		],
	};
	return schema;
}

/**
 * Generates the single layout as a Renderer.IUIAsJson object
 *
 * The TabFocus.ts has a dependency in the mainContainer. All tabbable elements
 * should be placed inside the mainContainer otherwise TabFocus.ts will not
 * function as expected.
 * @param {[key: number]: IPanelTemplate} panelTemplates PanelType -> PanelTemplate mapping
 * @returns {Renderer.IUIAsJson} Renderer.IUIAsJson object
 */
export function generateSingle(panelTemplates: { [key: number]: IPanelTemplate }): Renderer.IUIAsJson {
	let schema: Renderer.IUIAsJson = {
		attributes: [{ name: AttributeName.DataHtml2CanvasIgnore, value: AttributeValue.True }],
		children:
		[
			{
				children:
				[
					{
						// This adds a "first" dummy tabbable div to the mainContainer. It's used as a marker
						// to handle tabs and shift tabs so focus will stay with elements on just the feedback
						// dialog. Do not relocate this without updating the TabFocus.ts code.
						attributes: [{ name: AttributeName.TabIndex, value: AttributeValue.Zero }],
						id: IDs.FirstTabbable,
					},
					{
						attributes: [
							{ name: AttributeName.Type, value: AttributeValue.Button },
							{ name: AttributeName.AriaLabel, value: UIStrings.getUIStrings().CloseLabel },
						],
						id: IDs.CloseButton,
						classes: [Classes.CloseButton],
						// tslint:disable-next-line:max-line-length
						innerHTML: '<svg viewBox="4 4 16 16" width="16px" height="16px" focusable="false"><path d="M19,6.41L17.59,5 12,10.59 6.41,5 5,6.41 10.59,12 5,17.59 6.41,19 12,13.41 17.59,19 19,17.59 13.41,12z"/></svg>',
						tag: Tags.Button,
					},
					{
						children:
						[
							{
								children: [SingleFormTemplate.generate()],
								classes: [Classes.FormContainer],
								id: IDs.MiddleFormContainer,
							},
						].concat((generateMultiPanels(panelTemplates) as
							ConcatArray<{ children: IUIAsJson[], classes: string[], id: string }>)),
						classes: [Classes.Hidden],
						id: IDs.MainContentHolder,
						tag: Tags.Form,
					},

					{
						// This adds a "last" dummy tabbable div to the mainContainer. It's used as a marker
						// to handle tabs and shift tabs so focus will stay with elements on just the feedback
						// dialog. Do not relocate this without updating the TabFocus.ts code.
						attributes: [{ name: AttributeName.TabIndex, value: AttributeValue.Zero }],
						id: IDs.LastTabbable,
					},
				],
				id: IDs.MainContainer,
			},
		],
		classes: [Classes.SingleLayout, Utils.isRightToLeft() ? Classes.Rtl : "" ],
		id: IDs.OverlayBackground,
	};
	return schema;
}

/**
 * Generate Renderer.IUIAsJson objects that holds the different forms that will be used on the bellyband.
 * This is used to generate just one form of each one of the templates that are actually going to be used.
 * @param {[key: number]: IFormTemplate} formTemplates FeedbackType -> FormTemplate mapping
 * @returns {Renderer.IUIAsJson} Renderer.IUIAsJson object
 */
function generateMultiForms(formTemplates: { [key: number]: IFormTemplate }): Renderer.IUIAsJson[] {
	let wrapper: Renderer.IUIAsJson = {
		children: [],
	};

	let pushedContainers: { [key: string]: boolean } = {};

	for (let feedbackType in formTemplates) {
		if (formTemplates.hasOwnProperty(feedbackType)) {
			let notExists: boolean = !(formTemplates[feedbackType].containerId in pushedContainers);
			if (notExists) {
				wrapper.children.push(formTemplates[feedbackType].generate());
				pushedContainers[formTemplates[feedbackType].containerId] = true;
			}
		}
	}

	return wrapper.children;
}

/**
 * Generate Renderer.IUIAsJson objects that holds the different forms that will be used on the bellyband.
 * This is used to generate just one form of each one of the templates that are actually going to be used.
 * @param {[key: number]: IFormTemplate} formTemplates FeedbackType -> FormTemplate mapping
 * @returns {Renderer.IUIAsJson} Renderer.IUIAsJson object
 */
function generateMultiPanels(panelTemplates: { [key: number]: IPanelTemplate }): Renderer.IUIAsJson[] {
	let wrapper: Renderer.IUIAsJson = {
		children: [],
	};

	let pushedContainers: { [key: string]: boolean } = {};

	for (let panelType in panelTemplates) {
		if (panelTemplates.hasOwnProperty(panelType)) {
			let notExists: boolean = !(panelTemplates[panelType].containerId in pushedContainers);
			if (notExists) {
				wrapper.children.push(panelTemplates[panelType].generate());
				pushedContainers[panelTemplates[panelType].containerId] = true;
			}
		}
	}

	return wrapper.children;
}

/**
 * Generates Renderer.IUIAsJson object that holds the different anchors that will be used on the bellyband.
 * @param {[key: number]: IFormTemplate} formTemplates FeedbackType -> FormTemplate mapping
 * @returns {Renderer.IUIAsJson} Renderer.IUIAsJson object
 */
function generateOverallAnchors(formTemplates: { [key: number]: IFormTemplate }): Renderer.IUIAsJson[] {
	let wrapper: Renderer.IUIAsJson = {
		children: [],
	};

	if (FeedbackType.Smile in formTemplates) {
		wrapper.children.push(generateOverallAnchor(IDs.OverallSmileAnchor, IDs.OverallSmileImage,
			// The svg code for the image
			// tslint:disable-next-line:max-line-length
			'<svg viewBox="0 0 72 72" width="24px" height="24px" focusable="false"><path d="M36 1C16.7 1 1 16.7 1 36s15.7 35 35 35c19.3 0 35-15.7 35-35S55.3 1 36 1ZM49.3 18.3c2.3 0 4.2 2.7 4.2 6 0 3.3-1.9 6-4.2 6 -2.3 0-4.2-2.7-4.2-6C45.1 21 47 18.3 49.3 18.3ZM22.9 18.3c2.3 0 4.2 2.7 4.2 6 0 3.3-1.9 6-4.2 6 -2.3 0-4.2-2.7-4.2-6C18.7 21 20.6 18.3 22.9 18.3ZM36 58.6c-8.5 0-16-4.1-20.9-10.4l3.5-3.6c3.5 4.5 9.9 7.6 17.4 7.6 7.4 0 13.9-3.1 17.4-7.6l3.6 3.6C52.1 54.4 44.4 58.6 36 58.6Z"/></svg>',
			IDs.OverallSmileText, UIStrings.getUIStrings().SmileForm.Anchor));
	}

	if (FeedbackType.Frown in formTemplates) {
		wrapper.children.push(generateOverallAnchor(IDs.OverallFrownAnchor, IDs.OverallFrownImage,
			// The svg code for the image
			// tslint:disable-next-line:max-line-length
			'<svg viewBox="0 0 72 72" width="24px" height="24px" focusable="false"><path d="M36 1C16.7 1 1 16.7 1 36s15.7 35 35 35c19.3 0 35-15.7 35-35S55.3 1 36 1ZM49.3 18.3c2.3 0 4.2 2.7 4.2 6 0 3.3-1.9 6-4.2 6 -2.3 0-4.2-2.7-4.2-6C45.1 21 47 18.3 49.3 18.3ZM22.9 18.3c2.3 0 4.2 2.7 4.2 6 0 3.3-1.9 6-4.2 6 -2.3 0-4.2-2.7-4.2-6C18.7 21 20.6 18.3 22.9 18.3ZM52.8 57.9c-3.3-4.4-9.6-7.3-16.7-7.3 -7.2 0-13.4 3-16.7 7.3l-3.4-3.4c4.7-6.1 11.9-10 20.1-10 8.2 0 15.5 4 20.2 10L52.8 57.9Z"/></svg>',
			IDs.OverallFrownText, UIStrings.getUIStrings().FrownForm.Anchor));
	}

	if (FeedbackType.Idea in formTemplates) {
		wrapper.children.push(generateOverallAnchor(IDs.OverallIdeaAnchor, IDs.OverallIdeaImage,
			// The svg code for the image
			// tslint:disable-next-line:max-line-length
			'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" focusable="false" viewBox="0,0,2048,2048"><path fill="#FAFAFA" fill-opacity="1.000" d="M 213 1920 v -546 l 275 -649 h 1072 l 275 649 v 546 z" /><path fill="#3A3A38" fill-opacity="1.000" d="M 1877 1365 v 598 h -1706 v -598 l 289 -682 h 288 l -41 41 l 44 44 h -239 l -248 597 h 1520 l -221 -532 l 63 -62 m 166 680 h -1536 v 426 h 1536 z" /><path fill="#FAFAFA" fill-opacity="1.000" d="M 1049 1067 l -342 -343 l 664 -664 l 482 483 l -523 524 z" /><path fill="#797774" fill-opacity="1.000" d="M 1536 649 l -271 -272 l 60 -60 l 272 271 m -211 212 l -272 -272 l 60 -60 l 272 271 m -211 211 l -272 -271 l 61 -61 l 271 272 z" /><path fill="#1E8BCD" fill-opacity="1.000" d="M 989 1067 l -343 -343 l 725 -724 l 543 543 l -524 524 h -121 l 524 -524 l -422 -422 l -604 603 l 343 343 z" /><path fill="#3A3A38" fill-opacity="1.000" d="M 1451 1109 h -854 v -85 h 854 z" /></svg>',
			IDs.OverallIdeaText, UIStrings.getUIStrings().IdeaForm.Anchor));
	}

	if (FeedbackType.Bug in formTemplates) {
		wrapper.children.push(generateOverallAnchor(IDs.OverallBugAnchor, IDs.OverallBugImage,
			// The svg code for the image
			// tslint:disable-next-line:max-line-length
			'<svg viewBox="150 100 1748 1748" width="24px" height="24px" focusable="false"><path d="M1824 1088q0 26-19 45t-45 19h-224q0 171-67 290l208 209q19 19 19 45t-19 45q-18 19-45 19t-45-19l-198-197q-5 5-15 13t-42 28.5-65 36.5-82 29-97 13v-896h-128v896q-51 0-101.5-13.5t-87-33-66-39-43.5-32.5l-15-14-183 207q-20 21-48 21-24 0-43-16-19-18-20.5-44.5t15.5-46.5l202-227q-58-114-58-274h-224q-26 0-45-19t-19-45 19-45 45-19h224v-294l-173-173q-19-19-19-45t19-45 45-19 45 19l173 173h844l173-173q19-19 45-19t45 19 19 45-19 45l-173 173v294h224q26 0 45 19t19 45zm-480-576h-640q0-133 93.5-226.5t226.5-93.5 226.5 93.5 93.5 226.5z"/></svg>',
			IDs.OverallBugText, UIStrings.getUIStrings().BugForm.Anchor));
	}

	return wrapper.children;
}

/**
 * Generates a Renderer.IUIAsJson object that holds an anchor that will be used on the bellyband.
 * @param overallAnchorID the overall anchor id
 * @param overallImageID the image id
 * @param imageClass the image class (icon)
 * @param overallTextID the id for text box
 * @param uiString the string to display
 */
function generateOverallAnchor(
	overallAnchorID: string, overallImageID: string, svgImage: string,
	overallTextID: string, uiString: string): Renderer.IUIAsJson {
	return {
		attributes:
		[
			{ name: AttributeName.Type, value: AttributeValue.Button },
			{ name: AttributeName.Role, value: AttributeValue.Tab },
			{ name: AttributeName.AriaLabel, value: uiString },
			{ name: AttributeName.AriaSelected, value: AttributeValue.False },
		],
		children:
		[
			{
				classes: [Classes.OverallImage],
				id: overallImageID,
				innerHTML: svgImage,
				tag: Tags.Div,
			},
			{
				classes: [Classes.FontSubtitle, Classes.OverallText],
				id: overallTextID,
				innerText: uiString,
			},
		],
		classes: [Classes.OverallAnchor, Classes.TextAlignLeft],
		id: overallAnchorID,
		tag: Tags.Button,
	};
}
