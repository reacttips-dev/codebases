import * as IFloodgateStringProvider from "../Api/IFloodgateStringProvider";
import { IInterceptSurvey } from "../Api/IInterceptSurvey";
import * as ISurvey from "../Api/ISurvey";
import * as ISurveyComponent from "../Api/ISurveyComponent";
import { CampaignSurveyContent, CampaignSurveyTemplate } from "../Campaign/CampaignDefinitionProvider";
import * as ISurveyInfo from "../ISurveyInfo";
import * as InterceptComponent from "../SurveyComponents/InterceptComponent";
import * as Utils from "../Utils";
import { Survey } from "./Survey";
import * as SurveyDataSource from "./SurveyDataSource";

const { isNOU } = Utils;

class InterceptSurvey extends Survey implements IInterceptSurvey {
	public static make(data: InterceptSurvey.InterceptSurveyData): IInterceptSurvey {
		try {
			return new InterceptSurvey(data);
		} catch (e) {
			return null;
		}
	}

	public static makeIntercept(baseData: SurveyDataSource.SurveyDataSourceData, sp: IFloodgateStringProvider,
		surveyModel: CampaignSurveyTemplate): IInterceptSurvey {

		if (isNOU(baseData) || isNOU(sp) || isNOU(surveyModel)) {
			return null;
		}

		const content: CampaignSurveyContent = surveyModel.content;

		// Intercept component is required.
		if (isNOU(content) || isNOU(content.intercept)) {
			return null;
		}

		const data = new InterceptSurvey.InterceptSurveyData();
		data.baseData = baseData;

		data.interceptData = new InterceptComponent.InterceptComponentData();

		data.interceptData.title = sp.getCustomString(content.intercept.title);
		data.interceptData.question = sp.getCustomString(content.intercept.question);
		data.interceptData.url = sp.getCustomString(content.intercept.url);

		if ( isNOU(data.interceptData.title)
			|| isNOU(data.interceptData.question)
			|| isNOU(data.interceptData.url)) {

			return null;
		}

		return this.make(data);
	}

	private surveyInfo: SurveyDataSource;
	private intercept: InterceptComponent;

	private constructor(data: InterceptSurvey.InterceptSurveyData) {
		super();
		if (isNOU(data)) {
			throw new Error("data must not be null");
		}

		this.surveyInfo = new SurveyDataSource(data.baseData);
		this.intercept = new InterceptComponent(data.interceptData);
	}

	// @Override
	public getType(): ISurvey.Type {
		return ISurvey.Type.Intercept;
	}

	// @Override
	public getSurveyInfo(): ISurveyInfo {
		return this.surveyInfo;
	}

	// @Override
	public getInterceptComponent(): InterceptComponent {
		return this.intercept;
	}

	// @Override
	public getComponent(componentType: ISurveyComponent.Type): ISurveyComponent {
		return (componentType === ISurveyComponent.Type.Intercept) ? this.getInterceptComponent() : null;
	}

	// @Override
	public getDomElements(doc: Document): Element[] {
		return [];
	}

	// @Override
	public getJsonElements(): object {
		return {};
	}
}
module InterceptSurvey {
	/**
	 * Data required for an Intercept Survey
	 */
	export class InterceptSurveyData {
		public baseData: SurveyDataSource.SurveyDataSourceData;
		public interceptData: InterceptComponent.InterceptComponentData;
	}
}

export = InterceptSurvey;
