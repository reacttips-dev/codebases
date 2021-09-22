import { Api } from "@ms-ofb/officefloodgatecore";
import { FileType } from "@ms-ofb/officefloodgatecore/dist/src/Api/IFloodgateStorageProvider";
import { IAugLoopCallback } from "@ms-ofb/officefloodgatecore/dist/src/Api/IAugLoopCallback";
import { IFloodgateAuthTokenCallback } from "@ms-ofb/officefloodgatecore/dist/src/Api/IFloodgateAuthTokenCallback";
import { MessageSpec } from "@ms-ofb/officefloodgatecore/dist/src/Governance/MessageMetadata";

import { TargetedMessagingTransport } from "./TargetedMessagingTransport";
import { ContentType } from "./TargetedMessagingContentType";
import { buildQueryParameters, IQueryParams } from "../Common/UrlUtils";
import { TargetedMessagingCache } from "./TargetedMessagingCache";

import * as Constants from "../Constants";
import * as Logging from "../Logging/Logging";
import * as TmsgConstants from "./TargetedMessagingConstants";

import { getDynamicSetting, SettingKey } from "../Configuration/DynamicConfiguration";
import FloodgateStorageProvider from "../FloodgateCore/FloodgateStorageProvider";
import { TMS_SERVICE_ACTION_URL } from "./TargetedMessagingConstants";
import { IBeaconParameters } from "../FloodgateCore/CoachingUXLauncherFactory";

import { getAugLoopAnnotationData, IAugLoopResponse } from "./AugLoopHelper";
import { ISession } from "@augloop/runtime-client";

export class ContentResponse {
	public contentType: ContentType;
	public content: any;
}

interface ITmsServiceResponse {
	MessageMetadata: MessageSpec;
	UserGovernanceRules: any;
	CampaignContent: any;
	DynamicSettings: any;
	LogLevelSettings: ILogLevelSettings;
}

interface IUserFactsAugLoopResponse {
	puid: string;
	userFacts: Api.IUserFact[];
}

interface ILogLevelSettings {
	logLevel: Logging.LogLevel;
}

interface IDebugOverrides {
	addTmsQueryParams?: Record<string, string>;
	replaceTmsQueryParams?: Record<string, string>;
	tmsResponse?: ITmsServiceResponse;
	userFactsResponse?: ITmsServiceResponse;
}

export function getDebugCampaignDefinitions(): ContentResponse {
	const debugOverrides = FloodgateStorageProvider.safeReadObject<IDebugOverrides>(FileType.DebugOverrides, {});
	return debugOverrides && debugOverrides.tmsResponse && debugOverrides.tmsResponse.CampaignContent && {
		contentType: ContentType.campaignContent,
		content: debugOverrides.tmsResponse.CampaignContent,
	};
}

export function getDebugUserFacts(): ContentResponse {
	const debugOverrides = FloodgateStorageProvider.safeReadObject<IDebugOverrides>(FileType.DebugOverrides, {});
	return debugOverrides && debugOverrides.userFactsResponse && {
		contentType: ContentType.userFacts,
		content: debugOverrides.userFactsResponse,
	};
}

export class TargetedMessagingClient {
	private locale: string = "en-us";
	private country: string = "US";
	private authTokenCallback: IFloodgateAuthTokenCallback;
	private augLoopCallback: IAugLoopCallback<ISession>;
	private app: string;
	private platform: string;
	private version: string;
	private sessionId: string;
	private campaignFlights: string;
	private campaignParameters: string;

	private tmsgCache: TargetedMessagingCache;
	private tmsgTransport: TargetedMessagingTransport;

