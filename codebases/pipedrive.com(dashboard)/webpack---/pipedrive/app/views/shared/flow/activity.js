const Pipedrive = require('pipedrive');
const _ = require('lodash');
const { sanitizeHtml } = require('@pipedrive/sanitize-html');
const User = require('models/user');
const FileModel = require('models/file');
const DropMenu = require('views/ui/dropmenu');
const RelatedItemsView = require('views/shared/activity-relateditems');
const ActivityDeleteConfirmationDialog = require('views/activity-delete-confirmation-dialog')
	.default;
const Template = require('templates/shared/flow/activity.html');
const CUIAudioPlayer = require('./cui-audio-player');
const ActivityAnalytics = require('utils/analytics/activity-analytics');
const { isConferenceLinkEnabled } = require('utils/conference-meeting-utils');
const modals = require('utils/modals');

const $ = require('jquery');
const foldableHtmlTags = ['<div', '<ul', '<ol', '<br', '<p', '<table'];

module.exports = Pipedrive.View.extend({
	template: _.template(Template),
	foldable: null,

	/**
	 * Related deal or person model
	 * @type {Model}
	 */
	relatedModel: null,

	additionalData: null,

	initialize: function(options) {
		this.options = options || {};

		this.relatedModel = this.options.relatedModel;
		this.flowItemModel = this.options.flowItemModel;
		this.conferenceMeetingIntegrations = this.options.conferenceMeetingIntegrations;

		this.activeVideoConferenceMeeting = this.conferenceMeetingIntegrations.find(
			(integration) => integration.client_id === this.model.get('conference_meeting_client')
		);

		this.activeMeetingJoinText = this.activeVideoConferenceMeeting
			? this.activeVideoConferenceMeeting.join_title
			: _.gettext('Join Meeting');

		this.hasActiveCalendarSync = this.options.hasActiveCalendarSync;

		this.initSubViews();
		this.render();
		this.model.onChange(
			'done subject type due_date due_time note owner_name participants reference_type',
			this.render,
			this
		);

		this.onWindow(
			`resize.activityNote${this.relatedModel.id}`,
			_.bind(this.updateFoldableClass, this)
		);

		this.onWindow(
			`resize.viewContainer${this.relatedModel.id}`,
			_.bind(this.calculateItemDetailsWidth, this)
		);
	},

	templateHelpers: function() {
		return {
			note: sanitizeHtml(this.model.get('note'), { replaceLinks: true }),
			title: this.model.get('subject') || `(${_.gettext('no title')})`,
			relativeDate: this.model.getRelativeDate(),
			done: this.model.get('done'),
			relativeStatus: this.getRelativeStatus(),
			ownerName: this.flowItemModel.getOwnerName(),
			audioFile: this.model.has('file'),
			isFoldable: this.isFoldable(),
			conferenceLinksEnabled: isConferenceLinkEnabled(User.companyFeatures),
			conferenceMeetingIntegrationInstalled: !!this.activeVideoConferenceMeeting,
			joinMeetingText: this.activeMeetingJoinText,
			conferenceLink: this.sanitizeConferenceLink(this.model.get('conference_meeting_url'))
		};
	},

	initSubViews: function() {
		if (this.model.has('file')) {
			this.model.file = new FileModel(this.model.get('file'));

			this.audioPlayerView = new CUIAudioPlayer({
				model: this.model,
				fileModel: this.model.file
			});

			this.model.file.on('destroy', () => {
				this.audioPlayerView.destroy();
			});

			this.addView('.audioPlayerModel', this.audioPlayerView);
		}

		if (this.options.relatedModel) {
			this.relatedItems = new RelatedItemsView({
				model: this.model,
				relatedModel: this.options.relatedModel,
				containerClassName: 'flowItemDetails'
			});

			this.addView('.relatedItems', this.relatedItems);
		}
	},

	changeActivityStatus: function(ev) {
		const input = ev.target;
		const $label = $(input).closest('label');
		const status = $(input).is(':checked');
		const action = status ? 'marked_done' : 'marked_undone';

		$label.removeClass('active').addClass('default');

		this.model.save(
			{ done: status },
			{
				wait: true
			}
		);

		ActivityAnalytics.trackActivityMarkedAsDoneAndUndone({ model: this.model, action });
	},

	editActivity: function() {
		const options = {
			model: this.model,
			activity: this.model.id
		};

		options[this.relatedModel.type] = this.relatedModel;

		this.openEditActivityModal(options);
	},

	openEditActivityModal: function(options) {
		modals.open('webapp:modal', {
			modal: 'activity/edit',
			params: options
		});
	},

	deleteActivity: function() {
		this.confirmationDialog = new ActivityDeleteConfirmationDialog({
			container: this.$('#activityDeleteConfirmationDialog').get(0),
			attendees: this.model.get('attendees'),
			activityType: this.model.get('type'),
			referenceType: this.model.get('reference_type'),
			onConfirm: () => this.model.destroy(),
			hasActiveCalendarSync: this.hasActiveCalendarSync
		});
		this.confirmationDialog.render();
	},

	showNote: function() {
		if (this.isFoldable()) {
			const $note = this.$('.activityNote');

			this.noteStyle = $note.attr('style');
			$note.addClass('open');
			$note.removeAttr('style');
			this.$('.contentHtml').removeClass('isInline');

			this.$('.showLess').removeClass('hidden');
			this.$('.showMore').addClass('hidden');

			this.$('.closeActivityNote .showLess').on('click', _.bind(this.hideNote, this));
		}

		this.foldNoteTable();
	},

	foldNoteTable: function() {
		const $activityNote = this.$('.activityNote');

		if ($activityNote.find('table').length && !$activityNote.hasClass('open')) {
			$activityNote.addClass('foldedTable');
		} else {
			$activityNote.removeClass('foldedTable');
		}
	},

	hideNote: function(ev) {
		if (ev) {
			ev.stopPropagation();
		}

		const $note = this.$('.activityNote');

		this.$('.closeActivityNote').off('click.closeNote');
		$note.removeClass('open');
		$note.attr('style', this.noteStyle);
		this.$('.contentHtml').addClass('isInline');

		this.$('.showLess').addClass('hidden');
		this.$('.showMore').removeClass('hidden');

		this.foldNoteTable();
	},

	isFoldable: function() {
		const scrollWidth = this.$('.contentHtml')[0] ? this.$('.contentHtml')[0].scrollWidth : 0;

		let foldable = scrollWidth > this.$('.contentHtml').innerWidth();

		if (!foldable && this.model.get('note')) {
			_.forEach(
				foldableHtmlTags,
				_.bind(function(tag) {
					if (this.model.get('note').search(tag) !== -1) {
						foldable = true;

						return false;
					}
				}, this)
			);
		}

		return foldable;
	},

	getRelativeStatus: function() {
		if (!this.model.isDone() && this.model.isOverdue()) {
			return 'overdue';
		}

		if (!this.model.isDone() && this.model.isToday()) {
			return 'today';
		}

		// Activity is done or in the future
		return '';
	},

	createActivitySettings: function() {
		const self = this;

		this.selectSettings = new DropMenu({
			target: this.$('.selectSettingsButton[data-type=activity]'),
			ui: 'arrowDropmenu',
			alignRight: true,
			activeOnClick: false,
			getContentOnOpen: true,
			onOpen: function(d, dropMenuCallback) {
				const data = [];

				data.push({
					title: _.gettext('Edit'),
					className: 'edit',
					click: function() {
						self.editActivity();
					}
				});

				if (self.model.get('done')) {
					data.push({
						title: _.gettext('Mark as ‘To do’'),
						className: 'markUndone',
						click: function() {
							self.model.save({ done: false });
						}
					});
				} else {
					data.push({
						title: _.gettext('Mark as done'),
						className: 'markDone',
						click: function() {
							self.model.save({ done: true });
						}
					});
				}

				data.push({
					title: _.gettext('Export as ICS'),
					className: 'export',
					href: `${app.config.baseurl}/activity/ics/${self.model.id}`
				});

				if (User.settings.get('can_delete_activities')) {
					data.push({
						title: _.gettext('Delete'),
						className: 'delete',
						click: function() {
							self.deleteActivity();
						}
					});
				}

				d.config.data = data;
				dropMenuCallback();
			}
		});
	},

	updateFoldableClass: function() {
		if (this.isFoldable()) {
			this.$('.activityNote').addClass('foldable');
		} else {
			this.$('.activityNote').removeClass('foldable');
		}

		this.foldNoteTable();
	},

	onAttachedToDOM: function() {
		this.updateFoldableClass();
		this.calculateItemDetailsWidth();
	},

	selfRender: function() {
		const templateHelpers = this.getTemplateHelpers();

		if (_.isObject(templateHelpers)) {
			this.$el.html(this.template(templateHelpers));
		}

		this.$('.markAsDone input').on('change', _.bind(this.changeActivityStatus, this));
		this.$('.activityWrapper').on('click.editActivity', _.bind(this.editActivity, this));
		this.$('.activityNote .showMore').on('click', _.bind(this.showNote, this));
		this.$('.installIntegrationLink').on(
			'click',
			ActivityAnalytics.trackInstallIntegrationLinkClicked
		);
		this.$('.joinButton').on('click', () => {
			ActivityAnalytics.trackJoinButtonClicked(this.activeVideoConferenceMeeting);
		});

		this.createActivitySettings();
	},

	/**
	 * calcItemDetailsWidth Calculates flowComponent width on resizing
	 * and checks if flowItemDetails and relatedItems can fit on the same line
	 */
	calculateItemDetailsWidth: function() {
		const dateWidth = this.$('.flowComponent .flowItemDetails > span:nth-child(1)').width();
		const separatorWidth = this.$(
			'.flowComponent .flowItemDetails > span:nth-child(2)'
		).width();
		const iconsWidth =
			this.$('.applicationIcon.dropdown').width() +
			this.$('.applicationIcon.deal').width() +
			this.$('.applicationIcon.organization').width() +
			separatorWidth +
			25;
		const userNameWidth = this.$('.flowComponent .flowItemDetails > span:nth-child(3)').width();
		const firstRelatedItemWidth = this.$(
			'.relatedItems .flowItemDetails > li:nth-child(1) > a'
		).width();
		const secondRelatedItemWidth = this.$(
			'.relatedItems .flowItemDetails > li:nth-child(2) > a'
		).width();
		const flowComponentWidth = this.$('.flowComponent').width();
		const secondRowWidth = firstRelatedItemWidth + secondRelatedItemWidth + iconsWidth;
		const allElementsWidth =
			dateWidth +
			separatorWidth +
			userNameWidth +
			firstRelatedItemWidth +
			secondRelatedItemWidth +
			iconsWidth;

		this.$('.flowItemDetails').toggleClass('nextRow', allElementsWidth > flowComponentWidth);
		this.$('ul.flowItemDetails > li').toggleClass(
			'maxWidth',
			secondRowWidth > flowComponentWidth
		);
	},

	afterRender: function() {
		this.initTooltips();
	},

	sanitizeConferenceLink: function(conferenceLink) {
		const allowedProviders = {
			zoom: /(http)s?:\/\/.*zoom.us\/.+\/\w+/,
			microsoft: /(http)s?:\/\/.*teams.microsoft.com\/.+\/meetup-join\/.+/,
			google: /(http)s?:\/\/meet.google.com\/.+/
		};

		for (const provider in allowedProviders) {
			if (allowedProviders[provider].test(conferenceLink)) {
				return conferenceLink;
			}
		}
	},

	initTooltips: function() {
		const isDone = this.model.get('done');

		this.$('.input.markAsDone').tooltip({
			tip: isDone ? _.gettext('Mark as not done') : _.gettext('Mark as done'),
			position: 'top'
		});

		this.$('.closeActivityNote button').each((key, el) => {
			$(el).tooltip({
				tip: $(el).data('tooltip'),
				position: 'top'
			});
		});
	}
});
