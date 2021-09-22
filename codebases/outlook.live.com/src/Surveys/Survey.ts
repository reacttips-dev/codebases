import ISurvey = require("../Api/ISurvey");
import ISurveyComponent = require("../Api/ISurveyComponent");
import { ITransporter } from "../Api/ITransporter";
import { FloodgateEngine } from "../FloodgateEngine";
import * as ISurveyInfo from "../ISurveyInfo";

export abstract class Survey implements ISurvey {
	private survey: ISurvey;
	private clientFeedbackId: string;

	public abstract getComponent(componentType: ISurveyComponent.Type): ISurveyComponent;

	public getCampaignId(): string {
		return this.getSurveyInfo().getBackEndId();
	}

	public getLauncherType(): string {
		return this.getSurveyInfo().getLauncherType();
	}

	public getClientFeedbackId(): string {
		return this.clientFeedbackId;
	}

	public submit() {
		const surveyType: string = ISurvey.Type[this.getType()];
		const transporter: ITransporter = FloodgateEngine.getTransportFactory().makeTransporter(surveyType);
		transporter.setManifestValues(this.getJsonElements());
		this.clientFeedbackId = transporter.getClientFeedbackId();
		transporter.submit();
	}

	// Abstract classes that are implemented by actual Surveys
	public abstract getType(): ISurvey.Type;

	public abstract getSurveyInfo(): ISurveyInfo;

	public abstract getJsonElements(): object;

	public abstract getDomElements(doc: Document): Element[];
}
