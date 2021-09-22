export type TaskFunc<T> = () => Promise<T>;

export interface Task<T> {
    func: TaskFunc<T>;
    resolve: (value: T) => void;
    reject: (reason?: any) => void;
}

export interface PriorityTaskQueueConfig {
    maxParallelTasks?: number;
    taskQuanta: number;
}

/**
 * Task queue class to queue the service calls.
 */
export class PriorityTaskQueue<T> {
    protected taskList: { [priority: number]: Task<T>[] } = {}; // ordered as a FIFO
    protected numberOfTasksRunning = 0;

    constructor(
        private config: PriorityTaskQueueConfig = {
            maxParallelTasks: 1,
            taskQuanta: 0,
        }
    ) {}

    add(func: TaskFunc<T>, priority: number = 0): Promise<T> {
        if (!this.taskList[priority]) {
            this.taskList[priority] = [];
        }

        // tslint:disable-next-line:promise-must-complete
        return new Promise((resolve, reject) => {
            this.taskList[priority].unshift({
                func,
                resolve,
                reject,
            });
            this.scheduleTask();
        });
    }

    clear() {
        this.taskList = {};
    }

    scheduleTask(): void {
        if (this.config.taskQuanta < 0) {
            this.tryRunTask();
        } else {
            // Schedule the task on timer so that the JS thread is not occupied by the queue
            setTimeout(() => {
                this.tryRunTask();
            }, this.config.taskQuanta || 0);
        }
    }

    protected tryRunTask() {
        const priorities = Object.keys(this.taskList);
        if (
            this.numberOfTasksRunning < (this.config.maxParallelTasks || 1) &&
            priorities.length > 0
        ) {
            const nextPriority = Math.min.apply(
                null,
                priorities.map(p => parseInt(p))
            );
            const nextTask = this.taskList[nextPriority].pop();

            // If there are no more tasks then delete the key
            if (!this.taskList[nextPriority] || this.taskList[nextPriority].length == 0) {
                delete this.taskList[nextPriority];
            }

            this.numberOfTasksRunning++;
            if (nextTask) {
                nextTask
                    .func()
                    .then(value => {
                        nextTask.resolve(value);
                        this.onTaskComplete();
                    })
                    .catch(reason => {
                        nextTask.reject(reason);
                        this.onTaskComplete();
                    });
            }

            // Try scheduling parallel tasks
            this.scheduleTask();
        }
    }

    private onTaskComplete() {
        this.numberOfTasksRunning--;
        this.scheduleTask();
    }
}
