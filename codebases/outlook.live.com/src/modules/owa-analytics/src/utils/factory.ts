import { PerformanceDatapoint, logUsage } from '../index';
import type { CustomData } from 'owa-analytics-types';

// to faciliate unit testing
export function createDatapoint(name: string): PerformanceDatapoint {
    return new PerformanceDatapoint(name);
}

export function createUsageDatapoint(name: string, data: CustomData): void {
    logUsage(name, data);
}

export function createPerformanceObserver(
    type: string,
    registration: (list: PerformanceObserverEntryList) => void
) {
    let rv: PerformanceObserver | null = null;

    if (
        'PerformanceObserver' in self &&
        'supportedEntryTypes' in self.PerformanceObserver &&
        self.PerformanceObserver.supportedEntryTypes.some(s => s == type)
    ) {
        rv = new PerformanceObserver(registration);
    }

    return rv;
}

export function now() {
    return 'performance' in self && self.performance.now && self.performance.now();
}

export function runAt(cb: () => void, then: number) {
    const n = now();
    if (n) {
        const delay = Math.max(then - n, 0);
        setTimeout(cb, delay);
    }
}
