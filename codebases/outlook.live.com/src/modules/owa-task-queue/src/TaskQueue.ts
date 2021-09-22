/**
 * Task queue class to queue the service calls.
 */
export default class TaskQueue<T> {
    protected taskList: T[] = []; // ordered as a FIFO
    protected numberOfTasksRunning = 0;

    constructor(
        private maxParallelTasks: number,
        private taskCallback: (value: T) => Promise<any>,
        private taskDelay: number
    ) {}

    add(value: T) {
        this.taskList.unshift(value);
        this.scheduleTask();
    }

    clear() {
        this.taskList.splice(0, this.taskList.length);
    }

    private canRunMoreTasks(): boolean {
        // If the number of running tasks are less than the number of max tasks that can be run
        return this.numberOfTasksRunning < this.maxParallelTasks && this.taskList.length > 0;
    }

    scheduleTask() {
        if (this.canRunMoreTasks()) {
            // Schedule the task on timer so that the JS thread is not occupied by the queue
            setTimeout(() => {
                this.tryRunTask();
            }, this.taskDelay);
        }
    }

    private onTaskComplete() {
        this.numberOfTasksRunning--;
        this.scheduleTask();
    }

    protected tryRunTask() {
        if (this.canRunMoreTasks()) {
            // we don't need to check for undefined here because tasklist.pop will always return something
            let value = <T>this.taskList.pop();
            this.numberOfTasksRunning++;
            this.taskCallback(value)
                .then(() => {
                    this.onTaskComplete();
                })
                .catch(() => {
                    this.onTaskComplete();
                });

            // Try scheduling parallel tasks
            this.scheduleTask();
        }
    }
}
