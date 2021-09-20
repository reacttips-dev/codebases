import {
  Callback,
  LiveUpdate,
  Publish,
  subscribe,
} from 'app/scripts/init/live-updater';

export class LiveUpdaterClient {
  callbacks: Callback[] = [];
  broadcast: Publish;

  constructor() {
    this.broadcast = subscribe((update: LiveUpdate) => {
      this.callbacks.forEach((fx) => fx(update));
    });
  }

  subscribe(callback: Callback) {
    this.callbacks.push(callback);
  }

  unsubscribe(callback: Callback) {
    this.callbacks = this.callbacks.filter((cb) => cb !== callback);
  }
}
