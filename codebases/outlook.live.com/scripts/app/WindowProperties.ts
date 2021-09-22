/**
 * WindowProperties.ts
 *
 * Module to track window properties.
 */

/**
 * Is the window narrow?
 * @returns True if it is, false otherwise
 */
export function isNarrow(): boolean {
	let narrowScreenBoundary: number = 800;

	if (window.innerWidth) {
		return window.innerWidth < narrowScreenBoundary;
	}

	// if we can't find the width; go with narrow.
	return true;
}
