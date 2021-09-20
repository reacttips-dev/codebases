import EventEmitter from 'events';

class UIEventService {
  constructor () {
    this.eventEmitter = new EventEmitter();
  }

  publish (event, payload, meta) {
    this.eventEmitter.emit(event, payload, meta);
  }

  subscribe (event, listener, options) {
    if (options && options.once) {
      this.eventEmitter.once(event, listener);
    }
    else {
      this.eventEmitter.addListener(event, listener);
    }
    return () => {
      this.eventEmitter.removeListener(event, listener);
    };
  }
}

export default new UIEventService();
