/**
 * TargetedMessagingProvider.ts
 *
 * Module for targeted messaging campaign definition provider.
 */

import { Api } from "@ms-ofb/officefloodgatecore";
import { CampaignDefinitions } from "@ms-ofb/officefloodgatecore/dist/src/Governance/CampaignDefinitions";
import { FilterValidCampaignDefinitions } from
	"@ms-ofb/officefloodgatecore/dist/src/Campaign/CampaignDefinitionProvider";
import { getDynamicSetting, SettingKey } from "../Configuration/DynamicConfiguration";
import { TMS_CAMPAIGN_LOAD_TIMEOUT } from "./TargetedMessagingConstants";
import { createTimeoutPromise } from "../Utils";

import * as AssetsProvider from "./AssetsProvider";

export class TargetedMessagingCampaignDefinitionProvider implements Api.ICampaignDefinitionProvider {
	private loadAsyncTriggered: boolean = false;
	private campaignDefinitions: Api.CampaignDefinition[] = [];

	public load(): Api.CampaignDefinition[] {
		if (!this.loadAsyncTriggered) {
			this.loadAsync();
			this.loadAsyncTriggered = true;
		}

		return this.campaignDefinitions || [];
	}

	public loadAsync(): Promise<Api.CampaignDefinition[]> {
		const thisObj = this;
		const campaignDefinitionsPromise = AssetsProvider.get().getCampaignDefinitions();
		campaignDefinitionsPromise.then((response) => {
			thisObj.loadCampaignDefinitions(response);
			thisObj.loadAsyncTriggered = true;
		});

		const timeoutMilliseconds = getDynamicSetting(SettingKey.tmsLoadTimeout, TMS_CAMPAIGN_LOAD_TIMEOUT);
		const timeoutPromise = createTimeoutPromise(timeoutMilliseconds, campaignDefinitionsPromise);
		return new Promise((resolve, reject) => {
			timeoutPromise.then(
				function onFulfilled(response) {
					thisObj.loadCampaignDefinitions(response);
					thisObj.loadAsyncTriggered = true;
					resolve(thisObj.campaignDefinitions);
				}
			).catch(
				// might have timed out or getCampaignDefinitions might have failed
				// In either case we log and return resolve
				function onRejected(error) {
					resolve(thisObj.campaignDefinitions);
				}
			);
		});
	}

	private loadCampaignDefinitions(response: CampaignDefinitions) {
		const definitions = response && response.campaigns;
		if (definitions) {
			this.campaignDefinitions = FilterValidCampaignDefinitions(definitions).result;
		}
	}
}
