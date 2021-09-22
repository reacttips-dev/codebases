import * as IFloodgateStringProvider from "../Api/IFloodgateStringProvider";
import { INlqsSurvey } from "../Api/INlqsSurvey";
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

class NlqsSurvey extends Survey implements INlqsSurvey {
	public static make(data: NlqsSurvey.NlqsSurveyData): INlqsSurvey {
		try {
			return new NlqsSurvey(data);
		} catch (e) {
			return null;
		}
	}

	public static makeNlqs(baseData: SurveyDataSource.SurveyDataSourceData, sp: IFloodgateStringProvider,
		surveyModel: CampaignSurveyTemplate): INlqsSurvey {

		if (isNOU(baseData) || isNOU(sp) || isNOU(surveyModel)) {
			return null;
		}

		const ratingValuesAscending: string[] = [];
		const content: CampaignSurveyContent = surveyModel.content;

		if (isNOU(content) || isNOU(content.comment)
			|| isNOU(content.prompt) || isNOU(content.rating)) {

			return null;
		}

		const data = new NlqsSurvey.NlqsSurveyData();
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

	private surveyInfo: SurveyDataSource;
	private question: CommentComponent;
	private prompt: PromptComponent;
	private rating: RatingComponent;

	private constructor(data: NlqsSurvey.NlqsSurveyData) {
		super();
		if (isNOU(data)) {
			throw new Error("data must not be null");
		}

		this.surveyInfo = new SurveyDataSource(data.baseData);
		this.prompt = new PromptComponent(data.promptData);
		this.question = new CommentComponent(data.commentData);
		this.rating = new RatingComponent(data.ratingData);
	}

	// @Override
	public getType(): ISurvey.Type {
		return ISurvey.Type.Nlqs;
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
		if (isNOU(doc)) {
			throw new Error("Document must not be null");
		}

		const element: Element = doc.createElement(ISurvey.DOM_NLQS_TAGNAME);

		this.getSurveyInfo().getDomElements(doc).forEach((child) => {
			if (!isNOU(child)) {
				element.appendChild(child);
			}
		});

		this.getCommentComponent().getDomElements(doc).forEach((child) => {
			if (!isNOU(child)) {
				element.appendChild(child);
			}
		});

		this.getRatingComponent().getDomElements(doc).forEach((child) => {
			if (!isNOU(child)) {
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

		return result;
	}
}

module NlqsSurvey {
	/**
	 * Data required for a Nlqs Survey
	 */
	export class NlqsSurveyData {
		public baseData: SurveyDataSource.SurveyDataSourceData;
		public commentData: CommentComponent.CommentComponentData;
		public promptData: PromptComponent.PromptComponentData;
		public ratingData: RatingComponent.RatingComponentData;
	}
}

export = NlqsSurvey;
