import * as IFloodgateStringProvider from "../Api/IFloodgateStringProvider";
import { IFpsSurvey } from "../Api/IFpsSurvey";
import * as ISurvey from "../Api/ISurvey";
import * as ISurveyComponent from "../Api/ISurveyComponent";
import { CampaignSurveyContent, CampaignSurveyTemplate } from "../Campaign/CampaignDefinitionProvider";
import * as ISurveyInfo from "../ISurveyInfo";
import * as CommentComponent from "../SurveyComponents/CommentComponent";
import * as MultipleChoiceComponent from "../SurveyComponents/MultipleChoiceComponent";
import * as PromptComponent from "../SurveyComponents/PromptComponent";
import * as RatingComponent from "../SurveyComponents/RatingComponent";
import * as Utils from "../Utils";
import { Survey } from "./Survey";
import * as SurveyDataSource from "./SurveyDataSource";

const { isNOU } = Utils;

class FpsSurvey extends Survey implements IFpsSurvey {
	public static make(data: FpsSurvey.FpsSurveyData): IFpsSurvey {
		try {
			return new FpsSurvey(data);
		} catch (e) {
			return null;
		}
	}

	public static makeFps(baseData: SurveyDataSource.SurveyDataSourceData, sp: IFloodgateStringProvider,
		surveyModel: CampaignSurveyTemplate): IFpsSurvey {

		if (isNOU(baseData) || isNOU(sp) || isNOU(surveyModel)) {
			return null;
		}

		const ratingValuesAscending: string[] = [];
		const availableOptions: string[] = [];
		const content: CampaignSurveyContent = surveyModel.content;

		// Prompt is required and at least one of the other components are required
		if (isNOU(content) || isNOU(content.prompt) ||
			(isNOU(content.rating) && isNOU(content.multipleChoice) &&
			isNOU(content.comment))) {

			return null;
		}

		const data = new FpsSurvey.FpsSurveyData();
		data.baseData = baseData;

		data.promptData = new PromptComponent.PromptComponentData();
		data.promptData.title = sp.getCustomString(content.prompt.title);
		data.promptData.question = sp.getCustomString(content.prompt.question);
		data.promptData.yesButtonLabel = sp.getCustomString(content.prompt.yesLabel);
		data.promptData.noButtonLabel = sp.getCustomString(content.prompt.noLabel);

		if ( isNOU(data.promptData.title)
			|| isNOU(data.promptData.question)
			|| isNOU(data.promptData.yesButtonLabel)
			|| isNOU(data.promptData.noButtonLabel)) {

			return null;
		}

		if (content.rating) {
			data.ratingData = new RatingComponent.RatingComponentData();
			data.ratingData.question = sp.getCustomString(content.rating.question);
			data.ratingData.isZeroBased = content.rating.isZeroBased;

			for (const value of content.rating.ratingValuesAscending) {
				const customString: string = sp.getCustomString(value);

				if (isNOU(customString)) {
					return null;
				}

				ratingValuesAscending.push(customString);
			}

			data.ratingData.ratingValuesAscending = ratingValuesAscending;

			if (isNOU(data.ratingData.question)
				|| isNOU(data.ratingData.ratingValuesAscending)) {

				return null;
			}
		}

		if (content.multipleChoice) {
			data.multipleChoiceData = new MultipleChoiceComponent.MultipleChoiceComponentData();
			data.multipleChoiceData.question = sp.getCustomString(content.multipleChoice.question);
			data.multipleChoiceData.minNumberOfSelectedOptions = content.multipleChoice.minNumberOfSelectedOptions;
			data.multipleChoiceData.maxNumberOfSelectedOptions = content.multipleChoice.maxNumberOfSelectedOptions;

			for (const value of content.multipleChoice.availableOptions) {
				const customString: string = sp.getCustomString(value);

				if (isNOU(customString)) {
					return null;
				}

				availableOptions.push(customString);
			}

			data.multipleChoiceData.availableOptions = availableOptions;

			if (isNOU(data.multipleChoiceData.question)
				|| isNOU(data.multipleChoiceData.availableOptions)) {

				return null;
			}
		}

		if (content.comment) {
			data.commentData = new CommentComponent.CommentComponentData();
			data.commentData.question = sp.getCustomString(content.comment.question);

			if (isNOU(data.commentData.question)) {
				return null;
			}
		}

		return this.make(data);
	}

