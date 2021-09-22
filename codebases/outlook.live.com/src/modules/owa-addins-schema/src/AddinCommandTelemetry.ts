import type { IAddinCommandTelemetry } from 'owa-addins-store';
import { getPerformanceNow } from 'owa-fps-jank';

export default class AddinCommandTelemetry implements IAddinCommandTelemetry {
    private executionInitTime: number;
    private executionStartTime: number;
    private executionEndTime: number;

    setExecutionInitTime() {
        this.executionInitTime = getPerformanceNow();
    }

    setExecutionStartTime() {
        this.executionStartTime = getPerformanceNow();
    }

    setExecutionEndTime() {
        this.executionEndTime = getPerformanceNow();
    }

    getExecutionInitTime() {
        return this.executionInitTime;
    }

    getExecutionStartTime() {
        return this.executionStartTime;
    }

    getExecutionEndTime() {
        return this.executionEndTime;
    }
}
