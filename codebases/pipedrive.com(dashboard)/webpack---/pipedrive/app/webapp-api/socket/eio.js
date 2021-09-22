import SockJS from 'sockjs-client';
import Logger from '@pipedrive/logger-fe';
import _ from 'lodash';
import errorUtils from './error-utils';

const logger = new Logger('socket', 'eio');

const isMessageHandler = (event, args) => {
	return event === 'message' && args[0] && args[0].type === 'message';
};

const createEventHandler = (event, context) => {
	return function(...args) {
		if (event === 'open') {
			context.opened = true;
		}

		if (event === 'close') {
			context.opened = false;
		}

		if (isMessageHandler(event, args)) {
			try {
				args[0] = JSON.parse(args[0].data);
			} catch (e) {
				logger.remote(
					'error',
					'Failed to JSON.parse() the data of the first handler argument.',
					errorUtils.toPlainObject(e),
					`webapp.${app.ENV}`
				);
			}
		}

		if (context.handlers[event]) {
			for (let i = 0, len = context.handlers[event].length; i < len; i++) {
				context.handlers[event][i].apply(this, args);
			}
		}
	};
};

const constructSocket = (prefix) => {
	try {
		const sockJS = new SockJS(prefix);

		sockJS.onerror = function(event, err) {
			err = err || new Error('SockJS library error');
			logger.remote(
				'warning',
				'Cant construct web socket',
				errorUtils.toPlainObject(err),
				`webapp.${app.ENV}`
			);
		};

		return sockJS;
	} catch (e) {
		const error = e || new Error('SockJS library error');

		logger.remote(
			'warning',
			'Cant construct web socket',
			errorUtils.toPlainObject(error),
			`webapp.${app.ENV}`
		);
	}

	return null;
};

class PipedriveWebsocket {
	constructor(prefix, doConnect) {
		this.socket = false;
		this.opened = false;
		this.prefix = prefix || '/socketqueue';
		this.handlers = {};
		this.eventList = [];

		if (doConnect !== false) {
			this.connect();
		}
	}

	connect() {
		this.socket = constructSocket(this.prefix);
	}

	registerEvent(event) {
		if (!this.socket) {
			return;
		}

		this.socket[`on${event}`] = createEventHandler(event, this);
	}

	on(event, handler) {
		if (!this.handlers[event]) {
			this.handlers[event] = [];
			this.eventList.push(event);
			this.registerEvent(event);
		}

		this.handlers[event].push(handler);
	}

	closeUnderlyingSocket() {
		if (!this.socket || this.socket.readyState === SockJS.CLOSED) {
			return;
		}

		this.socket.close();
	}

	unbindAllListeners() {
		if (!this.socket) {
			return;
		}

		for (let i = 0; i < this.eventList.length; i++) {
			this.socket.removeEventListener(`on${this.eventList[i]}`);
		}
	}

	removeAllListeners() {
		if (!this.socket) {
			return;
		}

		this.unbindAllListeners();
		for (let i = 0; i < this.eventList.length; i++) {
			delete this.handlers[this.eventList[i]];
		}
		this.eventList = [];
	}

	send(message) {
		if (!this.socket) {
			return;
		}

		const socketMessage = typeof message === 'object' ? JSON.stringify(message) : message;

		try {
			this.socket.send(socketMessage);
		} catch (e) {
			const error = e || new Error('Socket.send failure');
			const warningDetails = {
				readyState: this.socket.readyState,
				transport: this.socket.transport,
				timedOut: this.socket._transportTimeoutId,
				socketUrl: this.socket.url,
				socketMessage
			};

			logger.remote(
				'warning',
				'Cant deliver socket message',
				_.assignIn(warningDetails, errorUtils.toPlainObject(error)),
				`webapp.${app.ENV}`
			);
		}
	}

	reconnect() {
		if (this.opened) {
			return;
		}

		this.unbindAllListeners();
		this.closeUnderlyingSocket();
		this.socket = constructSocket(this.prefix);

		for (let i = 0, len = this.eventList.length; i < len; i++) {
			this.registerEvent(this.eventList[i]);
		}
	}

	close() {
		if (!this.socket) {
			return;
		}

		this.removeAllListeners();
		this.closeUnderlyingSocket();
	}
}

export default PipedriveWebsocket;
