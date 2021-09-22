/**
 * Window.ts
 *
 * Module wrapping around the global window object
 */

import * as Configuration from "./../Configuration/Configuration";
import { ILaunchOptionsInAppFeedback } from "./../Configuration/ILaunchOptions";
import ICustomSurvey from "./../FloodgateCore/ICustomSurvey";
import IUISurvey from "./../FloodgateCore/UISurvey/IUISurvey";
import { FloodgateEngine } from "@ms-ofb/officefloodgatecore";
import { IFloodgateSettingIdMap } from "@ms-ofb/officefloodgatecore/dist/src/Api/Api";

const w = window as any;
const officeBrowserFeedback = w.OfficeBrowserFeedback = w.OfficeBrowserFeedback || {};
const floodgate = officeBrowserFeedback.floodgate = officeBrowserFeedback.floodgate || {};

/**
 * Get the IWindow object
 */
export function get(): IWindow { return w; }

/**
 * Get the IWindow object
 */
export function getGlobal(): IWindow { return w; }

/**
 * Set the setUiStrings() method
 * @param setUiStrings the method
 */
export function setSetUiStrings(setUiStrings: (data: any) => void) {
	officeBrowserFeedback.setUiStrings = setUiStrings;
}

/**
 * Set the singleFeedback() method
 * @param singleFeedback the method
 */
export function setSingleFeedback(
	singleFeedback: (feedbackType: string, launchOptions: ILaunchOptionsInAppFeedback) => Promise<any>) {
		officeBrowserFeedback.singleFeedback = singleFeedback;
}

/**
 * Set the multiFeedback() method
 * @param multiFeedback the method
 */
export function setMultiFeedback(
	multiFeedback: (launchOptions: ILaunchOptionsInAppFeedback) => Promise<any>) {
		officeBrowserFeedback.multiFeedback = multiFeedback;
}

/**
 * Set the createScreenshot() method
 * @param createScreenshot the method
 */
export function setCreateScreenshot(
	createScreenshot: (domElement?: object, options?: any) => Promise<any>) {
		officeBrowserFeedback.createScreenshot = createScreenshot;
}

/**
 * Set the floodgate showSurvey() method
 * @param floodgateShowSurvey the method
 */
export function setFloodgateShowSurvey(floodgateShowSurvey: (survey: IUISurvey) => Promise<any>) {
	floodgate.showSurvey = floodgateShowSurvey;
}

/**
 * Set the floodgate showCustomSurvey() method
 * @param floodgateShowSurvey the method
 */
export function setFloodgateShowCustomSurvey(floodgateShowCustomSurvey: (survey: ICustomSurvey) => Promise<any>) {
	floodgate.showCustomSurvey = floodgateShowCustomSurvey;
}

/**
 * Set the floodgate initialize() method
 * @param floodgateInitialize the method
 */
export function setFloodgateInitialize(floodgateInitialize: () => Promise<any>) {
	floodgate.initialize = floodgateInitialize;
}

/**
 * Set the floodgate start() method
 * @param floodgateStart the method
 */
export function setFloodgateStart(floodgateStart: () => Promise<any>) {
	floodgate.start = floodgateStart;
}

/**
 * Set the floodgate stop() method
 * @param floodgateStop the method
 */
export function setFloodgateStop(floodgateStop: () => void) {
	floodgate.stop = floodgateStop;
}

/**
 * Set the floodgate getEngine() method
 * @param floodgateGetEngine the method
 */
export function setFloodgateGetEngine(floodgateGetEngine: () => FloodgateEngine) {
	floodgate.getEngine = floodgateGetEngine;
}

/**
 * Set the floodgate getSettingIdMap() method
 * @param floodgateSettingIdMap the method
 */
export function getSettingIdMap(floodgateSettingIdMap: () => IFloodgateSettingIdMap) {
	floodgate.getSettingIdMap = floodgateSettingIdMap;
}

export interface IInitOptions extends Configuration.IInitOptionsCommon, Configuration.IInitOptionsInAppFeedback {
}

export interface IFloodgate {
	initOptions: Configuration.IInitOptionsFloodgate;
	showSurvey: (survey: IUISurvey) => Promise<any>;
	initialize: () => Promise<any>;
	start: () => Promise<any>;
	stop: () => void;
	getEngine: () => FloodgateEngine;
}

export interface IWindow extends WindowLocalStorage {
	OfficeBrowserFeedback: {
		initOptions: IInitOptions;
		multiFeedback: (launchOptions: ILaunchOptionsInAppFeedback) => Promise<any>;
		sdkVersion: string;
		singleFeedback: (feedbackType: string, launchOptions: ILaunchOptionsInAppFeedback) => Promise<any>;
		setUiStrings: (data: any) => void;
		html2canvas: () => ((domElement?: object, options?: any) => Promise<HTMLCanvasElement>);
		createScreenshot: (domElement?: object, options?: any) => Promise<HTMLCanvasElement>;
		floodgate: IFloodgate;
	};
}
