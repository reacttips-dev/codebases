/**
 * UserFactsProvider.ts
 *
 * Module for user facts provider.
 */

import { Api } from "@ms-ofb/officefloodgatecore";
import { getDynamicSetting, SettingKey } from "../Configuration/DynamicConfiguration";
import { TULIPS_INGESTION_TIME, TULIPS_LOAD_TIMEOUT } from "./TargetedMessagingConstants";

import * as AssetsProvider from "./AssetsProvider";
import * as Logging from "../Logging/Logging";

import { createTimeoutPromise } from "../Utils";

export class UserFactsProvider implements Api.IUserFactProvider {
	private loadAsyncTriggered: boolean = false;
	private userFacts: Api.IUserFact[] = [];
	private nameAndUserFactMap: Record<string, Api.IUserFact> = {};

	public load(): Api.IUserFact[] {
		if (!this.loadAsyncTriggered) {
			this.loadAsync();
			this.loadAsyncTriggered = true;
		}

		return this.userFacts || [];
	}

	public loadAsync(): Promise<Api.IUserFact[]> {
		const userFactsPromise = AssetsProvider.get().getUserFacts().then(userFacts => {
			this.loadUserFacts(userFacts);
		});

		const timeoutMilliseconds = getDynamicSetting(SettingKey.tulipsLoadTimeout, TULIPS_LOAD_TIMEOUT);
		const timeoutPromise = createTimeoutPromise(timeoutMilliseconds, userFactsPromise);
		return timeoutPromise.then(() => this.userFacts).catch(() => this.userFacts);
	}

	public getUserFact(userFactName: string) {
		return this.nameAndUserFactMap[userFactName];
	}

	private loadUserFacts(response: Api.IUserFact[]) {
		if (response) {
			this.userFacts = response || [];
			this.userFacts.map((userFact) => {
				this.nameAndUserFactMap[userFact.userFactName] = userFact;
			});
			this.loadAsyncTriggered = true;
			this.logUserFactInfo(this.userFacts);
		}
	}

	private logUserFactInfo(userFacts: Api.IUserFact[]) {
		if (!userFacts || userFacts.length <= 0) {
			return;
		}

		const tulipsIngestionTimeInterval = getDynamicSetting(SettingKey.tulipsIngestionTimeInterval, TULIPS_INGESTION_TIME);
		if (tulipsIngestionTimeInterval <= 0) {
			return;
		}

		let userFactProperties: Logging.ICustomProperties;
		try {
			const nowDate = Date.now();
			const isExpired = (rawItemDate: string): boolean => {
				const itemDate = Date.parse(rawItemDate);
				return !isNaN(itemDate) ? nowDate - itemDate > tulipsIngestionTimeInterval : true;
			};

			const factInfo = {
				Count: userFacts.length,
				RefreshTime: tulipsIngestionTimeInterval,
				IngestionTime: userFacts[0].clientIngestionDateTime,
				SourcesExpired: userFacts.filter(userFact => userFact && isExpired(userFact.sourceDateTime)).length || undefined,
				StoragesExpired: userFacts.filter(userFact => userFact && isExpired(userFact.storageDateTime)).length || undefined,
				IngestionsExpired: userFacts.filter(userFact => userFact && isExpired(userFact.clientIngestionDateTime)).length || undefined,
			};

			userFactProperties = {
				Message: "UserFacts",
				Data: JSON.stringify(factInfo),
			};
		} catch (error) {
			userFactProperties = {
				ErrorMessage: "Error getting UserFact info",
			};
		}

		Logging.getLogger().logEvent(
			Logging.EventIds.UserFacts.Provider.Info.VALUE,
			Logging.LogLevel.Info,
			userFactProperties);
	}
}
