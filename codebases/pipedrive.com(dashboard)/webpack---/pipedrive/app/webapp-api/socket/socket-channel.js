import { Model } from '@pipedrive/webapp-core';
import _ from 'lodash';
import Cookies from 'js-cookie';
import { fibonacciBackoff as backoff } from './backoffs';

const defaultSocketUrl = app.config.socket;
const buildFullDomain = function buildFullDomain(connectionInfo) {
	if (connectionInfo.isLocal) {
		return `.local.${connectionInfo.domain}`;
	}

	const domainParts = connectionInfo.domain.split('.');

	if (domainParts.length > 1 && domainParts[0] === connectionInfo.region) {
		return `.${connectionInfo.domain}`;
	}

	return `.${connectionInfo.region}.${connectionInfo.domain}`;
};
const buildUrlFromConnectionInfo = function buildUrlFromConnectionInfo(connectionInfo) {
	return [
		`${location.protocol}//${connectionInfo.subdomain}${connectionInfo.channel}`,
		buildFullDomain(connectionInfo),
		'/sockjs'
	].join('');
};
const SocketChannel = Model.extend({
	pendingCallbacks: [],
	ready: false,
	fetching: false,
	channelUrl: null,
	initialize: function(data, { user }) {
		this.user = user;
		this.fetchConnectionInfo = backoff(this.fetchConnectionInfo, this);
	},
	channelUrlResolved: function channelUrlResolved(channelUrl) {
		this.channelUrl = channelUrl;
		this.ready = true;
		this.applyPendingCallbacks(channelUrl);
	},
	applyPendingCallbacks: function applyPendingCallbacks(channelUrl) {
		_.each(this.pendingCallbacks, function(pendingCallback) {
			pendingCallback.callback(channelUrl);
		});
	},
	fetchConnectionInfo: function fetchConnectionInfo(callback) {
		if (this.ready) {
			return callback(this.channelUrl);
		}

		const self = this;

		if (_.isFunction(callback)) {
			this.pendingCallbacks.push({ callback });
		}

		if (!this.fetching) {
			this.fetching = true;
			this.fetch({
				url: '/ws-connection-info',
				data: {
					session_token: Cookies.get('pipe-session-token')
				},
				success: function(wsConnectionInfo) {
					self.fetching = false;
					const channelUrl = buildUrlFromConnectionInfo(wsConnectionInfo.toJSON());

					self.channelUrlResolved(channelUrl);
					self.fetchConnectionInfo.reset();
				},
				error: function() {
					self.fetching = false;
					self.fetchConnectionInfo();
				}
			});
		}
	},
	getChannel: function getChannel(callback) {
		const done = () => {
			callback(this.channelUrl);
		};

		if (this.channelUrl) {
			return done();
		}

		const wgwActive = this.user.get('wgw_active');

		if (!wgwActive) {
			this.channelUrlResolved(defaultSocketUrl);

			return done();
		}

		this.fetchConnectionInfo(done);
	}
});

export default SocketChannel;
