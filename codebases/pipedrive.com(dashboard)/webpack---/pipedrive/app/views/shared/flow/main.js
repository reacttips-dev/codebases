const Pipedrive = require('pipedrive');
const User = require('models/user');
const _ = require('lodash');
const FlowItemsCollection = require('collections/flow-items');
const FlowTemplate = require('templates/shared/flow/main.html');
const FlowCompose = require('views/shared/flow/compose');
const FlowFilters = require('utils/flow-filters');
const PinnedNotesView = require('views/shared/pinnednotes');
const FlowItemsView = require('views/shared/flow/flow-items');
const HighlightedNoteView = require('views/highlighted-note');
const FlowSocketeventCollector = require('components/flow-socketevent-collector/index');
const $ = require('jquery');

/**
 * Flow component
 *
 * Uses {@link views/shared/flow/FlowItem FlowItem} and {@link views/shared/flow/Compose FlowCompose} components
 *
 * @classdesc
 * Facebook wall style of deal or person model history viewing, filtering, editing
 *
 *
 * @example
 * <pre>
 * this.flow = new Flow({
 *   el: $('.flowDiv'),
 *   model: this.model
 * });
 * </pre>
 *
 * @param  {Object} options object to override defaultOptions
 * @class views/shared/flow
 * @augments module:Pipedrive.View
 */
module.exports = Pipedrive.View.extend(
	/** @lends views/shared/flow.prototype */
	{
		tagName: 'div',
		template: _.template(FlowTemplate),

		/**
		 * Override these values with constructor value
		 * @const {Object}
		 * @enum
		 */
		defaultOptions: {
			/** Model */
			model: null,
			/**
			 *  Flow has auto-loading feature - use this when flow parent element has scrollbar.
			 * It is used like: this.$el.parents(scrollParentClass)...
			 */
			scrollParentClass: null
		},

		/**
		 * Flow composer component
		 * @type {FlowCompose}
		 */
		compose: null,

		/**
		 * Flow filters instance
		 * @type {Filters}
		 */
		filters: null,

		/**
		 * model of which flow to show
		 * @type {Model}
		 */
		model: null,

		initialize: function(options) {
			this.options = _.defaults(options, this.defaultOptions);

			this.model = this.options.model;

			this.filters = new FlowFilters();
			this.filters.on('change', this.onFiltersChanged, this);

			this.collection = new FlowItemsCollection(null, {
				filters: this.filters,
				relatedModel: this.model
			});

			this.pinnedNotesView = new PinnedNotesView({
				relatedModel: this.model
			});

			this.fullReload();

			this.socketeventCollector = new FlowSocketeventCollector(this.model, this.collection);
			this.socketeventCollector.bindEvents();

			this.flowItemsView = new FlowItemsView({
				model: this.model,
				collection: this.collection,
				filters: this.filters
			});

			this.flowItemsView
				.on('beforeRender', _.bind(this.lockHeight, this))
				.on('afterRender', _.bind(this.unlockHeight, this));

			this.composeView = new FlowCompose({
				model: this.model
			});

			this.addView({
				'.pinnedNotes': this.pinnedNotesView,
				'.flowItems': this.flowItemsView,
				'.flowCompose': this.composeView
			});

			this.render();
		},

		onFocus: function() {
			this.addHighlightedItem();
		},

		addHighlightedItem: function() {
			const el = this.$('.highlightedItem').get(0);

			if (
				!User.companyFeatures.get('in_app_mentions') ||
				!User.companyFeatures.get('comments') ||
				!el
			) {
				return;
			}

			const urlParams = this.getUrlParameters();

			if (!urlParams.objectId) {
				return;
			}

			const props = {
				rootObjectType: this.model.type,
				rootObjectId: this.model.get('id'),
				noteId: urlParams.objectId,
				commentId: urlParams.commentId
			};

			if (this.highlightedNoteView) {
				this.highlightedNoteView.render(props);
			} else {
				this.highlightedNoteView = new HighlightedNoteView({
					el,
					...props
				});
			}
		},

		fullReload: function() {
			this.collection.pullPage({
				reset: true,
				sort: false
			});
		},

		templateHelpers: {
			commentsEnabled: User.companyFeatures.get('comments')
		},

		onAttachedToDOM: function() {
			// scroll for more logic
			if (this.$scroller && this.$scroller.length) {
				// we give 50ms for DOM to update container height information
				this.setTimeout(_.bind(this.checkScrollForLoadMore, this), 50);
			} else {
				this.findParentScrollContainer();
			}
		},

		lockHeight: function() {
			this.$el.css('min-height', this.$el.height());
		},

		unlockHeight: function() {
			this.$el.css('min-height', 'auto');
		},

		// Finds parent element with scroll for load more detection
		findParentScrollContainer: function() {
			const scrollerClass = this.options.scrollParentClass;

			if (!scrollerClass) {
				return;
			}

			this.$scroller = this.$el.parents(scrollerClass);
			this.$scroller.on('scroll.flow', _.bind(this.checkScrollForLoadMore, this));

			this.checkScrollForLoadMore();
		},

		checkScrollForLoadMore: function() {
			if (!this.$scroller || !this.$scroller.length) {
				return;
			}

			const nearBottom = 200;
			const scrollCurr = this.$scroller.scrollTop() + this.$scroller.height();
			const scrollTotal = this.$scroller.get(0).scrollHeight;
			const flowIsSmall = this.$el.height() < scrollCurr;

			if (flowIsSmall || scrollCurr > scrollTotal - nearBottom) {
				this.collection.pullPage();
			}
		},

		onFiltersChanged: function() {
			this.fullReload();
		},

		onBlur: function() {
			if (this.highlightedNoteView) {
				this.highlightedNoteView.unmount();
			}
		},

		onUnload: function() {
			$(this.options.scrollContainer).off('scroll.flow');
			this.socketeventCollector.unbindEvents();
		},

		getUrlParameters: function() {
			// Allow the user to highlight a specific item and related comment. These are optional.
			const urlParams = new URLSearchParams(window.location.search);
			const objectType = urlParams.get('objectType');
			const objectId = urlParams.get('objectId');
			const commentId = urlParams.get('commentId');

			return { objectType, objectId, commentId };
		}
	}
);
