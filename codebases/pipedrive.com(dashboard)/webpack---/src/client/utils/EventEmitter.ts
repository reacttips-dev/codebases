export class EventEmitter {
	private readonly events;

	constructor() {
		this.events = {};
	}

	public on(event: string, listener?) {
		if (!(event in this.events)) {
			this.events[event] = [];
		}

		this.events[event].push(listener);

		return () => {
			this.off(event, listener);
		};
	}

	public off(event: string, listener?) {
		if (!listener) {
			delete this.events[event];
		} else if (this.events[event].indexOf(listener) !== -1) {
			this.events[event].splice(this.events[event].indexOf(listener), 1);
		}
	}

	public emit(event, ...args) {
		if (event in this.events) {
			for (const listener of this.events[event]) {
				listener(...args);
			}
		}
	}

	public getEventListeners(event: string) {
		if (event in this.events) {
			return this.events[event];
		} else {
			return [];
		}
	}

	public once(event, listener) {
		return this.on(event, () => {
			this.emit(event);

			this.off(event, listener);
		});
	}
}
