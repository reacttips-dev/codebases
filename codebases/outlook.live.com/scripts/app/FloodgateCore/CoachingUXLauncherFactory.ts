/**
 * CoachingUX launcher factory for Web SDK
 */

import { Api, Utils } from "@ms-ofb/officefloodgatecore";

import * as Configuration from "./../Configuration/Configuration";
import { IInitOptionsCommon } from "./../Configuration/Configuration";
import { getDynamicSetting, SettingKey } from "../Configuration/DynamicConfiguration";

import * as Constants from "../Constants";
import * as DomUtils from "../Window/DomUtils";
import * as Window from "../Window/Window";
import * as Logging from "../Logging/Logging";
import * as AssetsProvider from "../TargetedMessaging/AssetsProvider";

const { isNOU } = Utils;

export interface IBeaconParameters {
	actionName: string;
	actionUrl: string;
}

export interface IOfficeWebSurfaces {
	Initialize(intOptions: IInitOptionsCommon): void;
	RenderSurface(
		surfaceParams: any,
		targetElementId?: string,
		surfaceId?: string): void;
	RemoveSurface(): void;
	GetSurfaceContainerId(): string;
}

declare module "../Window/Window" {
	interface IWindow {
		OfficeWebSurfaces: IOfficeWebSurfaces;
	}
}

export default class CoachingUXLauncherFactory implements Api.ISurveyLauncherFactory {
	public static readonly LAUNCHER_TYPE: string = "coachingux";

	public makeSurveyLauncher(survey: Api.ISurvey): Api.ISurveyLauncher {
		if (this.AcceptsSurvey(survey)) {
			return new CoachingUXLauncher(survey);
		}

		return null;
	}

	public AcceptsSurvey(survey: Api.ISurvey): boolean {
		if (!isNOU(survey) && survey.getType() === Api.ISurvey.Type.GenericMessagingSurface
		&& survey.getLauncherType().toLocaleLowerCase() === CoachingUXLauncherFactory.LAUNCHER_TYPE) {
			return true;
		}

		return false;
	}
}

export class CoachingUXLauncher implements Api.ISurveyLauncher {
	private survey: Api.ISurvey;

	constructor(survey: Api.ISurvey) {
		this.survey = survey;
	}

	public launch(): void {
		const surveyInfo = this.survey && this.survey.getSurveyInfo();
		const surveyMetadata = surveyInfo && surveyInfo.getMetadata();
		const contentMetadata = surveyMetadata && surveyMetadata.getContentMetadata();
		if (!contentMetadata) {
			return;
		}

		const startTime = new Date();
		const getWebSurfacesInstance = () => {
			const windowInstance = Window.getGlobal();
			return windowInstance && windowInstance.OfficeWebSurfaces;
		};

		const renderWebSurface = (uxInitOptions?: any) => {
			const officeWebSurfaces = getWebSurfacesInstance();
			if (uxInitOptions) {
				officeWebSurfaces.Initialize(uxInitOptions);
			}

			officeWebSurfaces.RemoveSurface();
			officeWebSurfaces.RenderSurface(
				contentMetadata,
				null /* targetElementId */,
				surveyInfo.getBackEndId());
		};

		const logErrorEvent = (error?: Error) => {
			Logging.getLogger().logEvent(
				Logging.EventIds.WebSurfaces.Common.Error.VALUE,
				Logging.LogLevel.Critical,
				{
					ErrorMessage: "Error loading websurfaces" + (error && error.message ? ": " + error.message : ""),
					TimeMilliseconds: Date.now() - (+startTime),
				});
		};

		try {
			if (getWebSurfacesInstance()) {
				renderWebSurface();
				return;
			}

			// if UX package isn't already loaded, download package and render surface
			DomUtils.loadScript(getDynamicSetting(SettingKey.webSurfacesLink, Constants.DynamicScriptUrls.WebSurfacesLink), null)
			.then(() => {
				const initOptions = Configuration.get().getCommonInitOptions();
				const floodgateInitOptions = Configuration.get().getFloodgateInitOptions();
				const surveyActivatedCallback = floodgateInitOptions && floodgateInitOptions.onSurveyActivatedCallback;

				const beaconCallback = (beaconParameters: IBeaconParameters): Promise<boolean> => {
					if (beaconParameters) {
						return AssetsProvider.get().setCampaignAction(beaconParameters);
					}
				};

				const uxOptions = {
					...initOptions,
					...floodgateInitOptions,
					beaconCallback,
					surfaceInitTime: startTime,
					surfaceId: surveyInfo.getBackEndId(),
					logSessionId: Configuration.get().getSdkSessionId(),
					logSettings: getDynamicSetting(SettingKey.logLevelSettings, undefined),
					renderer: surveyActivatedCallback,
					renderCallback: surveyActivatedCallback && surveyActivatedCallback.onTeachingCampaignRender,
				};

				renderWebSurface(uxOptions);
			}).catch(error => {
				logErrorEvent(error);
			});
		} catch (error) {
			logErrorEvent(error);
		}
	}
}
