/**
 * Implementation for IFloodgateEnvironmentProvider for web SDK.
 * We pass the SDK's internal locale here and not the one which the host app specifies.
 */

import * as Api from "@ms-ofb/officefloodgatecore/dist/src/Api/Api";
import * as Configuration from "./../Configuration/Configuration";

export default class FloodgateEnvironmentProvider implements Api.IFloodgateEnvironmentProvider {
	public getLanguage(): string {
		return Configuration.get().getCommonInitOptions().originalLocale;
	}
}