	private surveyInfo: SurveyDataSource;
	private question: CommentComponent;
	private prompt: PromptComponent;
	private rating: RatingComponent;
	private multipleChoice: MultipleChoiceComponent;

	private constructor(data: FpsSurvey.FpsSurveyData) {
		super();
		if (isNOU(data)) {
			throw new Error("data must not be null");
		}

		this.surveyInfo = new SurveyDataSource(data.baseData);
		this.prompt = new PromptComponent(data.promptData);
		this.question = data.commentData ? (new CommentComponent(data.commentData)) : null;
		this.rating = data.ratingData ? (new RatingComponent(data.ratingData)) : null;
		this.multipleChoice = data.multipleChoiceData ? (new MultipleChoiceComponent(data.multipleChoiceData)) : null;
	}

	// @Override
	public getType(): ISurvey.Type {
		return ISurvey.Type.Fps;
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
	public getMultipleChoiceComponent(): MultipleChoiceComponent {
		return this.multipleChoice;
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
			case ISurveyComponent.Type.MultipleChoice:
				return this.getMultipleChoiceComponent();
			default:
				return null;
		}
	}

	// @Override
	public getDomElements(doc: Document): Element[] {
		if (isNOU(doc)) {
			throw new Error("Document must not be null");
		}

		const element: Element = doc.createElement(ISurvey.DOM_FPS_TAGNAME);

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

		if (this.getRatingComponent()) {
			this.getRatingComponent().getDomElements(doc).forEach((child) => {
				if (!isNOU(child)) {
					element.appendChild(child);
				}
			});
		}

		if (this.getMultipleChoiceComponent()) {
			this.getMultipleChoiceComponent().getDomElements(doc).forEach((child) => {
				if (!isNOU(child)) {
					element.appendChild(child);
				}
			});
		}

		return [element];
	}

	// @Override
	public getJsonElements(): object {
		let result: object = {};

		result = Utils.overrideValues(this.getSurveyInfo().getJsonElements(), result);
		result[ISurveyComponent.JSON_APPLICATION_KEYNAME] = {};

		result[ISurveyComponent.JSON_APPLICATION_KEYNAME][ISurveyComponent.JSON_EXTENDEDMANIFESTDATA_KEYNAME] =
			JSON.stringify({
				[ISurveyComponent.JSON_SURVEYSTRINGS_KEYNAME]: this.makeSurveyStrings(),
				[ISurveyComponent.JSON_SURVEYSPECIFICDATA_KEYNAME]: this.makeResponseString(),
			});

		return result;
	}

	// Makes the string to send to Manifest respecting the components present in the survey
	private makeResponseString(): string {
		const response: object = {};

		if (this.question) {
			response[ISurveyComponent.JSON_COMMENT_KEYNAME] = [this.getCommentComponent().getSubmittedText()];
		}

		if (this.multipleChoice) {
			response[ISurveyComponent.JSON_MULTIPLECHOICE_KEYNAME] =
				[this.getMultipleChoiceComponent().getOptionSelectedStates()];
		}

		if (this.rating) {
			response[ISurveyComponent.JSON_RATING_KEYNAME] = [
				{numberOfOptions: this.getRatingComponent().getRatingValuesAscending().length,
			selectedRating: this.getRatingComponent().getSelectedRatingIndex() }];
		}

		return JSON.stringify(response);
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

		if (this.multipleChoice) {
			actualStrings[ISurveyComponent.JSON_MULTIPLECHOICE_KEYNAME] = [this.multipleChoice.getComponentJson()];
		}

		return JSON.stringify(actualStrings);
	}
}
module FpsSurvey {
	/**
	 * Data required for a Fps Survey
	 */
	export class FpsSurveyData {
		public baseData: SurveyDataSource.SurveyDataSourceData;
		public commentData: CommentComponent.CommentComponentData;
		public promptData: PromptComponent.PromptComponentData;
		public ratingData: RatingComponent.RatingComponentData;
		public multipleChoiceData: MultipleChoiceComponent.MultipleChoiceComponentData;
	}
}

export = FpsSurvey;
