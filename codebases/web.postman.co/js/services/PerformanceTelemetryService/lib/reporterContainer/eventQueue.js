class Queue {

  constructor () {
    this.queue = [];
  }

  getQueueSize () {
    return this.queue.length;
  }

  isEmpty () {
    return !this.queue.length;
  }

  enqueue (item) {
    this.queue.push(item);
  }

  dequeue () {
    if (this.isEmpty())
      return null;
    else
      return this.queue.shift();
  }

}

const eventQueue = new Queue();

export default eventQueue;
