/**
 * Implementation of Transporter Factory Interface for calling submit directly to petrol
 */

import { Api } from "@ms-ofb/officefloodgatecore";
import { Transporter } from "./../Transport/Transport";
import * as Configuration from "./../Configuration/Configuration";

export default class TransporterFactory implements Api.ITransporterFactory {
	public makeTransporter(surveyType: string): Api.ITransporter {
		return new Transporter(
			Configuration.get().getCommonInitOptions().environment,
			surveyType,
			Configuration.get().getCommonInitOptions().appId,
			"Survey",
			Configuration.get().getCommonInitOptions().applicationGroup,
			Configuration.get().getCommonInitOptions().telemetryGroup,
			Configuration.get().getCommonInitOptions().webGroup,
		);
	}
}
