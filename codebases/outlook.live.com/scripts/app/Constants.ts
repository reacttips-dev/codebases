/**
 * Constants.ts
 *
 * A module for non-UI constants.
 */

/**
 * Values for types of feedback that go into the json
 * Also used to determine the FormTemplate used on each one of the feedback types.
 */
export enum FeedbackType {
	Smile,
	Frown,
	Idea,
	Bug,
}

/**
 * Values for types of panels that go into the json
 * Also used to determine the PanelTemplate used on each one of the panel types.
 */
export const enum PanelType {
	Thanks
}

/**
 * Values for the environment
 */
export const enum Environment {
	Production,
	Int
}

/**
 * Values for autodismiss
 */
export const enum AutoDismissValues {
	NoAutoDismiss,
	SevenSeconds,
	FourteenSeconds,
	TwentyOneSeconds,
	TwentyEightSeconds
}

/**
 * Dynamic scripts
 */
export class DynamicScriptUrls {
	/**
	 * Link to the Office WebSurfaces UX package
	 */
	/* tslint:disable:max-line-length */
	public static WebSurfacesLink: string = "https://content.growth.office.net/mirrored/resources/programmablesurfaces/prod/officewebsurfaces.core.min.js";
}

/**
 * Constant GUIDs
 */
export class GUIDs {
	public static TMSAppID: string = "4c4f550b-42b2-4a16-93f9-fdb9e01bb6ed";
	public static TULIPSAppID: string = "05c88d91-956e-46b4-91b0-77a33cc21a4d";
}
