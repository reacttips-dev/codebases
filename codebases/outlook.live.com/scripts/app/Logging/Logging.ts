import { IInitOptionsCommon, ISamplingInitOption } from "./../Configuration/IInitOptions";
import { IEventId, ICustomProperties } from "./Constants";
import { Environment } from "./../Constants";
import { App, Browser, Device, Host, Release, Session, User } from "./Telemetry/Contracts";
import * as Utils from "./../Utils";
import ITelemetryLogger from "./Telemetry/ITelemetryLogger";
import TelemetryLoggerFactory from "./Telemetry/TelemetryLoggerFactory";
import FloodgateStorageProvider from "../FloodgateCore/FloodgateStorageProvider";
import { FileType } from "@ms-ofb/officefloodgatecore/dist/src/Api/IFloodgateStorageProvider";

export { ICustomProperties, IEventId, EventIds } from "./Constants";
import { getDynamicSetting, SettingKey } from "../Configuration/DynamicConfiguration";

const { isNOU } = Utils;
const NAMESPACE: string = "Office_Feedback";

let logger: ILogger;
let env: Environment;

/**
 * Initialize the logging module
 * @param initOptionsCommon object contains common init options
 * @param appName app name
 * @param appVersion app version
 * @param logSessionId local SDK session id
 */
export function initialize(initOptionsCommon: IInitOptionsCommon, appName: string, appVersion: string,
	logSessionId: string, samplingOption: ISamplingInitOption): void {

	const telemetryGroup = initOptionsCommon.telemetryGroup ? initOptionsCommon.telemetryGroup : {};
	const webGroup = initOptionsCommon.webGroup ? initOptionsCommon.webGroup : {};

	logger = new Logger(
		TelemetryLoggerFactory.create(
			TokenManager.getTenantToken(initOptionsCommon.environment),
			NAMESPACE,
			new App(appName, appVersion),
			new Session(logSessionId),
			new Host(initOptionsCommon.appId.toString(), initOptionsCommon.originalLocale, initOptionsCommon.sessionId, initOptionsCommon.build),
			new Release(telemetryGroup.audienceGroup),
			new Browser(webGroup.browser, webGroup.browserVersion),
			new Device(telemetryGroup.deviceId),
			new User(telemetryGroup.loggableUserId ? telemetryGroup.loggableUserId : initOptionsCommon.cid, telemetryGroup.tenantId)
		),
		samplingOption,
		initOptionsCommon
	);

	env = initOptionsCommon.environment;
}

/**
 * Get the logger object
 */
export function getLogger(): ILogger {
	return logger;
}

/**
 * Interface for a logger
 */
export interface ILogger {
	logEvent(eventId: IEventId, logSeverity: LogLevel, customProperties?: ICustomProperties, sampleRate?: number): void;
	logLocal?(logSeverity: LogLevel, ...others: any[]): void;
}

/**
 * Log level settings
 */
export const enum LogLevel {
	None,
	Critical,
	Error,
	Info
}

interface ILogSettings {
	consoleLog?: boolean;
	isEnabled?: boolean;
	logLevel?: LogLevel;
};

interface ILogLevelSettings {
	content: ILogSettings;
};

/**
 * Class representing a logger for the feedback SDK
 */
export class Logger implements ILogger {
	private static EVENT_NAME: string = "SDK";
	private static EVENT_ID: string = "EventId";

	private telemetryLogger: ITelemetryLogger;
	private logLevel: LogLevel;
	private isConsoleLogEnabled: boolean;
	private dynamicLogSettings: ILogLevelSettings;

	private eventSampling: ISamplingInitOption;
	private initOptionsCommon: IInitOptionsCommon;

	private readonly SAMPLING_RESULT = Math.random();

	constructor(telemetryLogger: ITelemetryLogger, samplingOptions: ISamplingInitOption, initOptionsCommon?: IInitOptionsCommon) {
		if (!telemetryLogger) {
			throw new Error("telemetryLogger must not be null");
		}

		this.telemetryLogger = telemetryLogger;
		this.eventSampling = samplingOptions;
		this.initOptionsCommon = initOptionsCommon;
	}

