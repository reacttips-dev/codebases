import * as IFloodgateStringProvider from "../Api/IFloodgateStringProvider";
import * as ISurvey from "../Api/ISurvey";
import { GovernedChannelType } from "../GovernedChannel";
import * as ISurveyEvent from "../ISurveyEvent";
import * as ISurveyInfo from "../ISurveyInfo";
import { ISurveyMetadata } from "../ISurveyMetadata";
import {
	CountedActivityEvent, CountedActivityEventData, CountedActivitySequenceEvent, CountedActivitySequenceEventData,
	ICountedActivityEvent, ICountedActivitySequenceEvent,
} from "../SurveyEvents";
import { Metadata, SurveyMetadata } from "../SurveyMetadata";
import * as FpsSurvey from "../Surveys/FpsSurvey";
import * as GenericMessagingSurfaceSurvey from "../Surveys/GenericMessagingSurfaceSurvey";
import * as InterceptSurvey from "../Surveys/InterceptSurvey";
import * as NlqsSurvey from "../Surveys/NlqsSurvey";
import * as NpsSurvey from "../Surveys/NpsSurvey";
import * as SurveyDataSource from "../Surveys/SurveyDataSource";
import * as Utils from "../Utils";
import {
	CampaignSurveyEvent, CampaignSurveyEventCountedActivity, CampaignSurveyEventCountedActivitySequence, CampaignSurveyMetadata,
	CampaignSurveyTemplate, CampaignSurveyTemplateFps, CampaignSurveyTemplateGenericMessagingSurface, CampaignSurveyTemplateIntercept,
	CampaignSurveyTemplateNlqs, CampaignSurveyTemplateNps, CampaignSurveyTemplateNps11PointStatic, CampaignSurveyTemplateNps5PointStatic,
} from "./CampaignDefinitionProvider";
import { CampaignState } from "./CampaignStateProvider";

const { dateToShortUtcString, isNOU } = Utils;

/**
 * Contains methods to take a campaign definition + state and generate an ISurvey
 */
export class CampaignSurveyFactory {
	public static makeSurvey(state: CampaignState, governedChannelType: GovernedChannelType, surveyModel: CampaignSurveyTemplate,
		stringProvider: IFloodgateStringProvider, additionalDataRequested?: ISurveyInfo.AdditionalDataType[], launcherType?: string): ISurvey {
		if (!state || !surveyModel || !stringProvider) {
			return null;
		}

		if (surveyModel instanceof CampaignSurveyTemplateNps5PointStatic) {
			return NpsSurvey.make5Point(CampaignSurveyFactory.makeSurveyDataSourceData(
				state, governedChannelType, surveyModel, additionalDataRequested, launcherType), stringProvider);
		} else if (surveyModel instanceof CampaignSurveyTemplateNps11PointStatic) {
			return NpsSurvey.make11Point(CampaignSurveyFactory.makeSurveyDataSourceData(
				state, governedChannelType, surveyModel, additionalDataRequested, launcherType), stringProvider);
		} else if (surveyModel instanceof CampaignSurveyTemplateFps) {
			return FpsSurvey.makeFps(CampaignSurveyFactory.makeSurveyDataSourceData(
				state, governedChannelType, surveyModel, additionalDataRequested, launcherType), stringProvider, surveyModel);
		} else if (surveyModel instanceof CampaignSurveyTemplateNlqs) {
			return NlqsSurvey.makeNlqs(CampaignSurveyFactory.makeSurveyDataSourceData(
				state, governedChannelType, surveyModel, additionalDataRequested, launcherType), stringProvider, surveyModel);
		} else if (surveyModel instanceof CampaignSurveyTemplateNps) {
			return NpsSurvey.makeCustom(CampaignSurveyFactory.makeSurveyDataSourceData(
				state, governedChannelType, surveyModel, additionalDataRequested, launcherType), stringProvider, surveyModel);
		} else if (surveyModel instanceof CampaignSurveyTemplateGenericMessagingSurface) {
			return GenericMessagingSurfaceSurvey.makeCustom(CampaignSurveyFactory.makeSurveyDataSourceData(
				state, governedChannelType, surveyModel, additionalDataRequested, launcherType));
		} else if (surveyModel instanceof CampaignSurveyTemplateIntercept) {
			return InterceptSurvey.makeIntercept(CampaignSurveyFactory.makeSurveyDataSourceData(
				state, governedChannelType, surveyModel, additionalDataRequested, launcherType), stringProvider, surveyModel);
		} else {
			return null;
		}
	}

