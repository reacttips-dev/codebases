/**
 * Theme.ts
 *
 * Module for the UI Theme
 */

import { Classes, IDs } from "./UI/UiConstants";

let defaultPrimaryColour = "#0167B0";
let defaultSecondaryColour = "#194789";

/**
 * Init
 * @param {string} primaryColour Primary Colour
 * @param {string} secondaryColour Secondary Colour
 */
export function initialize(primaryColour: string = undefined, secondaryColour: string = undefined) {
	if (!primaryColour) {
		primaryColour = defaultPrimaryColour;
	}

	if (!secondaryColour) {
		secondaryColour = defaultSecondaryColour;
	}

	let sheet = document.createElement("style");

	sheet.textContent =
		`.${Classes.OverallAnchor}:focus { background-color: ${primaryColour} } ` +
		`.${Classes.OverallAnchor}:hover { background-color: ${secondaryColour} } ` +
		`.${Classes.OverallAnchorActive} { background-color: ${primaryColour} } ` +
		`.${Classes.SpinnerCircle} { background-color: ${primaryColour} } ` +
		// tslint:disable-next-line:max-line-length
		`.${Classes.ChoiceGroup} input[type=radio]:checked+label>.${Classes.ChoiceGroupIcon} { border-color: ${primaryColour} } ` +
		// tslint:disable-next-line:max-line-length
		`.${Classes.ChoiceGroup} input[type=radio]:hover+label>.${Classes.ChoiceGroupIcon} { border-color: ${secondaryColour} } ` +
		// tslint:disable-next-line:max-line-length
		`.${Classes.ChoiceGroup} input[type=radio]:checked+label>.${Classes.ChoiceGroupIcon}>span { background-color: ${primaryColour} } ` +
		`.${Classes.SubmitButton} { background-color: ${primaryColour} } ` +
		`.${Classes.SubmitButton}:hover { background-color: ${secondaryColour} } ` +
		`.${Classes.CancelButton} { background-color: ${primaryColour} } ` +
		`.${Classes.CancelButton}:hover { background-color: ${secondaryColour} } ` +
		`.${Classes.Link} { color: ${primaryColour} } ` +
		`.${Classes.Link}:hover { color: ${secondaryColour} } ` +
		`.${Classes.ThanksPanelTitle} { color: ${primaryColour} } ` +
		`#${IDs.TPromptTitle} { color: ${primaryColour} } ` +
		`#${IDs.TFormTitle} { color: ${primaryColour} } `;

	document.body.appendChild(sheet);
}