	constructor(
		app: string,
		platform: string,
		version: string,
		locale: string,
		country: string,
		sessionId: string,
		authTokenCallback: IFloodgateAuthTokenCallback,
		augLoopCallback: IAugLoopCallback<ISession>,
		campaignFlights?: string,
		campaignParameters?: string,
		tmsgCacheIn?: TargetedMessagingCache) {
		this.locale = locale;
		this.country = country;
		this.authTokenCallback = authTokenCallback;
		this.augLoopCallback = augLoopCallback;
		this.app = app;
		this.platform = platform;
		this.version = version;
		this.sessionId = sessionId;
		this.campaignFlights = campaignFlights;
		this.campaignParameters = campaignParameters;

		this.tmsgCache = this.tmsgCache || tmsgCacheIn || new TargetedMessagingCache([
			ContentType.messageMetadata,
			ContentType.userGovernanceRules,
			ContentType.campaignContent,
			ContentType.dynamicSettings,
			ContentType.logLevelSettings,
			ContentType.userFacts,
		]);
	}

	public async getContent(
		requestedContent: ContentType): Promise<ContentResponse> {
		await this.refreshItemsInCacheFromTmsService([requestedContent]);
		const response: ContentResponse = this.retrieveCacheItemAndCreateContentResponse(requestedContent);
		return response;
	}

	public async getMultipleContents(
		requestedContent: Array<ContentType>): Promise<ContentResponse[]> {
		await this.refreshItemsInCacheFromTmsService(requestedContent);

		const contentResponses: ContentResponse[] = new Array<ContentResponse>();
		const bulkRefreshList: ContentType[] = new Array<ContentType>();
		for (let contentType of requestedContent) {
			const responseItem = this.createCachedContentResponse(contentType);
			contentResponses.push(responseItem);
		}

		this.refreshItemsInCacheFromTmsService(bulkRefreshList);

		return contentResponses;
	}

	public async getUserFactsContent(
		requestedContent: ContentType): Promise<ContentResponse> {
		await this.refreshItemsInCacheFromTulipsService(requestedContent);
		const response: ContentResponse = this.retrieveCacheItemAndCreateContentResponse(requestedContent);
		return response;
	}

	public async sendBeaconRequestToService(
		app: string,
		beaconParameters: IBeaconParameters,
		platform: string,
		version: string,
		locale: string,
		country: string,
		sessionId: string,
		authTokenCallback: IFloodgateAuthTokenCallback
		): Promise<boolean> {
		this.sessionId = sessionId;
		this.authTokenCallback = authTokenCallback;

		const tmsAppId = getDynamicSetting(SettingKey.tmsAppId, Constants.GUIDs.TMSAppID);
		const authToken = await this.getAuthToken(tmsAppId);
		let puid: string = undefined;
		if (!authToken) {
			puid = this.authTokenCallback.getUserPuid && await this.authTokenCallback.getUserPuid();
		}

		const requestStartTime = +new Date();
		try {
			const tmsQueryParams: IQueryParams = {
				app,
				country,
				locale,
				platform,
				puid,
				version,
			};

			const requestBody = JSON.stringify({
				actionName: beaconParameters.actionName,
				actionUrl: beaconParameters.actionUrl,
			});

			const response: Response = await this.sendRequest(
				tmsQueryParams,
				authToken,
				SettingKey.tmsActionUrl,
				TMS_SERVICE_ACTION_URL,
				requestBody,
				"POST");

			if (!response || response.status !== 200) {
				Logging.getLogger().logEvent(
					Logging.EventIds.WebSurfaces.Common.Error.VALUE,
					Logging.LogLevel.Error,
					this.createTelemetryData(requestStartTime, response, `Beacon${beaconParameters.actionName}`));
				return false;
			}
			return true;
		} catch (error) {
			Logging.getLogger().logEvent(
				Logging.EventIds.WebSurfaces.Common.Error.VALUE,
				Logging.LogLevel.Error,
				{
					ErrorMessage:
						"Error fetching from TMS SetCampaignAction endpoint" + (error && error.message ? ": " + error.message : ""),
					...this.createTelemetryData(requestStartTime, null, `Beacon${beaconParameters.actionName}`),
				});
			return false;
		}
	}

