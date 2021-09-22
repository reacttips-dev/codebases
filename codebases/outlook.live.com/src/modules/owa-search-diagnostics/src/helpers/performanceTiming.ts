/**
 * Flag indicating whether the resource timing api is supported or not.
 * http://caniuse.com/#feat=resource-timing
 */
const IsPerformanceResourceSupported =
    typeof window !== typeof undefined &&
    window.hasOwnProperty('Performance') &&
    Performance.prototype.getEntriesByName;

function safePerformanceMark(name: string): void {
    if (IsPerformanceResourceSupported) {
        performance?.mark?.(name);
    }
}

/**
 * Creates a performance marker with the given measureName plus the "- start" suffix
 */
export function safePerformanceMarkStart(measureName: string): void {
    safePerformanceMark(`${measureName} - start`);
}

/**
 * Get a Performance Measure for the given measure name
 * This function expects a Performance Marker with the format "${measureName} - start" to exists (use the safePerformanceMarkStart to get this)
 * If a start maker is not defined, a measure cannot be calculated and undefined will be returned
 * If a measure could be created, we then try to retrieve it from the buffer and return it
 * The start and end markers will then be removed from the buffer, to make sure that on the next call, a new, fresh start marker needs to be present
 */
export function safePerformanceMeasure(measureName: string): PerformanceEntry {
    if (!IsPerformanceResourceSupported) {
        return undefined;
    }

    try {
        // If a mark is removed before the measure() is called (e.g. if some other code calls performance.clearMarks()), this would throw a SyntaxError
        // See https://w3c.github.io/user-timing/#dom-performance-measure for more info.
        performance?.measure?.(measureName, `${measureName} - start`);
    } catch (error) {
        // Start marker was not found: return undefined
        return undefined;
    }

    // Fetch the measure
    const results = performance && performance.getEntriesByName(measureName);

    // Clear marks so the next measure will need to have start and end
    performance?.clearMarks?.(`${measureName} - start`);

    if (results && results.length > 0) {
        // The measure will have been added in the last position of the array, so return the last entry from results
        return results.slice(-1)[0];
    }

    // Measure was not found
    return undefined;
}
