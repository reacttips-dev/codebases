/**
 * Dummy IUISurvey implementation without dependancy on officefloodgatecore
 */

import IUISurvey from "./IUISurvey";
import * as Utils from "../../Utils";
import * as Api from "@ms-ofb/officefloodgatecore/dist/src/Api/Api";

export default class DummySurvey implements IUISurvey {
	public showPrompt: boolean = true;

	public showEmailRequest: boolean = true;

	private comment: string = "";
	private rating: number;

	public getPromptQuestion(): string {
		return "Prompt question?";
	}

	public getTitle(): string {
		return "Title";
	}

	public getPromptYesButtonText(): string {
		return "Yes";
	}

	public getPromptNoButtonText(): string {
		return "No";
	}

	public getRatingValuesAscending(): string[] {
		return ["worst", "worse", "ok", "better", "best"];
	}

	public getRatingQuestion(): string {
		return "Rating question?";
	}

	public getCommentQuestion(): string {
		return "Comment question?";
	}

	public getInterceptTitle(): string {
		return "Intercept Title";
	}

	public getInterceptQuestion(): string {
		return "Intercept question?";
	}

	public getInterceptUrl(): string {
		return "https://example.com";
	}

	public setValues(selectedIndex: number, comment: string): void {
		if (comment) { this.comment = comment; }
		if (Utils.isInteger(selectedIndex) && selectedIndex >= 0 && selectedIndex <= 4) {
			this.rating = selectedIndex / 4.0;
		}
	}

	public getJsonElements(): any {
		let result: any = {};

		if (this.comment) { result.comment = this.comment; }
		if (this.rating) { result.rating = this.rating; }

		return result;
	}

	public getSurveyType(): Api.ISurvey.Type {
		return Api.ISurvey.Type.Nps;
	}

	public getCampaignId(): string {
		return "10000000-0000-0000-0000-000000000000";
	}

	public getId(): string {
		return "00000000-0000-0000-0000-000000000000";
	}
}
