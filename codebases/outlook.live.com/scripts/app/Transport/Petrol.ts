import * as Configuration from "../Configuration/Configuration";

const HTTP_TIMEOUT: number = 8000; // timeout in milliseconds
/**
 * Make an http request with retries
 * @param method the http method "GET", "POST" etc
 * @param url the url
 * @param requestBody the request body
 * @param maxRetries the maximum number of retries
 * @param onLoad the onload handler
 */
function makeHttpRequest<T>(method: string, url: string, requestBody: any, maxRetries: number,
	onLoad: (xhr: XMLHttpRequest, resolve: (value?: T) => void, reject: (error?: any) => void) => void
): Promise<T> {
	let makeRequest: (retries: number, timeout: number) => Promise<T> =
		(retries: number, timeout: number) => {
			return new Promise((resolve, reject) => {
				let xhr: XMLHttpRequest = new XMLHttpRequest();
				xhr.open(method, url, true);
				xhr.timeout = timeout;
				xhr.onload = () => { onLoad(xhr, resolve, reject); };
				xhr.ontimeout = () => {
					if (retries > 0) {
						// double the timeout and retry it
						makeRequest(retries - 1, timeout * 2).then(resolve, reject);
					} else {
						reject(new Error(`Request to '${url}' timed out. timeout: ${xhr.timeout}`));
					}
				};
				xhr.onerror = () => {
					if (retries > 0) {
						makeRequest(retries - 1, timeout).then(resolve, reject);
					} else {
						reject(new Error(`Request to '${url}' errored. ${xhr.status} - ${xhr.statusText} : ${xhr.responseText}`));
					}
				};
				xhr.send(requestBody);
			});
		};

	// get the input timeout or using the default value if timeout is not defined
	const httpTimeout = Configuration.get().getCommonInitOptions().petrolTimeout
						? Configuration.get().getCommonInitOptions().petrolTimeout
						: HTTP_TIMEOUT;

	return makeRequest(maxRetries, httpTimeout);
}

const uploadEndpointInt: string = "https://petrol-int.office.microsoft.com/v1/feedback";
const uploadEndpointProd: string = "https://petrol.office.microsoft.com/v1/feedback";

/**
 * Send a payload to Petrol
 * @param isProduction is production?
 * @param manifest manifest content
 * @param screenshot screenshot content
 * @param diagnostics diagnostics content
 */
export function send(isProduction: boolean, manifest: Blob, screenshot?: Blob, diagnostics?: Blob): Promise<any> {
	if (manifest === undefined) {
		return Promise.reject(new Error("Manifest cannot be undefined"));
	}

	let formData = new FormData();
	formData.append("Manifest", manifest);

	if (screenshot) {
		formData.append("Screenshot", screenshot);
	}

	if (diagnostics) {
		formData.append("Diagnostics", diagnostics);
	}

	return makeHttpRequest<any>("POST", isProduction ? uploadEndpointProd : uploadEndpointInt, formData, 2,
		function (
			xhr: XMLHttpRequest,
			resolve: (value?: any) => void,
			reject: (error?: any) => void
		): void {
			if (xhr.status !== 200) {
				reject(new Error("Non-200 response with status code: " + xhr.status + ", response: " + xhr.responseText));
			}
			resolve();
		});
}
