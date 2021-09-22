/**
 * IUISurvey implementation based on an ICustomSurvey object
 */

import ICustomSurvey from "../ICustomSurvey";
import * as Utils from "../../Utils";
import IUISurvey from "./IUISurvey";
import * as Api from "@ms-ofb/officefloodgatecore/dist/src/Api/Api";

export default class CustomUISurvey implements IUISurvey {
	public showPrompt: boolean;

	public showEmailRequest: boolean;

	private comment: string = "";
	private ratingIndex: number = -1;
	private survey: ICustomSurvey;

	public constructor(survey: ICustomSurvey) {
		this.showPrompt = survey.showPrompt;
		this.showEmailRequest =  Utils.isBoolean(survey.showEmailRequest) ? survey.showEmailRequest : false;

		this.survey = survey;
	}

	public getPromptQuestion(): string {
		return this.survey.promptQuestion;
	}

	public getTitle(): string {
		return this.survey.title;
	}

	public getPromptYesButtonText(): string {
		return this.survey.promptYesButtonText;
	}

	public getPromptNoButtonText(): string {
		return this.survey.promptNoButtonText;
	}

	public getRatingValuesAscending(): string[] {
		return this.survey.ratingValuesAscending;
	}

	public getRatingQuestion(): string {
		return this.survey.ratingQuestion;
	}

	public getCommentQuestion(): string {
		return this.survey.commentQuestion;
	}

	public getInterceptTitle(): string {
		return undefined;
	}

	public getInterceptQuestion(): string {
		return undefined;
	}

	public getInterceptUrl(): string {
		return undefined;
	}

	public setValues(ratingIndex: number, comment: string): void {
		this.comment = comment;
		if (this.isRatingIndexValid(ratingIndex)) {
			this.ratingIndex = ratingIndex;
		} else {
			this.ratingIndex = -1;
		}
	}

	public getJsonElements(): any {
		let result: any = {};

		result.comment = this.comment;
		result.rating = this.getNormalizedRatingScore();
		result.survey = {
			surveyId: this.getCampaignId(),
		};

		return result;
	}

	public getSurveyType(): Api.ISurvey.Type {
		return this.survey.surveyType;
	}

	public getCampaignId(): string {
		return this.survey.campaignId;
	}

	public getId(): string {
		return this.getCampaignId();
	}

	private isRatingIndexValid(index: number): boolean {
		return (index >= 0 && index < this.survey.ratingValuesAscending.length);
	}

	private getNormalizedRatingScore(): number {
		if (!this.isRatingIndexValid(this.ratingIndex)) {
			return -1;
		}

		if (this.survey.isZeroBased) {
			return (this.ratingIndex) / (this.survey.ratingValuesAscending.length - 1);
		} else {
			return (this.ratingIndex + 1.0) / this.survey.ratingValuesAscending.length;
		}
	}
}