	/**
	 * Log an event
	 * @param eventId event Id
	 * @param logSeverity the log level severity for the message
	 * @param customProperties custom properties to add to the log
	 */
	public logEvent(eventId: IEventId, logSeverity: LogLevel, customProperties?: ICustomProperties): boolean {
		if (!eventId) {
			throw new Error("eventId must not be null");
		}

		const sampleRate = this.getEventSamplingRate(eventId.name);

		if (isNOU(logSeverity) || logSeverity === LogLevel.None) {
			if (env === Environment.Production) {
				const errorMessage = "logSeverity must not be null or none";
				if (this.isConsoleLogEnabled && console) {
					// tslint:disable:no-console
					console.log("Floodgate event: ", Logger.EVENT_NAME, errorMessage);
				}
				this.telemetryLogger.logEvent(Logger.EVENT_NAME, { ErrorMessage: errorMessage }, sampleRate);
			}
			return false;
		}

		customProperties = customProperties || {};
		(<any> customProperties)[Logger.EVENT_ID] = eventId.name;

		if (this.isLoggingEnabled(logSeverity, sampleRate) || this.isEventTelemetryEnabled(eventId.name)) {
			this.telemetryLogger.logEvent(Logger.EVENT_NAME, customProperties, sampleRate);
		}

		if (this.isConsoleLogEnabled && console) {
			// tslint:disable:no-console
			console.log("Floodgate event: ", Logger.EVENT_NAME, logSeverity, customProperties);
		}

		return true;
	}

	public logLocal?(logSeverity: LogLevel, ...others: any[]): void {
		if (this.isLoggingEnabled(logSeverity) && this.isConsoleLogEnabled && console) {
			// tslint:disable:no-console
			console.log("FG: ", logSeverity, others);
		}
	}

	public getUserSamplingRate(): number {
		return this.SAMPLING_RESULT;
	}

	public isEventTelemetryEnabled(eventName: string): boolean {
		try {
			if (!this.dynamicLogSettings) {
				return false;
			}

			const appId = this.initOptionsCommon?.appId?.toString();
			const locale = this.initOptionsCommon?.originalLocale?.toLowerCase();
			const settingName = `content_${eventName}`;

			// try settings from more specific to generic order
			const overrideSettings =
				this.dynamicLogSettings[`${settingName}_${appId}_${locale}` as keyof ILogLevelSettings] ||
				this.dynamicLogSettings[`${settingName}_${appId}` as keyof ILogLevelSettings] ||
				this.dynamicLogSettings[`${settingName}_${locale}` as keyof ILogLevelSettings] ||
				this.dynamicLogSettings[settingName as keyof ILogLevelSettings];

			return overrideSettings?.isEnabled;
		} catch (e) {
			if (this.isConsoleLogEnabled) {
				// tslint:disable:no-console
				console.log("FG: Error checking for dynamic log settings: ", e);
			}
		}

		return false;
	}

	/**
	 * This method enables logging only if the log severity of the event is less than or equal to the
	 * current log level set and within the sample rate. For example, if the log severity of the event is 
	 * LogLevel.Error and the current log level is set as LogLevel.Critical, then isLoggingEnabled will 
	 * return false since the condition LogLevel.Error <= LogLevel.Critical is false. Because, the log severity 
	 * follows the order defined in the LogLevel enum (None < Critical < Error < Info). The sample rate is the
	 * percentage of users allow to send the event back. If the random genarated number is less than the sample rate
	 * and the sample rate is not full blocking (0 value)
	 * If no current log level is set, then the default log level is set as LogLevel.Error so that all events
	 * marked with critical and error log severity get logged.
	 * @param inputLogLevel the log severity of the event
	 */
	private isLoggingEnabled(inputLogLevel: LogLevel, sampleRate: number = 1): boolean {
		if (isNOU(this.logLevel)) {
			const currentLogLevel = this.getCurrentLogLevel();
			this.logLevel = isNOU(currentLogLevel) ? LogLevel.Error : currentLogLevel;
		}

		return (inputLogLevel <= this.logLevel && this.SAMPLING_RESULT <= sampleRate && sampleRate !== 0);
	}