	private static makeSurveyDataSourceData(state: CampaignState, governedChannelType: GovernedChannelType, surveyModel: CampaignSurveyTemplate,
		additionalDataRequested?: ISurveyInfo.AdditionalDataType[], launcherType?: string): SurveyDataSource.SurveyDataSourceData {

		if (!state || !surveyModel) {
			return null;
		}

		const surveyData = new SurveyDataSource.SurveyDataSourceData();
		surveyData.activationEvent = CampaignSurveyFactory.makeEvent(state, surveyModel.activationEvent);
		surveyData.metadata = CampaignSurveyFactory.makeMetadata(surveyModel.metadata);
		surveyData.id = state.LastSurveyId;
		surveyData.backEndIdentifier = state.CampaignId;
		surveyData.expirationTimeUtc = dateToShortUtcString(state.LastSurveyExpirationTimeUtc);
		surveyData.governedChannelType = governedChannelType;
		surveyData.startTimeUtc = dateToShortUtcString(state.LastSurveyStartTimeUtc);
		surveyData.additionalDataRequested = additionalDataRequested  || [];
		surveyData.launcherType = launcherType || ISurvey.LAUNCHER_TYPE_DEFAULT;

		return surveyData;
	}

	private static makeCountedActivityEventData(eventModel: CampaignSurveyEventCountedActivity): CountedActivityEventData {
		if (!eventModel) {
			return null;
		}

		const eventData = new CountedActivityEventData();
		eventData.activity = eventModel.activity;
		eventData.count = eventModel.count;
		eventData.isAggregate = eventModel.isAggregate;

		return eventData;
	}

	private static makeCountedActivityEvent(state: CampaignState, eventModel: CampaignSurveyEventCountedActivity): ICountedActivityEvent {
		if (!state || !eventModel) {
			return null;
		}

		const eventData: CountedActivityEventData = CampaignSurveyFactory.makeCountedActivityEventData(eventModel);
		if (!eventData) {
			return null;
		}

		return new CountedActivityEvent(eventData);
	}

	private static makeCountedActivitySequenceEvent(state: CampaignState,
		eventModel: CampaignSurveyEventCountedActivitySequence): ICountedActivitySequenceEvent {

		if (!state || !eventModel) {
			return null;
		}

		const sequenceEventData = new CountedActivitySequenceEventData();
		sequenceEventData.sequence = [];

		for (const event of eventModel.sequence) {
			const eventData: CountedActivityEventData = CampaignSurveyFactory.makeCountedActivityEventData(event);
			if (!eventData) {
				return null;
			}

			sequenceEventData.sequence.push(eventData);
		}

		return new CountedActivitySequenceEvent(sequenceEventData);
	}

	private static makeEvent(state: CampaignState, eventModel: CampaignSurveyEvent): ISurveyEvent {
		if (eventModel instanceof CampaignSurveyEventCountedActivity) {
			return CampaignSurveyFactory.makeCountedActivityEvent(state, eventModel as CampaignSurveyEventCountedActivity);
		} else if (eventModel instanceof CampaignSurveyEventCountedActivitySequence) {
			return CampaignSurveyFactory.makeCountedActivitySequenceEvent(state, eventModel as CampaignSurveyEventCountedActivitySequence);
		} else {
			return null;
		}
	}

	private static makeMetadata(metadataModel: CampaignSurveyMetadata): ISurveyMetadata {
		if (isNOU(metadataModel) || isNOU(metadataModel.contentMetadata)) {
			return null;
		}

		const metadata = new Metadata();
		metadata.contentMetadata = metadataModel.contentMetadata;

		return new SurveyMetadata(metadata);
	}
}
