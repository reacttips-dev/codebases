const _ = require('lodash');
const cookies = require('js-cookie');
const localStorage = require('utils/get-local-storage');
const whatwg = require('whatwg-fetch');

// Time interval between refreshing state against server. minutes * seconds * milliseconds
const POLL_SERVER_INTERVAL_MS = 60 * 60 * 1000;
// Time that needs to pass before considering the ack expired. hours * minutes * seconds * milliseconds
const ACKNOWLEDGE_EXPIRY_MS = 24 * 60 * 60 * 1000;
// Local storage keys
const LS_ACK_ERROR_KEY = 'contact_sync_acknowledged_error';
const LS_ACK_DATE_KEY = 'contact_sync_acknowledged_date';

module.exports = {
	_state: {
		// The current connection error, e.g. 'InvalidToken'
		connectionError: null,
		// Contains the ack'ed value of the connectionError
		acknowledgedError: localStorage.getItem(LS_ACK_ERROR_KEY),
		// Contains the date the error was acknowledged
		acknowledgedDate: new Date(localStorage.getItem(LS_ACK_DATE_KEY) || '1999/01/01'),
		// Timer used to poll the contact-sync backend
		pollTimer: null,
		// Event listeners to be called
		listeners: []
	},

	addEventListener(listener) {
		this._state.listeners.push(listener);
		this.emit(listener);
		this.ensureServerPolling();
	},

	removeEventListener(callback) {
		this._state.listeners = this._state.listeners.filter((cb) => cb !== callback);
	},

	acknowledgeConnectionError() {
		this._state.acknowledgedError = this._state.connectionError;
		this._state.acknowledgedDate = new Date();

		localStorage.setItem(LS_ACK_ERROR_KEY, this._state.acknowledgedError);
		localStorage.setItem(LS_ACK_DATE_KEY, this._state.acknowledgedDate);

		this.broadcast();
	},

	ensureServerPolling() {
		if (this._state.pollTimer) {
			return;
		}

		this.poll();
		this._state.pollTimer = setInterval(this.poll.bind(this), POLL_SERVER_INTERVAL_MS);
	},

	async poll() {
		const token = cookies.get('pipe-session-token');

		try {
			// Fetch the latest data from the server. In case of error fail silently.
			const response = await whatwg.fetch(
				`/api/v1/contact-sync-api/status/me?session_token=${token}`
			);
			const body = await response.json();

			this.handleServerResponse(body);
		} catch (e) {
			// ignore error
		}
	},

	handleServerResponse(body) {
		const connection = _.get(body, 'data.connections[0]', null);

		if (!connection) {
			return;
		}

		this._state.connectionError = _.get(connection, 'error');

		this.broadcast();
	},

	broadcast() {
		this._state.listeners.forEach((listener) => this.emit(listener));
	},

	emit(listener) {
		const event = {
			errorCode: null
		};

		if (this._state.connectionError) {
			const acknowledgeMs = this._state.acknowledgedDate.getTime();
			const hasAcknowledged = this._state.acknowledgedError === this._state.connectionError;
			const hasExpired = new Date().getTime() - acknowledgeMs > ACKNOWLEDGE_EXPIRY_MS;

			if (!hasAcknowledged || (hasAcknowledged && hasExpired)) {
				event.errorCode = this._state.connectionError;
			}
		}

		listener(event);
	}
};