	public async getAugLoopUserFactsContent(requestedContent: ContentType): Promise<ContentResponse> {
		if (!this.tmsgCache.getItemContent(ContentType.userFacts)) {
			await this.refreshUserFactsInCacheFromAugLoop();
		}

		if (this.tmsgCache.isItemExpired(ContentType.userFacts)) {
			this.refreshUserFactsInCacheFromAugLoop();
		}

		const response: ContentResponse = this.retrieveCacheItemAndCreateContentResponse(requestedContent);
		return response;
	}

	private async refreshUserFactsInCacheFromAugLoop(): Promise<Api.IUserFact[]> {
		if (!this.tmsgCache.isItemExpired(ContentType.userFacts)) {
			const cachedUserFacts = this.tmsgCache.getItemContent(ContentType.userFacts) as Api.IUserFact[];
			Logging.getLogger().logEvent(
				Logging.EventIds.UserFacts.AugLoop.Requests.VALUE,
				Logging.LogLevel.Info,
				{
					Count: cachedUserFacts ? cachedUserFacts.length : -1,
					Type: "AugLoopUserFactsCached",
					Flights: this.campaignFlights,
				});

			return cachedUserFacts;
		}

		const requestStartTime = +new Date();
		let userFacts: Api.IUserFact[];
		try {
			const annotationName = getDynamicSetting(SettingKey.tulipsAugLoopAnnotationName, "AugLoop_User_UserLifecycleFactsAnnotation");
			const augLoopSessionPromise = this.augLoopCallback.getRuntimeSession;
			const response = await getAugLoopAnnotationData(annotationName, augLoopSessionPromise) as IUserFactsAugLoopResponse;
			if (response && response.userFacts) {
				userFacts = this.addClientIngestionTimeAndNormalizeKeysInArray(response.userFacts);
				this.tmsgCache.setContentItem(
						ContentType.userFacts,
						userFacts,
						TmsgConstants.CACHE_EXPIRY_USERFACTS);

				Logging.getLogger().logEvent(
					Logging.EventIds.UserFacts.AugLoop.Requests.VALUE,
					Logging.LogLevel.Info,
					{
						Count: userFacts ? userFacts.length : -1,
						...this.createTelemetryData(requestStartTime, null, "AugLoopUserFacts"),
					});
			} else {
				const augLoopError = response && (response as IAugLoopResponse).error;
				Logging.getLogger().logEvent(
					Logging.EventIds.UserFacts.AugLoop.Error.VALUE,
					Logging.LogLevel.Error,
					{
						ErrorMessage: "Error getting augloop facts " + (augLoopError && augLoopError.toString()),
						...this.createTelemetryData(requestStartTime, null, "AugLoopUserFacts"),
					});
				}
		} catch (error) {
			Logging.getLogger().logEvent(
				Logging.EventIds.UserFacts.AugLoop.Error.VALUE,
				Logging.LogLevel.Error,
				{
					ErrorMessage: "Error getting facts " + (error && error.message),
					...this.createTelemetryData(requestStartTime, null, "AugLoopUserFacts"),
				});
		}

		return userFacts;
	}

	private createTelemetryData(requestStartTimestamp: number, response: Response, type: string): Logging.ICustomProperties {
		const { headers, status, statusText } = response || {} as Response;
		const serverSessionId = headers && headers.get("X-UserSessionId");
		const serverCorrelationId = headers && headers.get("X-CorrelationId");
		return {
			Type: type,
			TimeMilliseconds: +new Date() - requestStartTimestamp,
			SessionId: serverSessionId || this.sessionId,
			CorrelationId: serverCorrelationId || undefined,
			HttpStatusCode: status || undefined,
			HttpStatusText: statusText || undefined,

			Flights: this.campaignFlights,
		};
	}

