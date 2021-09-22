import * as ISurvey from "../../src/Api/ISurvey";
import { GovernedChannelType } from "../GovernedChannel";
import * as ISurveyEvent from "../ISurveyEvent";
import * as ISurveyInfo from "../ISurveyInfo";
import { ISurveyMetadata } from "../ISurveyMetadata";
import * as Utils from "../Utils";

const { getDistantFuture, getDistantPast, isNOU, isDate } = Utils;

class SurveyDataSource implements ISurveyInfo {
	private data: SurveyDataSource.SurveyDataSourceData;

	public constructor(data: SurveyDataSource.SurveyDataSourceData) {
		if (isNOU(data)) {
			throw new Error("data must not be null");
		}
		if (isNOU(data.id) || data.id === "") {
			throw new Error("data.id must not be null or empty");
		}
		if (isNOU(data.governedChannelType)) {
			data.governedChannelType = GovernedChannelType.getDefault();
		}
		if (isNOU(data.expirationTimeUtc) || data.expirationTimeUtc === "") {
			throw new Error("data.expirationTimeUtc must not be null or empty");
		}
		if (isNOU(data.activationEvent)) {
			throw new Error("data.activationEvent must not be null");
		}
		if (isNOU(data.backEndIdentifier) || data.backEndIdentifier === "") {
			data.backEndIdentifier = data.id;
		}
		if (isNOU(data.launcherType)) {
			data.launcherType = ISurvey.LAUNCHER_TYPE_DEFAULT;
		}

		this.data = data;
	}

	// @Override
	public getId(): string {
		return this.data.id;
	}

	// @Override
	public getBackEndId(): string {
		return this.data.backEndIdentifier;
	}

	// @Override
	public getGovernedChannelType(): GovernedChannelType {
		return this.data.governedChannelType;
	}

	// @Override
	public getRawStartTimeUtc(): string {
		return this.data.startTimeUtc;
	}

	// @Override
	public getStartTimeUtc(): Date {
		if (isNOU(this.data.startTimeUtc)) {
			return getDistantPast(); // Optional start date means the survey has started
		}

		const parsed = new Date(this.data.startTimeUtc);
		if (!isDate(parsed)) {
			return getDistantFuture(); // Badly specified start dates means the survey never starts
		}

		return parsed;
	}

	// @Override
	public getExpirationTimeUtc(): Date {
		// Bad or missing expiration date means survey is always expired.

		if (isNOU(this.data.expirationTimeUtc)) {
			return getDistantPast();
		}

		const parsed = new Date(this.data.expirationTimeUtc);
		if (!isDate(parsed)) {
			return getDistantPast();
		}

		return parsed;
	}

	// @Override
	public getRawExpirationTimeUtc(): string {
		return this.data.expirationTimeUtc;
	}

	// @Override
	public isActiveForDate(date: Date): boolean {
		if (isNOU(date)) {
			return false;
		}

		return (date >= this.getStartTimeUtc() && date <= this.getExpirationTimeUtc());
	}

	// @Override
	public getActivationEvent(): ISurveyEvent {
		return this.data.activationEvent;
	}

	// @Override
	public getPreferredLaunchType(): ISurveyInfo.LaunchType {
		return this.data.preferredLaunchType;
	}

	// @Override
	public isAdditionalDataRequested(additionalDataToCheck: ISurveyInfo.AdditionalDataType): boolean {
		if (isNOU(this.data.additionalDataRequested)) {
			return false;
		}
		for (const additionalData of this.data.additionalDataRequested) {
			if (additionalData === additionalDataToCheck) {
				return true;
			}
		}
		return false;
	}

	// @Override
	public getLauncherType(): string {
		return this.data.launcherType;
	}

	// @Override
	public getMetadata(): ISurveyMetadata {
		return this.data.metadata;
	}

	// @Override
	public getDomElements(doc: Document): Element[] {
		if (!doc) {
			throw new Error("Document must not be null");
		}

		const typeElement: Element = doc.createElement(ISurveyInfo.DOM_TYPE_TAGNAME);
		typeElement.appendChild(doc.createTextNode(ISurveyInfo.DOM_TYPE_VALUE));

		const idElement: Element = doc.createElement(ISurveyInfo.DOM_ID_TAGNAME);
		idElement.appendChild(doc.createTextNode(this.getBackEndId()));

		return [typeElement, idElement];
	}

	// @Override
	public getJsonElements(): object {
		const surveyObject: object = {};
		surveyObject[ISurveyInfo.JSON_ID_KEYNAME] = this.getBackEndId();

		const result: object = {};
		result[ISurveyInfo.JSON_SURVEY_KEYNAME] = surveyObject;

		return result;
	}
}

module SurveyDataSource {
	/**
	 * Basic data needed for all Surveys
	 */
	export class SurveyDataSourceData {
		public id: string;
		public backEndIdentifier: string;
		public governedChannelType: GovernedChannelType;
		public startTimeUtc: string;
		public expirationTimeUtc: string;
		public activationEvent: ISurveyEvent;
		public preferredLaunchType: ISurveyInfo.LaunchType = ISurveyInfo.LaunchType.Default;
		public additionalDataRequested: ISurveyInfo.AdditionalDataType[];
		public launcherType: string;
		public metadata: ISurveyMetadata;
	}
}

export = SurveyDataSource;
