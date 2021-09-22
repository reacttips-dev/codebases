import * as IFloodgateStringProvider from "../Api/IFloodgateStringProvider";
import { INpsSurvey } from "../Api/INpsSurvey";
import * as ISurvey from "../Api/ISurvey";
import * as ISurveyComponent from "../Api/ISurveyComponent";
import { CampaignSurveyContent, CampaignSurveyTemplate } from "../Campaign/CampaignDefinitionProvider";
import * as ISurveyInfo from "../ISurveyInfo";
import * as CommentComponent from "../SurveyComponents/CommentComponent";
import * as PromptComponent from "../SurveyComponents/PromptComponent";
import * as RatingComponent from "../SurveyComponents/RatingComponent";
import * as Utils from "../Utils";
import { Survey } from "./Survey";
import * as SurveyDataSource from "./SurveyDataSource";

const { isNOU, overrideValues } = Utils;

class NpsSurvey extends Survey implements INpsSurvey {
	public static make(data: NpsSurvey.NpsSurveyData): INpsSurvey {
		try {
			return new NpsSurvey(data);
		} catch (e) {
			return null;
		}
	}

	public static makeCustom(baseData: SurveyDataSource.SurveyDataSourceData, sp: IFloodgateStringProvider,
		surveyModel: CampaignSurveyTemplate): INpsSurvey {

		if (isNOU(baseData) || isNOU(sp) || isNOU(surveyModel)) {
			return null;
		}

		const ratingValuesAscending: string[] = [];
		const content: CampaignSurveyContent = surveyModel.content;

		if (isNOU(content) || isNOU(content.comment)
			|| isNOU(content.prompt) || isNOU(content.rating)) {

			return null;
		}

		const data = new NpsSurvey.NpsSurveyData();
		data.baseData = baseData;
		data.promptData = new PromptComponent.PromptComponentData();
		data.ratingData = new RatingComponent.RatingComponentData();
		data.commentData = new CommentComponent.CommentComponentData();

		data.promptData.title = sp.getCustomString(content.prompt.title);
		data.promptData.question = sp.getCustomString(content.prompt.question);
		data.promptData.yesButtonLabel = sp.getCustomString(content.prompt.yesLabel);
		data.promptData.noButtonLabel = sp.getCustomString(content.prompt.noLabel);
		data.ratingData.question = sp.getCustomString(content.rating.question);
		data.ratingData.isZeroBased = content.rating.isZeroBased;
		data.commentData.question = sp.getCustomString(content.comment.question);

		for (const value of content.rating.ratingValuesAscending) {
			const customString: string = sp.getCustomString(value);

			if (isNOU(customString)) {
				return null;
			}

			ratingValuesAscending.push(customString);
		}

		data.ratingData.ratingValuesAscending = ratingValuesAscending;

		if (isNOU(data.ratingData.question)
			|| isNOU(data.commentData.question)
			|| isNOU(data.promptData.title)
			|| isNOU(data.promptData.question)
			|| isNOU(data.promptData.yesButtonLabel)
			|| isNOU(data.promptData.noButtonLabel)
			|| isNOU(data.ratingData.ratingValuesAscending)) {

			return null;
		}

		return this.make(data);
	}

