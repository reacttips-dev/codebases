import _ from 'lodash';
import Logger from '@pipedrive/logger-fe';
import { Model } from '@pipedrive/webapp-core';
import { put } from '@pipedrive/fetch';

import EioSocket from './eio';
import SocketChannel from './socket-channel';
import { fibonacciBackoff as backoff } from './backoffs';

const logger = new Logger('socket', 'connection');
const CHANNEL_REGEX = /(channel\d*)\./;

const isBrowserIgnored = function() {
	const userAgent = navigator.userAgent;
	const IGNORED_AGENTS = ['PhantomJS', 'PingdomTMS'];

	return _.reduce(
		IGNORED_AGENTS,
		function(isIgnored, agent) {
			return !!userAgent.match(new RegExp(agent, 'ig')) || isIgnored;
		},
		false
	);
};
const makeReconnectionSeed = function makeReconnectionSeed(seed) {
	return function reconnectSeed() {
		return Math.round(Math.random() * 100 * seed) % 10000;
	};
};

const channelSwitcher = {
	isChannelSwitchRequested: function isChannelSwitchRequested(data) {
		return !!data.switch_to_channel;
	},

	computeConnectionUrl: function(existingChannel, newChannel) {
		const channelDomain = existingChannel;
		const newChannelDomain = channelDomain.match(/\d+/)
			? channelDomain.replace(/\d+/, newChannel)
			: channelDomain + newChannel;

		return this.connectionUrl.replace(channelDomain, newChannelDomain);
	},

	switchToChannel: function switchToChannel(data) {
		const switchToChannelNr = data.switch_to_channel;
		const existingChannel = this.connectionUrl.match(CHANNEL_REGEX);

		if (!existingChannel || existingChannel.length !== 2) {
			return;
		}

		const newConnectionUrl = channelSwitcher.computeConnectionUrl.call(
			this,
			existingChannel[1],
			switchToChannelNr
		);

		this.reconnectToUrl(newConnectionUrl);
	}
};

const messageHandler = {
	validateMessageSequenceNumber: function validateMessageSequenceNumber(data) {
		// Check order of socket messages
		if (data.message_sequence) {
			logger.log('Message no.', data.message_sequence);

			if (this.lastSeenMessage > data.message_sequence) {
				logger.warn(
					'Order of messages is wrong',
					this.lastSeenMessage,
					'-->',
					data.message_sequence
				);
			}

			this.lastSeenMessage = data.message_sequence;
		}
	},

	logMessageText: function logMessageText(data) {
		if (data.messageText) {
			logger.log('message', data.messageText);
		}
	},

	logUnhandledMessage: function logUnhandledMessage(data) {
		if (!data.routingKey) {
			logger.log('unhandled', JSON.stringify(data));
		}
	},

	storeRuntimeMessage: function storeRuntimeMessage(data) {
		if (data.routingKey && app.ENV !== 'live') {
			if (!app.socketMessages) {
				app.socketMessages = [];
			}

			app.socketMessages.push({
				timestamp: new Date(),
				data
			});
		}
	},

	routeMessage: function routeMessage(data) {
		if (data.routingKey) {
			if (data.routingKey === 'auth') {
				logger.log(`auth: ${data.auth ? 'success' : 'failed'}`, JSON.stringify(data));

				if (data.auth) {
					this.fire('ready');
				} else {
					logger.log('auth', 'Failed, reconnecting');

					this.user.jwt.invalidate();
					this.reconnect();
				}
			} else {
				logger.log('routing', JSON.stringify(data));
				_.forEach(this.bindings, function(list, route) {
					if (data.routingKey.match(new RegExp(route))) {
						_.forEach(list, function(binding) {
							binding.callback.call(binding.context, data);
						});
					}
				});
			}
		}
	}
};

const local = {
	connectionOpened: function connectionOpened() {
		const self = this;

		logger.log(
			'opened',
			`Watch company ${self.user.get('company_id')}, user ${self.user.get('id')}`
		);

		self.fire('open');
		self.ready = true;
		self.connectionOpen = true;

		app.global.fire('socket.connection.event.open');

		// connection is open, but without auth nothing is coming in
		self.user.jwt.getValidJwt(function(jwt) {
			// don't trust socket auth response, get every time new one
			self.user.jwt.invalidate();

			// send jwt for auth
			if (self.connectionOpen) {
				self.message({ jwt });
				self.reconnect.reset();

				put('/api/v1/users/trigger_counts_update', {}).catch((error) => {
					logger.remote('error', 'Triggering counts update failed', {
						error: error && error.message
					});
				});
			}
		}, _.bind(self.reconnect, self));
	},

	connectionClosed: function connectionClosed() {
		// If forcefully unloaded, do not reconnect
		if (this.unloaded) {
			return;
		}

		this.ready = false;
		this.connectionOpen = false;

		logger.log('Connection closed, reconnecting');
		this.reconnect();
	},

	heartbeatReceived: function heartbeatReceived() {
		const self = this;

		logger.log('Heartbeat', self.connectionOpen);

		if (!self.connectionOpen) {
			self.connectionOpen = true;
			app.global.fire('socket.connection.event.open');
		}

		clearTimeout(self.connectionTimeout);
		self.connectionTimeout = setTimeout(function() {
			logger.log('Heartbeat failed. Connection closed, reconnecting');
			self.reconnect();
			self.connectionTimeout = null;
		}, self.maxConnectionTimeout);
	},

	incomingMessage: function incomingMessage(rawdata) {
		let data = rawdata;

		if (!_.isObject(data)) {
			try {
				data = JSON.parse(data);
			} catch (err) {
				throw new Error(`Could not parse socketqueue data | rawdata = ${rawdata}`);
			}
		}

		if (channelSwitcher.isChannelSwitchRequested(data)) {
			return channelSwitcher.switchToChannel.call(this, data);
		}

		messageHandler.validateMessageSequenceNumber.call(this, data);
		messageHandler.logMessageText(data);
		messageHandler.logUnhandledMessage(data);
		messageHandler.storeRuntimeMessage(data);
		messageHandler.routeMessage.call(this, data);

		app.global.fire('socket.connection.event.message');
	}
};