	/**
	 * This method returns the current log level if it is set in either url query parameters or floodgate local storage.
	 * Following table summarizes whether the log event calls with a log severity will log the events or not according
	 * to the current log level set. For example, the first row in the table demonstrates that when the current log level
	 * enabled is critical, then the log event will log the events only if the log severity is critical.
	 *
	 * Current Log Level Enabled | LogSeverity: Critical	| LogSeverity: Error	| LogSeverity: Info
	 * --------------------------------------------------------------------------------------------
	 * Critical Enabled			 | yes      				| no    			 	| no
	 * Error Enabled       		 | yes      				| yes   			 	| no
	 * Info Enabled        		 | yes      				| yes   			 	| yes
	 * None Enabled        		 | no       				| no    			 	| no
	 *
	 * Console logging will be enabled when the current log level is set through the url query parameters or
	 * when the url query parameter "obfconsolelog" is explicitly set to true.
	 */
	private getCurrentLogLevel(): LogLevel {
		try {
			// Check if console log is enabled in local browser session with query parameter overrides
			const urlParams = typeof URLSearchParams !== "undefined" && new URLSearchParams(window.location.search) || undefined;
			let consoleLogParam: string | boolean = urlParams && urlParams.get("obfconsolelog");
			if (!consoleLogParam) {
				// for getting iframe host url - eg: WAC
				const documentReferrer = typeof document !== "undefined" && document.referrer;
				consoleLogParam = documentReferrer && documentReferrer.indexOf("obfconsolelog") !== -1;
			}

			if (consoleLogParam) {
				this.isConsoleLogEnabled = true;
			}

			// Check if log level is set in local browser session with query parameter overrides
			const logLevelParam = urlParams && urlParams.get("obfloglevel");
			if (!isNOU(logLevelParam)) {
				this.isConsoleLogEnabled = true;
				return parseInt(logLevelParam, 10);
			}

			// Check if log level is set in floodgate local storage (manually or with remotely fetched settings)
			if (FloodgateStorageProvider.isStorageAvailable()) {
				const floodgateStorageProvider: FloodgateStorageProvider = new FloodgateStorageProvider();
				let tempStorageItem: string = floodgateStorageProvider.read(FileType.LogLevelSettings);
				if (!tempStorageItem) {
					tempStorageItem = getDynamicSetting(SettingKey.logLevelSettings, "");
				}

				const settingsObj = tempStorageItem && this.parseObject(tempStorageItem);
				if (settingsObj) {
					this.dynamicLogSettings = settingsObj;
					let logSettings = settingsObj.content as ILogSettings;

					if (this.initOptionsCommon) {
						const appId = this.initOptionsCommon.appId && this.initOptionsCommon.appId.toString();
						const locale =  this.initOptionsCommon.originalLocale && this.initOptionsCommon.originalLocale.toLowerCase();

						// log settings from more specific to generic order
						logSettings = settingsObj[`content_${appId}_${locale}`] ||
										settingsObj[`content_${appId}`] ||
										settingsObj[`content_${locale}`] ||
										settingsObj[`content`];
					}

					if (logSettings) {
						if (logSettings.consoleLog) {
							this.isConsoleLogEnabled = true;
						}

						return logSettings.logLevel;
					}
				}
			}
		} catch (e) {
			if (this.isConsoleLogEnabled) {
				// tslint:disable:no-console
				console.log("Error while getting the current log level: ", e);
			}
			return undefined;
		}

		return null;
	}

	private parseObject(tempItem: string): any {
		try {
			return JSON.parse(tempItem);
		} catch (e) {
			if (this.isConsoleLogEnabled) {
				// tslint:disable:no-console
				console.log("Error while parsing the json string for log level: ", e);
			}
			return null;
		}
	}

	private getEventSamplingRate(eventId: string): number {
		let sampleRate = 1;
		if (this.eventSampling.event) {
			// If the event is init with sample rate
			// check the sampling result against the sample rate
			if (eventId in this.eventSampling.event) {
				sampleRate = this.eventSampling.event[eventId];
			}
		}
		return sampleRate;
	}
}

class TokenManager {
	public static getTenantToken(environment: Environment): string {
		if (environment === Environment.Production) {
			return TokenManager.TENANT_TOKEN_PRODUCTION;
		} else {
			return TokenManager.TENANT_TOKEN_PRE_PRODUCTION;
		}
	}

	private static TENANT_TOKEN_PRODUCTION: string =
	"d79e824386c4441cb8c1d4ae15690526-bd443309-5494-444a-aba9-0af9eef99f84-7360"; // "Office Feedback" Prod Aria tenant
	private static TENANT_TOKEN_PRE_PRODUCTION: string =
	"2bf6a2ffddca4a80a892a0b182132961-625cb102-8b0c-480e-af53-92e48695d08d-7736"; // "Office Feedback" Sandbox Aria tenant
}
