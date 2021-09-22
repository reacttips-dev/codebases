const Pipedrive = require('pipedrive');
const _ = require('lodash');
const PDMetrics = require('utils/pd-metrics');

const KEY = Pipedrive.common.keyCodes();
const composerHelpers = {
	/**
	 * Get or set if saving is in progress
	 */
	isSaving: function(bool) {
		this.saving = _.isUndefined(bool) ? !!this.saving : bool;

		return this.saving;
	},

	/**
	 * Get or set a boolean, depending on whether there is a save event "in queue".
	 * Used to handle the case when new auto-save attempts happen during mail.save() hasn't finished yet.
	 *
	 * @param  {Boolean} bool
	 * @return {Boolean}
	 */
	isPendingSave: function(bool) {
		this.pendingSave = _.isUndefined(bool) ? !!this.pendingSave : bool;

		return this.pendingSave;
	},

	/**
	 * Get or set if cancelling is in progress
	 */
	isCancelling: function(bool) {
		if (!_.isUndefined(bool)) {
			this.cancelling = bool;
		}

		return this.cancelling;
	},

	/**
	 * Send spinner functions. Hides text in button.
	 */
	showSendSpinner: function($sendButtonText) {
		const $button = this.$('[data-composer="footer"] .cui4-button[type="submit"]');
		const css = {
			width: $button.outerWidth(),
			height: $button.outerHeight(),
			display: 'block'
		};

		this.$('.sendButtonSpinner').css(css);

		if ($sendButtonText) {
			$sendButtonText.css('visibility', 'hidden');
		}
	},

	hideSendSpinner: function($sendButtonText) {
		this.$('.sendButtonSpinner').hide();

		if ($sendButtonText) {
			$sendButtonText.css('visibility', '');
		}
	},

	/**
	 * Save spinner functions
	 */
	showSaveStatus: function() {
		const $indicator = this.$('.saveIndicator');

		if (!$indicator.length) {
			return;
		}

		const $wrap = this.$('.saveStatus');
		const indicatorCss = {
			height: $wrap.outerHeight(),
			display: 'block'
		};

		this.hideSavedText();

		$wrap.find('.savingText').addClass('show');
		$indicator.css(indicatorCss);
	},

	hideSaveStatus: function() {
		const $wrap = this.$('.saveStatus');

		$wrap.find('.savingText').removeClass('show');
		$wrap.find('.savedText').show();
	},

	/**
	 * Disable input, textarea & editable elements
	 */
	disableInputs: function() {
		this.headerView.disableInputs();
		this.$('textarea').prop('disabled', true);
		this.$('.bodyEditor').prop('contenteditable', false);
	},

	/**
	 * Enable input, textarea & editable elements
	 */
	enableInputs: function() {
		this.headerView.enableInputs();
		this.$('textarea').prop('disabled', false);
		this.$('.bodyEditor').prop('contenteditable', true);
	},

	/**
	 * Disable action buttons
	 */
	disableFooterActions: function(sendOnly) {
		const elementsList = `button${sendOnly ? ':not(.discard button)' : ''}`;

		this.$('[data-composer="footer"]')
			.find(elementsList)
			.addClass('disabled')
			.prop('disabled', true);
	},

	/**
	 * Enable action buttons
	 */
	enableFooterActions: function() {
		this.$('[data-composer="footer"]')
			.find('a, button')
			.removeClass('disabled')
			.prop('disabled', false);
	},

	/**
	 * Hides "Saved" text
	 */
	hideSavedText: function() {
		const $wrap = this.$('.saveStatus');

		$wrap.find('.savedText').hide();
	},

	/**
	 * Update bits of HTML in the compose area
	 */
	updateDetails: function() {
		this.$('.savedText').text(_.gettext('Saved'));
	},

	isSendable: function(data) {
		const invalidRecipients = this.draftModel.getInvalidRecipients();
		const noRecipients = _.isEmpty(data.to) && _.isEmpty(data.cc) && _.isEmpty(data.bcc);

		let isSendable = true;

		if (!_.isEmpty(invalidRecipients)) {
			const alertString = _.gettext(
				'"%s" does not appear to be a valid email address. ' +
					'Verify the address and try again.',
				invalidRecipients[0].email_address
			);

			window.alert(alertString);
			isSendable = false;
		} else if (noRecipients) {
			this.headerView.focusField('to');
			isSendable = false;
		} else if (!data.subject) {
			const confirm = window.confirm(
				_.gettext('This message has no subject. Do you want to send it anyway?')
			);

			if (!confirm) {
				this.headerView.focusField('subject');
				isSendable = false;
			}
		}

		return isSendable;
	},

	draftReadyForSending: function() {
		let readyForSending = true;

		if (this.isSaving()) {
			this.once('saved', this.sendMail, this);
			readyForSending = false;
		} else if (this.draftModel.isNew()) {
			// The API is not able to send an unsaved draft (for some weird reason)
			this.saveDraft({ success: this.sendMail.bind(this) });
			readyForSending = false;
		} else if (this.ifFileUploadInProgress()) {
			this.sendWhenFilesReady();
			readyForSending = false;
		}

		return readyForSending;
	},

	toggleSendingText: function(showSending) {
		const $sendingText = this.$('[data-composer="footer"] .sendingText');

		this.$('[data-composer="footer"] .saveStatus').toggle(!showSending);

		showSending ? $sendingText.addClass('show') : $sendingText.removeClass('show');
	},

	isDeleting: function(ev) {
		return ev.keyCode === KEY.backspace || ev.keyCode === KEY.delete;
	},

	sendPageActionMetrics: function(action) {
		PDMetrics.trackUsage(null, 'mail_view', 'action_taken', {
			'mail-v2.feature': 'mail-composer',
			'mail-v2.action': action
		});
	}
};

module.exports = composerHelpers;