	private sendRequest(
		tmsgQueryParams: IQueryParams,
		authToken: string,
		key: SettingKey,
		serviceUrl: string,
		requestBody?: string,
		verb?: string): Promise<Response> {
		this.tmsgTransport = this.tmsgTransport || new TargetedMessagingTransport(this.sessionId);
		const queryParamStr = buildQueryParameters(tmsgQueryParams);
		const tmsgBaseUrl = getDynamicSetting(key, serviceUrl);
		const requestPromise = verb === "POST" ?
			this.tmsgTransport.sendPostRequest(tmsgBaseUrl + queryParamStr, requestBody, authToken) :
			this.tmsgTransport.sendGetRequest(tmsgBaseUrl + queryParamStr, authToken);
		return requestPromise;
	}

	private retrieveCacheItemAndCreateContentResponse(contentType: ContentType): ContentResponse {
		const responseItem: ContentResponse = this.createCachedContentResponse(contentType);
		if (this.tmsgCache.isItemExpired(contentType)) {
			if (contentType === ContentType.userFacts) {
				this.refreshItemsInCacheFromTulipsService(contentType);
			} else {
				this.refreshItemsInCacheFromTmsService([contentType]);
			}
		}
		return responseItem;
	}

	private createCachedContentResponse(requestedContent: ContentType): ContentResponse {
		const contentResponse: ContentResponse = new ContentResponse();
		contentResponse.content = this.tmsgCache.getItemContent(requestedContent);
		contentResponse.contentType = requestedContent;

		return contentResponse;
	}

	private async getAuthToken(appIdOrUri: string): Promise<string> {
		if (!this.authTokenCallback || !this.authTokenCallback.getAuthToken) {
			return null;
		}

		const startTime = +new Date();
		const getDuration = () => +new Date() - startTime;
		const createAuthTelemetryData = (errorMessage: string = undefined): Logging.ICustomProperties => {
			return {
				ErrorMessage: errorMessage,
				SessionId: this.sessionId,
				TimeMilliseconds: getDuration(),
				Type: appIdOrUri,
			};
		};

		try {
			const retVal = await this.authTokenCallback.getAuthToken(appIdOrUri);
			Logging.getLogger().logEvent(
				Logging.EventIds.WebSurfaces.Common.Info.VALUE,
				Logging.LogLevel.Info,
				createAuthTelemetryData());

			return retVal;
		} catch (error) {
			Logging.getLogger().logEvent(
				Logging.EventIds.WebSurfaces.Common.Error.VALUE,
				Logging.LogLevel.Error,
				createAuthTelemetryData("Error getting token " + (error && error.message ? ": " + error.message : "")));
		}

		return null;
	}

