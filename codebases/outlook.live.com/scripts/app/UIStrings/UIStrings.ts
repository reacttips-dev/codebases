/**
 * UIStrings.ts
 *
 * Module for the strings to display
 */

export interface IUIStrings {
	FeedbackSubtitle: string;
	PrivacyStatement: string;

	Form: {
		CommentPlaceholder: string;
		CategoryPlaceholder: string;
		EmailPlaceholder: string;
		RatingLabel: string;
		ScreenshotLabel: string;
		EmailCheckBoxLabel: string;
		Submit: string;
		BasicFormTitle: string;
		Cancel: string;
		ScreenshotImgAltText: string;
		PrivacyLabel: string;
		PrivacyConsent: string;
	};

	SingleForm: {
		Title: string;
	};

	UserVoiceForm: {
		Title: string;
		Text: string;
		Button: string;
	};

	SmileForm: {
		Anchor: string;
		Title: string;
	};

	FrownForm: {
		Anchor: string;
		Title: string;
	};

	IdeaForm: {
		Anchor: string;
		Title: string;
	};

	BugForm: {
		Anchor: string;
		Title: string;
	};

	ThanksPanel: {
		Title: string;
		AppreciateText: string;
		Close: string;
	};

	Floodgate: {
		Nps: {
			Prompt: {
				Title: string;
				Question: string;
				Yes: string;
				No: string;
			};

			Comment: {
				Question: string;
			};

			Rating: {
				Question: string;
				Points11Value0: string;
				Points11Value1: string;
				Points11Value2: string;
				Points11Value3: string;
				Points11Value4: string;
				Points11Value5: string;
				Points11Value6: string;
				Points11Value7: string;
				Points11Value8: string;
				Points11Value9: string;
				Points11Value10: string;
				Points5Value1: string;
				Points5Value2: string;
				Points5Value3: string;
				Points5Value4: string;
				Points5Value5: string;
			}
		}
	};

	CloseLabel: string;
}

/**
 * Localized UI strings
 */
let uIStrings: IUIStrings;

/**
 * Set UI strings
 * @param {string} data List of localized UI strings
 */
export function setUIStrings(data: IUIStrings) {
	uIStrings = data;
}

/**
 * Get UI strings
 * @returns the UIStrings
 */
export function getUIStrings(): IUIStrings {
	return uIStrings;
}
