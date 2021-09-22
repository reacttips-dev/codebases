class Events {
    constructor() {
        this.listeners = {};
    }
    addEventListener(eventName, listener) {
        if (!Array.isArray(this.listeners[eventName])) {
            this.listeners[eventName] = [];
        }
        this.listeners[eventName].push(listener);
    }
    removeEventListener(eventName, listener) {
        if (Array.isArray(this.listeners[eventName])) {
            let idx = this.listeners[eventName].indexOf(listener);
            while (idx > -1) {
                this.listeners[eventName].splice(idx, 1);
                idx = this.listeners[eventName].indexOf(listener);
            }
        }
    }
    notifyListeners(eventName) {
        if (Array.isArray(this.listeners[eventName])) {
            this.listeners[eventName].forEach((listener) => listener());
        }
    }
}
export default Events;
//# sourceMappingURL=CheckoutEvents.js.map