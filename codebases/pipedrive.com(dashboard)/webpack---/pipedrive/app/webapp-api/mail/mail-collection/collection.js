const { Collection } = require('@pipedrive/webapp-core');

const Pipedrive = require('pipedrive');
const _ = require('lodash');
const MailConnectionModel = require('models/mail/mail-connection');
const moment = require('moment');
const logger = new Pipedrive.Logger('mail-connections-util');
const $ = require('jquery');
const Cookies = require('js-cookie');
const snackbar = require('snackbars');

module.exports = Collection.extend({
	model: MailConnectionModel,
	url: `${app.config.api}/mailbox/mailConnections`,
	retryCount: 0,
	maxRetries: 3,
	ready: false,
	callbacks: [],
	user: null,
	initializingFailedCallbacks: [],

	parse: function(response) {
		return response.data;
	},

	updateMailConnection: function(model) {
		const existingConnection = this.findWhere({ id: model.get('id') });

		if (model.isRevoked()) {
			if (existingConnection) {
				return this.remove(model);
			}

			return;
		}

		if (existingConnection) {
			const currentUpdateTime = moment(existingConnection.get('update_time')).unix();
			const newUpdateTime = moment(model.get('update_time')).unix();

			if (newUpdateTime > currentUpdateTime) {
				existingConnection.set(model.attributes);
			}
		} else {
			this.add(model);
		}
	},

	setAsReady: function() {
		this.ready = true;
		this.retryCount = 0;

		this.callbacks.forEach((callback) => {
			callback();
		});
		this.initializingFailedCallbacks = [];
	},

	initializingFailed: function(error) {
		this.initializingFailedCallbacks.forEach((callback) => {
			callback(error);
		});
	},

	onPullError: function(error) {
		if (this.retryCount < this.maxRetries) {
			this.retryCount++;
			this.initialPull();
		} else {
			const message = `Failed to pull mail-connections collection after ${this.maxRetries} retries.`;

			logger.log(message);
			this.initializingFailed(error);
		}
	},

	nylasSyncEnabled: async function() {
		return this.user.settings.get('nylas_sync');
	},

	hasNeverConnected: function() {
		return !this.length || !this.nylasSyncEnabled();
	},

	/**
	 * Public methods
	 */

	initialPull: function(user, callback, errorCallback) {
		this.user = user ? user : this.user;
		this.callbacks = callback ? [callback] : this.callbacks;
		this.initializingFailedCallbacks = errorCallback
			? [errorCallback]
			: this.initializingFailedCallbacks;

		if (!this.nylasSyncEnabled()) {
			this.setAsReady();

			return;
		}

		app.global.bind('mailConnection.model.*.add', this.updateMailConnection, this);
		app.global.bind('mailConnection.model.*.update', this.updateMailConnection, this);

		this.pull({
			success: this.setAsReady.bind(this),
			error: this.onPullError.bind(this)
		});
	},

	isReady: function() {
		return this.ready;
	},

	onReady: function(callback) {
		if (!this.isReady()) {
			this.callbacks.push(callback);

			return;
		}

		callback();
	},

	onInitializingFailed: function(callback) {
		if (this.isReady()) {
			return;
		}

		this.initializingFailedCallbacks.push(callback);
	},

	hasActiveNylasConnection: function() {
		return !!this.getConnectedNylasConnection();
	},

	getUserMailConnection: function(accountId) {
		return (
			this.isReady() &&
			this.nylasSyncEnabled() &&
			!!this.length &&
			this.findWhere({ account_id: accountId })
		);
	},

	getConnectedNylasConnection: function() {
		return (
			this.isReady() &&
			this.nylasSyncEnabled() &&
			!!this.length &&
			this.findWhere({ disconnect_flag: 0 })
		);
	},

	isMicrosoftConnection: function() {
		if (this.getConnectedNylasConnection()) {
			return ['outlook', 'office365', 'exchange', 'hotmail'].includes(
				this.getConnectedNylasConnection().get('provider')
			);
		} else {
			return true;
		}
	},

	getConnectedNylasEmail: function() {
		return this.getConnectedNylasConnection().get('email_address');
	},

	getSyncProvider: function() {
		return this.hasActiveNylasConnection()
			? this.getConnectedNylasConnection().get('sync_provider')
			: '';
	},

	isNonConnectedGoldOrHigher: function() {
		return this.isReady() && this.user.isGoldOrHigher() && !this.hasActiveNylasConnection();
	},

	needsNylasReauth: function() {
		if (!this.length || this.findWhere({ disconnect_flag: 0 }) || !this.user.isGoldOrHigher()) {
			return false;
		}

		const lastDisconnectedAccount = this.getLastDisconnectedAccount();

		return (
			lastDisconnectedAccount && !!lastDisconnectedAccount.get('needs_reauthentication_flag')
		);
	},

	needsUserReconnect: function() {
		if (
			this.user.settings.get('hide_email_reconnect_warning') ||
			!this.length ||
			this.findWhere({ disconnect_flag: 0 }) ||
			!this.user.isGoldOrHigher()
		) {
			return false;
		}

		const lastDisconnectedAccount = this.getLastDisconnectedAccount();

		return !lastDisconnectedAccount.get('needs_reauthentication_flag');
	},

	getLastDisconnectedAccount: function() {
		const disconnectedAccounts = this.where({ disconnect_flag: 1 });

		return _.maxBy(disconnectedAccounts, (account) => {
			return account.get('disconnect_time');
		});
	},

	reconnectLastDisconnectedAccount: function() {
		const account = this.getLastDisconnectedAccount();
		const token = Cookies.get('pipe-session-token');

		$.ajax({
			url: `${app.config.api}/mailbox/mailConnections/${account.get(
				'account_id'
			)}/reconnect?session_token=${token}`,
			type: 'PUT',
			success: function() {
				snackbar.show({
					text: _.gettext(
						'Your email account %s is now connected',
						account.get('email_address')
					)
				});
			},
			error: function() {
				snackbar.show({
					text: _.gettext('Can’t connect your email account. Please try again later.')
				});
			}
		});
	},

	isPastSyncing: function() {
		const currentConnection = this.getConnectedNylasConnection();

		return !!(
			currentConnection &&
			['initialising', 'in_progress', 'time_chosen'].includes(
				currentConnection.get('past_sync_status')
			)
		);
	},

	getPastSyncProgressInfo: function() {
		const currentConnection = this.getConnectedNylasConnection();
		const syncCounts = currentConnection.get('sync_counts');
		const syncedCount = _.get(syncCounts, 'synced_count');
		const totalCount = _.get(syncCounts, 'total_count');

		return syncCounts && syncedCount < totalCount ? { syncedCount, totalCount } : null;
	},

	getConnectLink: function() {
		let link;

		if (this.user.companyFeatures.get('3party_auth')) {
			link = '/settings/email-sync';
		} else {
			link = _.get(this.user.get('3rd_party_auth_links'), 'nylas');

			const companyId = this.user.get('company_id');
			const companyDomain = this.user.getCompanyDomainName();
			const nylasLinkFromUserModelEmpty = _.isEmpty(link);
			const hasConnections = !!this.length;

			if (hasConnections || (nylasLinkFromUserModelEmpty && !companyDomain)) {
				link = '/settings/email-sync';
			} else if (nylasLinkFromUserModelEmpty && companyDomain) {
				link = `/connect/redirect_to_3rd_party_auth?company_id=${companyId}&party=nylas&origin_domain=${companyDomain}`;
			}
		}

		return app.config.baseurl + link;
	},

	getAuthLink: function() {
		if (this.user.companyFeatures.get('3party_auth')) {
			return `${app.config.baseurl}/settings/email-sync`;
		} else {
			return `${app.config.baseurl}${_.get(this.user.get('3rd_party_auth_links'), 'nylas')}`;
		}
	},

	/**
	 * Defines whether user has permissions to use email tracking or not
	 */
	isEmailTrackingEnabled: function() {
		return !!this.user.settings.get('can_use_email_tracking');
	}
});
