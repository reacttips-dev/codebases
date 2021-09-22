/**
 * Base interface for a SurveyComponent (i.e. a question/widget to show the user
 * in a survey form, and that typically requires a response value of some kind)
 */
interface ISurveyComponent {
	getType(): ISurveyComponent.Type;
}

module ISurveyComponent {
	export const enum Type {
		// A quick pop-up requesting participation in a survey
		Prompt = "Prompt",

		// A question paired with a free-form text response
		Comment = "Comment",

		// A question asking for a selection from a list of allowed values with numeric meaning
		Rating = "Rating",

		// A question asking for one or more selections from a list of allowed values
		MultipleChoice = "MultipleChoice",

		// A pop-up dialog requesting participation in an Intercept session
		Intercept = "Intercept",
	}

	export const DOM_PROMPT_TAGNAME = "Prompt";
	export const DOM_COMMENT_TAGNAME = "Comment";
	export const DOM_RATING_TAGNAME = "Rating";
	export const DOM_MULTIPLECHOICE_TAGNAME = "MultipleChoice";
	export const DOM_INTERCEPT_TAGNAME = "Intercept";
	export const JSON_INTERCEPT_KEYNAME = "intercept";
	export const JSON_INTERCEPTURL_KEYNAME = "url";
	export const JSON_PROMPT_KEYNAME = "prompt";
	export const JSON_PROMPTYESTEXT_KEYNAME = "yesButtonText";
	export const JSON_PROMPTNOTEXT_KEYNAME = "noButtonText";
	export const JSON_COMMENT_KEYNAME = "comment";
	export const JSON_RATING_KEYNAME = "rating";
	export const JSON_RATINGOPTIONS_KEYNAME = "options";
	export const JSON_TITLE_KEYNAME = "title";
	export const JSON_QUESTION_KEYNAME = "question";
	export const JSON_MULTIPLECHOICE_KEYNAME = "multipleChoice";
	export const JSON_APPLICATION_KEYNAME = "application";
	export const JSON_EXTENDEDMANIFESTDATA_KEYNAME = "extendedManifestData";
	export const JSON_SURVEYSTRINGS_KEYNAME = "surveyStrings";
	export const JSON_SURVEYSPECIFICDATA_KEYNAME = "surveySpecificData";
}

export = ISurveyComponent;
