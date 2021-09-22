import { TaskQueue } from 'owa-task-queue';

export function createQueue<T>(
    maxParallelTasks: number,
    taskCallback: (value: T) => Promise<any>,
    taskDelay: number
): TaskQueue<T> {
    return new TaskQueue<T>(maxParallelTasks, taskCallback, taskDelay);
}