	private async refreshItemsInCacheFromTmsService(contentTypes: Array<ContentType>): Promise<void> {
		if (contentTypes.length === 0) {
			return;
		}

		// check if touched items are actually due for refresh or are still valid
		const bulkRefreshList: ContentType[] = new Array<ContentType>();
		for (let contentType of contentTypes) {
			if (this.tmsgCache.isItemExpired(contentType)) {
				bulkRefreshList.push(contentType);
			}
		}

		if (bulkRefreshList.length === 0) {
			// exit out if all items in cache are still valid to avoid unnecessary service roundtrips 
			return;
		}

		const tmsAppId = getDynamicSetting(SettingKey.tmsAppId, Constants.GUIDs.TMSAppID);
		const authToken = await this.getAuthToken(tmsAppId);
		let userPuid: string = undefined;
		if (!authToken) {
			userPuid = this.authTokenCallback.getUserPuid && await this.authTokenCallback.getUserPuid();
		}

		const requestStartTime = +new Date();

		// make service call for expired or uncached items
		try {
			// capture browser data to perform additional filters on IRIS
			// this is to avoid showing bad UI experience on unsupported browsers/dimensions
			const documentElement = document && (document.documentElement || document.getElementsByTagName("body")[0]);
			const browserParams: IQueryParams = {
				pageWidth: window.innerWidth || documentElement.clientWidth,
				pageHeight: window.innerHeight || documentElement.clientHeight,
				screenWidth: screen ? screen.width : undefined,
				screenHeight: screen ? screen.height : undefined,
				colorDepth: screen ? screen.colorDepth : undefined,
			};

			// allow testing with query param overrides with key obf-DebugOverrides
			// eg: {"addTmsQueryParams":{"key1":"key1value"},"replaceTmsQueryParams":{"key2":"key2value"}, "tmsResponse": {}}
			const debugOverrides = FloodgateStorageProvider.safeReadObject<IDebugOverrides>(FileType.DebugOverrides, {});
			const tmsQueryParams: IQueryParams = debugOverrides.replaceTmsQueryParams || {
				country: this.country,
				locale: this.locale,
				app: this.app,
				platform: this.platform,
				version: this.version,
				campaignParams: buildQueryParameters(browserParams) + "&more=true&" + (this.campaignParameters || ""),
				contentType: contentTypes.join(";"),
				puid: userPuid,
				OFC_FLIGHTS: this.campaignFlights,
				...(debugOverrides.addTmsQueryParams || {}),
			};

			const response: Response = await this.sendRequest(
				tmsQueryParams,
				authToken,
				SettingKey.tmsServiceUrl,
				TmsgConstants.TMS_SERVICEURL);
			if (response.status === 200) {
				const tmsServiceResponse: ITmsServiceResponse = await response.json();

				if (contentTypes.indexOf(ContentType.messageMetadata) !== -1
					&& tmsServiceResponse.MessageMetadata !== undefined) {
					this.tmsgCache.setContentItem(
							ContentType.messageMetadata,
							tmsServiceResponse.MessageMetadata,
							getDynamicSetting(SettingKey.tmsMessageMetadataExpiry, TmsgConstants.CACHE_EXPIRY_MESSAGEMETADATA));
				}

				if (contentTypes.indexOf(ContentType.userGovernanceRules) !== -1
					&& tmsServiceResponse.UserGovernanceRules !== undefined) {
					this.tmsgCache.setContentItem(
							ContentType.userGovernanceRules,
							tmsServiceResponse.UserGovernanceRules,
							getDynamicSetting(SettingKey.tmsUserGovernanceRulesExpiry, TmsgConstants.CACHE_EXPIRY_USERGOVERNANCERULES));
				}

				if (contentTypes.indexOf(ContentType.campaignContent) !== -1
					&& tmsServiceResponse.CampaignContent !== undefined) {
					this.tmsgCache.setContentItem(
							ContentType.campaignContent,
							tmsServiceResponse.CampaignContent,
							getDynamicSetting(SettingKey.tmsCampaignContentExpiry, TmsgConstants.CACHE_EXPIRY_CAMPAIGNCONTENT));
				}

				// There is no explicit request for the next set of ContentTypes in the code
				// If the server responds with these types save and use them later
				if (tmsServiceResponse.DynamicSettings !== undefined) {
					this.tmsgCache.setContentItem(
							ContentType.dynamicSettings,
							tmsServiceResponse.DynamicSettings,
							getDynamicSetting(SettingKey.tmsDynamicSettingsExpiry, TmsgConstants.CACHE_EXPIRY_DYNAMICSETTINGS));
				}

				if (tmsServiceResponse.LogLevelSettings !== undefined) {
					this.tmsgCache.setContentItem(
							ContentType.logLevelSettings,
							tmsServiceResponse.LogLevelSettings,
							getDynamicSetting(SettingKey.tmsLogLevelSettingsExpiry, TmsgConstants.CACHE_EXPIRY_LOGLEVELSETTINGS));
				}

				Logging.getLogger().logEvent(
					Logging.EventIds.WebSurfaces.Messaging.Requests.VALUE,
					Logging.LogLevel.Info,
					this.createTelemetryData(requestStartTime, response, contentTypes.join(";")));
			} else {
				Logging.getLogger().logEvent(
					Logging.EventIds.WebSurfaces.Common.Error.VALUE,
					Logging.LogLevel.Error,
					this.createTelemetryData(requestStartTime, response, contentTypes.join(";")));
			}
		} catch (error) {
			Logging.getLogger().logEvent(
				Logging.EventIds.WebSurfaces.Common.Error.VALUE,
				Logging.LogLevel.Error,
				{
					ErrorMessage: "Error fetching from TMS" + (error && error.message ? ": " + error.message : ""),
					...this.createTelemetryData(requestStartTime, null, contentTypes.join(";")),
				});
		}
	}

