/**
 * An Aria-based logger
 */

import * as Aria from "./Aria";
import { App, Browser, Device, Event, Host, Release, Session, User } from "./Contracts";
import ITelemetryLogger from "./ITelemetryLogger";

export default class AriaTelemetryLogger implements ITelemetryLogger {
	// Event.name is set as namespace<DELIMITER>eventName
	private static EVENT_NAME_DELIMITER: string = "_";
	private static CUSTOM_PROPERTIES_FIELD_PREFIX: string = "Data.";

	private static setApp(properties: any, app: App): void {
		properties["App.Name"] = app.getName();
		properties["App.Platform"] = app.getPlatform();
		properties["App.Version"] = app.getVersion();
	}

	private static setSession(properties: any, session: Session) {
		properties["Session.Id"] = session.getId();
	}

	private static setHost(properties: any, host: Host) {
		if (host) {
			properties["Host.Id"] = host.getId();
			properties["Host.SessionId2"] = host.getSessionId();
			properties["Host.Version"] = host.getVersion();
			properties["Host.Locale"] = host.getLocale();
		}
	}

	private static setEvent(properties: any, event: Event) {
		properties["Event.Name"] = event.getName();
		properties["Event.Id"] = event.getId();
		properties["Event.Source"] = event.getSource();
		properties["Event.SchemaVersion"] = event.getSchemaVersion();
		properties["Event.Sequence"] = event.getSequence();
		properties["Event.SampleRate"] = event.getSampleRate();
	}

	private static setRelease(properties: any, release: Release) {
		if (release) {
			properties["Release.AudienceGroup"] = release.getAudienceGroup();
		}
	}

	private static setBrowser(properties: any, browser: Browser) {
		if (browser) {
			properties["Browser.Name"] = browser.getName();
			properties["Browser.Version"] = browser.getVersion();
		}
	}

	private static setDevice(properties: any, device: Device) {
		if (device) {
			properties["Device.Id"] = device.getId();
		}
	}

	private static setUser(properties: any, user: User) {
		if (user) {
			properties["User.PrimaryIdentityHash"] = user.getPrimaryIdentityHash();
			properties["User.PrimaryIdentitySpace"] = user.getPrimaryIdentitySpace();
			properties["User.TenantId"] = user.getTenantId();
		}
	}

	private oesApp: App;
	private oesSession: Session;
	private oesHost: Host;
	private oesRelease: Release;
	private oesBrowser: Browser;
	private oesDevice: Device;
	private oesUser: User;

	private namespace: string;
	private sequence: number;

	constructor(tenantToken: string, namespace: string, app: App, session: Session, host?: Host, release?: Release,
		browser?: Browser, device?: Device, user?: User) {

		if (!tenantToken) {
			throw new Error("tenantToken must not be null");
		}
		if (!namespace) {
			throw new Error("namespace must not be null");
		}
		if (!app) {
			throw new Error("app must not be null");
		}
		if (!session) {
			throw new Error("session must not be null");
		}

		Aria.AWT().initialize(tenantToken);
		this.namespace = namespace;
		this.oesApp = app;
		this.oesSession = session;
		this.oesHost = host;
		this.oesRelease = release;
		this.oesBrowser = browser;
		this.oesDevice = device;
		this.oesUser = user;
		this.sequence = 1; // Sequence starts at 1 not 0
	}

	public logEvent(eventName: string, customProperties?: { [customField: string]: any }, sampleRate: number = 1) {
		if (!eventName) {
			throw new Error("eventName must not be null");
		}

		let oesEvent: Event = new Event(
			this.namespace + AriaTelemetryLogger.EVENT_NAME_DELIMITER + eventName,
			this.oesSession.getId(),
			this.sequence,
			sampleRate
		);

		let ariaProperties: any = {};

		if (customProperties != null) {
			for (const key in customProperties) {
				if (customProperties.hasOwnProperty(key)) {
					ariaProperties[AriaTelemetryLogger.CUSTOM_PROPERTIES_FIELD_PREFIX + key] = customProperties[key];
				}
			}
		}

		AriaTelemetryLogger.setApp(ariaProperties, this.oesApp);
		AriaTelemetryLogger.setSession(ariaProperties, this.oesSession);
		AriaTelemetryLogger.setHost(ariaProperties, this.oesHost);
		AriaTelemetryLogger.setRelease(ariaProperties, this.oesRelease);
		AriaTelemetryLogger.setEvent(ariaProperties, oesEvent);
		AriaTelemetryLogger.setBrowser(ariaProperties, this.oesBrowser);
		AriaTelemetryLogger.setDevice(ariaProperties, this.oesDevice);
		AriaTelemetryLogger.setUser(ariaProperties, this.oesUser);

		Aria.AWT().logEvent({
			name: oesEvent.getName(),
			properties: ariaProperties,
		});

		this.sequence++;
	}
}
