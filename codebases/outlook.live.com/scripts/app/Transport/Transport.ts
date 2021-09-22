/**
 * Feedback.ts
 *
 * Module for payload transport.
 */

import * as Constants from "./../Constants";
import * as Utils from "./../Utils";
import * as Logging from "./../Logging/Logging";
import * as Petrol from "./Petrol";
import { Screenshot } from "./Files/Screenshot";
import * as Configuration from "../Configuration/Configuration";
import { Manifest, ManifestFeedbackType, IManifestDataApplication, IManifestDataTelemetry, IManifestDataWeb }
	from "./Files/Manifest";

import { Api } from "@ms-ofb/officefloodgatecore";

export { IManifestDataApplication, IManifestDataTelemetry, IManifestDataWeb } from "./Files/Manifest"

export class Transporter implements Api.ITransporter {
	private manifest: Manifest;
	private screenshot: Screenshot;
	private environment: Constants.Environment;
	private clientFeedbackId: string;

	public constructor(environment: Constants.Environment, manifestType: string, appId: number, type: ManifestFeedbackType,
		applicationGroup: IManifestDataApplication, telemetryGroup: IManifestDataTelemetry, webGroup: IManifestDataWeb) {

		this.clientFeedbackId = Utils.guid();
		this.manifest = new Manifest(manifestType, appId, new Date().toISOString(), type,
		this.clientFeedbackId, { ...applicationGroup }, { ...telemetryGroup }, { ...webGroup });
		this.environment = environment;
	}

	public getClientFeedbackId(): string {
		return this.clientFeedbackId;
	}

	public setComment(comment: string) {
		this.manifest.setComment(comment);
	}

	public setEmail(email: string) {
		this.manifest.setEmail(email);
	}

	public setCategory(category: string) {
		this.manifest.setCategory(category);
	}

	public setScreenshot(screenshot: HTMLCanvasElement) {
		this.screenshot = new Screenshot(screenshot);
	}

	public getManifest(): Manifest {
		return this.manifest;
	}

	/**
	 * Set freeform custom values in manifest. Throws if values are already set.
	 * @param values the values as a JS object
	 */
	public setManifestValues(values: object) {
		this.manifest.setValues(values);
	}

	/**
	 * Submit the payload
	 */
	public submit(): Promise<any> {
		let manifestContent: Blob = this.manifest.getContent();
		let screenshotContent: Blob = undefined;
		const clientFeedbackId: string = this.clientFeedbackId;

		if (this.screenshot) {
			screenshotContent = this.screenshot.getContent();
		}

		return Petrol.send(this.environment === Constants.Environment.Production, manifestContent, screenshotContent)
				.catch(
					function onRejected(err: Error) {
						Configuration.get().getCommonInitOptions().onError("Payload submission failed: " + err.message +
							". ClientFeedbackId: " + clientFeedbackId);
						Logging.getLogger().logEvent(Logging.EventIds.Shared.Upload.Failed.VALUE,
							Logging.LogLevel.Error, { ErrorMessage: err.message, ClientFeedbackId: clientFeedbackId });
					}
				);
	}
}
