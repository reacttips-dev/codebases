/**
 * Contracts enforced by OfficeEventSchema (OES)
 */

export class App {
	private static PLATFORM: string = "Web";

	private name: string;
	private version: string;

	public constructor(name: string, version: string) {
		if (!name) {
			throw new Error("name must not be null");
		}
		if (!version) {
			throw new Error("version must not be null");
		}

		this.name = name;
		this.version = version;
	}

	public getName(): string {
		return this.name;
	}

	public getPlatform(): string {
		return App.PLATFORM;
	}

	public getVersion(): string {
		return this.version;
	}
}

export class Session {
	private id: string;

	public constructor(id: string) {
		if (!id) {
			throw new Error("id must not be null");
		}

		this.id = id;
	}

	public getId(): string {
		return this.id;
	}
}

export class Host {
	private id: string;
	private locale: string;
	private sessionId: string;
	private version: string;

	constructor(id: string, locale: string, sessionId: string, version: string) {
		this.id = id;
		this.locale = locale;
		this.sessionId = sessionId;
		this.version = version;
	}

	public getId(): string {
		return this.id;
	}

	public getLocale(): string {
		return this.locale;
	}

	public getSessionId(): string {
		return this.sessionId;
	}

	public getVersion(): string {
		return this.version;
	}
}

export class Event {
	// Id is set to sessionId<DELIMITER>sequence
	private static ID_DELIMITER = ".";
	private static SOURCE: string = "MsoThin";
	private static SCHEMA_VERSION: number = 1;

	private name: string;
	private id: string;
	private sequence: number;
	private sampleRate: number;

	public constructor(name: string, sessionId: string, sequence: number, sampleRate: number) {
		if (!name) {
			throw new Error("name must not be null");
		}
		if (!sessionId) {
			throw new Error("sessionId must not be null");
		}
		if ((!sequence && sequence !== 0) || sequence < 0) {
			throw new Error("sequence must not be negative");
		}

		this.name = name;
		this.id = sessionId + Event.ID_DELIMITER + sequence;
		this.sequence = sequence;
		this.sampleRate = sampleRate;
	}

	public getName(): string {
		return this.name;
	}

	public getId(): string {
		return this.id;
	}

	public getSource(): string {
		return Event.SOURCE;
	}

	public getSchemaVersion(): number {
		return Event.SCHEMA_VERSION;
	}

	public getSequence(): number {
		return this.sequence;
	}

	public getSampleRate(): number {
		return this.sampleRate;
	}
}

export class Release {
	private audienceGroup: string;

	public constructor(audienceGroup: string) {
		this.audienceGroup = audienceGroup;
	}

	public getAudienceGroup(): string {
		return this.audienceGroup;
	}
}

export class Browser {
	private name: string;
	private version: string;

	public constructor(name: string, version: string) {
		this.name = name;
		this.version = version;
	}

	public getName(): string {
		return this.name;
	}

	public getVersion(): string {
		return this.version;
	}
}

export class Device {
	private id: string;

	public constructor(id: string) {
		this.id = id;
	}

	public getId(): string {
		return this.id;
	}
}

export class User {
	private primaryIdentityHash: string;
	private primaryIdentitySpace: string;
	private tenantId: string;

	public constructor(primaryIdentityHash: string, tenantId: string) {
		this.tenantId = tenantId;
		this.primaryIdentityHash = primaryIdentityHash ? primaryIdentityHash.trim() : primaryIdentityHash;
		this.primaryIdentitySpace = this.generatePrimaryIdentitySpace();
	}

	public getTenantId(): string {
		return this.tenantId;
	}

	public getPrimaryIdentityHash(): string {
		return this.primaryIdentityHash;
	}

	public getPrimaryIdentitySpace(): string {
		return this.primaryIdentitySpace;
	}

	private generatePrimaryIdentitySpace(): string {
		if (this.primaryIdentityHash) {
			if (this.primaryIdentityHash.startsWith("a:")) {
				return "UserObjectId";
			}
			if (this.primaryIdentityHash.startsWith("p:")) {
				return "MsaPuid";
			}
			if (this.primaryIdentityHash.startsWith("ap:")) {
				return "OrgIdPuid";
			}
		}

		return undefined;
	}
}