const Socket = Model.extend({
	listeners: {},
	bindings: {},
	ready: false,
	unloaded: false,
	connectionTimeout: null,
	maxConnectionTimeout: 35000,
	lastSeenMessage: 0,
	connectionUrl: null,

	initialize: function(data, { user }) {
		this.user = user;

		this.socketChannel = new SocketChannel(null, { user });
		this.open = this.open.bind(this);
		this.onNetworkOffline = this.onNetworkOffline.bind(this);
	},

	open: function() {
		if (isBrowserIgnored()) {
			return false;
		}

		if (this.ready) {
			logger.log('open', 'Already started');

			return false;
		}

		if (this.connectionUrl) {
			return this.openSocket();
		}

		this.socketChannel.getChannel(
			_.bind(function(channelUrl) {
				this.connectionUrl = channelUrl;
				this.openSocket();
			}, this)
		);
	},

	openSocket: function() {
		if (!this.connectionUrl || !this.user) {
			return;
		}

		this.socket = new EioSocket(this.connectionUrl, false);
		this.bindListeners();
		this.ready = true;
		this.unloaded = false;
		this.reconnect(false);
		this.reconnect = backoff(this.reconnect, this, {
			seed: makeReconnectionSeed(this.user.get('id'))
		});
	},

	bindListeners: function() {
		self.removeEventListener('socketqueue.reconnect', this.open);
		self.removeEventListener('socketqueue.disconnect', this.onNetworkOffline);
		self.addEventListener('socketqueue.reconnect', this.open);
		self.addEventListener('socketqueue.disconnect', this.onNetworkOffline);

		this.socket.on('open', _.bind(local.connectionOpened, this));
		this.socket.on('message', _.bind(local.incomingMessage, this));
		this.socket.on('close', _.bind(local.connectionClosed, this));
		this.socket.on('heartbeat', _.bind(local.heartbeatReceived, this));
	},

	onNetworkOffline: function() {
		if (!this.connectionOpen) {
			return;
		}

		this.close();
	},

	reconnect: function reconnect(triggerEvents) {
		if (triggerEvents !== false) {
			this.fire('closed');
			app.global.fire('socket.connection.event.close');
		}

		this.connectionOpen = false;
		this.socket.reconnect();
	},

	getMeta: function() {
		return {
			company_id: this.user.get('company_id'),
			user_id: this.user.get('id'),
			user_name: this.user.get('name'),
			host: window.location.host,
			timestamp: (new Date().getTime() / 1000) | 0
		};
	},

	message: function(data) {
		logger.log('out', JSON.stringify(data));
		this.socket.send(
			JSON.stringify(
				_.assignIn(
					{
						routingKey: data.route,
						meta: this.getMeta()
					},
					data
				)
			)
		);
	},

	fire: function(evt) {
		if (evt in this.listeners) {
			_.forEach(this.listeners[evt], function(listener) {
				listener.callback.call(listener.context);
			});
		}
	},

	on: function(evt, callback, context) {
		if (!(evt in this.listeners)) {
			this.listeners[evt] = [];
		}

		this.listeners[evt].push({ callback, context });

		// Ready was already triggered
		if (evt === 'open' && this.ready) {
			callback.call(context);
		}
	},

	route: function(route, callback, context) {
		if (!(route in this.bindings)) {
			this.bindings[route] = [];
		}

		this.bindings[route].push({ callback, context });
	},

	close: function() {
		logger.log('Closed.');

		this.unloaded = true;
		this.ready = false;
		this.connectionOpen = false;
		this.user.jwt.abortLast();

		if (this.socket) {
			this.socket.close();
		}
	},

	reconnectToUrl: function(connectionUrl) {
		this.reconnect.reset();
		this.close();
		this.connectionUrl = connectionUrl;
		this.open();
	}
});

export default Socket;
