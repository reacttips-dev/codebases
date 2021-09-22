import type { PerformanceDatapoint } from 'owa-analytics';

export function markDatapointAsWaiting(datapoint: PerformanceDatapoint) {
    if (datapoint) {
        datapoint.addCustomData({
            waitingUserAction: true.toString(),
        });
    }
}
