interface EventHandler<T> {
    callback: EventEmitterCallback<T>;
    callbackThis: T;
}

export type EventEmitterCallback<T> = (this: T, ...args: any[]) => void;

export default class EventEmitter {
    private eventDictionary: { [eventName: string]: EventHandler<any>[] } = {};
    public on<T>(eventName: string, callback: EventEmitterCallback<T>, callbackThis?: T) {
        (this.eventDictionary[eventName] || (this.eventDictionary[eventName] = [])).push({
            callback,
            callbackThis,
        });
        return this;
    }
    public emit(eventName: string, ...data: any[]) {
        let evtArr = (this.eventDictionary[eventName] || []).slice();
        evtArr.forEach(handler => handler.callback.apply(handler.callbackThis, data));
        return this;
    }
    public off<T>(eventName: string, callback: EventEmitterCallback<T>) {
        let evts = this.eventDictionary[eventName];
        if (evts) {
            let liveEvents = evts.filter(handler => handler.callback !== callback);
            liveEvents.length
                ? (this.eventDictionary[eventName] = liveEvents)
                : delete this.eventDictionary[eventName];
        }
        return this;
    }
    public once<T extends any>(
        eventName: string,
        callback: EventEmitterCallback<T>,
        callbackThis?: T
    ) {
        const self = this;

        const wrappedCallback: EventEmitterCallback<T> = (...data: any[]) => {
            // must use a non-arrow function because of our need to get the 'arguments'
            self.off(eventName, wrappedCallback);

            // `callbackThis` is only undefined if no value was provided. In that case,
            // the callback isn't expecting any value for `this`.
            return callback.apply(callbackThis!, data);
        };

        (this.eventDictionary[eventName] || (this.eventDictionary[eventName] = [])).push({
            callback: wrappedCallback,
            callbackThis,
        });
        return this;
    }
}
