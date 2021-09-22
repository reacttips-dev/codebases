/**
 * ThanksPanelTemplate.ts
 *
 * A panel rendering a Thank you-message.
 */

import * as UIStrings from "./../../../UIStrings/UIStrings";
import { IUIAsJson } from "./../../Renderer";
import * as Configuration from "./../../../Configuration/Configuration";
import { PanelType } from "./../../../Constants";
import { IDs, Tags, Classes, Roles } from "../../UiConstants";
import { PanelTemplateType } from "./PanelTemplateType";

/**
 * Generate the markup
 * @returns the markup as json
 */
export function generate(): IUIAsJson {
	let primaryColor = Configuration.get().getCommonInitOptions().primaryColour;

	let formSchema = {
		children: [
			{
				tag: Tags.Div,
				id: IDs.ThanksPanelInnerContainer,
				children: [
					{
						id: IDs.ThanksPanelDiscussion,
						innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30.4 25.3"
	role="presentation" alt="" tabindex="-1" focusable="false">
	<defs>
		<style>
			.cls-1,.cls-3{isolation:isolate;}
			.cls-2{fill:#e1dfdd;}
			.cls-3{fill:` + primaryColor + `;opacity:0.4;}
			.cls-4{fill:#c8c6c4;mix-blend-mode:multiply;}
			.cls-5{fill:#fff;}</style>
	</defs>
	<title>commentsOffice</title>
	<g class="cls-1">
		<g id="Layer_1" data-name="Layer 1">
			<path class="cls-2" d="M17.8,0H1.2A1.216,1.216,0,0,0,0,1.2V15.3a1.1554,1.1554,0,0,0,1.2,1.2H7l.1,
				4.1L10,16.5h7.9a1.1554,1.1554,0,0,0,1.2-1.2V1.2A1.305,1.305,0,0,0,17.8,0Z"/>
			<path class="cls-3" d="M28.5,10.8a6.0429,6.0429,0,0,0-3.2-2,7.1943,7.1943,0,0,0-6.4,1,7.4884,
				7.4884,0,0,0-3.1,5.7,6.016,6.016,0,0,0,.9,3.7,6.9394,6.9394,0,0,0,5,3.7l2.9,2.4L24.4,23a7.8372,
				7.8372,0,0,0,3-1.3,7.4574,7.4574,0,0,0,3-4.7A7.5076,7.5076,0,0,0,28.5,10.8Z"/>
			<path id="Layer2_1_MEMBER_1_FILL" data-name="Layer2 1 MEMBER 1 FILL" class="cls-4" d="M11.9885,
				8.0154a.8939.8939,0,1,0,.6371-.2589.8653.8653,0,0,0-.6371.2589M6.8115,9.24A.8977.8977,0,1,0,
				5.5532,7.9589.8977.8977,0,1,0,6.8115,9.24m3.2259-1.2412a.894.894,0,1,0,.2588.637A.8653.8653,
				0,0,0,10.0374,7.9983Z"/>
			<path class="cls-5" d="M20.9019,16.3243a.8008.8008,0,0,0,.2586-.5659.8371.8371,0,0,
				0-.21-.5919.7693.7693,0,0,0-1.1091-.05.8379.8379,0,0,0-.2627.5706.8012.8012,0,0,0,
				.2066.5869.77.77,0,0,0,1.1167.05m1.51-.51a.8014.8014,0,0,0,.2066.5874.7695.7695,0,0,0,
				1.1127.0541.8379.8379,0,0,0,.2627-.57.8009.8009,0,0,0-.2066-.5869.7694.7694,0,0,
				0-1.1167-.05.8011.8011,0,0,0-.2587.5663m2.8279.1272a.8371.8371,0,0,0,.21.5919.7693.7693,0,0,
				0,1.1091.05.8379.8379,0,0,0,.2627-.5706.8012.8012,0,0,0-.2066-.5869.77.77,0,0,
				0-1.1167-.05A.8008.8008,0,0,0,25.24,15.9416Z"/>
		</g>
	</g>
</svg>`,
						tag: Tags.Div,
					},
					{
						id: IDs.ThanksPanelVerticalContainer,
						tag: Tags.Div,
						children: [
							{
								classes: [
									Classes.FontTitle,
									Classes.TextAlignLeft,
									Classes.FormQuestionMiddleText,
									Classes.ThanksPanelTitle,
								],
								innerText: UIStrings.getUIStrings().ThanksPanel?.Title,
								tag: Tags.Div,
							},
							{
								classes: [
									Classes.FontSubText,
									Classes.TextAlignLeft,
									Classes.ThanksPanelMessage,
								],
								innerText: UIStrings.getUIStrings().ThanksPanel?.AppreciateText,
								tag: Tags.Div,
							},
							{
								classes: [
									Classes.SubmitButton,
								],
								id: IDs.ThanksPanelCloseButton,
								innerText: UIStrings.getUIStrings().ThanksPanel?.Close,
								ariaLabel: UIStrings.getUIStrings().ThanksPanel?.Close,
								tag: Tags.Button,
								role: Roles.Button,
								attributes: [
									{
										name: "aria-label",
										value: UIStrings.getUIStrings().ThanksPanel?.Title + " " +
											UIStrings.getUIStrings().ThanksPanel?.AppreciateText + " " +
											UIStrings.getUIStrings().ThanksPanel?.Close,
									},
								],
							},
						],
					},
				],
			},
		],
		classes: [Classes.Hidden],
		id: containerId,
	};
	return formSchema;
}

/**
 * The id for the container. This is the id of the top-most element and should
 * be unique to each form
 */
export let containerId: string = IDs.ThanksPanelContainer;

/**
 * This method executes form
 * specific logic when the pane is opened
 * @param panelType panel type
 */
export function onSelect(panelType: PanelType): void {
	if (panelType !== PanelType.Thanks) {
		return;
	}

	document.getElementById(IDs.ThanksPanelCloseButton).focus();
}

/**
 * Form template type
 */
export let type: PanelTemplateType = PanelTemplateType.Thanks;
