const Pipedrive = require('pipedrive');
const _ = require('lodash');
const SearchPartiesCollection = require('collections/mail/search-parties');
const SearchThreadsCollection = require('collections/mail/search-threads');
const template = require('./search.html');
const $ = require('jquery');
const PDMetrics = require('utils/pd-metrics');
const componentLoader = require('webapp-component-loader');

const SearchView = Pipedrive.View.extend({
	template: _.template(template),

	spinner: null,
	threadsCollection: null,

	events: {
		'mousedown': 'onMouseDown',
		'input .searchInput input': 'onInputChange',
		'blur .searchInput input': 'onInputBlur',
		'keyup .searchInput input': 'onKeyUp',
		'click .searchInput input': 'onInputFocus',
		'focus .searchInput input': 'onInputFocus'
	},

	initialize: function(options) {
		this.options = options || {};
		this.section = options.section;
		this.threadsCollection = this.options.collectionStack.getStackedCollection(
			'threads/search'
		);
		this.searchThreadsCollection = new SearchThreadsCollection();
		this.searchPartiesCollection = new SearchPartiesCollection();
	},

	onLoad: function() {
		this.render();
	},

	templateHelpers: function() {
		return {
			onClearInputClicked: this.onClearInputClicked.bind(this)
		};
	},

	afterRender: function() {
		this.$input = this.$('.searchInput input');
		this.initSpinner();
	},

	onMouseDown: function(ev) {
		ev.preventDefault();
		ev.stopPropagation();

		this.$input.focus();
	},

	onInputFocus: function() {
		const currentValue = this.getInputValue();

		if (currentValue && !this.isPopoverOpened() && currentValue.length >= 2) {
			this.openPopover(currentValue);
		}
	},

	onFocus: function() {
		if (this.isOnSearchPage()) {
			this.toggleHasContent(true);

			this.setTimeout(() => {
				const partyNameEmail = _.get(
					this.threadsCollection.getPartyData(),
					'partyNameEmail'
				);
				const keyword = partyNameEmail || this.threadsCollection.getSearchKeyword();

				this.$input.val(keyword);
			}, 0);
		}
	},

	onBlur: function() {
		this.clearInput();
	},

	initSpinner: function() {
		this.toggleSpinner(this.isOnSearchPage() && this.threadsCollection.pulling());
		this.listenTo(this.threadsCollection, 'sync', this.toggleSpinner.bind(this, false));
		this.listenTo(
			this.threadsCollection,
			'search:started',
			this.toggleSpinner.bind(this, true)
		);
	},

	isOnSearchPage: function() {
		return this.section === 'search';
	},

	onInputChange: function() {
		let currentValue = this.getInputValue();

		this.toggleSpinner(false);
		this.toggleHasContent(!!currentValue);
		currentValue = $.trim(currentValue);

		if (currentValue.length === 0) {
			app.router.go(null, '/mail/inbox', true);
		}

		if (currentValue.length < 2) {
			return;
		}

		this.toggleSpinner(true);

		if (!this.isPopoverOpened()) {
			this.openPopover();
		}
	},

	openPopover: async function() {
		const popover = await componentLoader.load('webapp:popover');

		popover.open({
			popover: 'mail/search',
			params: {
				target: this.$input,
				position: 'bottom-start',
				searchThreadsCollection: this.searchThreadsCollection,
				searchPartiesCollection: this.searchPartiesCollection,
				onResultsPulled: this.onPopoverResultsPulled.bind(this),
				onRedirect: this.onPopoverRedirect.bind(this),
				getSearchKeyword: this.getInputValue.bind(this)
			}
		});
	},

	onPopoverResultsPulled: function() {
		this.toggleSpinner(false);
	},

	onClearInputClicked: function() {
		app.router.go(null, '/mail/inbox', true);
		this.clearInput(true);
	},

	onInputBlur: function() {
		const currentValue = $.trim(this.getInputValue());

		if (!currentValue) {
			this.clearInput();
		}

		this.toggleHasContent(!!currentValue);
	},

	onKeyUp: function(ev) {
		if (ev.keyCode === 13) {
			this.onEnterKeyUp();
		} else if (ev.keyCode === 27) {
			this.onEscKeyUp();
		}
	},

	onEnterKeyUp: function() {
		const keyword = $.trim(this.getInputValue());

		if (!this.isPopoverOpened() && keyword) {
			this.redirToSearchList(keyword);
		}
	},

	onEscKeyUp: function() {
		if (this.getInputValue()) {
			this.clearInput();
		}

		this.$input.blur();
	},

	redirToSearchList: function(keyword) {
		app.router.go(null, `/mail/search/bykeyword/${keyword}`, false, false);

		this.trackRedirectToList('to-results-list', keyword);
	},

	clearInput: function(toFocus) {
		const $input = this.$input;

		$input.val('');
		this.toggleHasContent(false);
		this.toggleSpinner(false);

		if (toFocus) {
			$input.focus();
		}

		app.global.fire('ui.popover.event.close');
	},

	toggleHasContent: function(bool) {
		this.$('.clearButton').toggle(bool);
		this.$('.searchInput').toggleClass('hasContent', bool);
	},

	toggleSpinner: function(show) {
		if (!show && this.threadsCollection.pulling()) {
			return;
		}

		this.$('.searchIcon').toggle(!show);
		this.$('.spinner').toggle(show);
	},

	getInputValue: function() {
		return this.$input.val();
	},

	isPopoverOpened: function() {
		return this.$input.attr('data-popover');
	},

	onPopoverRedirect: function(selectedItemType, keyword) {
		this.trackRedirectToList(selectedItemType, keyword);
	},

	trackRedirectToList: function(selectedItemType, keyword) {
		const keywordLength = $.trim(keyword).length;
		const metricsData = {
			'mail-v2.feature': 'email-search',
			'mail-v2.action': 'item-select',
			// Because we are actually catching here the events of the popover.
			'mail-v2.param.where': 'popover',
			'mail-v2.param.selected-item': selectedItemType,
			'mail-v2.param.character-count': keywordLength,
			'mail-v2.param.suggested-threads-count': this.searchThreadsCollection.length,
			'mail-v2.param.suggested-parties-count': this.searchPartiesCollection.length
		};

		if (selectedItemType === 'thread') {
			PDMetrics.trackUsage(null, 'mail_view', 'action_taken', metricsData);
		} else {
			this.listenToOnce(this.threadsCollection, 'sync', () => {
				const count = _.get(this.threadsCollection.additionalData, 'pagination.count');

				metricsData['mail-v2.param.list-results-count'] = count;
				PDMetrics.trackUsage(null, 'mail_view', 'action_taken', metricsData);
			});
		}

		this.threadsCollection.metricsKeywordLength = keywordLength;
	}
});

module.exports = SearchView;
