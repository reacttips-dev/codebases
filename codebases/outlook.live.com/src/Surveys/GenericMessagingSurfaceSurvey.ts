import * as ISurvey from "../Api/ISurvey";
import * as ISurveyComponent from "../Api/ISurveyComponent";
import * as ISurveyInfo from "../ISurveyInfo";
import * as Utils from "../Utils";
import { Survey } from "./Survey";
import * as SurveyDataSource from "./SurveyDataSource";

const { isNOU } = Utils;

class GenericMessagingSurfaceSurvey extends Survey {
	public static make(data: GenericMessagingSurfaceSurvey.GenericMessagingSurfaceSurveyData): ISurvey {
		try {
			return new GenericMessagingSurfaceSurvey(data);
		} catch (e) {
			return null;
		}
	}

	public static makeCustom(baseData: SurveyDataSource.SurveyDataSourceData): ISurvey {
		if (isNOU(baseData)) {
			return null;
		}

		const data = new GenericMessagingSurfaceSurvey.GenericMessagingSurfaceSurveyData();
		data.baseData = baseData;

		return this.make(data);
	}

	private surveyInfo: SurveyDataSource;

	private constructor(data: GenericMessagingSurfaceSurvey.GenericMessagingSurfaceSurveyData) {
		super();
		if (!data) {
			throw new Error("data must not be null");
		}

		this.surveyInfo = new SurveyDataSource(data.baseData);

		// This check cannot be done in survey info constructor
		// as metadata is specific to this survey type.
		if (isNOU(this.surveyInfo.getMetadata())) {
			throw new Error("metadata must not be null");
		}
	}

	// @Override
	public getType(): ISurvey.Type {
		return ISurvey.Type.GenericMessagingSurface;
	}

	// @Override
	public getSurveyInfo(): ISurveyInfo {
		return this.surveyInfo;
	}

	// @Override
	public getComponent(componentType: ISurveyComponent.Type): ISurveyComponent {
		return null;
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

module GenericMessagingSurfaceSurvey {
	/**
	 * Data required for a Generic Surface Survey
	 */
	export class GenericMessagingSurfaceSurveyData {
		public baseData: SurveyDataSource.SurveyDataSourceData;
	}
}

export = GenericMessagingSurfaceSurvey;
