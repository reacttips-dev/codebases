/**
 * Implementation of IFloodgateTelemetryLogger for Web SDK
 */

import * as Api from "@ms-ofb/officefloodgatecore/dist/src/Api/Api";
import * as Logging from "../Logging/Logging";

export default class IFloodgateTelemetryLogger implements Api.IFloodgateTelemetryLogger {

	/**
	 * Log that a survey's trigger was met.
	 * @param campaignId Id of the campaign the survey belongs to.
	 * @param surveyId Id of the survey.
	 * @param surveyType Type of the survey.
	 * @param surveyActivityInfo The survey's activities' information such as names, counts, isAggregate and if the list is ordered.
	 * @param additionalSurveyInfo additional survey info in a stringified json object:
	 * 		- surveyLauncherType: LauncherType of the survey.
	 * 		- channelType: The channel type of the survey's campaign.
	 * 		- surveyPercentageNumerator: Percentage numerator of the survey's Campaign.
	 * 		- surveyPercentageDenominator: Percentage denominator of the survey's Campaign.
	 * 		- surveyNominationPeriodNumber: The Nomination Period of the survey's Campaign in seconds, -1 if not applicable.
	 * 		- surveyCooldownPeriodNumber: The Cooldown Period of the survey's Campaign in seconds, -1 if not applicable.
	 * 		- allCandidateCampaignDefinitionIDs: The list of campaign definition IDs that have corresponding surveys which are candidates.
	 * 		- allCampaignDefinitionIDs: The list of all campaign definition IDs.
	 */
	public log_TriggerMet(campaignId: string, surveyId: string, surveyType: Api.ISurvey.Type, surveyActivityInfo: string,
		additionalSurveyInfo: string): void {
		Logging.getLogger().logEvent(Logging.EventIds.SURVEY_FLOODGATE_TRIGGERMET,
			Logging.LogLevel.Critical,
			{
				CampaignId: campaignId,
				SurveyId: surveyId,
				SurveyType: surveyType,
				SurveyActivityInfo: surveyActivityInfo,
				AdditionalSurveyInfo : additionalSurveyInfo,
			});
	}

	/**
	 * Log that a user was selected(nominated) for a survey if it's not sampled
	 * @param campaignId Id of the campaign the survey belongs to.
	 * @param surveyId Id of the survey.
	 * @param surveyType Type of the survey.
	 * @param additionalSurveyInfo additional survey info in a stringified json object:
	 * 		- surveyLauncherType LauncherType of the survey.
	 * 		- channelType The channel type of the survey's campaign.
	 * 		- surveyPercentageNumerator Percentage numerator of the survey's Campaign.
	 * 		- surveyPercentageDenominator Percentage denominator of the survey's Campaign.
	 * 		- surveyNominationPeriodNumber The Nomination Period of the survey's Campaign in seconds, -1 if not applicable.
	 * 		- surveyCooldownPeriodNumber The Cooldown Period of the survey's Campaign in seconds, -1 if not applicable.
	 * 		- allCandidateCampaignDefinitionIDs: The list of campaign definition IDs that have corresponding surveys which are candidates.
	 * 		- allCampaignDefinitionIDs: The list of all campaign definition IDs.
	 */
	public log_UserSelected(campaignId: string, surveyId: string, surveyType: Api.ISurvey.Type, additionalSurveyInfo: string): void {

		Logging.getLogger().logEvent(Logging.EventIds.SURVEY_FLOODGATE_USERSELECTED,
			Logging.LogLevel.Critical,
			{
				CampaignId: campaignId,
				SurveyId: surveyId,
				SurveyType: surveyType,
				AdditionalSurveyInfo : additionalSurveyInfo,
			});
	}

	/**
	 * Log that campaign definitions failed to load.
	 * @param errorMessage error message
	 */
	public log_CampaignLoad_Failed(errorMessage: string): void {
		Logging.getLogger().logEvent(Logging.EventIds.SURVEY_FLOODGATE_CAMPAIGNLOAD_FAILED,
			Logging.LogLevel.Error,
			{
				ErrorMessage: errorMessage,
			});
	}

	/**
	 * Log an event with error message
	 * @param eventId event id
	 * @param errorMessage error message
	 */
	public log_Error(eventId: string, errorMessage: string): void {
		const event: Logging.IEventId = { name: eventId };
		Logging.getLogger().logEvent(event,
			Logging.LogLevel.Error,
			{
				ErrorMessage: errorMessage,
			});
	}

	/**
	 * Log an event with properties
	 * @param eventId event id
	 * @param properties telemetry event properties
	 */
	public log_Event(eventId: string, properties: Api.ITelemetryProperties): void {
		const event: Logging.IEventId = { name: eventId };
		Logging.getLogger().logEvent(event, Logging.LogLevel.Critical, properties);
	}
}
