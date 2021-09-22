import "../Polyfills/Fetch";
import * as TmsConstants from "./TargetedMessagingConstants";
import * as Utils from "../Utils";

const { isNOU } = Utils;

export class TargetedMessagingTransport {
	constructor(private sessionId?: string) {
	}

	public async sendGetRequest(requestUrl: string, token?: string, useTimeout?: boolean): Promise<Response> {
		const requestInit = {
			method: "GET",
			headers: this.createHeaders(token),
		};

		return useTimeout ? this.timeoutFetch(requestUrl, requestInit) : fetch(requestUrl, requestInit);
	}

	public async sendPostRequest(
		requestUrl: string, requestBody: string, token?: string, useTimeout?: boolean): Promise<Response> {
		const requestInit = {
			method: "POST",
			headers: this.createHeaders(token),
			body: requestBody,
		};
		return useTimeout ? this.timeoutFetch(requestUrl, requestInit) : fetch(requestUrl, requestInit);
	}

	private timeoutFetch(input: RequestInfo, init: RequestInit = {}): Promise<Response> {
		return new Promise((resolve, reject) => {
			fetch(input, init).then(resolve, reject);
			setTimeout(() => reject(
				new Error("Service request timed out")),
				TmsConstants.TMS_FETCH_TIMEOUT);
		});
	}

	private createHeaders(token?: string): Headers {
		const headers: Headers = typeof Headers !== "undefined" && new Headers();
		if (headers) {
			if (!isNOU(token)) {
				headers.append("Authorization", "Bearer " + token);
			}

			headers.append("X-CorrelationId", Utils.guid());
			if (this.sessionId) {
				headers.append("X-UserSessionId", this.sessionId);
			}
		}

		return headers;
	}
}
