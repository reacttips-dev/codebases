/**
 * Rude survey launcher factory for Web SDK
 */

import UISurvey from "./../FloodgateCore/UISurvey/UISurvey";
import * as Window from "./../Window/Window";
import { Api, Utils } from "@ms-ofb/officefloodgatecore";

const { isNOU } = Utils;

export default class RudeSurveyLauncherFactory implements Api.ISurveyLauncherFactory {
	public static readonly LAUNCHER_TYPE: string = Api.ISurvey.LAUNCHER_TYPE_DEFAULT;

	public makeSurveyLauncher(survey: Api.ISurvey): Api.ISurveyLauncher {
		if (this.AcceptsSurvey(survey)) {
			return new RudeSurveyLauncher(survey);
		}

		return null;
	}

	public AcceptsSurvey(survey: Api.ISurvey): boolean {
		// This factory should accept any type that is not of type GenericMessagingSurface
		// This will ensure that a rude survey launcher is returned for any survey type old or new
		// as a launcher is needed to invoke survey activated callback
		if (!isNOU(survey)  && survey.getType() !== Api.ISurvey.Type.GenericMessagingSurface) {
			return true;
		}

		return false;
	}
}

export class RudeSurveyLauncher implements Api.ISurveyLauncher {
	private survey: Api.ISurvey;

	constructor(survey: Api.ISurvey) {
		this.survey = survey;
	}

	public launch(): void {
		Window.get().OfficeBrowserFeedback.floodgate.showSurvey(new UISurvey(this.survey));
	}
}
