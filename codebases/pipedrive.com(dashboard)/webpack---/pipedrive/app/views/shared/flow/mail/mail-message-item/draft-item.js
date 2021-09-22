/* eslint-disable camelcase */
const _ = require('lodash');
const Pipedrive = require('pipedrive');
const logger = new Pipedrive.Logger('mailDraft');
const PDMetrics = require('utils/pd-metrics');
const { remove } = require('@pipedrive/fetch');
const webappComponentLoader = require('webapp-component-loader');
const template = require('./draft-item.html');
const DropMenu = require('views/ui/dropmenu');
const ConfirmationDialog = require('views/ui/confirmation-dialog');
const snackbar = require('snackbars');

const DraftView = Pipedrive.View.extend({
	template: _.template(template),

	events: {
		'click .title': 'onOpenThreadModalClick',
		'click .scheduledEmailDropdownBtn': 'renderDropdown'
	},

	initialize: function(options) {
		this.options = options;
		this.isQueued = !_.isEmpty(this.model.get('mail_queue'));
		this.isScheduled = this.model.get('mail_queue')?.priority_type?.startsWith('scheduled');
		this.model.onChange('subject snippet', this.render, this);
		this.bindMailQueuelliEvents();
	},

	getTemplateHelpers: function() {
		if (this.isQueued) {
			this.model.itemTimestamp = this.model.get('mail_queue')?.delay_until_time;
		}

		return {
			model: this.model,
			isQueued: this.isQueued,
			isScheduled: this.isScheduled,
			scheduledMailTimestamp: _.gettext('Scheduled for %s', this.model.getFormattedDate())
		};
	},

	onOpenThreadModalClick: async function() {
		if (this.isQueued) {
			const router = await webappComponentLoader.load('froot:router');

			this.sendMetrics('open-scheduled-mail-in-outbox');

			return router.navigateTo('/mail/outbox');
		}

		this.sendMetrics('open-draft-in-modal');

		const params = this.getModalDefaultOpts();

		this.openThreadModal(params);
	},

	renderDropdown: function() {
		this.scheduledMailDropdown.render();
	},

	afterRender: function() {
		if (this.isQueued && !this.scheduledMailDropdown) {
			this.scheduledMailDropdown = new DropMenu({
				target: this.$('.scheduledEmailDropdownBtn'),
				className: 'mailScheduleDropdown',
				alignRight: true,
				activeOnClick: false,
				data: [
					{
						titleHtml: _.gettext('Cancel and move to drafts'),
						click: () => this.onDeleteClick('keepDraft')
					},
					{
						titleHtml: _.gettext('Cancel and delete'),
						click: () => this.onDeleteClick()
					}
				]
			});
		}
	},

	removeMailQueueItem: function(type) {
		remove(
			`/api/v1/mailbox/mailQueue/${this.model.get('mail_queue').mail_queue_id}${
				type ? `?${type}` : ''
			}`
		).catch((err) => {
			logger.warn('Cancelling scheduled mail failed', {
				error: err && err.message
			});
		});

		snackbar.show({
			text: _.gettext(
				type === 'keepDraft'
					? 'Message has been moved to drafts'
					: 'Message has been deleted'
			)
		});

		PDMetrics.trackUsage(null, 'email_schedule', 'cancelled', {
			deletion_type: type,
			thread_id: this.model.get('id')
		});

		if (type) {
			this.model.set('mail_queue', null);
			this.model.itemTimestamp = null;
			this.isQueued = null;

			return this.render();
		}

		this.destroy();
	},

	onDeleteClick: function(type) {
		const confirmMessageTitle = type
			? _.gettext(
					'Are you sure you want to cancel the sending and move this email to the drafts?'
			  )
			: _.gettext('Are you sure you want to cancel the sending and delete this email?');
		const dialogBody = type
			? _.gettext('This message will be moved to your drafts folder.')
			: _.gettext('This message will be permanently deleted. You cannot restore it later.');
		const secondaryButtonTitle = type
			? _.gettext('Cancel and move to drafts')
			: _.gettext('Cancel and delete');

		this.confirmationDialog = new ConfirmationDialog({
			el: 'body',
			title: confirmMessageTitle,
			message: dialogBody,
			primaryButton: {
				title: _.gettext('Keep as is')
			},
			secondaryButton: {
				title: secondaryButtonTitle,
				color: 'red',
				onClick: () => this.removeMailQueueItem(type)
			}
		});

		this.confirmationDialog.render();
	},

	addScheduledParamsToDraft: function(updateSocketEvent) {
		if (updateSocketEvent.get('mail_message_id') === this.model.get('id')) {
			this.model.set('mail_queue', {
				delay_until_time: updateSocketEvent.get('delay_until_time'),
				mail_queue_id: updateSocketEvent.get('id'),
				priority_type: updateSocketEvent.get('priority_type'),
				status: updateSocketEvent.get('status')
			});

			this.isQueued = !_.isEmpty(this.model.get('mail_queue'));
			this.isScheduled = this.model.get('mail_queue')?.priority_type?.startsWith('scheduled');
			this.render();
		}
	},

	removeScheduledParamsFromDraft: function(cancelledItemID) {
		// eslint-disable-next-line camelcase
		if (this.model.get('mail_queue')?.mail_queue_id === cancelledItemID) {
			this.model.set('mail_queue', null);
			this.model.itemTimestamp = null;
			this.isQueued = null;
			this.isScheduled = null;
			this.scheduledMailDropdown = null;

			return this.render();
		}
	},

	bindMailQueuelliEvents: function() {
		app.global.bind('mailQueueItem.model.*.add', this.addScheduledParamsToDraft, this);
		app.global.bind('mailQueueItem.model.*.delete', this.removeScheduledParamsFromDraft, this);
	},

	onUnload: function() {
		this.scheduledMailDropdown = null;
		app.global.unbind('mailQueueItem.model.*.add', this.addScheduledParamsToDraft, this);
		app.global.unbind(
			'mailQueueItem.model.*.delete',
			this.removeScheduledParamsFromDraft,
			this
		);
	},

	/**
	 * Get default data for modal
	 * @return {Object}
	 */
	getModalDefaultOpts: function() {
		return {
			threadId: this.model.get('mail_thread_id')
		};
	},

	openThreadModal: async function(params) {
		const modals = await webappComponentLoader.load('froot:modals');

		app.global.fire('deal.flow.compose.close', { tab: 'email', id: this.model.get('id') });
		modals.open('webapp:modal', { modal: 'mail/thread', params });
	},

	sendMetrics: function(action) {
		PDMetrics.trackUsage(null, 'mail_view', 'action_taken', {
			'mail-v2.feature': 'draft-item',
			'mail-v2.action': action,
			'mail-v2.param.where': 'flow',
			'mail-v2.param.type': this.options.relatedModel.type
		});
	}
});

module.exports = DraftView;
