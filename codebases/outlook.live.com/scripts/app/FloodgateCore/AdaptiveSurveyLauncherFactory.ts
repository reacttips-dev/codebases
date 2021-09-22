/**
 * Survey launcher factory for Web SDK
 */

import { Api, Utils } from "@ms-ofb/officefloodgatecore";
import CoachingUXLauncherFactory from "./CoachingUXLauncherFactory";
import RudeSurveyLauncherFactory from "./RudeSurveyLauncherFactory";
import * as Configuration from "../Configuration/Configuration";

const { isNOU } = Utils;

export default class AdaptiveSurveyLauncherFactory implements Api.ISurveyLauncherFactory {
	public static make(): Api.ISurveyLauncherFactory {
		return new AdaptiveSurveyLauncherFactory(
			new RudeSurveyLauncherFactory(),
			new CoachingUXLauncherFactory());
	}

	private rudeSurveyLauncherFactory: RudeSurveyLauncherFactory;
	private coachingUXLauncherFactory: CoachingUXLauncherFactory;

	private constructor(rudeSurveyLauncherFactory: RudeSurveyLauncherFactory,
		coachingUXLauncherFactory: CoachingUXLauncherFactory) {
		this.rudeSurveyLauncherFactory = rudeSurveyLauncherFactory;
		this.coachingUXLauncherFactory = coachingUXLauncherFactory;
	}

	public makeSurveyLauncher(survey: Api.ISurvey): Api.ISurveyLauncher {
		if (isNOU(survey)) {
			return null;
		}

		switch (survey.getLauncherType().toLocaleLowerCase()) {
			case CoachingUXLauncherFactory.LAUNCHER_TYPE:
				return this.makeGenericMessagingSurfaceLauncher(survey);
			case RudeSurveyLauncherFactory.LAUNCHER_TYPE:
			default:
				return this.makeRudeSurveyLauncher(survey);
		}
	}

	public AcceptsSurvey(survey: Api.ISurvey): boolean {
		if (isNOU(survey)) {
			return false;
		}

		switch (survey.getType()) {
			case Api.ISurvey.Type.GenericMessagingSurface:
				return (!isNOU(this.coachingUXLauncherFactory)
						&& this.coachingUXLauncherFactory.AcceptsSurvey(survey));
			default:
				return Configuration.get().checkIfSurveysEnabled() &&
					!isNOU(this.rudeSurveyLauncherFactory) &&
					this.rudeSurveyLauncherFactory.AcceptsSurvey(survey);
		}
	}

	private makeGenericMessagingSurfaceLauncher(survey: Api.ISurvey): Api.ISurveyLauncher {
		if (!isNOU(this.coachingUXLauncherFactory)) {
			return this.coachingUXLauncherFactory.makeSurveyLauncher(survey);
		}

		return null;
	}

	private makeRudeSurveyLauncher(survey: Api.ISurvey): Api.ISurveyLauncher {
		if (!isNOU(this.rudeSurveyLauncherFactory)) {
			return this.rudeSurveyLauncherFactory.makeSurveyLauncher(survey);
		}

		return null;
	}
}
