/**
 * Module that provides campaign definitions,
 * governance rules & message metadata from
 * targeted messaging service.
 */

import { Api } from "@ms-ofb/officefloodgatecore";
import { CampaignDefinitions } from "@ms-ofb/officefloodgatecore/dist/src/Governance/CampaignDefinitions";
import { MessageSpec } from "@ms-ofb/officefloodgatecore/dist/src/Governance/MessageMetadata";
import { UserGovernanceRules } from "@ms-ofb/officefloodgatecore/dist/src/Governance/UserGovernanceRules";

import * as Configuration from "../Configuration/Configuration";
import { getDynamicSetting, SettingKey } from "../Configuration/DynamicConfiguration";
import { TULIPS_LOAD_TIMEOUT } from "./TargetedMessagingConstants";
import { ContentType } from "./TargetedMessagingContentType";
import { TargetedMessagingClient, ContentResponse, getDebugCampaignDefinitions } from "./TargetedMessagingClient";

import { createTimeoutPromise } from "../Utils";
import { IBeaconParameters } from "../FloodgateCore/CoachingUXLauncherFactory";

export class AssetsProvider implements Api.IAssetsProvider {
	private configuration: Configuration.Configuration;
	private tmsgClient: TargetedMessagingClient;

	public constructor() {
		this.configuration = Configuration.get();

		// Enable TargetedMessaging client only if authCallback is provided
		// This is for cases where existing Floodgate hosts are not yet on-boarded into web surfaces flow
		const floodgateInitOptions = this.configuration && this.configuration.getFloodgateInitOptions();
		const authTokenCallback = floodgateInitOptions && floodgateInitOptions.authTokenCallback;
		if ((authTokenCallback && (authTokenCallback.getAuthToken || authTokenCallback.getUserPuid)) ||
			this.isAugLoopEnabled()) {
			const initOptions = this.configuration.getCommonInitOptions();
			this.tmsgClient = new TargetedMessagingClient(
				initOptions.appId.toString(),
				"Web" /*platform*/,
				initOptions.build,
				initOptions.originalLocale,
				this.extractCountryFromLocale(initOptions.originalLocale),
				this.configuration.getSdkSessionId(),
				floodgateInitOptions.authTokenCallback,
				floodgateInitOptions.augLoopCallback,
				floodgateInitOptions.campaignFlights,
				floodgateInitOptions.campaignQueryParameters);
		}
	}

	/**
	 * Get campaign definitions from TMS
	 */
	public getCampaignDefinitions(): Promise<CampaignDefinitions> {
		const debugResponse = getDebugCampaignDefinitions();
		if (debugResponse && debugResponse.content) {
			return Promise.resolve(debugResponse.content);
		}

		if (!this.tmsgClient) {
			return Promise.resolve(null);
		}

		return this.tmsgClient.getContent(ContentType.campaignContent)
			.then(({ content }: ContentResponse) => content);
	}

	public getUserGovernanceRules(): Promise<UserGovernanceRules> {
		if (!this.tmsgClient) {
			return Promise.resolve(null);
		}

		return this.tmsgClient.getContent(ContentType.userGovernanceRules)
			.then(({ content }: ContentResponse) => content);
	}

	public getMessageMetadata(): Promise<MessageSpec> {
		if (!this.tmsgClient) {
			return Promise.resolve(null);
		}

		return this.tmsgClient.getContent(ContentType.messageMetadata)
			.then(({ content }: ContentResponse) => content);
	}

	/**
	 * Get TULIPS user facts from AugLoop or GWS endpoint
	 */
	public getUserFacts(): Promise<Api.IUserFact[]> {
		const debugResponse = getDebugCampaignDefinitions();
		if (debugResponse && debugResponse.content) {
			return Promise.resolve(debugResponse.content);
		}

		if (!this.tmsgClient) {
			return Promise.resolve(null);
		}

		// Try to get facts from AL first
		if (this.isAugLoopEnabled()) {
			const timeoutMilliseconds = getDynamicSetting(SettingKey.tulipsLoadTimeout, TULIPS_LOAD_TIMEOUT);
			const timeoutPromise = createTimeoutPromise(timeoutMilliseconds, this.getAugLoopUserFacts());
			return timeoutPromise
				.then(userFacts => userFacts)
				.catch(() => this.getSubstrateUserFacts());
		}

		return this.getSubstrateUserFacts();
	}

	public setCampaignAction(beaconParameters: IBeaconParameters): Promise<boolean> {
		if (!this.tmsgClient) {
			return;
		}

		const initOptions = this.configuration.getCommonInitOptions();
		const floodgateInitOptions = this.configuration.getFloodgateInitOptions();
		return this.tmsgClient.sendBeaconRequestToService(
			initOptions.appId.toString(),
			beaconParameters,
			"Web" /*platform*/,
			initOptions.build,
			initOptions.originalLocale,
			this.extractCountryFromLocale(initOptions.originalLocale),
			this.configuration.getSdkSessionId(),
			floodgateInitOptions.authTokenCallback);
	}

	// Floodgate doesn't have country, so we have to use locale as a proxy and extract the country code
	private extractCountryFromLocale(locale?: string): string {
		if (!locale) {
			return undefined;
		}

		const splitLocale = locale.split("-");
		if (splitLocale.length === 2) {
			return splitLocale[1];
		} else {
			return undefined;
		}
	}

	private getSubstrateUserFacts(): Promise<Api.IUserFact[]> {
		if (!this.tmsgClient) {
			return Promise.resolve(null);
		}

		return this.tmsgClient.getUserFactsContent(ContentType.userFacts)
			.then(({ content }: ContentResponse) => content);
	}

	private getAugLoopUserFacts(): Promise<Api.IUserFact[]> {
		if (!this.tmsgClient) {
			return Promise.resolve(null);
		}

		return this.tmsgClient.getAugLoopUserFactsContent(ContentType.userFacts)
			.then(({ content }: ContentResponse) => content);
	}

	private isAugLoopEnabled(): boolean {
		return this.configuration?.getFloodgateInitOptions()?.augLoopCallback?.isEnabled;
	}
}

let assetsProvider: AssetsProvider;

export function get() {
	if (!assetsProvider) {
		assetsProvider = new AssetsProvider();
	}

	return assetsProvider;
}
