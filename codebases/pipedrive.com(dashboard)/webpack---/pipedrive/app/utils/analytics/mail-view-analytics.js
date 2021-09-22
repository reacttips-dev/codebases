const User = require('models/user');
const PDMetrics = require('utils/pd-metrics');
const MailConnections = require('collections/mail/global-singletons/mail-connections');

const getWarningType = () => {
	if (MailConnections.needsNylasReauth()) {
		return 'reauthenticate';
	}

	if (MailConnections.needsUserReconnect()) {
		return 'reconnect';
	}

	return null;
};

const trackViewOpened = () => {
	PDMetrics.trackUsage(null, 'mail_view', 'opened', {
		mail_connected: MailConnections.hasActiveNylasConnection(),
		unread_message_count: User.counts.get('unread_mail_threads_inbox_count'),
		warning: getWarningType()
	});
};

module.exports = {
	trackMailViewOpened: function() {
		if (MailConnections.isReady()) {
			trackViewOpened();
		} else {
			MailConnections.onReady(() => trackViewOpened());
		}
	},

	trackMailViewFolderChanged: function(folder) {
		PDMetrics.trackUsage(null, 'mail_view', 'folder_changed', {
			folder
		});
	},

	warningClicked: function() {
		PDMetrics.trackUsage(null, 'emailsync', 'warning_clicked', {
			warning: getWarningType()
		});
	},

	warningClosed: function() {
		PDMetrics.trackUsage(null, 'emailsync', 'warning_closed', {
			warning: getWarningType()
		});
	}
};
