/*
 * DomUtils.ts
 *
 * Module for page document utility functions
 */

/**
 * Load the style sheet
 * @param url The url of the stylesheet
 */
export function loadStylesheet(url: string): void {
	const link: HTMLLinkElement = document.createElement("link");
	link.rel = "stylesheet";
	link.type = "text/css";
	link.href = url;

	const entry: HTMLScriptElement = document.getElementsByTagName("script")[0];
	entry.parentNode.insertBefore(link, entry);
}

/**
 * Load the script and callback after it is loaded
 * @param url The url of the script
 * @param pageOrigin Optional - Origin of the page
 */
export function loadScript(url: string, pageOrigin: string = (window as any).origin): Promise<void> {
	return new Promise((resolve, reject) => {
		const script: any = document.createElement("script");
		script.async = true;

		if (script.readyState) { // IE
			script.onreadystatechange = function() {
				if (script.readyState === "loaded" || script.readyState === "complete") {
					script.onreadystatechange = null;
					resolve();
				}
			};
		} else {  // Others
			script.onload = function() {
				resolve();
			};
		}

		script.onerror = function() {
			reject();
		};

		script.src = url;

		// don't add if origin is not available or when containing "null". This is to mitigate possible
		// unexpected behavior with Chrome when a page hosting this SDK is being tested as a local file.
		// The behavior depends on Chrome.exe's --allow-file-access-from-files setting.
		if (pageOrigin && pageOrigin !== "null") {
			script.crossOrigin = "anonymous";
		}

		const entry: HTMLScriptElement = document.getElementsByTagName("script")[0];
		entry.parentNode.insertBefore(script, entry);
	});
}