	public static make5Point(baseData: SurveyDataSource.SurveyDataSourceData, sp: IFloodgateStringProvider): INpsSurvey {
		if (!baseData || !sp) {
			return null;
		}

		const data = new NpsSurvey.NpsSurveyData();
		data.baseData = baseData;
		data.ratingData = new RatingComponent.RatingComponentData();
		data.ratingData.isZeroBased = false;
		data.commentData = new CommentComponent.CommentComponentData();
		data.promptData = new PromptComponent.PromptComponentData();
		data.ratingData.question = sp.loadStringResource(IFloodgateStringProvider.StringType.NpsRatingQuestion);
		data.commentData.question = sp.loadStringResource(IFloodgateStringProvider.StringType.NpsCommentQuestion);
		data.promptData.title = sp.loadStringResource(IFloodgateStringProvider.StringType.NpsPromptTitle);
		data.promptData.question = sp.loadStringResource(IFloodgateStringProvider.StringType.NpsPromptQuestion);
		data.promptData.yesButtonLabel = sp.loadStringResource(IFloodgateStringProvider.StringType.NpsPromptYesLabel);
		data.promptData.noButtonLabel = sp.loadStringResource(IFloodgateStringProvider.StringType.NpsPromptNotNowLabel);

		const ratingValuesAscending: string[] = new Array(5);
		ratingValuesAscending[0] = sp.loadStringResource(IFloodgateStringProvider.StringType.Nps5RatingValue1);
		ratingValuesAscending[1] = sp.loadStringResource(IFloodgateStringProvider.StringType.Nps5RatingValue2);
		ratingValuesAscending[2] = sp.loadStringResource(IFloodgateStringProvider.StringType.Nps5RatingValue3);
		ratingValuesAscending[3] = sp.loadStringResource(IFloodgateStringProvider.StringType.Nps5RatingValue4);
		ratingValuesAscending[4] = sp.loadStringResource(IFloodgateStringProvider.StringType.Nps5RatingValue5);

		if (!data.ratingData.question
			|| !data.commentData.question
			|| !data.promptData.title
			|| !data.promptData.question
			|| !data.promptData.yesButtonLabel
			|| !data.promptData.noButtonLabel
			|| !ratingValuesAscending[0]
			|| !ratingValuesAscending[1]
			|| !ratingValuesAscending[2]
			|| !ratingValuesAscending[3]
			|| !ratingValuesAscending[4]) {

			return null;
		}

		data.ratingData.ratingValuesAscending = ratingValuesAscending;
		return this.make(data);
	}

	public static make11Point(baseData: SurveyDataSource.SurveyDataSourceData, sp: IFloodgateStringProvider): INpsSurvey {
		if (!baseData || !sp) {
			return null;
		}

		const data = new NpsSurvey.NpsSurveyData();
		data.baseData = baseData;
		data.ratingData = new RatingComponent.RatingComponentData();
		data.ratingData.isZeroBased = true;
		data.commentData = new CommentComponent.CommentComponentData();
		data.promptData = new PromptComponent.PromptComponentData();
		data.ratingData.question = sp.loadStringResource(IFloodgateStringProvider.StringType.NpsRatingQuestion);
		data.commentData.question = sp.loadStringResource(IFloodgateStringProvider.StringType.NpsCommentQuestion);
		data.promptData.title = sp.loadStringResource(IFloodgateStringProvider.StringType.NpsPromptTitle);
		data.promptData.question = sp.loadStringResource(IFloodgateStringProvider.StringType.NpsPromptQuestion);
		data.promptData.yesButtonLabel = sp.loadStringResource(IFloodgateStringProvider.StringType.NpsPromptYesLabel);
		data.promptData.noButtonLabel = sp.loadStringResource(IFloodgateStringProvider.StringType.NpsPromptNotNowLabel);

		const ratingValuesAscending: string[] = new Array(11);
		ratingValuesAscending[0] = sp.loadStringResource(IFloodgateStringProvider.StringType.Nps11RatingValue0);
		ratingValuesAscending[1] = sp.loadStringResource(IFloodgateStringProvider.StringType.Nps11RatingValue1);
		ratingValuesAscending[2] = sp.loadStringResource(IFloodgateStringProvider.StringType.Nps11RatingValue2);
		ratingValuesAscending[3] = sp.loadStringResource(IFloodgateStringProvider.StringType.Nps11RatingValue3);
		ratingValuesAscending[4] = sp.loadStringResource(IFloodgateStringProvider.StringType.Nps11RatingValue4);
		ratingValuesAscending[5] = sp.loadStringResource(IFloodgateStringProvider.StringType.Nps11RatingValue5);
		ratingValuesAscending[6] = sp.loadStringResource(IFloodgateStringProvider.StringType.Nps11RatingValue6);
		ratingValuesAscending[7] = sp.loadStringResource(IFloodgateStringProvider.StringType.Nps11RatingValue7);
		ratingValuesAscending[8] = sp.loadStringResource(IFloodgateStringProvider.StringType.Nps11RatingValue8);
		ratingValuesAscending[9] = sp.loadStringResource(IFloodgateStringProvider.StringType.Nps11RatingValue9);
		ratingValuesAscending[10] = sp.loadStringResource(IFloodgateStringProvider.StringType.Nps11RatingValue10);

		if (!data.ratingData.question
			|| !data.commentData.question
			|| !data.promptData.title
			|| !data.promptData.question
			|| !data.promptData.yesButtonLabel
			|| !data.promptData.noButtonLabel
			|| !ratingValuesAscending[0]
			|| !ratingValuesAscending[1]
			|| !ratingValuesAscending[2]
			|| !ratingValuesAscending[3]
			|| !ratingValuesAscending[4]
			|| !ratingValuesAscending[5]
			|| !ratingValuesAscending[6]
			|| !ratingValuesAscending[7]
			|| !ratingValuesAscending[8]
			|| !ratingValuesAscending[9]
			|| !ratingValuesAscending[10]) {

			return null;
		}

		data.ratingData.ratingValuesAscending = ratingValuesAscending;
		return this.make(data);
	}

