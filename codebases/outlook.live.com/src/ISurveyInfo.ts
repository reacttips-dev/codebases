import { ISurveyDomWriter } from "./Api/ISurveyDomWriter";
import { ISurveyJsonWriter } from "./Api/ISurveyJsonWriter";
import { GovernedChannelType } from "./GovernedChannel";
import * as ISurveyEvent from "./ISurveyEvent";
import { ISurveyMetadata } from "./ISurveyMetadata";

/**
 * Interface that can be used to access the basics of a Survey
 */
interface ISurveyInfo extends ISurveyDomWriter, ISurveyJsonWriter {
	/**
	 * A globally unique, but otherwise opaque, identity for this particular survey
	 */
	getId(): string;

	/**
	 * A globally unique, but otherwise opaque, identity for this particular survey on the OCV backend
	 * May be the same, or different than getId
	 */
	getBackEndId(): string;

	/**
	 * The goverend channel that this survey will be delivered/filtered through
	 */
	getGovernedChannelType(): GovernedChannelType;

	/**
	 * The raw string provided as the survey's start date, with no error checking
	 */
	getRawStartTimeUtc(): string;

	/**
	 * The start time, in UTC, of this Survey.  Before the client has passed this date
	 * the survey will won't be loaded into the survey activity listener.
	 * If no start date is given, returns distantPast.
	 * If bad start date given, returns distantFuture
	 * Otherwise, returns date
	 */
	getStartTimeUtc(): Date;

	/**
	 * The expiration time, in UTC, of this Survey. Once the client has passed this date, it should clean any
	 * cached data, and should reject any incoming surveys that have otherwise expired but are still active
	 * in the flighting system
	 * If no/bad expiration date given, returns distantPast to make sure this survey is always expired.
	 */
	getExpirationTimeUtc(): Date;

	/**
	 * The expiration time, in UTC, of this Survey.  Once the client has passed this date, it should clean any
	 * cached data, and should reject any incoming surveys that have otherwise expired but are still active
	 * in the flighting system
	 */
	getRawExpirationTimeUtc(): string;

	/**
	 * Returns whether or not the 'date' is between the start/expiration dates for this survey.
	 */
	isActiveForDate(date: Date): boolean;

	/**
	 * Gets the activation event that should be plumbed through to the FloodgateEngine/SurveyActiviytListener.
	 * When activated, this survey should be shown to the user.
	 */
	getActivationEvent(): ISurveyEvent;

	/**
	 * Gets the preferred launch mechanism based on this survey's data payload.  This may or may not be
	 * respected by the LauncherFactory depending on the platform and implementation, and is strictly considered
	 * a behavioral hint
	 */
	getPreferredLaunchType(): ISurveyInfo.LaunchType;

	/**
	 * Return additionalDataRequested array
	 */
	isAdditionalDataRequested(additionalData: ISurveyInfo.AdditionalDataType): boolean;

	/**
	 * Return the launcher type string
	 */
	getLauncherType(): string;

	/**
	 * Gets the metadata of the survey, this is optional but if available it can be used by launcher to
	 * make appropriate decisions while launching a surface.
	 */
	getMetadata(): ISurveyMetadata;
}

module ISurveyInfo {
	export const enum LaunchType {
		// No launch type specified, defer to the launcher factory code
		Default = "Default",
		// Prefer a notification-based launcher (like the windows toast launcher when present)
		Notification = "Notification",
		// Prefer a modal-dialog based launcher
		Modal = "Modal",
	}

	export const enum AdditionalDataType {
		// Request email address
		EmailAddress,
	}

	export const DOM_TYPE_TAGNAME = "Type";
	export const DOM_TYPE_VALUE = "Survey";
	export const DOM_ID_TAGNAME = "SurveyID";
	export const JSON_SURVEY_KEYNAME = "survey";
	export const JSON_ID_KEYNAME = "surveyId";
}

export = ISurveyInfo;
