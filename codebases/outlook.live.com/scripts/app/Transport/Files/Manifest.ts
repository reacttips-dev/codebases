/**
 * Manifest.ts
 * Module for managing the manifest file
 */

import { IFile } from "./IFile";
import { FeedbackType } from "./../../Constants";
import * as Utils from "./../../Utils";

export class Manifest implements IFile {
	private manifestData: IManifestData;

	public constructor(manifestType: string, appId: number, submitTime: string, type: ManifestFeedbackType,
		clientFeedbackId: string, applicationGroup: IManifestDataApplication, telemetryGroup: IManifestDataTelemetry,
		webGroup: IManifestDataWeb) {
		this.manifestData = {
			appId: appId,
			application: applicationGroup,
			clientFeedbackId: clientFeedbackId,
			manifestType: manifestType,
			source: "Client",
			submitTime: submitTime,
			telemetry: telemetryGroup,
			type: sanitizeType(type),
			web: webGroup,
		};
	}

	public setComment(comment: string) {
		this.manifestData.comment = comment;
	}

	public setEmail(email: string) {
		this.manifestData.email = email;
	}

	public setCategory(category: string) {
		this.manifestData.telemetry = this.manifestData.telemetry || {};
		this.manifestData.telemetry.featureArea = category;
	}

	/**
	 * Set freeform custom values in manifest. Throws if values are already set.
	 * @param values the values as a JS object
	 */
	public setValues(values: object) {
		if (values) {
			for (let field in values) {
				if (values.hasOwnProperty(field)) {
					if (this.manifestData.hasOwnProperty(field)) {
						(<any> this.manifestData)[field] = Utils.overrideValues((<any> values)[field], (<any> this.manifestData)[field]);
					} else {
						(<any> this.manifestData)[field] = (<any> values)[field];
					}
				}
			}
		}
	}

	public getContent(): Blob {
		return new Blob([JSON.stringify(this.manifestData)], {type : "application/json"});
	}
}

function sanitizeType(type: ManifestFeedbackType): string {
	if (type === "Survey") {
		return type;
	} else {
		return FeedbackType[type];
	}
}

export type ManifestFeedbackType = FeedbackType | "Survey";

/**
 * Interface for the manifest data
 */
export interface IManifestData {
	// #region "Required properties"
	manifestType: string;
	appId: number;
	submitTime: string;
	source: string;
	type: string;
	clientFeedbackId: string;
	// #endregion "Required properties"
	comment?: string;
	email?: string;
	rating?: number;
	survey?: IManifestDataSurvey;
	web?: IManifestDataWeb;
	application?: IManifestDataApplication;
	telemetry?: IManifestDataTelemetry;
}

/**
 * Interface for survey related properties in manifest
 */
export interface IManifestDataSurvey {
	surveyId: string;
}

/**
 * Interface for application related properties in manifest
 */
export interface IManifestDataApplication {
	appData?: string;
	extendedManifestData?: string;
	feedbackTenant?: string;
}

/**
 * Interface for telemetry related properties in manifest
 */
export interface IManifestDataTelemetry {
	audience?: string;
	audienceGroup?: string;
	channel?: string;
	deviceId?: string;
	deviceType?: string;
	errorClassification?: string;
	errorCode?: string;
	errorName?: string;
	featureArea?: string;
	flights?: string;
	flightSource?: string;
	fundamentalArea?: string;
	installationType?: string;
	isLogIncluded?: boolean;
	isUserSubscriber?: boolean;
	loggableUserId?: string;
	officeArchitecture?: string;
	officeBuild?: string;
	officeEditingLang?: number;
	officeUILang?: number;
	osBitness?: number;
	osBuild?: string;
	osUserLang?: number;
	platform?: string;
	processSessionId?: string;
	ringId?: number;
	sku?: string;
	sourceContext?: string;
	systemProductName?: string;
	systemManufacturer?: string;
	tenantId?: string;
}

/**
 * Interface for web related properties in manifest
 */
export interface IManifestDataWeb {
	browser?: string;
	browserVersion?: string;
	dataCenter?: string;
	sourcePageName?: string;
	sourcePageURI?: string;
}
