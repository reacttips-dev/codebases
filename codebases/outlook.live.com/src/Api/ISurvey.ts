import { ISurveyForm } from "../Api/ISurveyForm";
import * as ISurveyInfo from "../ISurveyInfo";
import { ISurveyDomWriter } from "./ISurveyDomWriter";
import { ISurveyJsonWriter } from "./ISurveyJsonWriter";

/**
 * The interface for all Surveys
 * A survey has a type, a globally unique id (otherwise opaque, but suitable for correlation with telemetry and for saving stats in the registry),
 * an expiration time to aid in cache cleanup, and an activation event to cause this survey to be triggered
 */
interface ISurvey extends ISurveyForm, ISurveyDomWriter, ISurveyJsonWriter {
	/**
	 * Get the type of this survey.
	 */
	getType(): ISurvey.Type;

	/**
	 * Get basic root-level information about this survey
	 */
	getSurveyInfo(): ISurveyInfo;
}

module ISurvey {
	export enum Type {
		// A Feedback survey. Contains a single question with a free-form text response
		Feedback = 0,
		// An NPS (net promoter score) survey. Asks user to rate "whether or not they would recommend this product to family/friends".
		// Contains a prompt, question, and rating
		Nps = 1,
		// A PSAT (product satisfaction) survey. Asks user to rate "overall, based on their experience, how satisifed are they with this app"
		// Contains a prompt, question, and rating
		Psat = 2,
		// A BPS (build promotion) survey. Asks user to choose between Yes and No options of promoting the current build to the next audience ring
		// Contains a prompt, question, and rating (Yes/No)
		Bps = 3,
		// A FPS (feature promotion) survey. Asks user to rate a given app feature.
		// Contains a prompt, question, and rating
		Fps = 4,
		// A NLQS (net language quality score) survey. Asks user to rate the language quality.
		// Contains a prompt, question, and rating
		Nlqs = 5,
		// An intercept survey. Asks user if they want to talk to a Microsoft engineer to give feedback.
		// User can dismiss it or click on it to go to the intercept website, where the experience continues.
		Intercept = 6,
		// A Generic surface survey that uses content metadata to render a surface.
		// As of 4th Feb 2019 there are 11 types defined in Mso hence giving a value of 12.
		GenericMessagingSurface = 12,
	}

	export const DOM_FEEDBACKSURVEY_TAGNAME = "FeedbackSurvey";
	export const DOM_NPS_TAGNAME = "Nps";
	export const DOM_PSAT_TAGNAME = "Psat";
	export const DOM_BPS_TAGNAME = "Bps";
	export const DOM_FPS_TAGNAME = "Fps";
	export const DOM_NLQS_TAGNAME = "Nlqs";
	export const DOM_INTERCEPT_TAGNAME = "Intercept";

	// If the launcher type is null or undefined in campaign definition then this value will be used as default
	export const LAUNCHER_TYPE_DEFAULT = "survey";
}

export = ISurvey;