	private async refreshItemsInCacheFromTulipsService(contentType: ContentType): Promise<void> {
		// check if touched item is actually due for refresh or is still valid
		if (!this.tmsgCache.isItemExpired(contentType)) {
			// exit out if the cache is still valid to avoid unnecessary service roundtrips
			return;
		}

		const tulipsAppId = getDynamicSetting(SettingKey.tulipsAppId, Constants.GUIDs.TULIPSAppID);
		const authToken = await this.getAuthToken(tulipsAppId);
		if (!authToken) {
			// if authToken is null then exit out since service call cannot be made without authToken
			return;
		}

		const requestStartTime = +new Date();

		// make service call for expired or uncached item
		try {
			const response: Response = await this.sendRequest(
				{},
				authToken,
				SettingKey.tulipsServiceUrl,
				TmsgConstants.TULIPS_SERVICEURL);
			if (response.status === 200 || response.status === 204) {
				const tulipsServiceResponse = await response.json();

				if (contentType.indexOf(ContentType.userFacts) !== -1
					&& tulipsServiceResponse !== undefined) {
					const normalizedUserFacts = this.addClientIngestionTimeAndNormalizeKeys(tulipsServiceResponse);
					this.tmsgCache.setContentItem(
							ContentType.userFacts,
							normalizedUserFacts,
							TmsgConstants.CACHE_EXPIRY_USERFACTS);
				}

				Logging.getLogger().logEvent(
					Logging.EventIds.UserFacts.Messaging.Requests.VALUE,
					Logging.LogLevel.Info,
					this.createTelemetryData(requestStartTime, response, contentType));
			} else {
				Logging.getLogger().logEvent(
					Logging.EventIds.UserFacts.Common.Error.VALUE,
					Logging.LogLevel.Error,
					this.createTelemetryData(requestStartTime, response, contentType));
			}
		} catch (error) {
			Logging.getLogger().logEvent(
				Logging.EventIds.UserFacts.Common.Error.VALUE,
				Logging.LogLevel.Error,
				{
					ErrorMessage: "Error fetching from TULIPS" + (error && error.message ? ": " + error.message : ""),
					...this.createTelemetryData(requestStartTime, null, contentType),
				});
		}
	}

	private addClientIngestionTimeAndNormalizeKeys(tulipsServiceResponse: Record<string, string>[]): Api.IUserFact[] {
		const currentDateTime = new Date(Date.now()).toISOString();

		return tulipsServiceResponse.map(responseFact => {
			const fact = this.normalizeKeys(responseFact);
			fact.clientIngestionDateTime = currentDateTime;
			return fact;
		});
	}

	private addClientIngestionTimeAndNormalizeKeysInArray(userFacts: Api.IUserFact[]): Api.IUserFact[] {
		const currentDateTime = new Date(Date.now()).toISOString();

		return userFacts.map(userFact => {
			const fact = this.normalizeKeys(userFact as unknown as Record<string, string>);
			fact.clientIngestionDateTime = currentDateTime;
			return fact;
		});
	}

	/**
	 * This method normalizes the keys of the user fact object retrieved from the TULIPS service.
	 * Specifically it converts the first letter of each key in the object to lower case.
	 * For example the key "UserFactType" returned from the service will be converted to "userFactType".
	 * @param userFact the user fact object
	 */
	private normalizeKeys(userFact: Record<string, string>) {
		const normalizedUserFact = {} as Api.IUserFact;
		for (const key of Object.keys(userFact)) {
			const normalizedKey = (key.charAt(0).toLowerCase() + key.substring(1)) as keyof Api.IUserFact;
			normalizedUserFact[normalizedKey] = userFact[key];
		}

		return normalizedUserFact;
	}
}
