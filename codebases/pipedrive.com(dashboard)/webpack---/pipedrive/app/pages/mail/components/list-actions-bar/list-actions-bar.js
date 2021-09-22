'use strict';

const Pipedrive = require('pipedrive');
const _ = require('lodash');
const User = require('models/user');
const DropMenu = require('views/ui/dropmenu');
const ConfirmationDialog = require('views/ui/confirmation-dialog');
const SearchView = require('../search/search');
const snackbars = require('snackbars');
const $ = require('jquery');
const MailConnections = require('collections/mail/global-singletons/mail-connections');
const PDMetrics = require('utils/pd-metrics');
const componentLoader = require('webapp-component-loader');

const ThreadListActionsBarView = Pipedrive.View.extend({
	templateHelpers: {},

	currentCount: 0,

	events: {
		'click .selectAllCheckbox input': 'onSelectAllCheckboxClicked',
		'click .unselect': 'onSelectedIndicatorUnselectClicked',
		'click .selectAllCheckbox.inputWrapper': 'delegateClickToCheckbox',
		'click .filter': 'openFiltersPopover',
		'click .clearFilters': 'clearFilters'
	},

	initialize: function(options) {
		this.options = _.isObject(options) ? options : {};
		this.threadsCollection = this.options.collectionStack.getStackedCollection(
			`threads/${this.section}`
		);
		this.listenTo(this.threadsCollection, 'filters:change', this.updateFiltersText);
		this.listenTo(this.threadsCollection, 'filters:applied', this.onFiltersSuccess);
		this.listenTo(MailConnections.instance, 'change', this.setAndUpdateConversationCounter);

		this.initializeSearchView();
	},

	getTemplateHelpers: function() {
		return {
			filtersButtonText: this.getFiltersButtonText(),
			hasActiveFilters: this.threadsCollection.isAnyFilterActive()
		};
	},

	onLoad: function() {
		this.bindEvents();
		this.render();
	},

	afterRender: function() {
		this.initializeDropMenus();
		this.initTooltip();
		this.$('.refresh a').on('click', _.bind(this.onThreadlistRefreshClicked, this));
	},

	initializeSearchView: function() {
		this.searchView = new SearchView({
			collectionStack: this.options.collectionStack,
			section: this.section
		});
		this.addView({
			'.search': this.searchView
		});
	},

	initTooltip: function() {
		this.$('.refresh a').tooltip({
			tip: this.$('.refresh a').data('tooltip'),
			position: 'bottom'
		});

		this.$('.deselect').tooltip({
			tip: _.gettext('Clear selection'),
			position: 'bottom-end'
		});

		this.initClearFiltersTooltip();
	},

	initClearFiltersTooltip: function() {
		this.$('.clearFilters a').tooltip({
			tip: _.gettext('Clear filter'),
			position: 'bottom'
		});
	},

	initializeDropMenus: function() {
		// select items dropmenu
		const bulkSelectData = this.getBulkSelectDropMenuOptions();

		this.bulkSelectDropMenu = new DropMenu({
			target: this.$('.bulkEditDropdown'),
			className: 'bulkSelectDropmenu',
			ui: 'arrowDropmenu',
			data: bulkSelectData,
			activeOnClick: true,
			onOpen: _.bind(this.onBulkSelectDropMenuOpen, this)
		});

		// mark dropmenu if items selected
		const selectedStateMarkData = this.getSelectedMarkDropMenuOptions();

		this.selectedMarkDropMenu = new DropMenu({
			target: this.$('.markSelected'),
			ui: 'arrowDropmenu',
			className: 'markSelectedDropmenu',
			alignRight: true,
			data: selectedStateMarkData,
			activeOnClick: true
		});

		// share menu when items selected
		const sharedMenuData = this.getShareDropMenuOptions();

		this.shareDropMenu = new DropMenu({
			target: this.$('.share'),
			ui: 'arrowDropmenu',
			className: 'privacyDropmenu',
			alignRight: true,
			data: sharedMenuData,
			activeOnClick: true
		});
	},

	openFiltersPopover: async function(ev) {
		ev.preventDefault();

		const popover = await componentLoader.load('webapp:popover');

		popover.open({
			popover: 'mail/filters',
			params: {
				target: ev.currentTarget,
				position: 'bottom-start',
				threadsCollection: this.threadsCollection
			}
		});
	},

	clearFilters: function(ev) {
		ev.preventDefault();
		this.threadsCollection.clearFilters();
		this.$('.clearFilters a')
			.tooltip()
			.close();
	},

	getFiltersButtonText: function() {
		const filtersTitlesArray = this.threadsCollection.getActiveFiltersShortTitles();
		const count = filtersTitlesArray.length;

		let text = _.gettext('Filter');

		if (!_.isEmpty(filtersTitlesArray)) {
			text = '';
			_.forEach(filtersTitlesArray, (title, i) => {
				if (i > 1) {
					text += ` +${count - 2}`;

					return false;
				} else {
					text += ` ${title}${i === count - 1 ? '' : ','}`;
				}
			});
		}

		return text;
	},

	updateFiltersText: function() {
		this.render();
	},

	onFiltersSuccess: function() {
		this.toggleSpinner(false, true);
	},

	bindEvents: function() {
		this.listenTo(this.threadsCollection, 'selected', this.onSelected);
		this.listenTo(this.threadsCollection, 'sync', this.setAndUpdateConversationCounter);
		this.listenTo(this.threadsCollection, 'remove', this.onThreadRemoved);
		this.listenTo(this.threadsCollection, 'add', this.onThreadAdded);
		this.listenTo(
			User.counts,
			`change:${this.section}_mail_threads_count`,
			this.setAndUpdateConversationCounter
		);
	},

	/**
	 * Returns an array of objects of data for the bulk-select-by-criteria dropmenu items.
	 * @return {Array}
	 */
	getBulkSelectMap: function() {
		const threadsColl = this.threadsCollection;

		return [
			{
				title: _.gettext('All'),
				criteriaKey: 'all',
				method: _.bind(threadsColl.selectAll, threadsColl, null, true)
			},
			{
				title: _.gettext('None'),
				criteriaKey: 'none',
				method: _.bind(threadsColl.resetSelection, threadsColl)
			},
			{
				title: _.gettext('Read'),
				criteriaKey: 'read',
				method: _.bind(threadsColl.selectThreadsByReadState, threadsColl, true)
			},
			{
				title: _.gettext('Unread'),
				criteriaKey: 'unread',
				method: _.bind(threadsColl.selectThreadsByReadState, threadsColl, false)
			},
			{
				title: _.gettext('Shared'),
				criteriaKey: 'shared',
				method: _.bind(threadsColl.selectThreadsBySharedFlag, threadsColl, true)
			},
			{
				title: _.gettext('Private'),
				criteriaKey: 'private',
				method: _.bind(threadsColl.selectThreadsBySharedFlag, threadsColl, false)
			}
		];
	},

	/**
	 * Returns an array of objects of bulk-select-by-criteria dropmenu items' data.
	 * @return {Array}
	 */
	getBulkSelectDropMenuOptions: function() {
		const bulkSelectMap = this.getBulkSelectMap();

		return _.map(
			bulkSelectMap,
			_.bind(function(item) {
				return {
					title: item.title,
					click: _.bind(this.bulkSelectByCriteria, this, item.criteriaKey)
				};
			}, this)
		);
	},

	/**
	 * A callback triggered once an item in bulk-select-by-criteria dropmenu is clicked.
	 * Calls a corresponding method in the threads collection.
	 *
	 * @param  {String} criteria 	eg. "all", "read" and so on..
	 * @void
	 */
	bulkSelectByCriteria: function(criteria) {
		const bulkSelectMap = this.getBulkSelectMap();
		const item = _.find(bulkSelectMap, { criteriaKey: criteria });

		this.sendMetrics('bulk-select-by-criteria', { 'mail-v2.param.criteria': criteria });

		item.method();
	},

	getSelectedMarkDropMenuOptions: function() {
		const data = [
			{
				id: 'markAsRead',
				test: 'markAsRead',
				title: _.gettext('Mark as read'),
				click: _.bind(this.onReadStateOptionClick, this, true)
			},
			{
				id: 'markAsUnread',
				test: 'markAsUnread',
				title: _.gettext('Mark as unread'),
				click: _.bind(this.onReadStateOptionClick, this, false)
			}
		];

		return data;
	},

	getShareDropMenuOptions: function() {
		const data = [
			{
				id: 'share',
				test: 'share',
				titleHtml:
					`${'<span class="actionContainer"><span class="actionIcon">'}${_.icon(
						'unlocked',
						'small'
					)}</span>` +
					`<span class="actionHeaderText">${_.gettext(
						'Share within your company'
					)}</span>` +
					`<p class="actionDescriptionText">${_.gettext(
						'This email conversation will be visible to others only when it’s linked to ' +
							'contacts and deals in Pipedrive.'
					)}</p>` +
					`</span>`,
				click: this.onShareOptionClick.bind(this, true)
			},
			{
				id: 'makePrivate',
				test: 'makePrivate',
				titleHtml:
					`${'<span class="actionContainer"><span class="actionIcon">'}${_.icon(
						'ac-padlock',
						'small'
					)}</span>` +
					`<span class="actionHeaderText">${_.gettext(
						'Keep this conversation private'
					)}</span>` +
					`<p class="actionDescriptionText">${_.gettext(
						'This email conversation can still be linked to contacts and deals in Pipedrive, ' +
							'but it will only be visible to you.'
					)}</p>` +
					`</span>`,
				click: this.onShareOptionClick.bind(this, false)
			}
		];

		return data;
	},

	/**
	 * A callback triggered by the DropMenu view once the bulk-select dropmenu gets clicked.
	 * Prevents the dropmenu from opening if the list is empty.
	 *
	 * @param  {module:Pipedrive.View} dropMenu
	 * @param  {Function} callback 					Further logic for opening the dropmenu
	 * @void
	 */
	onBulkSelectDropMenuOpen: function(dropMenu, callback) {
		const toBlock = !this.threadsCollection.length;

		callback(toBlock);
	},

	/**
	 * Handler for marking option (to read/unread)
	 * @param  {Boolean} toRead    value that will be set on selected models
	 * @void
	 */
	onReadStateOptionClick: function(toRead) {
		const selectedModelCount = this.threadsCollection.getSelectedModels().length;

		this.threadsCollection.toggleReadFlagOnSelectedThreads(toRead);
		this.showReadStateSnack(toRead, selectedModelCount);

		this.sendMetrics('bulk-change-read-state', {
			'mail-v2.param.to': toRead ? 'read' : 'unread',
			'mail-v2.param.count': selectedModelCount
		});
	},

	showReadStateSnack: function(toRead, count) {
		let text;

		if (toRead) {
			text = _.gettext(
				_.ngettext(
					'The conversation has been marked as read',
					'%d conversations have been marked as read',
					count
				),
				count
			);
		} else {
			text = _.gettext(
				_.ngettext(
					'The conversation has been marked as unread',
					'%d conversations have been marked as unread',
					count
				),
				count
			);
		}

		snackbars.show({
			text
		});
	},

	/**
	 * Handler for sharing option (to shared/private)
	 * @param  {Boolean} toShared    value that will be set on selected models
	 * @void
	 */
	onShareOptionClick: function(toShared) {
		const selectedModelCount = this.threadsCollection.getSelectedModels().length;

		this.threadsCollection.toggleVisibilityOnSelectedThreads(toShared);
		this.showShareSnack(toShared, selectedModelCount);

		this.sendMetrics('bulk-change-shared-state', {
			'mail-v2.param.to': toShared ? 'shared' : 'private',
			'mail-v2.param.count': selectedModelCount
		});
	},

	showShareSnack: function(toShared, count) {
		let text;

		if (toShared) {
			text = _.gettext(
				_.ngettext(
					'The conversation has been shared with others',
					'%d conversations have been shared with others',
					count
				),
				count
			);
		} else {
			text = _.gettext(
				_.ngettext(
					'The conversation has been made private',
					'%d conversations have been made private',
					count
				),
				count
			);
		}

		snackbars.show({
			text
		});
	},

	onSelectAllCheckboxClicked: function(ev) {
		// Prevents any further actions if list is empty
		if (!this.threadsCollection.length) {
			ev.preventDefault();

			return;
		}

		this.threadsCollection.selectAll.call(this.threadsCollection, ev);
	},

	onSelectedIndicatorUnselectClicked: function(ev) {
		if (!this.threadsCollection.length) {
			return;
		}

		this.threadsCollection.selectAll.call(this.threadsCollection, ev, false);
	},

	/**
	 * If refresh button clicked, pull thread's collection again.
	 * @param  {Object}
	 * @void
	 */
	onThreadlistRefreshClicked: function(ev) {
		ev.preventDefault();

		if ($(ev.currentTarget).hasClass('disabled')) {
			return;
		}

		this.sendMetrics('threadList-refresh-clicked');

		this.loadItems();
	},

	loadItems: function() {
		this.toggleSpinner(true);

		const opts = {
			data: _.assignIn(
				{},
				this.threadsCollection.getPullBy(),
				this.threadsCollection.getActiveFilters()
			),
			success: this.toggleSpinner.bind(this, false, null),
			error: this.toggleSpinner.bind(this, false, null)
		};

		this.pull(this.threadsCollection, opts);
	},

	toggleSpinner: function(show, filter) {
		const $selector = filter ? this.$('.filterGroup .spinner') : this.$('.refresh .spinner');
		const $icon = filter ? this.$('.filterGroup svg') : this.$('.refresh svg');

		if (filter) {
			this.$('.filterGroup .filter .icon').toggleClass('hidden', show);
		} else {
			this.$('.refresh a').toggleClass('disabled', show);
		}

		if (show) {
			$icon.hide();
			$selector.show();
		} else {
			$icon.show();
			$selector.hide();
		}
	},

	/**
	 * Calls click event on checkbox if table cell clicked instead of checkbox
	 * @param  {Object}
	 * @void
	 */
	delegateClickToCheckbox: function(ev) {
		if (ev.target.tagName !== 'INPUT') {
			$(ev.currentTarget)
				.find('input')
				.click();
		}
	},

	onDeleteClick: function() {
		const selectedModelsLength = this.threadsCollection.getSelectedModels().length;
		const confirmMessageTitle = _.gettext(
			_.ngettext(
				'Are you sure you want to delete this email conversation?',
				'Are you sure you want to delete %s email conversations?',
				selectedModelsLength
			),
			selectedModelsLength
		);

		this.confirmationDialog = new ConfirmationDialog({
			el: 'body',
			title: confirmMessageTitle,
			message: _.gettext('You can’t undo this action.'),
			primaryButton: {
				title: _.gettext('Cancel')
			},
			secondaryButton: {
				title: _.gettext('Delete'),
				color: 'red',
				onClick: () => this.onUserConfirmedDelete(selectedModelsLength)
			}
		});

		this.confirmationDialog.render();
	},

	onUserConfirmedDelete: function(selectedModelsLength) {
		this.sendMetrics('bulk-delete', {
			'mail-v2.param.user-confirmed': true,
			'mail-v2.param.count': selectedModelsLength
		});

		this.threadsCollection.deleteSelectedThreads({
			success: this.showDeletedItemsSnack(selectedModelsLength)
		});
	},

	showDeletedItemsSnack: function(deletedThreadsCount) {
		const text = _.gettext(
			_.ngettext(
				'The conversation has been deleted',
				'%d conversations have been deleted',
				deletedThreadsCount
			),
			deletedThreadsCount
		);

		snackbars.show({
			text
		});
	},

	setAndUpdateConversationCounter: function(operation) {
		if (MailConnections.isPastSyncing()) {
			return this.fillPastSyncCounter();
		}

		if (operation === '+') {
			this.currentCount++;
		} else if (operation === '-') {
			this.currentCount--;
		} else {
			this.currentCount = this.threadsCollection.getCount();
		}

		const counterString = _.gettext(
			_.ngettext('%d conversation', '%d conversations', this.currentCount),
			this.currentCount
		);

		const $listCountElement = this.$el.find('.listCount');

		if (this.currentCount === 0) {
			$listCountElement.addClass('hidden');
		} else if (this.threadsCollection.selectedIds.length === 0) {
			$listCountElement.removeClass('hidden');
		}

		this.$el.find('.listCountText').text(counterString);
		this.$el.find('.listCountSpinner').removeClass('active');
	},

	fillPastSyncCounter: function() {
		let counterText = _.gettext('Syncing');

		const pastSyncProgress = MailConnections.getPastSyncProgressInfo();

		if (pastSyncProgress) {
			const count = `: ${pastSyncProgress.syncedCount}/${pastSyncProgress.totalCount}`;

			counterText += _.gettext('%s conversations', count);
		}

		this.$el.find('.listCountText').text(counterText);
		this.$el.find('.listCountSpinner').addClass('active');
	},

	onSelected: function() {
		this.updateColletionSelection();
	},

	onThreadRemoved: function() {
		this.updateColletionSelection();

		if (this.threadsCollection.isAnyFilterActive()) {
			this.setAndUpdateConversationCounter('-');
		}
	},

	onThreadAdded: function() {
		if (this.threadsCollection.isAnyFilterActive()) {
			this.setAndUpdateConversationCounter('+');
		}
	},

	updateColletionSelection: function() {
		const threadsColl = this.threadsCollection;

		threadsColl.selectedIds = _.map(
			_.filter(this.threadsCollection.models, { rowSelected: true }),
			'id'
		);
		const allSelected = !!(
			threadsColl.length && threadsColl.selectedIds.length === threadsColl.length
		);
		const hasSelectedItems = threadsColl.selectedIds.length > 0;

		this.updateSelectedIndicator();

		const isIndeterminate = hasSelectedItems && !allSelected;
		const checkboxIcon = isIndeterminate ? '#icon-sm-minus' : '#icon-sm-check-done';

		this.$('.selectAllCheckbox input')
			.prop('indeterminate', isIndeterminate)
			.attr('checked', hasSelectedItems);

		this.$('.selectAllCheckbox use')
			.attr('xlink:href', checkboxIcon)
			.attr('href', checkboxIcon);

		this.$('.barItems').toggleClass('itemsSelected', hasSelectedItems);
		this.$('.listCount').toggleClass('hidden', hasSelectedItems);
		this.$el
			.parent()
			.find('.settings')
			.toggleClass('hidden', hasSelectedItems);
	},

	updateSelectedIndicator: function() {
		const count = this.threadsCollection.selectedIds.length;
		const text =
			this.threadsCollection.getCount() === this.threadsCollection.selectedIds.length
				? _.gettext('All %d selected', count)
				: _.gettext('%d selected', count);

		this.$('.selectedCountText').text(text);
	},

	onUnload: function() {
		this.$('.selectAllCheckbox input').off();
	},

	sendMetrics: function(action, params) {
		const data = _.assignIn(
			{
				'mail-v2.feature': 'threads-list',
				'mail-v2.action': action,
				'mail-v2.param.folder': this.section
			},
			params
		);

		PDMetrics.trackUsage(null, 'mail_view', 'action_taken', data);
	}
});

module.exports = ThreadListActionsBarView;
