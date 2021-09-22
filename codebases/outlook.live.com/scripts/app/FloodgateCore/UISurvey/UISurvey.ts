/**
 * An implementation of IUISurvey based on floodgate.core INpsSurvey
 */

import IUISurvey from "./IUISurvey";
import * as Api from "@ms-ofb/officefloodgatecore/dist/src/Api/Api";

export default class UISurvey implements IUISurvey {
	public showPrompt: boolean = true;

	public showEmailRequest: boolean = false;

	private isIntercept: boolean;

	private survey: Api.ISurvey;
	private prompt: Api.IPromptComponent;
	private comment: Api.ICommentComponent;
	private rating: Api.IRatingComponent;
	private intercept: Api.IInterceptComponent;

	constructor(survey: Api.ISurvey) {
		if (!survey) {
			throw Error("survey must not be null");
		} else {
			this.survey = survey;
		}

		if (survey.getType() === Api.ISurvey.Type.Intercept) {
			this.isIntercept = true;

			let interceptComponent: Api.ISurveyComponent = survey.getComponent(Api.ISurveyComponent.Type.Intercept);

			if (interceptComponent) {
				this.intercept = (interceptComponent as Api.IInterceptComponent);
			} else {
				throw Error("intercept component must not be null");
			}

		} else {
			this.isIntercept = false;

			let promptComponent: Api.ISurveyComponent = survey.getComponent(Api.ISurveyComponent.Type.Prompt);
			let commentComponent: Api.ISurveyComponent = survey.getComponent(Api.ISurveyComponent.Type.Comment);
			let ratingComponent: Api.ISurveyComponent = survey.getComponent(Api.ISurveyComponent.Type.Rating);

			if (promptComponent) {
				this.prompt = (promptComponent as Api.IPromptComponent);
			} else {
				throw Error("prompt component must not be null");
			}

			// Check for additonalDataRequested options
			this.showEmailRequest = survey.getSurveyInfo().isAdditionalDataRequested(
				Api.ISurveyInfo.AdditionalDataType.EmailAddress);

			if (commentComponent) {
				this.comment = (commentComponent as Api.ICommentComponent);
			} else {
				throw Error("comment component must not be null");
			}

			if (ratingComponent) {
				this.rating = (ratingComponent as Api.IRatingComponent);
			} else {
				throw Error("rating component must not be null");
			}
		}
	}

	public getPromptQuestion(): string {
		return this.isIntercept ? undefined : this.prompt.getQuestion();
	}

	public getTitle(): string {
		return this.isIntercept ? undefined : this.prompt.getTitle();
	}

	public getPromptYesButtonText(): string {
		return this.isIntercept ? undefined : this.prompt.getYesButtonText();
	}

	public getPromptNoButtonText(): string {
		return this.isIntercept ? undefined : this.prompt.getNoButtonText();
	}

	public getRatingValuesAscending(): string[] {
		return this.isIntercept ? undefined : this.rating.getRatingValuesAscending();
	}

	public getRatingQuestion(): string {
		return this.isIntercept ? undefined : this.rating.getQuestion();
	}

	public getCommentQuestion(): string {
		return this.isIntercept ? undefined : this.comment.getQuestion();
	}

	public getInterceptTitle(): string {
		return this.isIntercept ? this.intercept.getTitle() : undefined;
	}

	public getInterceptQuestion(): string {
		return this.isIntercept ? this.intercept.getQuestion() : undefined;
	}

	public getInterceptUrl(): string {
		return this.isIntercept ? this.intercept.getUrl() : undefined;
	}

	public setValues(selectedIndex: number, comment: string): void {
		if (!this.isIntercept) {
			this.rating.setSelectedRatingIndex(selectedIndex);
			this.comment.setSubmittedText(comment);
		}
	}

	public getJsonElements(): any {
		return this.survey.getJsonElements();
	}

	public getSurveyType(): Api.ISurvey.Type {
		return this.survey.getType();
	}

	public getCampaignId(): string {
		return this.survey.getSurveyInfo().getBackEndId();
	}

	public getId(): string {
		return this.survey.getSurveyInfo().getId();
	}
}
