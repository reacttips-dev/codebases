/* eslint-disable import/no-default-export */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type QueueItem = () => Promise<any>;

export default class PromiseQueue {
  private queue: QueueItem[] = [];
  private isProcessing = false;

  constructor() {}

  add = (queueItem: QueueItem) =>
    new Promise((resolve, reject) => {
      this.queue.push(() => queueItem().then(resolve, reject));
      this.processQueue();
    });

  private processQueue = () => {
    if (!this.isProcessing && this.queue[0]) {
      this.isProcessing = true;
      const processedItem = this.queue.shift()!();
      processedItem.finally(() => {
        this.isProcessing = false;
        this.processQueue();
      });
    }
  };
}
