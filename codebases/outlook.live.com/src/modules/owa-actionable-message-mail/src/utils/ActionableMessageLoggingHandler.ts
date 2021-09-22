import type { LoggingHandler } from 'owa-actionable-message-v2';
import type { CustomData, CustomDataType, CustomDataArray } from 'owa-analytics-types';

const ALLOWED_AUTO_INVOKES_EXECUTION_COUNT = 1;

export default class ActionableMessageLoggingHandler implements LoggingHandler {
    private dataPoints: CustomDataArray = [];
    private autoInvokeExecutionCount: number = 0;

    public log(data: CustomDataType) {
        this.dataPoints.push(data);
    }

    public logAutoInvokeExecution() {
        this.autoInvokeExecutionCount++;
    }

    public shouldPostLogs(): boolean {
        return (
            this.autoInvokeExecutionCount > ALLOWED_AUTO_INVOKES_EXECUTION_COUNT &&
            this.dataPoints.length > 0
        );
    }

    public getUsageLogs(): CustomData {
        return this.shouldPostLogs() ? this.dataPoints : [];
    }

    public cleanUp(): void {
        this.dataPoints = [];
        this.autoInvokeExecutionCount = 0;
    }
}