	private surveyInfo: SurveyDataSource;
	private question: CommentComponent;
	private prompt: PromptComponent;
	private rating: RatingComponent;

	private constructor(data: NpsSurvey.NpsSurveyData) {
		super();
		if (!data) {
			throw new Error("data must not be null");
		}

		this.surveyInfo = new SurveyDataSource(data.baseData);
		this.prompt = new PromptComponent(data.promptData);
		this.question = new CommentComponent(data.commentData);
		this.rating = new RatingComponent(data.ratingData);
	}

	// @Override
	public getType(): ISurvey.Type {
		return ISurvey.Type.Nps;
	}

	// @Override
	public getSurveyInfo(): ISurveyInfo {
		return this.surveyInfo;
	}

	// @Override
	public getCommentComponent(): CommentComponent {
		return this.question;
	}

	// @Override
	public getPromptComponent(): PromptComponent {
		return this.prompt;
	}

	// @Override
	public getRatingComponent(): RatingComponent {
		return this.rating;
	}

	// @Override
	public getComponent(componentType: ISurveyComponent.Type): ISurveyComponent {
		switch (componentType) {
			case ISurveyComponent.Type.Comment:
				return this.getCommentComponent();
			case ISurveyComponent.Type.Prompt:
				return this.getPromptComponent();
			case ISurveyComponent.Type.Rating:
				return this.getRatingComponent();
			default:
				return null;
		}
	}

	// @Override
	public getDomElements(doc: Document): Element[] {
		if (!doc) {
			throw new Error("Document must not be null");
		}

		const element: Element = doc.createElement(ISurvey.DOM_NPS_TAGNAME);

		this.getSurveyInfo().getDomElements(doc).forEach((child) => {
			if (child) {
				element.appendChild(child);
			}
		});

		this.getCommentComponent().getDomElements(doc).forEach((child) => {
			if (child) {
				element.appendChild(child);
			}
		});

		this.getRatingComponent().getDomElements(doc).forEach((child) => {
			if (child) {
				element.appendChild(child);
			}
		});

		return [element];
	}

	// @Override
	public getJsonElements(): object {
		let result: object = {};

		result = overrideValues(this.getSurveyInfo().getJsonElements(), result);
		result = overrideValues(this.getCommentComponent().getJsonElements(), result);
		result = overrideValues(this.getRatingComponent().getJsonElements(), result);

		result[ISurveyComponent.JSON_APPLICATION_KEYNAME] = {};
		result[ISurveyComponent.JSON_APPLICATION_KEYNAME][ISurveyComponent.JSON_EXTENDEDMANIFESTDATA_KEYNAME] =
			JSON.stringify({[ISurveyComponent.JSON_SURVEYSTRINGS_KEYNAME]: this.makeSurveyStrings()});

		return result;
	}

	// Makes the string to send to Manifest respecting the components present in the survey
	private makeSurveyStrings(): string {
		const actualStrings: object = {};

		if (this.prompt) {
			actualStrings[ISurveyComponent.JSON_PROMPT_KEYNAME] = this.prompt.getComponentJson();
		}

		if (this.rating) {
			actualStrings[ISurveyComponent.JSON_RATING_KEYNAME] = [this.rating.getComponentJson()];
		}

		if (this.question) {
			actualStrings[ISurveyComponent.JSON_COMMENT_KEYNAME] = [this.question.getComponentJson()];
		}

		return JSON.stringify(actualStrings);
	}
}

module NpsSurvey {
	/**
	 * Data required for a Nps Survey
	 */
	export class NpsSurveyData {
		public baseData: SurveyDataSource.SurveyDataSourceData;
		public commentData: CommentComponent.CommentComponentData;
		public promptData: PromptComponent.PromptComponentData;
		public ratingData: RatingComponent.RatingComponentData;
	}
}

export = NpsSurvey;
