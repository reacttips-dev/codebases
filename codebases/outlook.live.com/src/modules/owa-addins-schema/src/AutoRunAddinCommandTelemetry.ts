import type { IAutoRunAddinCommandTelemetry } from 'owa-addins-store';
import { getPerformanceNow } from 'owa-fps-jank';

export default class AutoRunAddinCommandTelemetry implements IAutoRunAddinCommandTelemetry {
    private executionInitTime: number;
    private executionStartTime: number;
    private executionEndTime: number;
    private queuePushTime: number;
    private queuePopTime: number;

    setExecutionInitTime() {
        this.executionInitTime = getPerformanceNow();
    }

    setExecutionStartTime() {
        this.executionStartTime = getPerformanceNow();
    }

    setExecutionEndTime() {
        this.executionEndTime = getPerformanceNow();
    }

    setQueuePushTime() {
        this.queuePushTime = getPerformanceNow();
    }

    setQueuePopTime() {
        this.queuePopTime = getPerformanceNow();
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

    getQueuePushTime() {
        return this.queuePushTime;
    }

    getQueuePopTime() {
        return this.queuePopTime;
    }
}
