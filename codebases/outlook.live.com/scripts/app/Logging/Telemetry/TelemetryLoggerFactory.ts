/**
 * Factory to return ITelemetryLogger objects
 */

import { App, Browser, Device, Host, Release, Session, User } from "./Contracts";
import ITelemetryLogger from "./ITelemetryLogger";
import AriaTelemetryLogger from "./AriaTelemetryLogger";

export default class TelemetryLoggerFactory {
	public static create(tenantToken: string, namespace: string, app: App, session: Session,
		host: Host, release: Release, browser: Browser, device: Device, user: User): ITelemetryLogger {
			return new AriaTelemetryLogger(tenantToken, namespace, app, session, host, release, browser, device, user);
		}
}
