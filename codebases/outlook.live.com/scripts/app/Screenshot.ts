/**
 * Screenshot.ts
 *
 * A module for screenshot. It uses the html2canvas package.
 */

const html2canvas: any = require("../app/thirdparty/html2canvas/html2canvas");

/**
 * Get screenshot
 * @param domElement document element or document body 
 * @param options background color
 */
export function createScreenshot(domElement?: object, options?: any): Promise<HTMLCanvasElement> {
	return html2canvas(domElement || document.body, { background: "#ffffff", ...options });
}
