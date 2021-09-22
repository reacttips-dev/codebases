let performanceTimingSupported: boolean;
export default function isPerformanceTimingSupported(): boolean {
    if (performanceTimingSupported == undefined) {
        performanceTimingSupported =
            typeof window != 'undefined' &&
            window.performance != null &&
            window.performance.timing != null &&
            window.performance.navigation != null &&
            window.performance.getEntriesByName != null;
    }

    return performanceTimingSupported;
}
